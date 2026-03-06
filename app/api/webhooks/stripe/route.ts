import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Disable body parsing — Stripe needs the raw body
export const runtime = "nodejs";

// Helper to create a service role client bypassing RLS (since this is a server-to-server webhook)
const getAdminSupabase = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = getStripe().webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const { userId, productId } = session.metadata || {};

                console.log("✅ Checkout completed:", { sessionId: session.id, userId, productId });

                if (userId && productId) {
                    await supabase.from("orders").insert({
                        user_id: userId,
                        product_id: productId,
                        stripe_session_id: session.id,
                        status: "completed",
                        amount: session.amount_total ? session.amount_total / 100 : 0
                    });

                    if (session.mode === "subscription" && session.subscription) {
                        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
                        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);

                        await supabase.from("subscriptions").insert({
                            user_id: userId,
                            product_id: productId,
                            stripe_subscription_id: subscription.id,
                            status: subscription.status,
                            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                        });
                    }
                }
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log("🔄 Subscription updated:", subscription.id, subscription.status);

                await supabase.from("subscriptions")
                    .update({
                        status: subscription.status,
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString()
                    })
                    .eq("stripe_subscription_id", subscription.id);
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log("❌ Subscription canceled:", subscription.id);

                await supabase.from("subscriptions")
                    .update({ status: "canceled" })
                    .eq("stripe_subscription_id", subscription.id);
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as any;
                if (invoice.subscription) {
                    const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
                    console.log("⚠️ Payment failed:", invoice.id);
                    await supabase.from("subscriptions")
                        .update({ status: "past_due" })
                        .eq("stripe_subscription_id", subId);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
