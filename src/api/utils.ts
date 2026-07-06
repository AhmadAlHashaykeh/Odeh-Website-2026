import type { ListParams } from './types';

export function buildQueryString(params: ListParams = {}): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function mapSortKey(sortKey: string, sortMap: Record<string, string>): string | undefined {
  if (!sortKey) {
    return undefined;
  }

  return sortMap[sortKey];
}

export const COMMON_SORT_MAP: Record<string, string> = {
  title_asc: 'title',
  title_desc: '-title',
  updated_asc: 'updated_at',
  updated_desc: '-updated_at',
  order_asc: 'display_order',
};

export async function fetchTotalCount(
  listFn: (params: ListParams) => Promise<{ meta: { total: number } }>,
  params: ListParams = {},
): Promise<number> {
  const response = await listFn({ ...params, page: 1, per_page: 1 });
  return response.meta.total;
}
