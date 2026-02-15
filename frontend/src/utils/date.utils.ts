export function getMonthYear(date: Date): string {
  return `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
