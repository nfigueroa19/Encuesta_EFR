import { describe, expect, it } from 'vitest';
import type { ConteoOpcion, Envio } from './datos-panel';
import { distribucion } from './distribucion';
import { partesLibroEnvios } from './excel-envios';
import { filtrarEnvios, resumenParticipacion } from './participacion';
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
});

describe('participación', () => {
  const envios: Envio[] = [
    { cedula: 1, nombre: '=HYPERLINK("x")', respondioLideres: true, enviadoEl: '2026-11-13' },
    { cedula: 2, nombre: null, respondioLideres: false, enviadoEl: '2026-11-12' },
  ];

  it('cuenta envíos de hoy y líderes', () => {
    expect(resumenParticipacion(envios, '2026-11-13')).toMatchObject({ respondieron: 2, total: 99, hoy: 1, lideres: 1 });
  });

  it('busca por cédula con puntos o por nombre sin tildes', () => {
    const lista: Envio[] = [
      { cedula: 1061234567, nombre: 'María Gómez', respondioLideres: false, enviadoEl: '2026-11-13' },
      { cedula: 34567890, nombre: 'Juan Pérez', respondioLideres: true, enviadoEl: '2026-11-12' },
    ];
    expect(filtrarEnvios(lista, '1.061.234').map((envio) => envio.cedula)).toEqual([1061234567]);
    expect(filtrarEnvios(lista, 'gomez').map((envio) => envio.cedula)).toEqual([1061234567]);
    expect(filtrarEnvios(lista, '  ')).toHaveLength(2);
    expect(filtrarEnvios(lista, 'ana')).toHaveLength(0);
  });

  it('arma la hoja de Excel con textos escapados y sin fórmulas', () => {
    const hoja = partesLibroEnvios(envios)['xl/worksheets/sheet1.xml'] ?? '';
    expect(hoja).toContain('<c><v>1</v></c><c t="inlineStr" s="0"><is><t xml:space="preserve">=HYPERLINK(&quot;x&quot;)</t></is></c>');
    expect(hoja).not.toContain('<f>');
    expect(hoja.match(/<row>/g)).toHaveLength(3);
  });
});
