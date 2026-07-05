const EXTERNAL_PREFIXES = ['http', 'tel:', 'mailto:'];

function isAbsoluteUrl(url) {
  return EXTERNAL_PREFIXES.some((prefix) => url.startsWith(prefix));
}

/** Resolve a site path or external URL to a full public URL. */
export function resolvePublicUrl(path) {
  if (!path) return '';
  if (isAbsoluteUrl(path)) return path;
  return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Open a URL in a new tab with safe referrer policy. */
export function openExternalUrl(url) {
  if (!url) return;
  const target = isAbsoluteUrl(url) ? url : resolvePublicUrl(url);
  window.open(target, '_blank', 'noopener,noreferrer');
}
