import { Alert } from '@heroui/react';
import { useEffect, useRef } from 'react';
import type { Pregunta } from '../domain/cuestionario';

interface PropsResumenFaltantes {
  readonly faltantes: readonly Pregunta[];
}

const nombrePregunta = (pregunta: Pregunta) => (pregunta.tipo === 'likert' ? `Afirmación ${String(pregunta.numero)}` : pregunta.enunciado);

function irAPregunta(id: string) {
  document.getElementById(`pregunta-${id}`)?.querySelector('input')?.focus();
}

// DESIGN.md Components: resumen de errores al inicio, con enlaces a cada campo. Recibe el foco al
// montarse; el padre lo vuelve a montar (key) en cada intento de avanzar con faltantes.
export function ResumenFaltantes({ faltantes }: PropsResumenFaltantes) {
  const raiz = useRef<HTMLDivElement>(null);
  useEffect(() => { raiz.current?.focus(); }, []);
  if (faltantes.length === 0) return null;
  const titulo = faltantes.length === 1 ? 'Falta 1 respuesta para continuar' : `Faltan ${String(faltantes.length)} respuestas para continuar`;
  return (
    <div ref={raiz} tabIndex={-1} className="scroll-mt-24 outline-none">
      <Alert status="danger" className="animate-entrada">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{titulo}</Alert.Title>
          <ul className="mt-2 flex flex-col">
            {faltantes.map((pregunta) => (
              <li key={pregunta.id}>
                <button type="button" className="min-h-11 text-left underline underline-offset-2" onClick={() => { irAPregunta(pregunta.id); }}>
                  {nombrePregunta(pregunta)}
                </button>
              </li>
            ))}
          </ul>
        </Alert.Content>
      </Alert>
    </div>
  );
}
