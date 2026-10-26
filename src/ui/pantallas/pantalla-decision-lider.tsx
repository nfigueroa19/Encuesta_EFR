import { Button } from '@heroui/react';
import { MarcoPaso } from '../marco-paso';
import { AvisoEnvio } from './pantalla-seccion';

interface PropsPantallaDecisionLider {
  readonly pendiente: boolean;
  readonly errorEnvio: string | null;
  readonly onAnterior: () => void;
  readonly onEnviar: () => void;
  readonly onContinuarComoLider: () => void;
}

// Población del Instrumento B según el documento fuente: Gerencia, subdirecciones, jefaturas,
// coordinaciones y líderes con personal a cargo. La persona decide si le aplica.
export function PantallaDecisionLider({ pendiente, errorEnvio, onAnterior, onEnviar, onContinuarComoLider }: PropsPantallaDecisionLider) {
  return (
    <MarcoPaso titulo="Terminó la encuesta de colaboradores" antetitulo={null} ilustracion={null}>
      <div className="flex max-w-[68ch] flex-col gap-4">
        <p>Gracias por sus respuestas. Falta un último paso.</p>
        <p>Si usted es líder, por favor responda las siguientes preguntas sobre la implementación del modelo EFR.</p>
        <p>Si no es líder, ya puede enviar su encuesta.</p>
      </div>
      {errorEnvio === null ? null : <AvisoEnvio detalle={errorEnvio} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onPress={onEnviar} isPending={pendiente}>Enviar mi encuesta</Button>
        <Button variant="outline" onPress={onContinuarComoLider} isDisabled={pendiente}>Soy líder: continuar</Button>
        <Button variant="ghost" onPress={onAnterior} isDisabled={pendiente} className="sm:ml-auto">Volver a la sección anterior</Button>
      </div>
    </MarcoPaso>
  );
}
