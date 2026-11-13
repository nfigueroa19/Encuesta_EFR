import { createClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../config/public';

// Cliente aparte del de la encuesta, que no guarda sesión (AN-02). La sesión del panel vive en
// sessionStorage: se borra al cerrar la pestaña, útil en equipos compartidos del hospital.
export const clientePanel = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storage: window.sessionStorage, storageKey: 'efr-panel-sesion' },
});
