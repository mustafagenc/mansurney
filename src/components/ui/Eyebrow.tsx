export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-bold uppercase tracking-[0.22em] text-altin-metin rtl:tracking-normal ${className}`}>{children}</p>;
}
