import { describe, expect, it } from 'vitest';
import type { Pregunta, Seccion } from './cuestionario';
import { SECCIONES_INSTRUMENTO_A } from './instrumento-a';
import {
  dimensionesCompletadas,
  esVisible,
  estaRespondida,
  hayRespuestas,
  normalizarSeleccion,
  preguntasFaltantes,
  registrarRespuesta,
  respuestasParaEnvio,
  SIN_OPCION,
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

describe('edad de las personas cuidadas', () => {
  const buscar = (id: string) => caracterizacion.preguntas.find((pregunta) => pregunta.id === id) as Pregunta;
  const cuidado = buscar('A-C-05');
  const edadHijos = buscar('A-C-11');
  const edadMayores = buscar('A-C-12');
  const marcar = (...opciones: string[]) => registrarRespuesta(SIN_RESPUESTAS, cuidado, { tipo: 'opciones', opciones });

  it('pregunta cada rango solo por el tipo de persona marcado', () => {
    expect([esVisible(edadHijos, SIN_RESPUESTAS), esVisible(edadMayores, SIN_RESPUESTAS)]).toEqual([false, false]);
    expect([esVisible(edadHijos, marcar('hijos-menores')), esVisible(edadMayores, marcar('hijos-menores'))]).toEqual([true, false]);
    expect([esVisible(edadHijos, marcar('hijos-menores', 'adultos-mayores')), esVisible(edadMayores, marcar('hijos-menores', 'adultos-mayores'))]).toEqual([true, true]);
    expect(esVisible(edadHijos, marcar('ninguna'))).toBe(false);
  });

  it('exige el rango cuando se muestra y lo omite del envío cuando se oculta', () => {
    const respuestas = marcar('adultos-mayores');
    const faltantes = preguntasFaltantes(caracterizacion, respuestas).map((pregunta) => pregunta.id);
    expect(faltantes).toEqual(['A-C-01', 'A-C-02', 'A-C-03', 'A-C-04', 'A-C-12', 'A-C-06', 'A-C-07', 'A-C-08', 'A-C-09']);
    const conEdad = registrarRespuesta(respuestas, edadMayores, { tipo: 'opciones', opciones: ['70-a-79'] });
    const sinMayores = registrarRespuesta(conEdad, cuidado, { tipo: 'opciones', opciones: ['ninguna'] });
    expect(respuestasParaEnvio([caracterizacion], conEdad).has('A-C-12')).toBe(true);
    expect(respuestasParaEnvio([caracterizacion], sinMayores).has('A-C-12')).toBe(false);
  });
});

describe('preguntasFaltantes', () => {
  it('exige todas las preguntas visibles, también las de texto', () => {
    const faltantes = preguntasFaltantes(caracterizacion, SIN_RESPUESTAS).map((pregunta) => pregunta.id);
    expect(faltantes).toEqual(['A-C-01', 'A-C-02', 'A-C-03', 'A-C-04', 'A-C-05', 'A-C-06', 'A-C-07', 'A-C-08', 'A-C-09']);
  });

  it('un texto corto necesita 2 caracteres y uno largo 10, sin contar espacios sobrantes', () => {
    const genero = caracterizacion.preguntas.find((pregunta) => pregunta.id === 'A-C-07') as Pregunta;
    const abierta = SECCIONES_INSTRUMENTO_A.at(-1)?.preguntas[0] as Pregunta;
    const texto = (cadena: string) => ({ tipo: 'texto', texto: cadena }) as const;
    expect(estaRespondida(genero, texto(' M '))).toBe(false);
    expect(estaRespondida(genero, texto('Mujer'))).toBe(true);
    expect(estaRespondida(abierta, texto('Más tiempo '))).toBe(true);
    expect(estaRespondida(abierta, texto('Mejor   '))).toBe(false);
  });

  it('exige el parentesco (A-C-10) solo cuando hay dependientes económicos', () => {
    const faltantes = preguntasFaltantes(caracterizacion, conDependientes('si')).map((pregunta) => pregunta.id);
    expect(faltantes).toContain('A-C-10');
    expect(preguntasFaltantes(caracterizacion, conDependientes('no')).map((pregunta) => pregunta.id)).not.toContain('A-C-10');
  });

  it('no cuenta una selección múltiple vacía como respondida', () => {
    const cuidado = caracterizacion.preguntas.find((pregunta) => pregunta.id === 'A-C-05') as Pregunta;
    const vacia = registrarRespuesta(SIN_RESPUESTAS, cuidado, { tipo: 'opciones', opciones: [] });
    expect(preguntasFaltantes(caracterizacion, vacia).map((pregunta) => pregunta.id)).toContain('A-C-05');
  });
});

describe('hayRespuestas', () => {
  it('ignora textos en blanco y selecciones quitadas', () => {
    const abierta = SECCIONES_INSTRUMENTO_A.at(-1)?.preguntas[0] as Pregunta;
    expect(hayRespuestas(SIN_RESPUESTAS)).toBe(false);
    expect(hayRespuestas(registrarRespuesta(SIN_RESPUESTAS, abierta, { tipo: 'texto', texto: '  ' }))).toBe(false);
    expect(hayRespuestas(registrarRespuesta(conDependientes('si'), dependientes, SIN_OPCION))).toBe(false);
    expect(hayRespuestas(conDependientes('no'))).toBe(true);
  });
});

describe('SIN_OPCION', () => {
  it('quitar la opción marcada deja la pregunta sin responder y fuera del envío', () => {
    const marcada = conDependientes('si');
    expect(preguntasFaltantes(caracterizacion, marcada).map((pregunta) => pregunta.id)).not.toContain('A-C-06');
    const quitada = registrarRespuesta(marcada, dependientes, SIN_OPCION);
    expect(preguntasFaltantes(caracterizacion, quitada).map((pregunta) => pregunta.id)).toContain('A-C-06');
    expect(esVisible(parentesco, quitada)).toBe(false);
    expect(respuestasParaEnvio([caracterizacion], quitada).has('A-C-06')).toBe(false);
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
    respuestas = registrarRespuesta(respuestas, caracterizacion.preguntas.find((p) => p.id === 'A-C-09') as Pregunta, { tipo: 'texto', texto: ' ' });
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
