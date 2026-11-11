-- Cierra la encuesta al personal de planta: personal.entidad = 'HSLV'.
-- Criterio confirmado por el usuario el 2026-11-11 (decision-validacion-tabla-personal).
-- Los privilegios de la función no cambian: create or replace los conserva.
create or replace function public.efr_es_habilitado(p_cedula bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.personal
    where cedula = p_cedula and entidad = 'HSLV'
  );
$$;
