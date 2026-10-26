import { describe, expect, it } from 'vitest';
import { clavePaso, PASO_INICIAL, pasoDesdeClave, transicion, type Paso } from './flujo';

const TOTAL = 8;

describe('transicion', () => {
  it('empieza en la introducción y solo la confirmación de lectura abre la primera sección', () => {
    expect(PASO_INICIAL).toEqual({ tipo: 'introduccion' });
    expect(transicion(PASO_INICIAL, { tipo: 'siguiente' }, TOTAL)).toEqual(PASO_INICIAL);
    expect(transicion(PASO_INICIAL, { tipo: 'lectura-confirmada' }, TOTAL)).toEqual({ tipo: 'seccion', indice: 0 });
  });

  it('avanza sección por sección y termina en la decisión de líder', () => {
    expect(transicion({ tipo: 'seccion', indice: 3 }, { tipo: 'siguiente' }, TOTAL)).toEqual({ tipo: 'seccion', indice: 4 });
    expect(transicion({ tipo: 'seccion', indice: 7 }, { tipo: 'siguiente' }, TOTAL)).toEqual({ tipo: 'decision-lider' });
  });

  it('retrocede hasta la introducción y desde los pasos finales', () => {
    expect(transicion({ tipo: 'seccion', indice: 0 }, { tipo: 'anterior' }, TOTAL)).toEqual({ tipo: 'introduccion' });
    expect(transicion({ tipo: 'decision-lider' }, { tipo: 'anterior' }, TOTAL)).toEqual({ tipo: 'seccion', indice: 7 });
    expect(transicion({ tipo: 'lideres' }, { tipo: 'anterior' }, TOTAL)).toEqual({ tipo: 'decision-lider' });
  });

  it('solo un líder que lo elige llega al Instrumento B', () => {
    expect(transicion({ tipo: 'decision-lider' }, { tipo: 'continuar-como-lider' }, TOTAL)).toEqual({ tipo: 'lideres' });
    expect(transicion({ tipo: 'seccion', indice: 2 }, { tipo: 'continuar-como-lider' }, TOTAL)).toEqual({ tipo: 'seccion', indice: 2 });
  });

  it('el resultado del envío solo cambia el paso desde la decisión o el Instrumento B', () => {
    const enviables: readonly Paso[] = [{ tipo: 'decision-lider' }, { tipo: 'lideres' }];
    for (const paso of enviables) {
      expect(transicion(paso, { tipo: 'envio-registrado' }, TOTAL)).toEqual({ tipo: 'enviado' });
      expect(transicion(paso, { tipo: 'ya-respondio' }, TOTAL)).toEqual({ tipo: 'ya-respondio' });
    }
    expect(transicion({ tipo: 'seccion', indice: 1 }, { tipo: 'envio-registrado' }, TOTAL)).toEqual({ tipo: 'seccion', indice: 1 });
  });
});

describe('historial del navegador', () => {
  it('ida y vuelta entre clave y paso', () => {
    const pasos: Paso[] = [{ tipo: 'introduccion' }, { tipo: 'seccion', indice: 3 }, { tipo: 'decision-lider' }, { tipo: 'lideres' }];
    for (const paso of pasos) expect(pasoDesdeClave(clavePaso(paso), 7)).toEqual(paso);
  });

  it('rechaza claves desconocidas, fuera de rango o de pasos finales', () => {
    for (const clave of ['seccion-7', 'seccion--1', 'enviado', 'ya-respondio', '../x', 3, null, undefined]) {
      expect(pasoDesdeClave(clave, 7)).toBeNull();
    }
  });

  it('ir-a solo actúa dentro del cuestionario, no tras el envío', () => {
    const destino: Paso = { tipo: 'seccion', indice: 1 };
    expect(transicion({ tipo: 'seccion', indice: 4 }, { tipo: 'ir-a', paso: destino }, 7)).toEqual(destino);
    expect(transicion({ tipo: 'enviado' }, { tipo: 'ir-a', paso: destino }, 7)).toEqual({ tipo: 'enviado' });
  });
});
