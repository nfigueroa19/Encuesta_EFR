import { Alert, Button, Spinner } from '@heroui/react';
import { SECCIONES_INSTRUMENTO_A } from '../../domain/instrumento-a';
import { SECCION_LIDERES } from '../../domain/instrumento-b';
import type { DatosPanel } from '../../domain/panel/datos-panel';
import { csvEnvios, resumenParticipacion } from '../../domain/panel/participacion';
import { resultadoDimensiones } from '../../domain/panel/resultado-dimensiones';
import { EstadoActualizacion, type EstadoEnVivo } from '../../ui/panel/estado-actualizacion';
import { IndicadoresPanel } from '../../ui/panel/indicadores-panel';
import { ResultadosSecciones } from '../../ui/panel/resultados-secciones';
import { TablaEnvios } from '../../ui/panel/tabla-envios';
import { TarjetasDimensiones } from '../../ui/panel/tarjetas-dimensiones';
import { MarcoPanel } from './marco-panel';
import { hoyEnColombia } from './rutas-panel';
import { useDatosPanel } from './use-datos-panel';

const SECCIONES = [...SECCIONES_INSTRUMENTO_A, SECCION_LIDERES];

// La marca BOM hace que Excel lea las tildes como UTF-8. Va como escape: LFI-07 prohíbe el carácter invisible.
const BOM_UTF8 = String.fromCodePoint(0xfeff);

// Blob local: el CSV no pasa por ningún servidor.
function descargarCsv(datos: DatosPanel): void {
  const archivo = new Blob([BOM_UTF8, csvEnvios(datos.envios)], { type: 'text/csv;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = `envios-efr-${hoyEnColombia()}.csv`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

export function PaginaPanel() {
  const { estado, enVivo, recargar } = useDatosPanel();
  return (
    <MarcoPanel>
      <h1 className="text-heading text-titulo">Resultados del diagnóstico EFR 2026</h1>
      {estado.tipo === 'cargando' ? <Spinner aria-label="Cargando resultados" /> : null}
      {estado.tipo === 'error' ? <AvisoError onReintentar={recargar} /> : null}
      {estado.tipo === 'datos' ? <Contenido datos={estado.datos} actualizado={estado.actualizado} enVivo={enVivo} onActualizar={recargar} /> : null}
    </MarcoPanel>
  );
}

interface PropsContenido {
  readonly datos: DatosPanel;
  readonly actualizado: Date;
  readonly enVivo: EstadoEnVivo;
  readonly onActualizar: () => void;
}

function Contenido({ datos, actualizado, enVivo, onActualizar }: PropsContenido) {
  return (
    <>
      <EstadoActualizacion enVivo={enVivo} actualizado={actualizado} onActualizar={onActualizar} />
      <IndicadoresPanel resumen={resumenParticipacion(datos.envios, datos.habilitados, hoyEnColombia())} />
      <TablaEnvios envios={datos.envios} onExportar={() => { descargarCsv(datos); }} />
      <TarjetasDimensiones resultados={resultadoDimensiones(SECCIONES, datos.conteos)} />
      <ResultadosSecciones secciones={SECCIONES} datos={datos} />
    </>
  );
}

function AvisoError({ onReintentar }: { readonly onReintentar: () => void }) {
  return (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>No pudimos cargar los resultados</Alert.Title>
        <Alert.Description>Revise su conexión a internet e intente de nuevo.</Alert.Description>
      </Alert.Content>
      <Button variant="outline" onPress={onReintentar}>Reintentar</Button>
    </Alert>
  );
}
