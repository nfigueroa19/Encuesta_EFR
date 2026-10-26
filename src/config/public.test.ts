import { describe, expect, it } from 'vitest';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './public';

describe('configuración pública', () => {
  it('usa una clave publicable, nunca la secreta ni la anon heredada', () => {
    expect(SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_')).toBe(true);
  });

  it('apunta a Supabase por HTTPS', () => {
    expect(new URL(SUPABASE_URL).protocol).toBe('https:');
  });
});
