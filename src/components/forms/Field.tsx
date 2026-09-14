import { cloneElement, useId, type ReactElement } from 'react';

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
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="text-kor">
            {' '}
            *
          </span>
        )}
      </label>
      {cloneElement(children, {
        id,
        required,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? errId : undefined,
        className:
          'rounded-lg border border-yesil/20 bg-white px-3 py-2.5 focus:border-altin aria-invalid:border-kor',
      })}
      {error && (
        <p id={errId} className="text-sm text-kor">
          {error}
        </p>
      )}
    </div>
  );
}
