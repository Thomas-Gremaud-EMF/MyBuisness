# BusyLink

Une plateforme de "page de liens" (style Linktree/MyLinks) orientée business :
contact direct (WhatsApp, appel, email, prise de rendez-vous), thèmes pro,
liens personnalisés et suivi des clics.

Stack : **Next.js 16 · TypeScript · Tailwind 4 · Supabase**.

---

## 🚀 Mise en route (à faire une seule fois)

### 1. Créer un projet Supabase (gratuit)

1. Va sur https://supabase.com → **Start your project** → connecte-toi (GitHub ou email).
2. Clique **New project**. Donne un nom (ex: `mybuisness`), choisis un mot de
   passe pour la base (note-le), et une région proche (ex: `West EU (Paris)`).
3. Attends ~2 min que le projet se crée.

### 2. Installer le schéma de la base

1. Dans ton projet Supabase, menu de gauche → **SQL Editor** → **New query**.
2. Ouvre le fichier `supabase/schema.sql` de ce projet, copie **tout** son
   contenu, colle-le, puis clique **Run**.
3. Tu dois voir « Success. No rows returned ». ✅

### 3. Récupérer tes clés

1. Menu de gauche → **Project Settings** (la roue dentée) → **API**.
2. Copie **Project URL** et la clé **anon public**.

### 4. Configurer le projet local

1. Copie le fichier `.env.local.example` en `.env.local`.
2. Colle tes deux valeurs :

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 5. (Recommandé pour tester) Désactiver la confirmation par email

Pour pouvoir créer un compte et entrer directement sans cliquer sur un email :

1. Supabase → **Authentication** → **Sign In / Providers** → **Email**.
2. Désactive **Confirm email** → Save.

> Tu pourras le réactiver plus tard quand l'app sera en ligne.

---

## ▶️ Lancer en local

```bash
npm run dev
```

Ouvre http://localhost:3000 :

- `/signup` — créer ta page
- `/dashboard` — éditer tes liens, thème et contacts
- `/<ton-username>` — ta page publique

---

## 📁 Structure

```
src/
  app/
    page.tsx              → page d'accueil (vitrine)
    login / signup        → authentification
    dashboard/            → espace d'édition (privé)
    [username]/           → page publique d'un utilisateur
    auth/                 → callback email + déconnexion
  lib/
    supabase/             → connexion à la base (client, serveur, middleware)
    types.ts              → types + thèmes
  middleware.ts           → protège /dashboard
supabase/
  schema.sql              → tables + sécurité + automatisations
```

---

## 🌍 Mettre en ligne (plus tard)

1. Pousser le code sur **GitHub**.
2. Importer le repo sur **Vercel** (gratuit).
3. Ajouter les variables d'environnement (mêmes que `.env.local`).
4. Dans Supabase → **Authentication** → **URL Configuration**, ajouter
   l'URL Vercel dans les *Redirect URLs*.
