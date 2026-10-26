import type { EstadoConexion } from '../domain/estado-conexion';
import { clienteSupabase } from './cliente-supabase';

interface ErrorPostgrest {
  readonly code: string;
  readonly message: string;
}

// insufficient_privilege: el rol anon no tiene GRANT sobre la tabla.
const PRIVILEGIO_INSUFICIENTE = '42501';

export function clasificarSonda(error: ErrorPostgrest | null): EstadoConexion {
  if (error === null) return { tipo: 'expuesta' };
  if (error.code === PRIVILEGIO_INSUFICIENTE) return { tipo: 'protegida' };
  return { tipo: 'sin-conexion', detalle: error.message };
}

// limit(0): la sonda no trae filas aunque la tabla quedara abierta por error.
export async function sondearTablaPersonal(): Promise<EstadoConexion> {
  const { error } = await clienteSupabase.from('personal').select('cedula').limit(0);
  return clasificarSonda(error);
}
