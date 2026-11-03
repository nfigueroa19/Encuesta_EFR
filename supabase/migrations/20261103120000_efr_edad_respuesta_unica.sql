-- A-C-08 (rango de edad de la persona encuestada) pasa de texto libre a selección única: el texto libre
-- es difícil de ordenar y agrupar. Rangos exclusivos y exhaustivos para personal adulto.
-- Sin envíos registrados al 2026-11-03, así que no hay respuestas de texto que convertir.
-- Los textos viven en src/domain/instrumento-a.ts; las funciones de validación no cambian.
update public.efr_preguntas
set tipo = 'unica',
    opciones = array['18-a-25', '26-a-35', '36-a-45', '46-a-55', '56-a-65', 'mas-de-65']
where id = 'A-C-08';
