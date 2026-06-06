/* eslint-disable @next/next/no-img-element */

/**
 * Affiche la photo de profil si elle existe, sinon l'initiale du nom.
 */
export default function Avatar({
  src,
  name,
  size = 96,
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size / 2.5 }}
      className={`flex items-center justify-center rounded-full bg-white/30 font-bold ${className}`}
    >
      {initial}
    </div>
  );
}
