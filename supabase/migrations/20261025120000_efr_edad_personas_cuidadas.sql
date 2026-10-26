-- Edad de las personas bajo cuidado (A-C-05), por rangos y solo para los tipos de persona marcados:
-- A-C-11 (hijos menores) y A-C-12 (adultos mayores). Rangos en lugar de edades exactas para reducir
-- el riesgo de identificar a alguien en una planta pequeña.
-- No son obligatorias en la base: la interfaz las exige solo cuando se muestran (src/domain/respuestas.ts).
-- Los textos de pregunta y la condición de visibilidad viven en src/domain/instrumento-a.ts.
insert into public.efr_preguntas (id, instrumento, tipo, opciones, obligatoria) values
  ('A-C-11', 'A', 'multiple', array['0-a-5', '6-a-11', '12-a-17'], false),
  ('A-C-12', 'A', 'multiple', array['60-a-69', '70-a-79', '80-o-mas'], false);

-- Mismas reglas que la versión de 20261024230000, más la coherencia de A-C-11 y A-C-12 con A-C-05:
-- el rango existe si y solo si se marcó el tipo de persona correspondiente.
create or replace function public.efr_validar_respuestas(p_respondio_lideres boolean, p_respuestas jsonb)
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if jsonb_typeof(p_respuestas) is distinct from 'object' then
    raise exception 'efr: la carga de respuestas no es un objeto' using errcode = '22023';
  end if;
  if exists (
    select 1
    from jsonb_each(p_respuestas) as r
    left join public.efr_preguntas as p on p.id = r.key
    where p.id is null
      or (p.instrumento = 'B' and not p_respondio_lideres)
      or not public.efr_valor_valido(p.tipo, p.opciones, r.value)
  ) then
    raise exception 'efr: respuesta fuera de catálogo' using errcode = '22023';
  end if;
  if exists (select 1 from public.efr_preguntas as p where p.obligatoria and not p_respuestas ? p.id) then
    raise exception 'efr: faltan respuestas obligatorias' using errcode = '22023';
  end if;
  -- A-C-10 (parentesco de dependientes) solo aplica si A-C-06 = sí.
  if p_respuestas ? 'A-C-10' and (p_respuestas #>> '{A-C-06,opcion}') is distinct from 'si' then
    raise exception 'efr: A-C-10 sin dependientes declarados' using errcode = '22023';
  end if;
  if (p_respuestas ? 'A-C-11') is distinct from coalesce(p_respuestas #> '{A-C-05,opciones}' ? 'hijos-menores', false) then
    raise exception 'efr: A-C-11 incoherente con A-C-05' using errcode = '22023';
  end if;
  if (p_respuestas ? 'A-C-12') is distinct from coalesce(p_respuestas #> '{A-C-05,opciones}' ? 'adultos-mayores', false) then
    raise exception 'efr: A-C-12 incoherente con A-C-05' using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.efr_validar_respuestas(boolean, jsonb) from public, anon, authenticated;
