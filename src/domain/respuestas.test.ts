import { describe, expect, it } from 'vitest';
import type { Pregunta, Seccion } from './cuestionario';
import { SECCIONES_INSTRUMENTO_A } from './instrumento-a';
import {
  dimensionesCompletadas,
  esVisible,
  normalizarSeleccion,
  preguntasFaltantes,
  registrarRespuesta,
  respuestasParaEnvio,
  SIN_RESPUESTAS,
  type Respuestas,
} from './respuestas';

const caracterizacion = SECCIONES_INSTRUMENTO_A[0] as Seccion;
const parentesco = caracterizacion.preguntas.find((pregunta) => pregunta.id === 'A-C-10') as Pregunta;
const dependientes = caracterizacion.preguntas.find((pregunta) => pregunta.id === 'A-C-06') as Pregunta;

const conDependientes = (opcion: string): Respuestas => registrarRespuesta(SIN_RESPUESTAS, dependientes, { tipo: 'opcion', opcion });

describe('esVisible', () => {
  it('muestra A-C-10 solo si la persona declara dependientes económicos', () => {
    expect(esVisible(parentesco, SIN_RESPUESTAS)).toBe(false);
    expect(esVisible(parentesco, conDependientes('no'))).toBe(false);
    expect(esVisible(parentesco, conDependientes('si'))).toBe(true);
  });
});

describe('preguntasFaltantes', () => {
  it('exige las preguntas cerradas y deja opcionales las de texto', () => {
    const faltantes = preguntasFaltantes(caracterizacion, SIN_RESPUESTAS).map((pregunta) => pregunta.id);
    expect(faltantes).toEqual(['A-C-01', 'A-C-02', 'A-C-03', 'A-C-04', 'A-C-05', 'A-C-06']);
  });

  it('no cuenta una selección múltiple vacía como respondida', () => {
    const cuidado = caracterizacion.preguntas.find((pregunta) => pregunta.id === 'A-C-05') as Pregunta;
    const vacia = registrarRespuesta(SIN_RESPUESTAS, cuidado, { tipo: 'opciones', opciones: [] });
    expect(preguntasFaltantes(caracterizacion, vacia).map((pregunta) => pregunta.id)).toContain('A-C-05');
  });
});

describe('normalizarSeleccion', () => {
  it('"Ninguna" reemplaza a las demás y elegir otra opción la retira', () => {
    expect(normalizarSeleccion(['hijos-menores'], ['hijos-menores', 'ninguna'], 'ninguna')).toEqual(['ninguna']);
    expect(normalizarSeleccion(['ninguna'], ['ninguna', 'adultos-mayores'], 'ninguna')).toEqual(['adultos-mayores']);
    expect(normalizarSeleccion([], ['otra'], 'ninguna')).toEqual(['otra']);
  });
});

describe('respuestasParaEnvio', () => {
  it('omite textos vacíos y preguntas ocultas, y recorta espacios', () => {
    const genero = caracterizacion.preguntas.find((pregunta) => pregunta.id === 'A-C-07') as Pregunta;
    let respuestas = conDependientes('no');
    respuestas = registrarRespuesta(respuestas, parentesco, { tipo: 'texto', texto: 'Madre' });
    respuestas = registrarRespuesta(respuestas, genero, { tipo: 'texto', texto: '  Femenino ' });
    const envio = respuestasParaEnvio([caracterizacion], respuestas);
    expect(envio.has('A-C-10')).toBe(false);
    expect(envio.get('A-C-07')).toEqual({ tipo: 'texto', texto: 'Femenino' });
  });
});

describe('dimensionesCompletadas', () => {
  it('cuenta una dimensión cuando sus ocho afirmaciones tienen respuesta', () => {
    const dimension1 = SECCIONES_INSTRUMENTO_A[1] as Seccion;
    const respuestas = dimension1.preguntas.reduce<Respuestas>(
      (acumuladas, pregunta) => registrarRespuesta(acumuladas, pregunta, { tipo: 'opcion', opcion: 'de-acuerdo' }),
      SIN_RESPUESTAS,
    );
    expect(dimensionesCompletadas(SECCIONES_INSTRUMENTO_A, respuestas)).toBe(1);
  });
});
