import type { Respuestas, ValorRespuesta } from '../domain/respuestas';
import type { ResultadoAcceso, ResultadoEnvio } from '../domain/resultados';
import { clienteSupabase } from './cliente-supabase';

// Valores que devuelven las funciones SQL. Cualquier otro se trata como error (mapa cerrado).
const ACCESO = {
  habilitado: { tipo: 'habilitado' },
  no_habilitado: { tipo: 'no-habilitado' },
  ya_respondio: { tipo: 'ya-respondio' },
} as const satisfies Record<string, ResultadoAcceso>;

const ENVIO = {
  registrado: { tipo: 'registrado' },
  no_habilitado: { tipo: 'no-habilitado' },
  ya_respondio: { tipo: 'ya-respondio' },
} as const satisfies Record<string, ResultadoEnvio>;

// Sin tipos generados del esquema: data llega sin tipo y se valida con traducir().
interface RespuestaRpc {
  readonly data: unknown;
  readonly error: { readonly message: string } | null;
}

type Dto = { opcion: string } | { opciones: readonly string[] } | { texto: string };

function aDto(valor: ValorRespuesta): Dto {
  if (valor.tipo === 'opcion') return { opcion: valor.opcion };
  if (valor.tipo === 'opciones') return { opciones: valor.opciones };
  return { texto: valor.texto };
}

export function aCargaEnvio(respuestas: Respuestas): Record<string, Dto> {
  return Object.fromEntries(Array.from(respuestas, ([id, valor]) => [id, aDto(valor)]));
}

async function rpc(funcion: 'efr_verificar_cedula' | 'efr_enviar_encuesta', argumentos: Record<string, unknown>): Promise<RespuestaRpc> {
  const respuesta: RespuestaRpc = await clienteSupabase.rpc(funcion, argumentos);
  return respuesta;
}

function traducir<T extends { readonly tipo: string }>(mapa: Readonly<Record<string, T>>, data: unknown): T | null {
  return typeof data === 'string' && Object.hasOwn(mapa, data) ? (mapa[data] ?? null) : null;
}

export async function verificarCedula(cedula: number): Promise<ResultadoAcceso> {
  const { data, error } = await rpc('efr_verificar_cedula', { p_cedula: cedula });
  if (error !== null) return { tipo: 'error', detalle: error.message };
  return traducir(ACCESO, data) ?? { tipo: 'error', detalle: 'Respuesta desconocida del servidor' };
}

export async function enviarEncuesta(cedula: number, respondioLideres: boolean, respuestas: Respuestas): Promise<ResultadoEnvio> {
  const { data, error } = await rpc('efr_enviar_encuesta', {
    p_cedula: cedula,
    p_respondio_lideres: respondioLideres,
    p_respuestas: aCargaEnvio(respuestas),
  });
  if (error !== null) return { tipo: 'error', detalle: error.message };
  return traducir(ENVIO, data) ?? { tipo: 'error', detalle: 'Respuesta desconocida del servidor' };
}
