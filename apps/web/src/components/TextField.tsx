type TextFieldProps = Readonly<{
  autoComplete?: string;
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
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      <input
        autoComplete={autoComplete}
        className="min-h-12 rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none ring-0 placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,122,86,0.12)]"
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
