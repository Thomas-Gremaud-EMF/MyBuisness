"use client";

import type { Link } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

/**
 * Liste des liens cliquables. À chaque clic, on incrémente le compteur
 * (sans bloquer l'ouverture du lien) puis on ouvre l'URL.
 */
export default function PublicLinks({
  links,
  cardClass,
}: {
  links: Link[];
  cardClass: string;
}) {
  const supabase = createClient();

  function handleClick(link: Link) {
    // Fire-and-forget : on n'attend pas la réponse
    supabase.rpc("increment_click", { link_id: link.id });
  }

  return (
    <div className="mt-8 space-y-3">
      {links.map((link) =>
        link.type === "header" ? (
          <p
            key={link.id}
            className="pt-2 text-center text-sm font-semibold uppercase tracking-wide opacity-70"
          >
            {link.title}
          </p>
        ) : (
          <a
            key={link.id}
            href={link.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(link)}
            className={`block rounded-xl px-5 py-4 text-center font-medium transition ${cardClass}`}
          >
            {link.title}
          </a>
        ),
      )}
    </div>
  );
}
