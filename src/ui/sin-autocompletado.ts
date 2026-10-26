// La encuesta contiene datos del personal: ningún campo se autocompleta ni se guarda en el historial
// del navegador. Los data-* piden lo mismo a los gestores de contraseñas (1Password, LastPass, Bitwarden).
export const SIN_AUTOCOMPLETADO = {
  autoComplete: 'off',
  'data-1p-ignore': true,
  'data-lpignore': 'true',
  'data-bwignore': true,
  'data-form-type': 'other',
} as const;
