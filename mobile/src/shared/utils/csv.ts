export function escapeCsvCell(value: string | number | null | undefined): string {
  const text = value == null ? '' : String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function buildCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>): string {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const dataLines = rows.map((row) => row.map(escapeCsvCell).join(','));

  return [headerLine, ...dataLines].join('\n');
}

export function formatCsvDate(value: string): string {
  return value.slice(0, 10);
}
