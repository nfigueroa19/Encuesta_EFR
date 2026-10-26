import { LogoInstitucional } from './logo-institucional';

// Logo grande de las pantallas de acceso e introducción: el único logo del flujo.
export function LogoBienvenida() {
  return <LogoInstitucional variante="bienvenida" className="h-36 w-auto animate-aparecer md:h-44" />;
}
