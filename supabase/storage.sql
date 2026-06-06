-- ============================================================
--  MyBuisness — Stockage des photos de profil
--  À exécuter dans : Supabase > SQL Editor > New query > Run
-- ============================================================

-- Crée le "bucket" (dossier de stockage) public pour les avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Tout le monde peut VOIR les avatars (ils sont publics)
drop policy if exists "Avatars publics en lecture" on storage.objects;
create policy "Avatars publics en lecture"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Chaque utilisateur peut envoyer SA photo (dans son propre dossier)
drop policy if exists "Upload de son avatar" on storage.objects;
create policy "Upload de son avatar"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Et la remplacer / la supprimer
drop policy if exists "Maj de son avatar" on storage.objects;
create policy "Maj de son avatar"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Suppr de son avatar" on storage.objects;
create policy "Suppr de son avatar"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
