'use client';

import { useTranslation } from '@/i18n/use-translation';

type ClientsErrorStateProps = Readonly<{
  message: string;
  onRetry?: () => void;
}>;

export function ClientsErrorState({ message, onRetry }: ClientsErrorStateProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[1.4rem] border border-[color:rgba(214,69,69,0.16)] bg-[color:rgba(214,69,69,0.06)] p-8 shadow-[var(--shadow-soft)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--danger)]">
        {messages.clients.error.eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {messages.clients.error.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">{message}</p>
      {onRetry ? (
        <button
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          onClick={onRetry}
          type="button"
        >
          {messages.common.actions.tryAgain}
        </button>
      ) : null}
    </section>
  );
}
