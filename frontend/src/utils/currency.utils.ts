export function formatToCurrency(amount: number, currency: string = 'BRL', locale: string = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrency(currencyString: string, locale: string = 'pt-BR'): number | null {
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }); // Assuming BRL
  const parts = formatter.formatToParts(1000.00);
  const decimal = parts.find(part => part.type === 'decimal')?.value;
  const group = parts.find(part => part.type === 'group')?.value;

  let cleanedString = currencyString.replace(new RegExp(`\${group}`, 'g'), '');
  if (decimal) {
    cleanedString = cleanedString.replace(decimal, '.');
  }
  
  // Remove currency symbol and any non-numeric characters except for the decimal point
  cleanedString = cleanedString.replace(/[^0-9.-]/g, '');

  const parsed = parseFloat(cleanedString);
  return isNaN(parsed) ? null : parsed;
}
