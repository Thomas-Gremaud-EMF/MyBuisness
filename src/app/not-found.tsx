import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <p className="text-6xl font-extrabold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Cette page n&apos;existe pas</h1>
      <p className="mt-2 text-gray-500">
        Le profil que tu cherches est introuvable ou a été supprimé.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
