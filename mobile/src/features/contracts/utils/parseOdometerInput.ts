export function parseOdometerInput(input: string, fallback: number): number {
  const trimmed = input.trim();

  if (trimmed === '') {
    return fallback;
  }

  const sanitized = trimmed.replace(/\D/g, '');

  if (sanitized === '') {
    return fallback;
  }

  const parsed = Number(sanitized);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}
