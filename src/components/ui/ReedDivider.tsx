export function ReedDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3.5 text-altin ${className}`}>
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-altin rtl:bg-linear-to-l" />
      <span className="size-[9px] shrink-0 rounded-full border-2 border-altin shadow-[0_0_0_4px_rgb(191_155_70/0.15)]" />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-altin rtl:bg-linear-to-r" />
    </div>
  );
}
