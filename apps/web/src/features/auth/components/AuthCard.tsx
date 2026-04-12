'use client';

type AuthCardProps = Readonly<{
  children: React.ReactNode;
  description: string;
  title: string;
}>;

export function AuthCard({ children, description, title }: AuthCardProps) {
  return (
    <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-[var(--shadow-soft)] sm:p-9">
      <div>
        <h1 className="text-[1.9rem] font-medium tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.15rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>
        <div className="mt-8 border-t border-[var(--border)] pt-7">{children}</div>
      </div>
    </div>
  );
}
