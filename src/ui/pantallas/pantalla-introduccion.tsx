import { Button, Checkbox } from '@heroui/react';
import { useState } from 'react';
import type { BloqueIntroduccion, ContenidoIntroduccion, ElementoIntroduccion } from '../../domain/introduccion';
import { LogoBienvenida } from '../logo-bienvenida';
import { MarcoPaso } from '../marco-paso';

interface PropsPantallaIntroduccion {
  readonly contenido: ContenidoIntroduccion;
  readonly onConfirmar: () => void;
}

export function PantallaIntroduccion({ contenido, onConfirmar }: PropsPantallaIntroduccion) {
  const [leido, setLeido] = useState(false);
  return (
    <MarcoPaso titulo={contenido.titulo} antetitulo={null} ilustracion={<LogoBienvenida />}>
      <div className="mx-auto flex max-w-[68ch] flex-col gap-8">
        {contenido.bloques.map((bloque, indice) => <Bloque key={indice} bloque={bloque} />)}
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
      {bloque.titulo === null ? null : <h2 className="text-heading text-titulo">{bloque.titulo}</h2>}
      {bloque.elementos.map((elemento, indice) => <Elemento key={indice} elemento={elemento} />)}
    </section>
  );
}

function Elemento({ elemento }: { readonly elemento: ElementoIntroduccion }) {
  if (elemento.tipo === 'parrafo') return <p>{elemento.texto}</p>;
  return (
    <ul className="flex list-disc flex-col gap-1 pl-6 marker:text-brand">
      {elemento.items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}
