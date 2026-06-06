"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";
import { updateProfile } from "./actions";

export default function AvatarUpload({
  currentUrl,
  name,
  refresh,
}: {
  currentUrl: string | null;
  name: string;
  refresh: () => void;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Choisis un fichier image (jpg, png...).");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Image trop lourde (3 Mo maximum).");
      return;
    }

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      setError("Session expirée, reconnecte-toi.");
      return;
    }

    // Chemin : <id-utilisateur>/<horodatage>.<extension>
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      setError("Échec de l'envoi : " + uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    await updateProfile({ avatar_url: publicUrl });
    setPreview(publicUrl);
    setUploading(false);
    refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar src={preview} name={name} size={64} className="bg-gray-200" />
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:border-gray-900 disabled:opacity-50"
        >
          {uploading ? "Envoi..." : preview ? "Changer la photo" : "Ajouter une photo"}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
