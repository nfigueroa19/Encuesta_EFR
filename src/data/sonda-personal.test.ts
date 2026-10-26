import { describe, expect, it } from 'vitest';
import { clasificarSonda } from './sonda-personal';

describe('clasificarSonda', () => {
  it('marca la tabla como protegida cuando Postgres niega el privilegio', () => {
    const error = { code: '42501', message: 'permission denied for table personal' };
    expect(clasificarSonda(error)).toEqual({ tipo: 'protegida' });
  });

  it('alerta cuando la clave publicable puede consultar la tabla', () => {
    expect(clasificarSonda(null)).toEqual({ tipo: 'expuesta' });
  });

  it('informa cualquier otro error como falta de conexión', () => {
    const error = { code: '', message: 'TypeError: Failed to fetch' };
    expect(clasificarSonda(error)).toEqual({
      tipo: 'sin-conexion',
      detalle: 'TypeError: Failed to fetch',
    });
  });
});
