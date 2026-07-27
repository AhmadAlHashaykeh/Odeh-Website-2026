export type MediaReference =
  | string
  | {
      path?: string | null;
      url?: string | null;
      src?: string | null;
      alt?: string | null;
    }
  | null
  | undefined;

/** Origin of the API host (no trailing slash), derived from VITE_API_BASE_URL. */
function getApiOrigin(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof baseUrl !== 'string' || baseUrl.trim() === '') {
    return '';
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    return '';
  }
}

function isAbsoluteUrl(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//');
}

function getUrlOrigin(value: string): string | null {
  try {
    const normalized = value.startsWith('//') ? `https:${value}` : value;
    return new URL(normalized).origin;
  } catch {
    return null;
  }
}

function isRelativeStoragePath(value: string): boolean {
  return value.startsWith('/storage/') || value.startsWith('storage/');
}

function normalizeStoragePath(value: string): string {
  return value.startsWith('storage/') ? `/${value}` : value;
}

/**
 * Prefer a relative media path when an absolute URL points at the wrong host
 * (e.g. misconfigured Laravel APP_URL) or has an unusable origin.
 */
export function shouldPreferRelativeMediaPath(
  absoluteUrl: string,
  relativePath: string,
  apiOrigin: string,
): boolean {
  if (!relativePath || !isRelativeStoragePath(relativePath)) {
    return false;
  }

  if (!isAbsoluteUrl(absoluteUrl)) {
    return false;
  }

  const urlOrigin = getUrlOrigin(absoluteUrl);
  if (!urlOrigin) {
    return true;
  }

  if (!apiOrigin) {
    return false;
  }

  return urlOrigin !== apiOrigin;
}

/**
 * Absolute http(s) URLs are returned unchanged when their host is usable.
 * Relative `/storage/...` paths are prefixed with the API origin so images
 * resolve against Laravel (not the Vite/frontend host).
 * Other relative paths (e.g. `/odeh-logo2.png`) stay relative to the frontend.
 */
export function absolutizeMediaUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  if (trimmed === '') {
    return '';
  }

  if (isAbsoluteUrl(trimmed)) {
    return trimmed;
  }

  const normalized = isRelativeStoragePath(trimmed) ? normalizeStoragePath(trimmed) : trimmed;

  if (normalized.startsWith('/storage/')) {
    const origin = getApiOrigin();
    return origin ? `${origin}${normalized}` : normalized;
  }

  return trimmed;
}

function firstRelativeCandidate(...candidates: Array<string | null | undefined>): string {
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') {
      continue;
    }

    const trimmed = candidate.trim();
    if (trimmed === '' || isAbsoluteUrl(trimmed)) {
      continue;
    }

    return trimmed;
  }

  return '';
}

export function resolveMediaUrl(value: MediaReference): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return absolutizeMediaUrl(value);
  }

  const url = typeof value.url === 'string' ? value.url.trim() : '';
  const path = typeof value.path === 'string' ? value.path.trim() : '';
  const src = typeof value.src === 'string' ? value.src.trim() : '';
  const relativePath = firstRelativeCandidate(path, src);
  const apiOrigin = getApiOrigin();

  if (url !== '') {
    if (shouldPreferRelativeMediaPath(url, relativePath, apiOrigin)) {
      return absolutizeMediaUrl(relativePath);
    }

    return absolutizeMediaUrl(url);
  }

  if (path !== '') {
    return absolutizeMediaUrl(path);
  }

  if (src !== '') {
    return absolutizeMediaUrl(src);
  }

  return '';
}

export function resolveMediaPath(value: MediaReference): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value.path === 'string' && value.path.trim() !== '') {
    return value.path;
  }

  if (typeof value.src === 'string' && value.src.trim() !== '') {
    return value.src;
  }

  if (typeof value.url === 'string' && value.url.trim() !== '') {
    return value.url;
  }

  return '';
}

export function normalizeGalleryItem<T extends Record<string, unknown>>(item: T): T & { src: string } {
  const src = resolveMediaPath(item);

  return {
    ...item,
    src,
  };
}

const MEDIA_FIELD_KEYS = new Set([
  'coverImage',
  'featuredImage',
  'photo',
  'posterImage',
  'backgroundImage',
  'icon',
  'image',
  'logoSrc',
  'faviconSrc',
]);

/** True when an `icon` field looks like a media path/URL, not a UI key like "facebook". */
function isMediaIconValue(value: unknown): boolean {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return false;
    }

    return trimmed.includes('/') || trimmed.includes('://') || trimmed.startsWith('storage');
  }

  if (typeof value === 'object' && value !== null) {
    const media = value as { path?: string | null; url?: string | null; src?: string | null };
    const candidate = media.url ?? media.path ?? media.src ?? '';
    return isMediaIconValue(candidate);
  }

  return false;
}

function normalizeIconKey(value: unknown): unknown {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    const media = value as { path?: string | null; url?: string | null; src?: string | null };
    const key = media.path ?? media.src ?? media.url;
    if (typeof key === 'string') {
      return key;
    }
  }

  return value;
}

export function normalizePublicMedia<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => normalizePublicMedia(item)) as T;
  }

  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = { ...(data as Record<string, unknown>) };

  for (const [key, value] of Object.entries(result)) {
    if (key === 'icon' && !isMediaIconValue(value)) {
      result[key] = normalizeIconKey(value);
    } else if (MEDIA_FIELD_KEYS.has(key)) {
      result[key] = resolveMediaUrl(value as MediaReference);
    } else if ((key === 'gallery' || key === 'images') && Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? {
              ...item,
              src: resolveMediaUrl(item as MediaReference),
            }
          : item,
      );
    } else if (key === 'logo' || (key === 'image' && typeof value === 'object' && value !== null)) {
      result[key] = {
        ...(value as Record<string, unknown>),
        src: resolveMediaUrl(value as MediaReference),
      };
    } else if (key === 'favicon' && typeof value === 'object' && value !== null) {
      result[key] = {
        ...(value as Record<string, unknown>),
        src: resolveMediaUrl(value as MediaReference),
      };
    } else if (typeof value === 'object') {
      result[key] = normalizePublicMedia(value);
    }
  }

  return result as T;
}
