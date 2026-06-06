import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Link } from "@/lib/types";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  // Cas rare : le profil n'a pas encore été créé par le trigger
  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <p className="text-gray-600">
          Ton profil est en cours de création… Recharge la page dans quelques
          secondes.
        </p>
      </div>
    );
  }

  return (
    <DashboardClient
      profile={profile as Profile}
      initialLinks={(links as Link[]) ?? []}
    />
  );
}
