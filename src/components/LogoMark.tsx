/**
 * Symbole BusyLink : deux maillons entrelacés dans un carré arrondi indigo.
 * À utiliser à côté du nom "BusyLink" dans les en-têtes.
 */
export default function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Logo BusyLink"
    >
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7B79FF" />
          <stop offset="0.55" stopColor="#5B53F0" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="lm-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="lm-weave" clipPathUnits="userSpaceOnUse">
          <rect x="43" y="51" width="16" height="20" />
        </clipPath>
      </defs>

      <rect width="100" height="100" rx="28" fill="url(#lm-bg)" />
      <rect width="100" height="100" rx="28" fill="url(#lm-gloss)" />

      <g
        transform="rotate(-45 50 50)"
        fill="none"
        stroke="#ffffff"
        strokeWidth="11"
        strokeLinejoin="round"
      >
        <rect id="lm-lb" x="42" y="37" width="38" height="26" rx="13" />
        <rect x="20" y="37" width="38" height="26" rx="13" />
        <use href="#lm-lb" clipPath="url(#lm-weave)" />
      </g>
    </svg>
  );
}
