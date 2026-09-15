// Sade, tek renkli mesajlaşma ikonu (konuşma balonu + telefon ahizesi); rengi `currentColor`'dan alır.
// Dekoratiftir — yanındaki metin bağlantıyı zaten tanımlar.
export function WhatsAppIcon({ className = 'size-[1.125em]' }: { className?: string }) {
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
      <path d="M3.5 20.5l1.3-4.1A8.6 8.6 0 1 1 8 19.4z" />
      <path d="M9.2 8.1c.3-.4.8-.4 1.1 0l.9 1.6c.2.3.1.7-.1 1l-.5.5c.5 1.1 1.3 1.9 2.4 2.4l.5-.5c.3-.2.7-.3 1-.1l1.6.9c.4.3.4.8 0 1.1-.6.7-1.5 1-2.4.7-2.2-.7-3.9-2.4-4.6-4.6-.3-.9 0-1.8.7-2.4z" />
    </svg>
  );
}
