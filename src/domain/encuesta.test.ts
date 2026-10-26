import { describe, expect, it } from 'vitest';
import { ESTADO_INICIAL, reducirEncuesta, seccionDelPaso, seccionesDelEnvio } from './encuesta';
import { SECCIONES_INSTRUMENTO_A } from './instrumento-a';
import { SECCION_LIDERES } from './instrumento-b';

describe('reducirEncuesta', () => {
  it('aplica la normalización de "Ninguna" al registrar una respuesta múltiple', () => {
    const cuidado = SECCIONES_INSTRUMENTO_A[0]?.preguntas.find((pregunta) => pregunta.id === 'A-C-05');
    if (cuidado === undefined) throw new Error('Falta A-C-05 en el catálogo');
    const conHijos = reducirEncuesta(ESTADO_INICIAL, { tipo: 'responder', pregunta: cuidado, valor: { tipo: 'opciones', opciones: ['hijos-menores'] } });
    const conNinguna = reducirEncuesta(conHijos, { tipo: 'responder', pregunta: cuidado, valor: { tipo: 'opciones', opciones: ['hijos-menores', 'ninguna'] } });
    expect(conNinguna.respuestas.get('A-C-05')).toEqual({ tipo: 'opciones', opciones: ['ninguna'] });
  });

  it('delega los eventos de navegación en la máquina de estados', () => {
    const estado = reducirEncuesta(ESTADO_INICIAL, { tipo: 'evento', evento: { tipo: 'lectura-confirmada' } });
    expect(estado.paso).toEqual({ tipo: 'seccion', indice: 0 });
    expect(seccionDelPaso(estado.paso)).toBe(SECCIONES_INSTRUMENTO_A[0]);
  });
});

describe('seccionesDelEnvio', () => {
  it('incluye el Instrumento B solo cuando la persona eligió responderlo', () => {
    expect(seccionesDelEnvio(false)).not.toContain(SECCION_LIDERES);
    expect(seccionesDelEnvio(true)).toContain(SECCION_LIDERES);
  });
});
