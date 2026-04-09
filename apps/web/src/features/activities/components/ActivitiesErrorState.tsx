import { useTranslation } from '@/i18n/use-translation';

type ActivitiesErrorStateProps = Readonly<{
  message: string;
  onRetry?: () => void;
}>;

export function ActivitiesErrorState({
  message,
  onRetry,
}: ActivitiesErrorStateProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-[color:rgba(181,69,69,0.16)] bg-[color:rgba(181,69,69,0.06)] p-8 shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--danger)]">
        {messages.activities.error.eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {messages.activities.error.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">{message}</p>
      {onRetry ? (
        <button
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          onClick={onRetry}
          type="button"
        >
          {messages.common.actions.tryAgain}
        </button>
      ) : null}
    </section>
  );
}
