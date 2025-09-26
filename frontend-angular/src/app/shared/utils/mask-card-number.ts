export function mascararNumeroCartao(numero: string): string {
  const digits = (numero || '').replace(/\s+/g, '');
  if (digits.length < 6) return numero || '';
  const prefix = digits.slice(0, 4);
  const sufix = digits.slice(-4);
  return `${prefix} **** **** ${sufix}`;
}