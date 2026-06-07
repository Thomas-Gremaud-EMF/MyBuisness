"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LogoMark from "@/components/LogoMark";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9_-]{3,30}$/.test(cleanUsername)) {
      setError(
        "Le nom d'utilisateur doit faire 3 à 30 caractères : lettres minuscules, chiffres, - ou _.",
      );
      return;
    }

    setLoading(true);

    // 1) Vérifier que le nom d'utilisateur est libre
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existing) {
      setLoading(false);
      setError("Ce nom d'utilisateur est déjà pris. Essaie-en un autre.");
      return;
    }

    // 2) Créer le compte (le profil est créé automatiquement par un trigger)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: cleanUsername, display_name: displayName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Si la confirmation par email est désactivée, on a déjà une session
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setInfo(
        "Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.",
      );
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <LogoMark className="h-7 w-7" />
          <span>
            Busy<span className="text-indigo-600">Link</span>
          </span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Crée ta page</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gratuit, en moins d&apos;une minute.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom d&apos;utilisateur (ton lien)
            </label>
            <label className="flex cursor-text items-center rounded-lg border border-gray-300 focus-within:border-indigo-500 overflow-hidden">
              <span className="pl-3 text-sm text-gray-400 select-none">
                busylink.app/
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="leo-coaching"
                className="flex-1 px-1 py-2 pr-3 outline-none text-sm"
                required
              />
            </label>
          </div>

          <Field
            label="Nom affiché (ton nom ou ta marque)"
            value={displayName}
            onChange={setDisplayName}
            placeholder="Léo Coaching"
          />
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="leo@exemple.com"
            required
          />
          <Field
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="6 caractères minimum"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-green-600">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer ma page"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-indigo-600">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
      />
    </div>
  );
}
