import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Link } from "@/lib/types";
import { THEMES } from "@/lib/types";
import Avatar from "@/components/Avatar";
import PublicLinks from "./PublicLinks";
import ContactBar from "./ContactBar";

type Props = { params: Promise<{ username: string }> };

async function getData(username: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!profile) return null;

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  return { profile: profile as Profile, links: (links as Link[]) ?? [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getData(username);
  if (!data) return { title: "Page introuvable" };

  const name = data.profile.display_name || data.profile.username;
  return {
    title: `${name} · MyBuisness`,
    description: data.profile.bio ?? `Retrouve tous les liens de ${name}.`,
  };
}

export default async function PublicPage({ params }: Props) {
  const { username } = await params;
  const data = await getData(username);
  if (!data) notFound();

  const { profile, links } = data;
  const theme = THEMES[profile.theme] ?? THEMES.minimal;

  return (
    <main className={`flex min-h-full flex-col items-center ${theme.page} px-5 py-12`}>
      <div className="w-full max-w-md">
        {/* En-tête du profil */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={profile.avatar_url}
            name={profile.display_name || profile.username}
            size={96}
            className="mb-4"
          />
          <h1 className={`text-2xl font-bold ${theme.text}`}>
            {profile.display_name || profile.username}
          </h1>
          <p className={`text-sm ${theme.accent}`}>@{profile.username}</p>
          {profile.bio && (
            <p className={`mt-3 max-w-xs ${theme.text} opacity-90`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Boutons de contact rapide */}
        <ContactBar profile={profile} themeText={theme.text} />

        {/* Liens */}
        <PublicLinks links={links} cardClass={theme.card} />

        <p className={`mt-10 text-center text-xs ${theme.accent}`}>
          <a href="/" target="_blank" className="underline">
            Créé avec MyBuisness
          </a>
        </p>
      </div>
    </main>
  );
}
