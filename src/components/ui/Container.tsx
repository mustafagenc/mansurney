export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-[min(1180px,92%)] ${className}`}>{children}</div>;
}
