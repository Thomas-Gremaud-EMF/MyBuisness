import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-col min-h-full bg-white text-gray-900">
      {/* Barre de navigation */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight">
          Busy<span className="text-indigo-600">Link</span>
        </span>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
            >
              Mon tableau de bord
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 font-medium hover:text-indigo-600">
                Connexion
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
              >
                Créer ma page
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Section principale */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-3xl mx-auto">
        <span className="mb-4 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
          Pensé pour les entrepreneurs
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Un seul lien pour
          <br />
          les gens qui <span className="text-indigo-600">entreprennent</span>.
        </h1>
        <p className="mt-4 text-base font-medium uppercase tracking-wide text-indigo-600">
          Stay busy. Share one link.
        </p>
        <p className="mt-5 text-lg text-gray-600 max-w-xl">
          Regroupe tes réseaux, ton contact WhatsApp, ta prise de rendez-vous et
          tes produits sur une page pro. Partage-la depuis ta bio Instagram,
          TikTok ou LinkedIn.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Créer ma page gratuitement
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-gray-300 px-7 py-3 font-semibold hover:border-gray-900"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>

        {/* Arguments */}
        <div className="mt-20 grid sm:grid-cols-3 gap-6 text-left w-full">
          {[
            {
              title: "Contact direct",
              desc: "Boutons WhatsApp, appel, email et prise de rendez-vous intégrés.",
            },
            {
              title: "100% à ta marque",
              desc: "Thèmes pro, ton nom, ta bio et ton lien personnalisé.",
            },
            {
              title: "Suivi des clics",
              desc: "Vois quels liens performent pour mieux convertir.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        BusyLink — Stay busy. Share one link. ❤️
      </footer>
    </main>
  );
}
