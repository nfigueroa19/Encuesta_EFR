export const PREFERENCIAS_TEMA = ['claro', 'oscuro', 'sistema'] as const;

export type PreferenciaTema = (typeof PREFERENCIAS_TEMA)[number];

// Valores de data-theme que reconoce HeroUI.
export type TemaAplicado = 'light' | 'dark';

export function esPreferenciaTema(valor: unknown): valor is PreferenciaTema {
  return PREFERENCIAS_TEMA.some((preferencia) => preferencia === valor);
}

export function resolverTema(preferencia: PreferenciaTema, sistemaOscuro: boolean): TemaAplicado {
  if (preferencia === 'sistema') return sistemaOscuro ? 'dark' : 'light';
  return preferencia === 'oscuro' ? 'dark' : 'light';
}
