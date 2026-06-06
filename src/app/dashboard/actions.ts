"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Récupère l'utilisateur connecté ou lève une erreur. */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");
  return { supabase, user };
}

export async function addLink(input: {
  title: string;
  url: string;
  type?: "link" | "social" | "header";
}) {
  const { supabase, user } = await requireUser();

  // Place le nouveau lien à la fin
  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    title: input.title.trim(),
    url: input.url.trim() || null,
    type: input.type ?? "link",
    position: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateLink(
  id: string,
  fields: Partial<{ title: string; url: string; is_active: boolean }>,
) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("links")
    .update(fields)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLink(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

/** Réordonne les liens : reçoit la liste d'ids dans le nouvel ordre. */
export async function reorderLinks(orderedIds: string[]) {
  const { supabase, user } = await requireUser();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("links")
        .update({ position: index })
        .eq("id", id)
        .eq("user_id", user.id),
    ),
  );

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProfile(fields: {
  display_name?: string;
  bio?: string;
  theme?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  booking_url?: string;
}) {
  const { supabase, user } = await requireUser();

  const cleaned = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, v?.trim() || null]),
  );

  const { error } = await supabase
    .from("profiles")
    .update({ ...cleaned, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}
