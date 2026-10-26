import { useCallback, useReducer, useState } from 'react';
import type { Pregunta } from '../domain/cuestionario';
import { ESTADO_INICIAL, reducirEncuesta, seccionDelPaso } from '../domain/encuesta';
import type { Evento } from '../domain/flujo';
import { esVisible, preguntasFaltantes, type ValorRespuesta } from '../domain/respuestas';

export type ControlEncuesta = ReturnType<typeof useEncuesta>;

export function useEncuesta() {
  const [estado, despachar] = useReducer(reducirEncuesta, ESTADO_INICIAL);
  // Intentos de avanzar con faltantes en el paso actual; 0 = aún no se muestran errores.
  const [intentos, setIntentos] = useState(0);

  const emitir = useCallback((evento: Evento) => {
    setIntentos(0);
    despachar({ tipo: 'evento', evento });
  }, []);
  const responder = useCallback((pregunta: Pregunta, valor: ValorRespuesta) => {
    despachar({ tipo: 'responder', pregunta, valor });
  }, []);

  const seccion = seccionDelPaso(estado.paso);
  const faltantes = seccion === null ? [] : preguntasFaltantes(seccion, estado.respuestas);
  const preguntas = seccion === null ? [] : seccion.preguntas.filter((pregunta) => esVisible(pregunta, estado.respuestas));

  // Devuelve true si el paso actual está completo y se puede seguir.
  const validar = () => {
    if (faltantes.length > 0) setIntentos((anterior) => anterior + 1);
    return faltantes.length === 0;
  };

  return { ...estado, seccion, preguntas, faltantes: intentos > 0 ? faltantes : [], intentos, emitir, responder, validar };
}
