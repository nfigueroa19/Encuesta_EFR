import { Hoja } from './hoja';
import { useAnimacionHojas, type AnimacionHojas } from './movimiento/use-animacion-hojas';

const ANGULOS = [-66, -40, -14, 14, 40, 66] as const;

interface PropsAbanicoHojas {
  readonly animacion: AnimacionHojas;
}

export function AbanicoHojas({ animacion }: PropsAbanicoHojas) {
  const raiz = useAnimacionHojas<HTMLDivElement>(animacion);
  return (
    <div ref={raiz} aria-hidden="true" className="relative h-20 w-40">
      {ANGULOS.map((angulo) => (
        <span
          key={angulo}
          className="absolute bottom-0 left-1/2 block origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${String(angulo)}deg)` }}
        >
          <Hoja rellena className="hoja-abanico block h-14 w-9 text-brand" />
        </span>
      ))}
    </div>
  );
}
