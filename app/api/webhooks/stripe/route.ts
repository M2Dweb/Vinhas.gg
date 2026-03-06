import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body
export const runtime = "nodejs";

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

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const { userId, productId } = session.metadata || {};

                console.log("✅ Checkout completed:", {
                    sessionId: session.id,
                    userId,
                    productId,
                    amount: session.amount_total,
                    mode: session.mode,
                });

                // TODO: Create order in Supabase
                // If subscription, also create subscription record
                // const supabase = createServiceRoleClient();
                // await supabase.from('orders').insert({ ... });

                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log("🔄 Subscription updated:", subscription.id, subscription.status);

                // TODO: Update subscription status in Supabase
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log("❌ Subscription canceled:", subscription.id);

                // TODO: Mark subscription as canceled in Supabase
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                console.log("⚠️ Payment failed:", invoice.id);

                // TODO: Update subscription status to past_due
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
