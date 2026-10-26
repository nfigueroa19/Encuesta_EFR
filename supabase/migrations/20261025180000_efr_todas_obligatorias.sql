-- Todas las preguntas son obligatorias; los textos exigen un mínimo de caracteres.
-- Excepciones del catálogo (obligatoria = false): A-C-10, A-C-11 y A-C-12 solo existen si la pregunta que las
-- activa (A-C-06, A-C-05) lo indica, y efr_validar_respuestas las exige en ese caso. Las preguntas del
-- Instrumento B (B-xx) solo se exigen si respondio_lideres es verdadero.
-- Mínimos: texto corto 2, texto largo 10 (deben coincidir con MINIMO_TEXTO en src/domain/cuestionario.ts).
update public.efr_preguntas
set obligatoria = true
where id not in ('A-C-10', 'A-C-11', 'A-C-12');

create or replace function public.efr_valor_valido(p_tipo public.efr_tipo_pregunta, p_opciones text[], p_valor jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(p_valor) is distinct from 'object' then false
    when (select count(*) from jsonb_object_keys(p_valor)) <> 1 then false
    when p_tipo in ('likert', 'unica') then
      jsonb_typeof(p_valor -> 'opcion') = 'string' and (p_valor ->> 'opcion') = any (p_opciones)
    when p_tipo = 'multiple' then
      jsonb_typeof(p_valor -> 'opciones') = 'array'
      and jsonb_array_length(p_valor -> 'opciones') between 1 and cardinality(p_opciones)
      and not exists (
        select 1 from jsonb_array_elements(p_valor -> 'opciones') as e
        where jsonb_typeof(e) <> 'string' or (e #>> '{}') <> all (p_opciones)
      )
      and (select count(distinct e) from jsonb_array_elements_text(p_valor -> 'opciones') as e)
        = jsonb_array_length(p_valor -> 'opciones')
      -- "Ninguna" excluye las demás opciones.
      and (not (p_valor -> 'opciones') ? 'ninguna' or jsonb_array_length(p_valor -> 'opciones') = 1)
    when p_tipo = 'texto_corto' then
      jsonb_typeof(p_valor -> 'texto') = 'string' and char_length(btrim(p_valor ->> 'texto')) between 2 and 80
    when p_tipo = 'texto_largo' then
      jsonb_typeof(p_valor -> 'texto') = 'string' and char_length(btrim(p_valor ->> 'texto')) between 10 and 2000
    else false
  end;
$$;

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
  if exists (
    select 1 from public.efr_preguntas as p
    where p.obligatoria and (p.instrumento = 'A' or p_respondio_lideres) and not p_respuestas ? p.id
  ) then
    raise exception 'efr: faltan respuestas obligatorias' using errcode = '22023';
  end if;
  -- Preguntas condicionales: existen si y solo si la pregunta que las activa lo indica.
  if (p_respuestas ? 'A-C-10') is distinct from ((p_respuestas #>> '{A-C-06,opcion}') = 'si') then
    raise exception 'efr: A-C-10 incoherente con A-C-06' using errcode = '22023';
  end if;
  if (p_respuestas ? 'A-C-11') is distinct from coalesce(p_respuestas #> '{A-C-05,opciones}' ? 'hijos-menores', false) then
    raise exception 'efr: A-C-11 incoherente con A-C-05' using errcode = '22023';
  end if;
  if (p_respuestas ? 'A-C-12') is distinct from coalesce(p_respuestas #> '{A-C-05,opciones}' ? 'adultos-mayores', false) then
    raise exception 'efr: A-C-12 incoherente con A-C-05' using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.efr_valor_valido(public.efr_tipo_pregunta, text[], jsonb) from public, anon, authenticated;
revoke all on function public.efr_validar_respuestas(boolean, jsonb) from public, anon, authenticated;
