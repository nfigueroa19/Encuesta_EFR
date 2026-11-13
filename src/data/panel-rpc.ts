import type { ConteoOpcion, DatosPanel, Envio, TextoAbierto } from '../domain/panel/datos-panel';
import { clientePanel } from './cliente-panel';

export type ResultadoDatos =
  | { readonly tipo: 'datos'; readonly datos: DatosPanel }
  | { readonly tipo: 'sin-permiso' }
  | { readonly tipo: 'error'; readonly detalle: string };

type FuncionPanel = 'efr_panel_envios' | 'efr_panel_habilitados' | 'efr_panel_conteos' | 'efr_panel_textos';

class ErrorPanel extends Error {
  readonly sinPermiso: boolean;

  constructor(sinPermiso: boolean, mensaje: string) {
    super(mensaje);
    this.sinPermiso = sinPermiso;
  }
}

// Sin tipos generados del esquema: cada fila se valida antes de entrar al dominio.
type Fila = Readonly<Record<string, unknown>>;
const esFila = (valor: unknown): valor is Fila => typeof valor === 'object' && valor !== null;
const texto = (valor: unknown): string => (typeof valor === 'string' ? valor : '');
const numero = (valor: unknown): number => (typeof valor === 'number' ? valor : Number.NaN);

interface RespuestaRpc {
  readonly data: unknown;
  readonly error: { readonly message: string; readonly code: string } | null;
}

async function llamar(funcion: FuncionPanel): Promise<unknown> {
  const respuesta: RespuestaRpc = await clientePanel.rpc(funcion);
  const { data, error } = respuesta;
  // 42501 viene de efr_exigir_analista; PGRST301/303 son tokens vencidos o inválidos.
  if (error !== null) throw new ErrorPanel(['42501', 'PGRST301', 'PGRST303'].includes(error.code), error.message);
  return data;
}

async function filas(funcion: FuncionPanel): Promise<readonly Fila[]> {
  const data = await llamar(funcion);
  if (!Array.isArray(data)) throw new ErrorPanel(false, `${funcion}: respuesta sin filas`);
  return data.filter(esFila);
}

const aEnvio = (fila: Fila): Envio => ({
  cedula: numero(fila.cedula),
  nombre: typeof fila.nombre === 'string' ? fila.nombre : null,
  respondioLideres: fila.respondio_lideres === true,
  enviadoEl: texto(fila.enviado_el),
});

const aConteo = (fila: Fila): ConteoOpcion => ({
  preguntaId: texto(fila.pregunta_id),
  opcion: texto(fila.opcion),
  total: numero(fila.total),
  respondientes: numero(fila.respondientes),
});

const aTexto = (fila: Fila): TextoAbierto => ({ preguntaId: texto(fila.pregunta_id), texto: texto(fila.texto) });

async function cargar(): Promise<DatosPanel> {
  const [envios, habilitados, conteos, textos] = await Promise.all([
    filas('efr_panel_envios'), llamar('efr_panel_habilitados'), filas('efr_panel_conteos'), filas('efr_panel_textos'),
  ]);
  return { envios: envios.map(aEnvio), habilitados: numero(habilitados), conteos: conteos.map(aConteo), textos: textos.map(aTexto) };
}

export async function cargarDatosPanel(): Promise<ResultadoDatos> {
  try {
    return { tipo: 'datos', datos: await cargar() };
  } catch (error) {
    if (error instanceof ErrorPanel && error.sinPermiso) return { tipo: 'sin-permiso' };
    return { tipo: 'error', detalle: error instanceof Error ? error.message : 'Error desconocido' };
  }
}
