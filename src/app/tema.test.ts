import { describe, expect, it } from 'vitest';
import { esPreferenciaTema, resolverTema } from './tema';

describe('esPreferenciaTema', () => {
  it('acepta solo los valores del mapa cerrado', () => {
    expect(esPreferenciaTema('oscuro')).toBe(true);
    expect(esPreferenciaTema('../oscuro')).toBe(false);
    expect(esPreferenciaTema(null)).toBe(false);
  });
});

describe('resolverTema', () => {
  it('respeta la elección manual sobre la del sistema', () => {
    expect(resolverTema('claro', true)).toBe('light');
    expect(resolverTema('oscuro', false)).toBe('dark');
  });

  it('sigue al sistema cuando la preferencia es "sistema"', () => {
    expect(resolverTema('sistema', true)).toBe('dark');
    expect(resolverTema('sistema', false)).toBe('light');
  });
});
