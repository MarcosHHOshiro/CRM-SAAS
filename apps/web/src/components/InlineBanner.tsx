type InlineBannerProps = Readonly<{
  children: React.ReactNode;
  tone?: 'error' | 'info' | 'success';
}>;

const toneClasses: Record<NonNullable<InlineBannerProps['tone']>, string> = {
  error: 'border-[color:rgba(181,69,69,0.18)] bg-[color:rgba(181,69,69,0.08)] text-[var(--danger)]',
  info: 'border-[var(--border)] bg-[var(--card-strong)] text-[var(--foreground)]',
  success:
    'border-[color:rgba(17,122,86,0.18)] bg-[color:rgba(17,122,86,0.08)] text-[var(--accent-strong)]',
};

export function InlineBanner({ children, tone = 'info' }: InlineBannerProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm leading-6 ${toneClasses[tone]}`}>
      {children}
    </div>
  );
}
