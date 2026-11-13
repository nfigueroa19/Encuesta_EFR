// Supabase Auth exige un correo; en el formulario se escribe solo el usuario (pedido del 2026-11-13).
// Mapa cerrado: el texto escrito nunca se usa para construir el correo (LFI-01).
const USUARIOS_PANEL: ReadonlyMap<string, string> = new Map([['talento', 'talento@efr.hosusana.com']]);

export function correoDeUsuario(texto: string): string | null {
  return USUARIOS_PANEL.get(texto.trim().toLowerCase()) ?? null;
}
