import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour le navigateur (composants "use client").
 * Utilise la clé publique "anon" — sans danger côté client car la
 * sécurité réelle est assurée par les règles RLS dans la base de données.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
