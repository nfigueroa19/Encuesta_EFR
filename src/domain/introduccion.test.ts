import { describe, expect, it } from 'vitest';
import { INTRODUCCION } from './introduccion';

const textos = INTRODUCCION.bloques.flatMap((bloque) =>
  bloque.elementos.flatMap((elemento) => (elemento.tipo === 'parrafo' ? [elemento.texto] : elemento.items)),
);

describe('INTRODUCCION', () => {
  it('nombra al hospital completo, nunca con la sigla', () => {
    expect([INTRODUCCION.titulo, ...textos].some((texto) => texto.includes('HSLV'))).toBe(false);
    expect(textos.some((texto) => texto.includes('Hospital Susana López de Valencia'))).toBe(true);
  });

  it('lista las seis dimensiones de la línea base', () => {
    const dimensiones = INTRODUCCION.bloques.flatMap((bloque) => bloque.elementos).filter((e) => e.tipo === 'lista');
    expect(dimensiones.map((lista) => lista.items.length)).toEqual([4, 6]);
  });
});
