// Páginas del build (vite.config.ts, entradas panel/index.html y panel/login.html).
export const RUTAS_PANEL = { ingreso: '/panel/login.html', panel: '/panel/' } as const;

export function irA(ruta: (typeof RUTAS_PANEL)[keyof typeof RUTAS_PANEL]): void {
  window.location.replace(ruta);
}

// enviado_el se guarda en hora de Colombia; "hoy" se calcula en la misma zona.
export function hoyEnColombia(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
}
