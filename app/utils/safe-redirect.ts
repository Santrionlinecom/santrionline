const DEFAULT_REDIRECT = '/dashboard';

export function safeRedirect(
  to: FormDataEntryValue | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== 'string') return defaultRedirect;

  if (!to.startsWith('/') || to.startsWith('//') || to.startsWith('/\\')) {
    return defaultRedirect;
  }

  return to;
}
