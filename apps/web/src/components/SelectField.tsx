type SelectFieldOption = {
  label: string;
  value: string;
};

type SelectFieldProps = Readonly<{
  disabled?: boolean;
  error?: string;
  hint?: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectFieldOption[];
  value: string;
}>;

export function SelectField({
  disabled = false,
  error,
  hint,
  label,
  name,
  onChange,
  options,
  value,
}: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
        {label}
      </span>
      <select
        className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none ring-0 focus:border-[var(--accent)] focus:bg-[var(--card-strong)] focus:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:bg-[var(--field-disabled)] disabled:text-[var(--foreground-muted)] disabled:opacity-80"
        disabled={disabled}
        name={name}
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-sm text-[var(--danger)]">{error}</span> : null}
      {!error && hint ? <span className="text-sm text-[var(--foreground-muted)]">{hint}</span> : null}
    </label>
  );
}
