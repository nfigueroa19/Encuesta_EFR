-- efr_exigir_analista solo se llama desde las funciones efr_panel_*. Supabase otorga EXECUTE a
-- authenticated por defecto y el revoke de la migración 20261113120000 no lo incluía (asesor de seguridad, 2026-11-13).
revoke execute on function public.efr_exigir_analista() from authenticated;
