type TextFieldProps = Readonly<{
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}>;

export function TextField({
  autoComplete,
  disabled = false,
  error,
  hint,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
}: TextFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
        {label}
      </span>
      <input
        autoComplete={autoComplete}
        className="min-h-11 rounded-xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none ring-0 placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,92,53,0.12)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-[var(--foreground-muted)] disabled:opacity-80"
        disabled={disabled}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? <span className="text-sm text-[var(--danger)]">{error}</span> : null}
      {!error && hint ? <span className="text-sm text-[var(--foreground-muted)]">{hint}</span> : null}
    </label>
  );
}
