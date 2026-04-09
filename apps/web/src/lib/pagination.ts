type SearchParamsLike = Pick<URLSearchParams, 'get' | 'toString'>;

export function getPageFromSearchParams(searchParams: SearchParamsLike) {
  const rawPage = Number(searchParams.get('page') ?? '1');

  if (!Number.isInteger(rawPage) || rawPage < 1) {
    return 1;
  }

  return rawPage;
}

export function paginateItems<T>(items: T[], currentPage: number, pageSize: number) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    currentPage: safePage,
    items: items.slice(startIndex, startIndex + pageSize),
    totalItems,
    totalPages,
  };
}

export function buildPageQueryString(searchParams: SearchParamsLike, page: number) {
  const params = new URLSearchParams(searchParams.toString());

  if (page <= 1) {
    params.delete('page');
  } else {
    params.set('page', String(page));
  }

  return params.toString();
}
