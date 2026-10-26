import { env } from 'node:process';
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

// Bundle de producción sin mapas de fuente, comentarios, console ni debugger, con nombres
// acortados. Los avisos de licencia de las dependencias van a .vite/license.md en lugar de
// quedar en línea, para cumplir sus licencias sin dejarlos dentro del código.
const BUILD_PRODUCCION = {
  sourcemap: false,
  minify: 'oxc',
  license: true,
  rolldownOptions: {
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
