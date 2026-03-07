import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, userId } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const stripe = getStripe();

        // Check if any item is a subscription
        const hasSubscription = items.some((item: any) => item.type === "subscription");
        const mode = hasSubscription ? "subscription" : "payment";

        const line_items = items.map((item: any) => {
            if (item.priceId) {
                return {
                    price: item.priceId,
                    quantity: item.quantity,
                };
            } else {
                return {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: Math.round(item.amount * 100),
                        recurring:
                            item.type === "subscription"
                                ? {
                                    interval:
                                        item.interval === "yearly" ? "year" : "month",
                                }
                                : undefined,
                    },
                    quantity: item.quantity,
                };
            }
        });

        const session = await stripe.checkout.sessions.create({
            mode,
            payment_method_types: ["card"],
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products`,
            metadata: {
                userId: userId || "",
                // Store a simplified JSON summary of the cart to process orders in the webhook
                cartData: JSON.stringify(items.map((i: any) => ({
                    id: i.productId,
                    type: i.type,
                }))).slice(0, 500), // Stripe limit is 500 chars for metadata values
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
