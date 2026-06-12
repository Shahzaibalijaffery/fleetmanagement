export function parseOdometerInput(input: string, fallback: number): number {
  const trimmed = input.trim();

  if (trimmed === '') {
    return fallback;
  }

  const parsed = Number(trimmed);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}
