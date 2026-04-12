type TextAreaFieldProps = Readonly<{
  error?: string;
  hint?: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}>;

export function TextAreaField({
  error,
  hint,
  label,
  name,
  onChange,
  placeholder,
  rows = 5,
  value,
}: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      <textarea
        className="rounded-2xl border border-[var(--border)] bg-[color:rgb(var(--card-rgb)/0.9)] px-4 py-3 text-sm text-[var(--foreground)] outline-none ring-0 placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:bg-[var(--card-strong)] focus:shadow-[var(--focus-ring)]"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
      {error ? <span className="text-sm text-[var(--danger)]">{error}</span> : null}
      {!error && hint ? <span className="text-sm text-[var(--foreground-muted)]">{hint}</span> : null}
    </label>
  );
}
