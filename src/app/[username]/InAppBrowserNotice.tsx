"use client";

import { useEffect, useState } from "react";

/**
 * Bannière affichée UNIQUEMENT quand la page est ouverte dans le navigateur
 * intégré d'une app (Instagram, Facebook, TikTok, Snapchat...). Elle invite
 * à ouvrir dans le vrai navigateur du téléphone.
 *
 * - Android : le bouton force l'ouverture dans Chrome (via une "intent" URL).
 * - iOS : impossible de forcer (bloqué par Apple) → on copie le lien et on
 *   explique comment faire via le menu "···".
 */
export default function InAppBrowserNotice() {
  const [show, setShow] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [hint, setHint] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const inApp =
      /Instagram|FBAN|FBAV|FB_IAB|Messenger|TikTok|Snapchat|Line|Pinterest|Twitter/i.test(
        ua,
      );
    if (inApp) {
      setShow(true);
      setIsAndroid(/Android/i.test(ua));
    }
  }, []);

  if (!show) return null;

  function openInBrowser() {
    const url = window.location.href;

    if (isAndroid) {
      // Force l'ouverture dans Chrome
      const clean = url.replace(/^https?:\/\//, "");
      window.location.href = `intent://${clean}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }

    // iOS : on ne peut pas forcer → on copie le lien + on explique
    navigator.clipboard
      ?.writeText(url)
      .then(() => setCopied(true))
      .catch(() => {});
    setHint(true);
  }

  return (
    <div className="mb-6 w-full rounded-xl bg-white/95 p-3 text-gray-800 shadow-md backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium leading-snug">
          🌐 Pour une meilleure expérience, ouvre dans ton navigateur
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={openInBrowser}
            className="rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700"
          >
            Ouvrir
          </button>
          <button
            onClick={() => setShow(false)}
            aria-label="Fermer"
            className="px-1 text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {hint && (
        <p className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-500">
          Appuie sur <b>···</b> (en haut à droite) puis{" "}
          <b>« Ouvrir dans le navigateur »</b>.
          {copied && <span className="text-green-600"> Lien copié ✓</span>}
        </p>
      )}
    </div>
  );
}
