import type { Profile } from "@/lib/types";

/**
 * Barre de boutons de contact rapide (WhatsApp, appel, email, RDV, site).
 * N'affiche que les boutons réellement renseignés.
 */
export default function ContactBar({
  profile,
  themeText,
}: {
  profile: Profile;
  themeText: string;
}) {
  const buttons: { label: string; icon: string; href: string }[] = [];

  if (profile.whatsapp) {
    const num = profile.whatsapp.replace(/[^0-9]/g, "");
    buttons.push({ label: "WhatsApp", icon: "💬", href: `https://wa.me/${num}` });
  }
  if (profile.phone) {
    buttons.push({ label: "Appeler", icon: "📞", href: `tel:${profile.phone}` });
  }
  if (profile.email) {
    buttons.push({ label: "Email", icon: "✉️", href: `mailto:${profile.email}` });
  }
  if (profile.booking_url) {
    buttons.push({ label: "Rendez-vous", icon: "📅", href: profile.booking_url });
  }
  if (profile.website) {
    buttons.push({ label: "Site", icon: "🌐", href: profile.website });
  }

  if (buttons.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {buttons.map((b) => (
        <a
          key={b.label}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur ${themeText} hover:bg-white/25`}
        >
          <span>{b.icon}</span>
          {b.label}
        </a>
      ))}
    </div>
  );
}
