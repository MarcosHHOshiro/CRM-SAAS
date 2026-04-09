type SelectFieldOption = {
  label: string;
  value: string;
};

type SelectFieldProps = Readonly<{
  error?: string;
  hint?: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectFieldOption[];
  value: string;
}>;

export function SelectField({
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
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      <select
        className="min-h-12 rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none ring-0 focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,122,86,0.12)]"
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
