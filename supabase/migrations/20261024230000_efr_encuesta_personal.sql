-- Encuesta EFR: validación contra public.personal y registro de respuestas por colaborador.
-- Decisión: decision-validacion-tabla-personal (2026-10-24). La encuesta no es anónima:
-- cada envío queda asociado a la cédula, y una cédula solo puede enviar una vez.
-- Tablas con prefijo efr_ porque el proyecto Supabase es compartido con otros aplicativos.
-- Sin llave foránea a personal: su carga la gestionan otros aplicativos y una restricción
-- aquí podría bloquear sus borrados o recargas.

create type public.efr_tipo_pregunta as enum ('likert', 'unica', 'multiple', 'texto_corto', 'texto_largo');

create table public.efr_preguntas (
  id text primary key check (id ~ '^(A-C-[0-9]{2}|A-D[1-6]-[0-9]{2}|A-AB-[0-9]{2}|B-[0-9]{2})$'),
  instrumento char(1) not null check (instrumento in ('A', 'B')),
  tipo public.efr_tipo_pregunta not null,
  opciones text[],
  obligatoria boolean not null,
  check ((tipo in ('texto_corto', 'texto_largo')) = (opciones is null))
);
alter table public.efr_preguntas enable row level security;

create table public.efr_envios (
  id uuid primary key default gen_random_uuid(),
  cedula bigint not null unique,
  version_instrumento text not null default '2026-10-24',
  respondio_lideres boolean not null,
  -- AN-03: fecha truncada al día, hora de Colombia.
  enviado_el date not null default (now() at time zone 'America/Bogota')::date
);
alter table public.efr_envios enable row level security;

create table public.efr_respuestas (
  envio_id uuid not null references public.efr_envios (id) on delete cascade,
  pregunta_id text not null references public.efr_preguntas (id),
  opcion text,
  opciones text[],
  texto text check (char_length(texto) <= 2000),
  primary key (envio_id, pregunta_id),
  check (num_nonnulls(opcion, opciones, texto) = 1)
);
alter table public.efr_respuestas enable row level security;

-- RLS sin políticas y sin privilegios: solo las funciones SECURITY DEFINER escriben o leen.
revoke all on public.efr_preguntas, public.efr_envios, public.efr_respuestas from anon, authenticated;

-- Catálogo. Los textos viven en src/domain/; aquí solo identificadores, tipo y opciones válidas.
insert into public.efr_preguntas (id, instrumento, tipo, opciones, obligatoria) values
  ('A-C-01', 'A', 'unica', array['asistencial', 'administrativo', 'apoyo', 'otro'], true),
  ('A-C-02', 'A', 'unica', array['diurna', 'turnos', 'mixta', 'otra'], true),
  ('A-C-03', 'A', 'unica', array['menos-de-1', '1-a-3', '4-a-6', '7-a-10', 'mas-de-10'], true),
  ('A-C-04', 'A', 'unica', array['directivo', 'profesional', 'tecnico', 'asistencial', 'administrativo-otro'], true),
  ('A-C-05', 'A', 'multiple', array['hijos-menores', 'hijos-mayores-dependientes', 'adultos-mayores', 'familiar-necesidad-cuidado', 'ninguna', 'otra'], true),
  ('A-C-06', 'A', 'unica', array['si', 'no'], true),
  ('A-C-07', 'A', 'texto_corto', null, false),
  ('A-C-08', 'A', 'texto_corto', null, false),
  ('A-C-09', 'A', 'texto_corto', null, false),
  ('A-C-10', 'A', 'texto_corto', null, false);

insert into public.efr_preguntas (id, instrumento, tipo, opciones, obligatoria)
select format('A-D%s-%s', (n - 1) / 8 + 1, lpad(n::text, 2, '0')), 'A', 'likert',
  array['totalmente-de-acuerdo', 'de-acuerdo', 'parcialmente-de-acuerdo', 'en-desacuerdo', 'totalmente-en-desacuerdo'],
  true
from generate_series(1, 48) as n;

insert into public.efr_preguntas (id, instrumento, tipo, opciones, obligatoria)
select format('A-AB-%s', n), 'A', 'texto_largo', null, false from generate_series(53, 60) as n;

insert into public.efr_preguntas (id, instrumento, tipo, opciones, obligatoria)
select format('B-%s', lpad(n::text, 2, '0')), 'B', 'texto_largo', null, false from generate_series(1, 14) as n;

-- Único punto que define quién puede responder. Hoy: toda la tabla personal (prueba piloto).
-- Para limitar al personal de planta basta cambiar esta función, p. ej. "and entidad = 'HSLV'".
create function public.efr_es_habilitado(p_cedula bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.personal where cedula = p_cedula);
$$;

-- No devuelve datos de la persona: solo el estado de acceso.
create function public.efr_verificar_cedula(p_cedula bigint)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when not public.efr_es_habilitado(p_cedula) then 'no_habilitado'
    when exists (select 1 from public.efr_envios where cedula = p_cedula) then 'ya_respondio'
    else 'habilitado'
  end;
$$;

create function public.efr_valor_valido(p_tipo public.efr_tipo_pregunta, p_opciones text[], p_valor jsonb)
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
      jsonb_typeof(p_valor -> 'texto') = 'string' and char_length(btrim(p_valor ->> 'texto')) between 1 and 80
    when p_tipo = 'texto_largo' then
      jsonb_typeof(p_valor -> 'texto') = 'string' and char_length(btrim(p_valor ->> 'texto')) between 1 and 2000
    else false
  end;
$$;

-- Rechaza el envío completo ante cualquier valor fuera de catálogo o faltante obligatorio.
create function public.efr_validar_respuestas(p_respondio_lideres boolean, p_respuestas jsonb)
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
end;
$$;

-- Envío atómico: la encuesta completa o nada.
create function public.efr_enviar_encuesta(p_cedula bigint, p_respondio_lideres boolean, p_respuestas jsonb)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_estado text := public.efr_verificar_cedula(p_cedula);
  v_envio uuid;
begin
  if v_estado <> 'habilitado' then
    return v_estado;
  end if;
  perform public.efr_validar_respuestas(p_respondio_lideres, p_respuestas);
  insert into public.efr_envios (cedula, respondio_lideres)
  values (p_cedula, p_respondio_lideres)
  returning id into v_envio;
  insert into public.efr_respuestas (envio_id, pregunta_id, opcion, opciones, texto)
  select v_envio, r.key, r.value ->> 'opcion',
    case when r.value ? 'opciones' then array(select jsonb_array_elements_text(r.value -> 'opciones')) end,
    btrim(r.value ->> 'texto')
  from jsonb_each(p_respuestas) as r;
  return 'registrado';
exception
  when unique_violation then
    return 'ya_respondio';
end;
$$;

revoke all on function public.efr_es_habilitado(bigint) from public, anon, authenticated;
revoke all on function public.efr_valor_valido(public.efr_tipo_pregunta, text[], jsonb) from public, anon, authenticated;
revoke all on function public.efr_validar_respuestas(boolean, jsonb) from public, anon, authenticated;
revoke all on function public.efr_verificar_cedula(bigint) from public, anon, authenticated;
revoke all on function public.efr_enviar_encuesta(bigint, boolean, jsonb) from public, anon, authenticated;

grant execute on function public.efr_verificar_cedula(bigint) to anon;
grant execute on function public.efr_enviar_encuesta(bigint, boolean, jsonb) to anon;
