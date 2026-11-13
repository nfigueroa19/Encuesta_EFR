import type { Envio } from './datos-panel';

// Libro de Excel (.xlsx, Office Open XML) mínimo con una hoja: las partes del paquete como texto.
// El empaquetado zip ocurre en app/ (fflate). Los textos van como inlineStr: Excel no los evalúa
// como fórmulas, así que un nombre que empiece por "=" se muestra tal cual.

const ENCABEZADO = ['Cédula', 'Nombre', 'Líder', 'Fecha de envío'] as const;
const ANCHOS = [16, 48, 10, 18] as const;

// XML 1.0 no admite caracteres de control salvo tabulador (9), salto de línea (10) y retorno (13).
const esControlInvalido = (caracter: string) => {
  const codigo = caracter.charCodeAt(0);
  return codigo < 32 && codigo !== 9 && codigo !== 10 && codigo !== 13;
};

function escaparXml(texto: string): string {
  return Array.from(texto).filter((caracter) => !esControlInvalido(caracter)).join('')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

const celdaTexto = (texto: string, estilo = 0) => `<c t="inlineStr" s="${String(estilo)}"><is><t xml:space="preserve">${escaparXml(texto)}</t></is></c>`;
const celdaNumero = (valor: number) => `<c><v>${String(valor)}</v></c>`;

function filaEnvio(envio: Envio): string {
  return `<row>${celdaNumero(envio.cedula)}${celdaTexto(envio.nombre ?? '')}${celdaTexto(envio.respondioLideres ? 'Sí' : 'No')}${celdaTexto(envio.enviadoEl)}</row>`;
}

function hoja(envios: readonly Envio[]): string {
  const columnas = ANCHOS.map((ancho, indice) => `<col min="${String(indice + 1)}" max="${String(indice + 1)}" width="${String(ancho)}" customWidth="1"/>`).join('');
  const encabezado = `<row>${ENCABEZADO.map((titulo) => celdaTexto(titulo, 1)).join('')}</row>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${columnas}</cols><sheetData>${encabezado}${envios.map(filaEnvio).join('')}</sheetData></worksheet>`;
}

const PARTES_FIJAS = {
  '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
  '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Envíos" sheetId="1" r:id="rId1"/></sheets></workbook>`,
  'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  // Estilo 0: normal. Estilo 1: negrita, para el encabezado.
  'xl/styles.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
} as const;

export function partesLibroEnvios(envios: readonly Envio[]): Readonly<Record<string, string>> {
  return { ...PARTES_FIJAS, 'xl/worksheets/sheet1.xml': hoja(envios) };
}
