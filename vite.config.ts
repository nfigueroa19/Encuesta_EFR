import { env } from 'node:process';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { validarConfigPublica } from './src/config/validar-config';

// La CSP completa la pone Render en producción (render.yaml).
// En desarrollo se omite porque el refresco en caliente de Vite inyecta scripts en línea.
const ENCABEZADOS_DESARROLLO = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'X-Frame-Options': 'DENY',
};

// comments: false también borra los avisos de licencia de las dependencias; license: true los
// conserva en .vite/license.md para cumplir sus licencias.
// Tres páginas: la encuesta y el panel de resultados con su ingreso (fase-11-panel-resultados).
// Entradas separadas para que el código del panel no viaje en el paquete de la encuesta.
const PAGINAS = {
  encuesta: fileURLToPath(new URL('./index.html', import.meta.url)),
  panel: fileURLToPath(new URL('./panel/index.html', import.meta.url)),
  ingreso: fileURLToPath(new URL('./panel/login.html', import.meta.url)),
};

const BUILD_PRODUCCION = {
  sourcemap: false,
  minify: 'oxc',
  license: true,
  rolldownOptions: {
    input: PAGINAS,
    output: {
      comments: false,
      minify: { compress: { dropConsole: true, dropDebugger: true }, mangle: true },
    },
  },
} as const;

export default defineConfig(({ command }) => {
  if (command === 'build') {
    validarConfigPublica(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);
  }
  return {
    plugins: [react(), tailwindcss()],
    build: BUILD_PRODUCCION,
    server: { host: '127.0.0.1', port: 5173, strictPort: true, headers: ENCABEZADOS_DESARROLLO },
    preview: { host: '127.0.0.1', port: 4173, strictPort: true, headers: ENCABEZADOS_DESARROLLO },
    test: { include: ['src/**/*.test.ts'] },
  };
});
