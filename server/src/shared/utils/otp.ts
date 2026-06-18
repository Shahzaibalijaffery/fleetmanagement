export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getOtpExpiryDate(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
