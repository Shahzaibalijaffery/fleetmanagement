interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    totalPages: number;
  };
}

export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>,
  pageSize = 100,
): Promise<T[]> {
  const firstPage = await fetchPage(1);
  const items = [...firstPage.data];

  for (let page = 2; page <= firstPage.meta.totalPages; page += 1) {
    const nextPage = await fetchPage(page);
    items.push(...nextPage.data);
  }

  if (firstPage.meta.totalPages === 0 && items.length === 0 && pageSize > 0) {
    return items;
  }

  return items;
}
