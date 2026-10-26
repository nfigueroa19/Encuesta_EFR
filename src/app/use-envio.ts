import { useState } from 'react';
import { enviarEncuesta } from '../data/encuesta-rpc';
import { seccionesDelEnvio } from '../domain/encuesta';
import type { Evento } from '../domain/flujo';
import { respuestasParaEnvio, type Respuestas } from '../domain/respuestas';
import type { ResultadoEnvio } from '../domain/resultados';

// El detalle técnico de Supabase no se muestra: no ayuda a quien responde.
const ERRORES: Record<ResultadoEnvio['tipo'], string | null> = {
  registrado: null,
  'ya-respondio': null,
  'no-habilitado': 'Su cédula ya no figura en el registro de personal. Comuníquese con Talento Humano.',
  error: 'Revise su conexión a internet e intente de nuevo. Sus respuestas siguen en esta pantalla.',
};

const EVENTOS: Partial<Record<ResultadoEnvio['tipo'], Evento>> = {
  registrado: { tipo: 'envio-registrado' },
  'ya-respondio': { tipo: 'ya-respondio' },
};

export type ControlEnvio = ReturnType<typeof useEnvio>;

export function useEnvio(cedula: number, respuestas: Respuestas, emitir: (evento: Evento) => void) {
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (respondioLideres: boolean) => {
    setPendiente(true);
    setError(null);
    const carga = respuestasParaEnvio(seccionesDelEnvio(respondioLideres), respuestas);
    const resultado = await enviarEncuesta(cedula, respondioLideres, carga);
    setPendiente(false);
    setError(ERRORES[resultado.tipo]);
    const evento = EVENTOS[resultado.tipo];
    if (evento !== undefined) emitir(evento);
  };

  return { pendiente, error, enviar: (respondioLideres: boolean) => { void enviar(respondioLideres); } };
}
