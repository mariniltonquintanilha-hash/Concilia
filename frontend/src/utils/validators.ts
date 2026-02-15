export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function isPositive(value: number): boolean {
  return typeof value === 'number' && value > 0;
}
