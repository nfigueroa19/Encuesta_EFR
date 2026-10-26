import { AbanicoHojas } from '../abanico-hojas';
import { LogoInstitucional } from '../logo-institucional';
import { MarcoPaso } from '../marco-paso';

const MENSAJES = {
  enviado: {
    titulo: 'Gracias por su participación',
    parrafos: [
      'Sus respuestas quedaron registradas. Con ellas el HSLV construye su línea base EFR 2026.',
      'Ya puede cerrar esta ventana.',
    ],
  },
  'ya-respondio': {
    titulo: 'Usted ya respondió la encuesta',
    parrafos: [
      'Gracias por participar en el diagnóstico EFR 2026. Su respuesta quedó registrada y no es necesario enviarla de nuevo.',
      'Si cree que se trata de un error, comuníquese con Talento Humano.',
    ],
  },
} as const;

interface PropsPantallaCierre {
  readonly motivo: keyof typeof MENSAJES;
}

// DESIGN.md Motion 5: en la confirmación las hojas convergen una sola vez.
export function PantallaCierre({ motivo }: PropsPantallaCierre) {
  const mensaje = MENSAJES[motivo];
  return (
    <MarcoPaso titulo={mensaje.titulo} antetitulo={null} ilustracion={<AbanicoHojas />}>
      <div className="mx-auto flex max-w-[60ch] flex-col gap-4 text-center">
        {mensaje.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
      </div>
      <LogoInstitucional variante="lema" className="mx-auto h-auto w-full max-w-xl animate-aparecer rounded-lg" />
    </MarcoPaso>
  );
}
