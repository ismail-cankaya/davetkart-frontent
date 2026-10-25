import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
  hint?: string;
}

/**
 * Hesap formlarının etiketli girdisi (Faz 14). Hata alanın altında, ekran
 * okuyucuya `aria-describedby` ile bağlı.
 */
export function FormField({ id, label, error, hint, className, ...input }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-bold tracking-wider uppercase text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={
          'w-full bg-white border border-ink/15 focus:border-brand/50 focus:ring-2 focus:ring-brand/10 focus:outline-none ' +
          'rounded-xl px-4 py-3 text-sm text-ink transition duration-300 aria-[invalid=true]:border-rose-400 ' +
          (className ?? '')
        }
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Birincil kaydet düğmesi; meşgulken metni değişir ve tıklanamaz. */
export function SubmitButton({ busy, busyLabel, children }: { busy: boolean; busyLabel: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-soft disabled:opacity-60 disabled:cursor-wait text-white px-6 py-3 rounded-full font-semibold text-sm transition duration-300 cursor-pointer shadow-md shadow-brand/15"
    >
      {busy ? busyLabel : children}
    </button>
  );
}
