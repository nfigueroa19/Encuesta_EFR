import { describe, expect, it } from 'vitest';
import { esTamanoTexto } from './tamano-texto';

describe('esTamanoTexto', () => {
  it('acepta solo los valores del mapa cerrado', () => {
    expect(esTamanoTexto('muy-grande')).toBe(true);
    expect(esTamanoTexto('200%')).toBe(false);
    expect(esTamanoTexto(null)).toBe(false);
  });
});
