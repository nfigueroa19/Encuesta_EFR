import { describe, expect, it } from 'vitest';
import { aCargaEnvio } from './encuesta-rpc';

describe('aCargaEnvio', () => {
  it('produce el JSON que valida public.efr_valor_valido: una sola clave por respuesta', () => {
    const carga = aCargaEnvio(new Map([
      ['A-D1-01', { tipo: 'opcion', opcion: 'de-acuerdo' }],
      ['A-C-05', { tipo: 'opciones', opciones: ['ninguna'] }],
      ['A-AB-53', { tipo: 'texto', texto: 'Horarios flexibles' }],
    ] as const));
    expect(carga).toEqual({
      'A-D1-01': { opcion: 'de-acuerdo' },
      'A-C-05': { opciones: ['ninguna'] },
      'A-AB-53': { texto: 'Horarios flexibles' },
    });
  });
});
