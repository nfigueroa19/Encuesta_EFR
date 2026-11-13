-- Panel de resultados EFR (fase-11-panel-resultados, 2026-11-13).
-- Solo las cuentas de Supabase Auth registradas en efr_analistas leen datos, y siempre a través
-- de funciones: las tablas siguen sin privilegios para anon y authenticated.
-- La lista de envíos lleva cédula, nombre, líder y fecha (sin hora, AN-03), autorizada por Jurídica
-- el 2026-11-13. Ninguna función junta a una persona con sus respuestas (AN-09).

create table public.efr_analistas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_el date not null default (now() at time zone 'America/Bogota')::date
);
alter table public.efr_analistas enable row level security;
revoke all on public.efr_analistas from anon, authenticated;

create function public.efr_es_analista()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.efr_analistas where user_id = (select auth.uid()));
$$;

-- 42501 (insufficient_privilege): el cliente lo traduce a "sesión sin permiso" y vuelve al ingreso.
create function public.efr_exigir_analista()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.efr_es_analista() then
    raise exception 'sin permiso' using errcode = '42501';
  end if;
end;
$$;

create function public.efr_panel_envios()
returns table (cedula bigint, nombre text, respondio_lideres boolean, enviado_el date)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.efr_exigir_analista();
  return query
    select e.cedula, p.nombre_completo::text, e.respondio_lideres, e.enviado_el
    from public.efr_envios e
    left join public.personal p on p.cedula = e.cedula
    order by e.enviado_el desc, p.nombre_completo;
end;
$$;

create function public.efr_panel_habilitados()
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.efr_exigir_analista();
  return (select count(*) from public.personal p where public.efr_es_habilitado(p.cedula));
end;
$$;

-- Conteo por opción. En selección múltiple una persona suma en varias opciones, por eso
-- `respondientes` (personas que contestaron la pregunta) es el denominador, no la suma de conteos.
create function public.efr_panel_conteos()
returns table (pregunta_id text, opcion text, total integer, respondientes integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.efr_exigir_analista();
  return query
    with valores as (
      select r.pregunta_id, coalesce(r.opcion, o.valor) as opcion, r.envio_id
      from public.efr_respuestas r
      left join lateral unnest(r.opciones) as o(valor) on true
      where r.texto is null
    )
    select v.pregunta_id, v.opcion, count(*)::integer,
      (select count(*)::integer from public.efr_respuestas x where x.pregunta_id = v.pregunta_id)
    from valores v
    group by v.pregunta_id, v.opcion;
end;
$$;

-- Orden aleatorio en cada consulta: el orden de llegada no debe permitir asociar un texto a un envío.
create function public.efr_panel_textos()
returns table (pregunta_id text, texto text)
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  perform public.efr_exigir_analista();
  return query
    select r.pregunta_id, r.texto from public.efr_respuestas r
    where r.texto is not null
    order by r.pregunta_id, random();
end;
$$;

revoke all on function public.efr_es_analista(), public.efr_exigir_analista(), public.efr_panel_envios(),
  public.efr_panel_habilitados(), public.efr_panel_conteos(), public.efr_panel_textos() from public, anon;
grant execute on function public.efr_es_analista(), public.efr_panel_envios(), public.efr_panel_habilitados(),
  public.efr_panel_conteos(), public.efr_panel_textos() to authenticated;

-- Aviso de envío nuevo por un canal privado. La carga va vacía: el panel vuelve a pedir los datos
-- con las funciones de arriba. Un fallo del aviso nunca debe revertir el envío de la encuesta.
create function public.efr_avisar_envio()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  begin
    perform realtime.send('{}'::jsonb, 'nuevo_envio', 'efr-panel', true);
  exception when others then
    raise warning 'efr_avisar_envio: %', sqlerrm;
  end;
  return null;
end;
$$;
revoke all on function public.efr_avisar_envio() from public, anon, authenticated;

create trigger efr_envios_aviso_panel
after insert on public.efr_envios
for each statement execute function public.efr_avisar_envio();

create policy efr_panel_escuchar on realtime.messages
for select to authenticated
using (realtime.topic() = 'efr-panel' and realtime.messages.extension = 'broadcast' and (select public.efr_es_analista()));
