export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    image_url: string | null;
                    order: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    image_url?: string | null;
                    order?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    image_url?: string | null;
                    order?: number;
                    created_at?: string;
                };
            };
            products: {
                Row: {
                    id: string;
                    category_id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    image_url: string | null;
                    price: number;
                    stripe_price_id: string | null;
                    type: "one-time" | "subscription";
                    interval: "monthly" | "yearly" | null;
                    features: Json | null;
                    active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    category_id: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    image_url?: string | null;
                    price: number;
                    stripe_price_id?: string | null;
                    type?: "one-time" | "subscription";
                    interval?: "monthly" | "yearly" | null;
                    features?: Json | null;
                    active?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    category_id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    image_url?: string | null;
                    price?: number;
                    stripe_price_id?: string | null;
                    type?: "one-time" | "subscription";
                    interval?: "monthly" | "yearly" | null;
                    features?: Json | null;
                    active?: boolean;
                    created_at?: string;
                };
            };
            profiles: {
                Row: {
                    id: string;
                    display_name: string | null;
                    avatar_url: string | null;
                    role: "user" | "admin";
                    created_at: string;
                };
                Insert: {
                    id: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    role?: "user" | "admin";
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    role?: "user" | "admin";
                    created_at?: string;
                };
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string;
                    product_id: string;
                    stripe_session_id: string | null;
                    status: "pending" | "completed" | "failed" | "refunded";
                    amount: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    product_id: string;
                    stripe_session_id?: string | null;
                    status?: "pending" | "completed" | "failed" | "refunded";
                    amount: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    product_id?: string;
                    stripe_session_id?: string | null;
                    status?: "pending" | "completed" | "failed" | "refunded";
                    amount?: number;
                    created_at?: string;
                };
            };
            subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    product_id: string;
                    stripe_subscription_id: string;
                    status: "active" | "canceled" | "past_due" | "paused";
                    current_period_end: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    product_id: string;
                    stripe_subscription_id: string;
                    status?: "active" | "canceled" | "past_due" | "paused";
                    current_period_end: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    product_id?: string;
                    stripe_subscription_id?: string;
                    status?: "active" | "canceled" | "past_due" | "paused";
                    current_period_end?: string;
                    created_at?: string;
                };
            };
            order_messages: {
                Row: {
                    id: string;
                    order_id: string;
                    user_id: string;
                    message: string;
                    is_admin_reply: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    user_id: string;
                    message: string;
                    is_admin_reply?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    order_id?: string;
                    user_id?: string;
                    message?: string;
                    is_admin_reply?: boolean;
                    created_at?: string;
                };
            };
        };
    };
}

// Convenience types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type OrderMessage = Database["public"]["Tables"]["order_messages"]["Row"];
