import { Button, Checkbox } from '@heroui/react';
import { useState } from 'react';
import type { BloqueIntroduccion, ContenidoIntroduccion } from '../../domain/introduccion';
import { AbanicoHojas } from '../abanico-hojas';
import { MarcoPaso } from '../marco-paso';

interface PropsPantallaIntroduccion {
  readonly contenido: ContenidoIntroduccion;
  readonly onConfirmar: () => void;
}

export function PantallaIntroduccion({ contenido, onConfirmar }: PropsPantallaIntroduccion) {
  const [leido, setLeido] = useState(false);
  return (
    <MarcoPaso titulo={contenido.titulo} antetitulo={null} ilustracion={<AbanicoHojas animacion="despliegue" />}>
      {contenido.aprobado ? null : (
        <p className="self-center rounded-sm border border-warning px-2 py-1 text-body-sm text-warning">
          Texto en borrador, pendiente de aprobación de Talento Humano
        </p>
      )}
      <div className="mx-auto flex max-w-[68ch] flex-col gap-8">
        {contenido.bloques.map((bloque) => <Bloque key={bloque.titulo} bloque={bloque} />)}
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
          <Checkbox isSelected={leido} onChange={setLeido} className="opcion-respuesta">
            <Checkbox.Content>
              <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
              <span>{contenido.confirmacion}</span>
            </Checkbox.Content>
          </Checkbox>
          <Button isDisabled={!leido} onPress={onConfirmar} className="self-start">Comenzar la encuesta</Button>
        </div>
      </div>
    </MarcoPaso>
  );
}

function Bloque({ bloque }: { readonly bloque: BloqueIntroduccion }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-heading text-titulo">{bloque.titulo}</h2>
      {bloque.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
      {bloque.lista.length === 0 ? null : (
        <ul className="flex list-disc flex-col gap-1 pl-6 marker:text-brand">
          {bloque.lista.map((elemento) => <li key={elemento}>{elemento}</li>)}
        </ul>
      )}
    </section>
  );
}
