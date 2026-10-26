import bienvenidaBlanco from '../assets/logos/bienvenida-blanco.webp';
import bienvenidaColor from '../assets/logos/bienvenida-color.webp';
import cierreLema from '../assets/logos/cierre-lema.webp';
import encabezadoBlanco from '../assets/logos/encabezado-blanco.webp';
import encabezadoColor from '../assets/logos/encabezado-color.webp';
import sellos from '../assets/logos/sellos.webp';

// Generados por scripts/optimizar-logos.py. Mapa cerrado de variantes (LFI-01).
// Los logos con texto azul marino se cambian por la versión blanca en el tema oscuro;
// el lema y los sellos traen fondo blanco propio y sirven en ambos temas.
const LOGOS = {
  encabezado: { claro: encabezadoColor, oscuro: encabezadoBlanco, ancho: 450, alto: 112, alt: 'Hospital Susana López de Valencia E.S.E.' },
  bienvenida: { claro: bienvenidaColor, oscuro: bienvenidaBlanco, ancho: 365, alto: 400, alt: 'Hospital Susana López de Valencia E.S.E.' },
  lema: { claro: cierreLema, oscuro: cierreLema, ancho: 1451, alto: 320, alt: 'Hospital Susana López de Valencia E.S.E. Innovamos y nos transformamos para cuidarte mejor' },
  sellos: { claro: sellos, oscuro: sellos, ancho: 1999, alto: 240, alt: 'Sellos de acreditación, certificaciones y redes a las que pertenece el HSLV' },
} as const;

interface PropsLogo {
  readonly variante: keyof typeof LOGOS;
  readonly className: string;
}

export function LogoInstitucional({ variante, className }: PropsLogo) {
  const logo = LOGOS[variante];
  const comunes = { alt: logo.alt, width: logo.ancho, height: logo.alto, decoding: 'async' } as const;
  if (logo.claro === logo.oscuro) return <img src={logo.claro} className={className} {...comunes} />;
  return (
    <>
      <img src={logo.claro} className={`logo-tema-claro ${className}`} {...comunes} />
      <img src={logo.oscuro} className={`logo-tema-oscuro ${className}`} {...comunes} />
    </>
  );
}
