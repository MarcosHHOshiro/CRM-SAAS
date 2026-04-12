type TextFieldProps = Readonly<{
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  hideErrorIcon?: boolean;
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
  hideErrorIcon = false,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
}: TextFieldProps) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </span>
      <div className="relative">
        <input
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={`min-h-[3rem] w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none ring-0 transition-all placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(255,92,53,0.12)] disabled:cursor-not-allowed disabled:bg-[var(--field-disabled)] disabled:text-[var(--foreground-muted)] disabled:opacity-80 ${
            error
              ? 'border-[var(--danger)] pr-11 focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(214,69,69,0.12)]'
              : 'border-[var(--border)]'
          }`}
          disabled={disabled}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {error && !hideErrorIcon ? (
          <>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center" aria-hidden="true">
              <svg
                className="h-4 w-4 text-[var(--danger)]"
                fill="none"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M10 6.25V10.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
                <circle cx="10" cy="13.5" fill="currentColor" r="1" />
              </svg>
            </span>
            <span className="sr-only" id={`${name}-error`}>
              {error}
            </span>
          </>
        ) : error ? (
          <span className="sr-only" id={`${name}-error`}>
            {error}
          </span>
        ) : null}
      </div>
      {!error && hint ? <span className="text-sm text-[var(--foreground-muted)]">{hint}</span> : null}
    </label>
  );
}
