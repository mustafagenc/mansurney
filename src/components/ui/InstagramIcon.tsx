// Sade, tek renkli fotoğraf makinesi ikonu (yuvarlatılmış kare + mercek + nokta); rengi `currentColor`'dan alır.
// Dekoratiftir — yanındaki metin bağlantıyı zaten tanımlar.
export function InstagramIcon({ className = 'size-[1.125em]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
