export function formatCurrency(amount: number, currency: string = 'BRL', locale: string = 'pt-BR'): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }
  
  export function formatDate(dateInput: Date | string, locale: string = 'pt-BR'): string {
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat(locale).format(date);
  }
