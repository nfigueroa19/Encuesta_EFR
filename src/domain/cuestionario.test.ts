import { describe, expect, it } from 'vitest';
import { TOTAL_DIMENSIONES } from './dimensiones';
import { ESCALA_LIKERT } from './escala-likert';
import { SECCIONES_INSTRUMENTO_A } from './instrumento-a';
import { SECCION_LIDERES } from './instrumento-b';

// Debe coincidir con el CHECK de public.efr_preguntas.id y con el catálogo sembrado en la migración.
const FORMATO_ID = /^(A-C-[0-9]{2}|A-D[1-6]-[0-9]{2}|A-AB-[0-9]{2}|B-[0-9]{2})$/;
const todas = [...SECCIONES_INSTRUMENTO_A, SECCION_LIDERES].flatMap((seccion) => seccion.preguntas);

describe('catálogo del cuestionario', () => {
  it('tiene los 82 identificadores del catálogo en Supabase (80 + A-C-11 y A-C-12 de la migración 20261025120000), únicos y con formato válido', () => {
    const ids = todas.map((pregunta) => pregunta.id);
    expect(ids).toHaveLength(82);
    expect(new Set(ids).size).toBe(82);
    expect(ids.every((id) => FORMATO_ID.test(id))).toBe(true);
  });

  it('numera las 48 afirmaciones del 1 al 48, ocho por dimensión', () => {
    const likert = todas.filter((pregunta) => pregunta.tipo === 'likert');
    expect(likert.map((pregunta) => pregunta.numero)).toEqual(Array.from({ length: 48 }, (_, indice) => indice + 1));
    expect(likert[8]?.id).toBe('A-D2-09');
    expect(likert[47]?.id).toBe('A-D6-48');
  });

  it('usa seis dimensiones y una escala de cinco opciones', () => {
    expect(SECCIONES_INSTRUMENTO_A.filter((seccion) => seccion.dimension !== null)).toHaveLength(TOTAL_DIMENSIONES);
    expect(ESCALA_LIKERT.map((opcion) => opcion.id)).toEqual([
      'totalmente-de-acuerdo', 'de-acuerdo', 'parcialmente-de-acuerdo', 'en-desacuerdo', 'totalmente-en-desacuerdo',
    ]);
  });

  it('cubre las preguntas abiertas 53 a 60 y las 14 del Instrumento B', () => {
    const abiertas = SECCIONES_INSTRUMENTO_A.at(-1)?.preguntas.map((pregunta) => pregunta.id);
    expect(abiertas).toEqual(['A-AB-53', 'A-AB-54', 'A-AB-55', 'A-AB-56', 'A-AB-57', 'A-AB-58', 'A-AB-59', 'A-AB-60']);
    expect(SECCION_LIDERES.preguntas.at(-1)?.id).toBe('B-14');
  });
});
