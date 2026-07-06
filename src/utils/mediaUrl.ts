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

export function resolveMediaUrl(value: MediaReference): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value.url === 'string' && value.url.trim() !== '') {
    return value.url;
  }

  if (typeof value.path === 'string' && value.path.trim() !== '') {
    return value.path;
  }

  if (typeof value.src === 'string' && value.src.trim() !== '') {
    return value.src;
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

export function normalizePublicMedia<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => normalizePublicMedia(item)) as T;
  }

  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = { ...(data as Record<string, unknown>) };

  for (const [key, value] of Object.entries(result)) {
    if (MEDIA_FIELD_KEYS.has(key)) {
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
