export type PaginationParams = {
  page?: string | number;
  limit?: string | number;
};

export type Pagination = {
  page: number;
  limit: number;
  skip: number;
};

export function parsePagination(
  params: PaginationParams,
  options?: { defaultPage?: number; defaultLimit?: number; maxLimit?: number }
): Pagination {
  const defaultPage = options?.defaultPage ?? 1;
  const defaultLimit = options?.defaultLimit ?? 20;
  const maxLimit = options?.maxLimit ?? 100;

  const rawPage = Number(params.page ?? defaultPage);
  const rawLimit = Number(params.limit ?? defaultLimit);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : defaultPage;
  const limitUncapped =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : defaultLimit;
  const limit = Math.min(limitUncapped, maxLimit);

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(total: number, p: Pagination) {
  const totalPages = Math.max(Math.ceil(total / p.limit), 1);
  return {
    page: p.page,
    limit: p.limit,
    total,
    totalPages,
    hasPrev: p.page > 1,
    hasNext: p.page < totalPages,
  };
}
