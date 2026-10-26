export const TAMANOS_TEXTO = ['normal', 'grande', 'muy-grande'] as const;

export type TamanoTexto = (typeof TAMANOS_TEXTO)[number];

export function esTamanoTexto(valor: unknown): valor is TamanoTexto {
  return TAMANOS_TEXTO.some((tamano) => tamano === valor);
}
