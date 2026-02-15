// Placeholder for common validation functions
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isPositiveNumber(num: number): boolean {
  return typeof num === 'number' && num > 0;
}
