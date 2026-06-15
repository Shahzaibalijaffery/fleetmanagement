export function formatMoney(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
