import { cloneElement, useId, type ReactElement } from 'react';

// Spec §4.4: alt çizgili minimal alan — çerçevesiz, şeffaf zemin, odakta altın kenarlık.
const inputClasses =
  'w-full rounded-none border-0 border-b border-murekkep/25 bg-transparent px-0 py-3 text-metin transition-colors duration-200 focus:border-altin aria-invalid:border-kor';

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactElement<Record<string, unknown>>;
}) {
  const id = useId();
  const errId = `${id}-err`;
  // `select` alanları özel bir ok gerektirir (spec §4.4); diğer alan türleri düz kalır.
  const isSelect = children.type === 'select';

  const field = cloneElement(children, {
    id,
    required,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? errId : undefined,
    className: isSelect ? `${inputClasses} appearance-none pe-6` : inputClasses,
  });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-semibold text-metin-soluk">
        {label}
        {required && (
          <span aria-hidden="true" className="text-kor">
            {' '}
            *
          </span>
        )}
      </label>
      {isSelect ? (
        <div className="relative">
          {field}
          {/* Mantıksal konumlu özel ok; RTL'de otomatik aynalanır (bkz. LanguageSwitcher). */}
          <svg
            aria-hidden="true"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            className="pointer-events-none absolute end-0 top-1/2 -translate-y-1/2 text-murekkep"
          >
            <path d="M1 1l4 4 4-4" />
          </svg>
        </div>
      ) : (
        field
      )}
      {error && (
        <p id={errId} className="text-sm text-kor">
          {error}
        </p>
      )}
    </div>
  );
}
