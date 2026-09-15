// Kamış boğumu — seyrek kullanılan küçük süs (spec §3.6): yalnızca beyit bandı ve footer.
export function ReedDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-2 text-altin ${className}`}>
      <span className="h-px w-full max-w-12 bg-linear-to-r from-transparent to-altin/70 rtl:bg-linear-to-l" />
      <span className="h-2.5 w-px shrink-0 bg-altin/70" />
      <span className="size-1.5 shrink-0 rounded-full border border-altin" />
      <span className="h-2.5 w-px shrink-0 bg-altin/70" />
      <span className="h-px w-full max-w-12 bg-linear-to-l from-transparent to-altin/70 rtl:bg-linear-to-r" />
    </div>
  );
}
