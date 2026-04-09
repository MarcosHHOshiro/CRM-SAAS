type PaginationControlsProps = Readonly<{
  currentPage: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}>;

export function PaginationControls({
  currentPage,
  itemLabel,
  onPageChange,
  pageSize,
  totalItems,
  totalPages,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <section className="flex flex-col gap-4 rounded-[1.7rem] border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Showing {startItem}-{endItem} of {totalItems} {itemLabel}
        </p>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={currentPage <= 1}
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
          type="button"
        >
          Previous
        </button>
        <button
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={currentPage >= totalPages}
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}
