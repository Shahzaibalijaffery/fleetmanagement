export function formatNumericFieldValue(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '';
  }

  return String(value);
}

export function formatAmountFieldValue(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value) || value === 0) {
    return '';
  }

  return String(value);
}

export function sanitizeIntegerInput(text: string): string {
  return text.replace(/\D/g, '');
}

export function sanitizeDecimalInput(text: string): string {
  const cleaned = text.replace(/[^\d.]/g, '');
  const dotIndex = cleaned.indexOf('.');

  if (dotIndex === -1) {
    return cleaned;
  }

  const beforeDot = cleaned.slice(0, dotIndex + 1);
  const afterDot = cleaned.slice(dotIndex + 1).replace(/\./g, '');

  return beforeDot + afterDot;
}

export function handleIntegerFieldChange(
  text: string,
  onChange: (value: number | undefined) => void,
): void {
  const sanitized = sanitizeIntegerInput(text);

  if (sanitized === '') {
    onChange(undefined);
    return;
  }

  onChange(Number(sanitized));
}

export function handleAmountFieldChange(text: string, onChange: (value: number) => void): void {
  const sanitized = sanitizeDecimalInput(text);

  if (sanitized === '' || sanitized === '.') {
    onChange(0);
    return;
  }

  const parsed = Number(sanitized);
  onChange(Number.isNaN(parsed) ? 0 : parsed);
}

export function parseIntegerInput(text: string, fallback: number): number {
  const sanitized = sanitizeIntegerInput(text.trim());

  if (sanitized === '') {
    return fallback;
  }

  const parsed = Number(sanitized);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

export function parseDecimalInput(text: string, fallback: number): number {
  const sanitized = sanitizeDecimalInput(text.trim());

  if (sanitized === '' || sanitized === '.') {
    return fallback;
  }

  const parsed = Number(sanitized);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}
