/** Types partagés correspondant aux tables Supabase. */

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  booking_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Link = {
  id: string;
  user_id: string;
  type: "link" | "social" | "header";
  title: string;
  url: string | null;
  icon: string | null;
  position: number;
  is_active: boolean;
  clicks: number;
  created_at: string;
};

/** Thèmes disponibles pour la page publique. */
export const THEMES: Record<
  string,
  { name: string; page: string; card: string; text: string; accent: string }
> = {
  minimal: {
    name: "Minimal",
    page: "bg-gray-50",
    card: "bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md",
    text: "text-gray-900",
    accent: "text-gray-500",
  },
  dark: {
    name: "Sombre",
    page: "bg-neutral-950",
    card: "bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white",
    text: "text-white",
    accent: "text-neutral-400",
  },
  ocean: {
    name: "Océan",
    page: "bg-gradient-to-b from-sky-500 to-indigo-700",
    card: "bg-white/15 backdrop-blur border border-white/20 hover:bg-white/25 text-white",
    text: "text-white",
    accent: "text-white/70",
  },
  sunset: {
    name: "Sunset",
    page: "bg-gradient-to-b from-orange-400 via-pink-500 to-purple-600",
    card: "bg-white/15 backdrop-blur border border-white/20 hover:bg-white/25 text-white",
    text: "text-white",
    accent: "text-white/80",
  },
};
