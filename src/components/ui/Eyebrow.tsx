// Görsel stil `globals.css` içindeki `.eyebrow` sınıfındadır (mantıksal yönde çizgi,
// Arapçada çizgisiz/büyük harfsiz). Renk `className` ile ezilebilir (ör. `text-altin!`).
export function Eyebrow({
  children,
  className = '',
  align = 'start',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center';
}) {
  return <p className={`eyebrow ${align === 'center' ? 'eyebrow-center' : ''} ${className}`}>{children}</p>;
}
