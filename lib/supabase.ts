import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function createClient() {
    // Return existing instance if it exists to avoid "Multiple GoTrueClient instances" warnings
    if (!supabaseInstance) {
        supabaseInstance = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }
    return supabaseInstance;
}
