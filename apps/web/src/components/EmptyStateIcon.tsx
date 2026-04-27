type EmptyStateIconProps = Readonly<{
  children?: React.ReactNode;
}>;

export function EmptyStateIcon({ children }: EmptyStateIconProps) {
  return (
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--card)] text-[var(--foreground-muted)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--border)]">
      {children ?? (
        <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
          <path
            d="M3.5 12h4l2.1-5 4.8 10 2.1-5H20.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </span>
  );
}
