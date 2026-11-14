// Pure pagination helpers shared by the component and the workbench tests.
// Kept free of JSX so Node can import the source directly in tests.

export function paginationRange(page: number, total: number): (number | 'gap')[] {
  const numbers = [...new Set([1, total, page - 1, page, page + 1])]
    .filter(n => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  numbers.forEach((n, i) => {
    if (i > 0 && n - numbers[i - 1] > 1) result.push('gap');
    result.push(n);
  });
  return result;
}

export function validatePage(input: string, total: number): number | undefined {
  if (!/^\d+$/.test(input.trim())) return undefined;
  const page = Number(input);
  return Number.isSafeInteger(page) && page >= 1 && page <= total ? page : undefined;
}
