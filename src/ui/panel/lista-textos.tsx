// Respuestas abiertas sin nombre ni fecha, en el orden aleatorio que entrega efr_panel_textos.
// React escapa el texto: nunca se interpreta como HTML (AGENTS.md §4.3).
export function ListaTextos({ textos }: { readonly textos: readonly string[] }) {
  if (textos.length === 0) return <p className="text-body-sm text-muted">Sin respuestas todavía.</p>;
  return (
    <details className="group">
      <summary className="cursor-pointer text-label text-brand">Ver {String(textos.length)} respuestas</summary>
      <ul className="mt-3 flex flex-col gap-2">
        {textos.map((texto, indice) => (
          <li key={indice} className="border-l-2 border-separator pl-3 text-body-sm whitespace-pre-line">{texto}</li>
        ))}
      </ul>
    </details>
  );
}
