// Las claves son constantes del código, nunca entrada del usuario (LFI-01).
export function leerPreferencia<T extends string>(clave: string, esValida: (valor: unknown) => valor is T, porDefecto: T): T {
  try {
    const guardada = localStorage.getItem(clave);
    return esValida(guardada) ? guardada : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function guardarPreferencia(clave: string, valor: string): void {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    // Almacenamiento bloqueado (modo privado, política del equipo): la elección dura esta visita.
  }
}
