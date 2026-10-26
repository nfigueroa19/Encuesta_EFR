// Cédulas colombianas: entre 5 y 11 dígitos. Se aceptan puntos y espacios como separadores de miles.
const SEPARADORES = /[.\s]/g;
const SOLO_DIGITOS = /^[0-9]{5,11}$/;

export function leerCedula(texto: string): number | null {
  const limpia = texto.replace(SEPARADORES, '');
  if (!SOLO_DIGITOS.test(limpia) || limpia.startsWith('0')) return null;
  return Number(limpia);
}
