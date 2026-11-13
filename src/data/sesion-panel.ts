import { correoDeUsuario } from '../domain/panel/usuario-panel';
import { clientePanel } from './cliente-panel';

export type ResultadoIngreso = 'ingreso' | 'credenciales' | 'conexion';

export async function ingresarPanel(usuario: string, clave: string): Promise<ResultadoIngreso> {
  const correo = correoDeUsuario(usuario);
  // Mismo mensaje para usuario desconocido y clave errada: no revela qué usuarios existen.
  if (correo === null) return 'credenciales';
  const { error } = await clientePanel.auth.signInWithPassword({ email: correo, password: clave });
  if (error === null) return 'ingreso';
  return error.status === 400 ? 'credenciales' : 'conexion';
}

// getUser valida el token contra el servidor; getSession solo leería el almacenamiento local.
export async function haySesionValida(): Promise<boolean> {
  const { error } = await clientePanel.auth.getUser();
  return error === null;
}

export async function cerrarSesionPanel(): Promise<void> {
  await clientePanel.auth.signOut();
}
