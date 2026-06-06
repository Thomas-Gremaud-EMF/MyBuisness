-- ============================================================
--  MyBuisness — Schéma de base de données
--  À exécuter dans : Supabase > ton projet > SQL Editor > New query
--  Copie-colle TOUT ce fichier, puis clique sur "Run".
-- ============================================================

-- ------------------------------------------------------------
-- 1) TABLE "profiles" : un profil public par utilisateur
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique not null
               check (username ~ '^[a-z0-9_-]{3,30}$'),
  display_name text,
  bio          text,
  avatar_url   text,
  theme        text not null default 'minimal',
  -- Liens "business" rapides (téléphone, email, whatsapp, site, rdv)
  phone        text,
  email        text,
  whatsapp     text,
  website      text,
  booking_url  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2) TABLE "links" : les liens affichés sur la page publique
-- ------------------------------------------------------------
create table if not exists public.links (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  type       text not null default 'link',  -- link | social | header
  title      text not null,
  url        text,
  icon       text,                          -- nom d'icône (ex: instagram)
  position   integer not null default 0,    -- ordre d'affichage
  is_active  boolean not null default true,
  clicks     integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists links_user_id_idx on public.links (user_id);

-- ------------------------------------------------------------
-- 3) SÉCURITÉ (RLS) : qui a le droit de lire/écrire quoi
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.links    enable row level security;

-- Profils : visibles par tout le monde (pages publiques)
drop policy if exists "Profils visibles par tous" on public.profiles;
create policy "Profils visibles par tous"
  on public.profiles for select using (true);

-- Profils : chacun crée/modifie uniquement le sien
drop policy if exists "Créer son propre profil" on public.profiles;
create policy "Créer son propre profil"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Modifier son propre profil" on public.profiles;
create policy "Modifier son propre profil"
  on public.profiles for update using (auth.uid() = id);

-- Liens : les liens actifs sont publics ; le propriétaire voit tout
drop policy if exists "Liens actifs visibles par tous" on public.links;
create policy "Liens actifs visibles par tous"
  on public.links for select
  using (is_active = true or auth.uid() = user_id);

-- Liens : le propriétaire gère ses liens (créer/modifier/supprimer)
drop policy if exists "Gérer ses propres liens" on public.links;
create policy "Gérer ses propres liens"
  on public.links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4) AUTOMATISATION : créer un profil dès l'inscription
--    Le username est passé depuis le formulaire d'inscription.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      'user_' || substr(new.id::text, 1, 8)
    ),
    new.raw_user_meta_data ->> 'display_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 5) COMPTEUR DE CLICS : incrémenter sans authentification
--    Appelée depuis la page publique quand un visiteur clique.
-- ------------------------------------------------------------
create or replace function public.increment_click(link_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.links set clicks = clicks + 1 where id = link_id;
$$;

grant execute on function public.increment_click(uuid) to anon, authenticated;
