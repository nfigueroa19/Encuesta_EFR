import { Alert, Button, Spinner } from '@heroui/react';
import { SECCIONES_INSTRUMENTO_A } from '../../domain/instrumento-a';
import { SECCION_LIDERES } from '../../domain/instrumento-b';
import type { DatosPanel } from '../../domain/panel/datos-panel';
import { resumenParticipacion } from '../../domain/panel/participacion';
import { resultadoDimensiones } from '../../domain/panel/resultado-dimensiones';
import { IndicadoresPanel } from '../../ui/panel/indicadores-panel';
import { ResultadosSecciones } from '../../ui/panel/resultados-secciones';
import { TablaEnvios } from '../../ui/panel/tabla-envios';
import { TarjetasDimensiones } from '../../ui/panel/tarjetas-dimensiones';
import { descargarExcelEnvios } from './descargar-excel';
import { MarcoPanel } from './marco-panel';
import { hoyEnColombia } from './rutas-panel';
import { useDatosPanel } from './use-datos-panel';

const SECCIONES = [...SECCIONES_INSTRUMENTO_A, SECCION_LIDERES];

export function PaginaPanel() {
  const { estado, recargar } = useDatosPanel();
  return (
    <MarcoPanel>
      <h1 className="text-heading text-titulo">Resultados del diagnóstico EFR 2026</h1>
      {estado.tipo === 'cargando' ? <Spinner aria-label="Cargando resultados" /> : null}
      {estado.tipo === 'error' ? <AvisoError onReintentar={recargar} /> : null}
      {estado.tipo === 'datos' ? <Contenido datos={estado.datos} /> : null}
    </MarcoPanel>
  );
}

function Contenido({ datos }: { readonly datos: DatosPanel }) {
  return (
    <>
      <IndicadoresPanel resumen={resumenParticipacion(datos.envios, hoyEnColombia())} />
      <TablaEnvios envios={datos.envios} onExportar={() => { descargarExcelEnvios(datos.envios); }} />
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
