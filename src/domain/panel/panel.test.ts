import { describe, expect, it } from 'vitest';
import type { ConteoOpcion, Envio } from './datos-panel';
import { distribucion, inicioBarraDivergente } from './distribucion';
import { csvEnvios, resumenParticipacion } from './participacion';
import { nivelSemaforo, porcentajeDimension, promedioLikert } from './puntaje-efr';
import { correoDeUsuario } from './usuario-panel';

const conteo = (preguntaId: string, opcion: string, total: number, respondientes: number): ConteoOpcion => ({ preguntaId, opcion, total, respondientes });

describe('usuario del panel', () => {
  it('solo acepta talento, sin importar mayúsculas ni espacios', () => {
    expect(correoDeUsuario(' Talento ')).toBe('talento@efr.hosusana.com');
    expect(correoDeUsuario('admin')).toBeNull();
    expect(correoDeUsuario('talento@efr.hosusana.com')).toBeNull();
  });
});

describe('puntaje preliminar', () => {
  it('reproduce el ejemplo del documento: 3,75 → 75 %', () => {
    expect(porcentajeDimension(3.75)).toBe(75);
  });

  it('promedia solo los ítems pedidos y las opciones Likert', () => {
    const conteos = [conteo('A-D1-01', 'totalmente-de-acuerdo', 3, 4), conteo('A-D1-01', 'en-desacuerdo', 1, 4), conteo('A-D2-09', 'de-acuerdo', 9, 9)];
    expect(promedioLikert(conteos, ['A-D1-01'])).toBe((5 * 3 + 2) / 4);
    expect(promedioLikert(conteos, ['A-D3-17'])).toBeNull();
  });

  it('asigna el nivel por límite inferior', () => {
    expect([0, 39.5, 40, 59.9, 60, 74.9, 75, 89.9, 90, 100].map(nivelSemaforo)).toEqual([
      'critico', 'critico', 'bajo', 'bajo', 'en-desarrollo', 'en-desarrollo', 'consolidado', 'consolidado', 'avanzado', 'avanzado',
    ]);
  });
});

describe('distribución', () => {
  const opciones = [{ id: 'a', texto: 'A' }, { id: 'b', texto: 'B' }, { id: 'c', texto: 'C' }];

  it('usa las personas que respondieron como denominador y conserva el orden', () => {
    const resultado = distribucion([conteo('P', 'c', 1, 4), conteo('P', 'a', 4, 4)], 'P', opciones);
    expect(resultado.respondientes).toBe(4);
    expect(resultado.opciones.map((item) => item.porcentaje)).toEqual([100, 0, 25]);
  });

  it('centra la opción neutra en el 50 %', () => {
    const items = [10, 20, 40, 20, 10].map((porcentaje, indice) => ({ opcion: { id: String(indice), texto: '' }, total: 0, porcentaje }));
    // 30 % en desacuerdo + la mitad del 40 % neutro = 50 puntos a la izquierda del centro, a media escala.
    expect(inicioBarraDivergente(items)).toBe(25);
  });
});

describe('participación', () => {
  const envios: Envio[] = [
    { cedula: 1, nombre: '=HYPERLINK("x")', respondioLideres: true, enviadoEl: '2026-11-13' },
    { cedula: 2, nombre: null, respondioLideres: false, enviadoEl: '2026-11-12' },
  ];

  it('cuenta envíos de hoy y líderes', () => {
    expect(resumenParticipacion(envios, 115, '2026-11-13')).toMatchObject({ respondieron: 2, hoy: 1, lideres: 1 });
  });

  it('neutraliza fórmulas y escapa comillas en el CSV', () => {
    expect(csvEnvios(envios).split('\r\n')[1]).toBe('"1";"\'=HYPERLINK(""x"")";"Sí";"2026-11-13"');
  });
});
