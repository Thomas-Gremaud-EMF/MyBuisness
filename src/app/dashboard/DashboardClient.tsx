"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Profile, Link as LinkType } from "@/lib/types";
import { THEMES } from "@/lib/types";
import Avatar from "@/components/Avatar";
import AvatarUpload from "./AvatarUpload";
import {
  addLink,
  updateLink,
  deleteLink,
  reorderLinks,
  updateProfile,
} from "./actions";

type Tab = "liens" | "apparence" | "contact";

export default function DashboardClient({
  profile,
  initialLinks,
}: {
  profile: Profile;
  initialLinks: LinkType[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("liens");
  const [links, setLinks] = useState(initialLinks);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `/${profile.username}`;

  function refresh() {
    startTransition(() => router.refresh());
  }

  function copyLink() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-gray-50">
      {/* En-tête */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
          <span className="text-lg font-bold">
            Busy<span className="text-indigo-600">Link</span>
          </span>
          <div className="flex items-center gap-1.5 text-sm">
            <button
              onClick={copyLink}
              className="rounded-full border border-gray-300 px-3 py-1.5 hover:border-gray-900"
              title={publicUrl}
            >
              {copied ? (
                "✓ Copié"
              ) : (
                <>
                  🔗<span className="hidden sm:inline"> Copier mon lien</span>
                </>
              )}
            </button>
            <a
              href={`/${profile.username}`}
              target="_blank"
              className="rounded-full bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
            >
              <span className="sm:hidden">Voir ↗</span>
              <span className="hidden sm:inline">Voir ma page ↗</span>
            </a>
            <form action="/auth/signout" method="post">
              <button
                className="rounded-full px-3 py-1.5 text-gray-500 hover:text-gray-900"
                title="Déconnexion"
              >
                <span className="sm:hidden">Sortir</span>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-5 py-8 lg:grid-cols-[1fr_360px]">
        {/* Colonne d'édition */}
        <div className="min-w-0">
          {/* Onglets */}
          <div className="mb-6 flex gap-1 rounded-full bg-gray-100 p-1 text-sm font-medium">
            {(["liens", "apparence", "contact"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full py-2 capitalize transition ${
                  tab === t ? "bg-white shadow-sm" : "text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "liens" && (
            <LinksTab
              links={links}
              setLinks={setLinks}
              refresh={refresh}
            />
          )}
          {tab === "apparence" && (
            <AppearanceTab profile={profile} refresh={refresh} />
          )}
          {tab === "contact" && (
            <ContactTab profile={profile} refresh={refresh} />
          )}
        </div>

        {/* Aperçu téléphone */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-gray-400">
              Aperçu en direct
            </p>
            <PhonePreview profile={profile} links={links} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Onglet : LIENS                                                  */
/* ---------------------------------------------------------------- */
function LinksTab({
  links,
  setLinks,
  refresh,
}: {
  links: LinkType[];
  setLinks: (l: LinkType[]) => void;
  refresh: () => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await addLink({ title, url });
    setTitle("");
    setUrl("");
    setSaving(false);
    refresh();
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...links];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setLinks(next);
    await reorderLinks(next.map((l) => l.id));
  }

  return (
    <div className="space-y-6">
      {/* Ajout */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-gray-200 bg-white p-4 space-y-3"
      >
        <h2 className="font-semibold">Ajouter un lien</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre (ex: Mon site, Instagram, Réserver un appel)"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          type="url"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          disabled={saving}
          className="w-full rounded-lg bg-gray-900 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? "Ajout..." : "+ Ajouter"}
        </button>
      </form>

      {/* Liste */}
      <div className="space-y-3">
        {links.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            Aucun lien pour le moment. Ajoute ton premier lien ci-dessus ☝️
          </p>
        )}
        {links.map((link, i) => (
          <LinkRow
            key={link.id}
            link={link}
            isFirst={i === 0}
            isLast={i === links.length - 1}
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
            refresh={refresh}
          />
        ))}
      </div>
    </div>
  );
}

function LinkRow({
  link,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  refresh,
}: {
  link: LinkType;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  refresh: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url ?? "");

  async function save() {
    await updateLink(link.id, { title, url });
    setEditing(false);
    refresh();
  }

  async function toggle() {
    await updateLink(link.id, { is_active: !link.is_active });
    refresh();
  }

  async function remove() {
    if (!confirm(`Supprimer "${link.title}" ?`)) return;
    await deleteLink(link.id);
    refresh();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-3">
        {/* Flèches d'ordre */}
        <div className="flex flex-col text-gray-400">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="hover:text-gray-900 disabled:opacity-20"
            aria-label="Monter"
          >
            ▲
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="hover:text-gray-900 disabled:opacity-20"
            aria-label="Descendre"
          >
            ▼
          </button>
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
              />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                type="url"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                data-1p-ignore
                data-lpignore="true"
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          ) : (
            <>
              <p className="truncate font-medium">{link.title}</p>
              <p className="truncate text-xs text-gray-400">
                {link.url || "Pas d'URL"} · {link.clicks} clic
                {link.clicks > 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {editing ? (
            <button
              onClick={save}
              className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white"
            >
              OK
            </button>
          ) : (
            <>
              <button
                onClick={toggle}
                className={`rounded-lg px-2 py-1 text-xs ${
                  link.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
                title={link.is_active ? "Visible" : "Masqué"}
              >
                {link.is_active ? "Visible" : "Masqué"}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg px-2 py-1 text-gray-500 hover:text-gray-900"
              >
                ✏️
              </button>
              <button
                onClick={remove}
                className="rounded-lg px-2 py-1 text-gray-400 hover:text-red-600"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Onglet : APPARENCE                                              */
/* ---------------------------------------------------------------- */
function AppearanceTab({
  profile,
  refresh,
}: {
  profile: Profile;
  refresh: () => void;
}) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [theme, setTheme] = useState(profile.theme);
  const [saved, setSaved] = useState(false);

  async function save() {
    await updateProfile({ display_name: displayName, bio, theme });
    setSaved(true);
    refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5">
      <div>
        <label className="block text-sm font-medium mb-2">Photo de profil</label>
        <AvatarUpload
          currentUrl={profile.avatar_url}
          name={profile.display_name || profile.username}
          refresh={refresh}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nom affiché</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Quelques mots sur toi ou ton activité"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Thème</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`rounded-xl border-2 p-1 text-left transition ${
                theme === key ? "border-indigo-600" : "border-transparent"
              }`}
            >
              <div
                className={`h-16 rounded-lg ${t.page} flex items-end p-2`}
              >
                <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-900">
                  {t.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={save}
        className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        {saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Onglet : CONTACT (spécifique business)                         */
/* ---------------------------------------------------------------- */
function ContactTab({
  profile,
  refresh,
}: {
  profile: Profile;
  refresh: () => void;
}) {
  const [fields, setFields] = useState({
    phone: profile.phone ?? "",
    email: profile.email ?? "",
    whatsapp: profile.whatsapp ?? "",
    website: profile.website ?? "",
    booking_url: profile.booking_url ?? "",
  });
  const [saved, setSaved] = useState(false);

  function set(k: keyof typeof fields, v: string) {
    setFields((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    await updateProfile(fields);
    setSaved(true);
    refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  const rows: {
    key: keyof typeof fields;
    label: string;
    placeholder: string;
    mode: "tel" | "email" | "url";
  }[] = [
    { key: "whatsapp", label: "WhatsApp (numéro international)", placeholder: "+33612345678", mode: "tel" },
    { key: "phone", label: "Téléphone", placeholder: "+33612345678", mode: "tel" },
    { key: "email", label: "Email de contact", placeholder: "contact@exemple.com", mode: "email" },
    { key: "booking_url", label: "Lien de prise de rendez-vous", placeholder: "https://calendly.com/...", mode: "url" },
    { key: "website", label: "Site web", placeholder: "https://monsite.com", mode: "url" },
  ];

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">
        Ces infos affichent des boutons de contact rapides en haut de ta page.
      </p>
      {rows.map((r) => (
        <div key={r.key}>
          <label className="block text-sm font-medium mb-1">{r.label}</label>
          <input
            value={fields[r.key]}
            onChange={(e) => set(r.key, e.target.value)}
            placeholder={r.placeholder}
            inputMode={r.mode}
            autoComplete={r.mode}
            autoCorrect="off"
            autoCapitalize={r.mode === "tel" ? undefined : "none"}
            spellCheck={false}
            data-1p-ignore
            data-lpignore="true"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
        </div>
      ))}
      <button
        onClick={save}
        className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        {saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Aperçu téléphone                                                */
/* ---------------------------------------------------------------- */
function PhonePreview({
  profile,
  links,
}: {
  profile: Profile;
  links: LinkType[];
}) {
  const theme = THEMES[profile.theme] ?? THEMES.minimal;
  const visible = links.filter((l) => l.is_active);

  return (
    <div className="mx-auto w-[300px] overflow-hidden rounded-[2.5rem] border-[10px] border-gray-900 shadow-xl">
      <div className={`h-[560px] overflow-y-auto ${theme.page} px-5 py-8`}>
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={profile.avatar_url}
            name={profile.display_name || profile.username}
            size={80}
            className="mb-3"
          />
          <h2 className={`text-lg font-bold ${theme.text}`}>
            {profile.display_name || profile.username}
          </h2>
          <p className={`text-xs ${theme.accent}`}>@{profile.username}</p>
          {profile.bio && (
            <p className={`mt-2 text-sm ${theme.text} opacity-90`}>
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {visible.length === 0 && (
            <p className={`text-center text-xs ${theme.accent}`}>
              Tes liens apparaîtront ici
            </p>
          )}
          {visible.map((l) => (
            <div
              key={l.id}
              className={`rounded-xl px-4 py-3 text-center text-sm font-medium ${theme.card}`}
            >
              {l.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
