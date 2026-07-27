import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('mediaUrl', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/api');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('resolves a relative storage path against the API origin', async () => {
    const { resolveMediaUrl } = await import('./mediaUrl');

    expect(resolveMediaUrl('/storage/uploads/projects/cover.webp')).toBe(
      'https://api.example.com/storage/uploads/projects/cover.webp',
    );
  });

  it('preserves a correct absolute URL', async () => {
    const { resolveMediaUrl } = await import('./mediaUrl');

    expect(
      resolveMediaUrl({
        path: '/storage/uploads/projects/cover.webp',
        url: 'https://api.example.com/storage/uploads/projects/cover.webp',
      }),
    ).toBe('https://api.example.com/storage/uploads/projects/cover.webp');
  });

  it('prefers a valid relative path when the absolute URL has the wrong host', async () => {
    const { resolveMediaUrl } = await import('./mediaUrl');

    expect(
      resolveMediaUrl({
        path: '/storage/uploads/projects/cover.webp',
        url: 'http://localhost/storage/uploads/projects/cover.webp',
      }),
    ).toBe('https://api.example.com/storage/uploads/projects/cover.webp');
  });

  it('preserves absolute external URLs', async () => {
    const { resolveMediaUrl } = await import('./mediaUrl');

    expect(
      resolveMediaUrl({
        path: 'https://cdn.example.com/brand/logo.webp',
        url: 'https://cdn.example.com/brand/logo.webp',
      }),
    ).toBe('https://cdn.example.com/brand/logo.webp');
  });

  it('detects mismatched absolute hosts for storage paths', async () => {
    const { shouldPreferRelativeMediaPath } = await import('./mediaUrl');

    expect(
      shouldPreferRelativeMediaPath(
        'http://localhost/storage/uploads/a.webp',
        '/storage/uploads/a.webp',
        'https://api.example.com',
      ),
    ).toBe(true);

    expect(
      shouldPreferRelativeMediaPath(
        'https://api.example.com/storage/uploads/a.webp',
        '/storage/uploads/a.webp',
        'https://api.example.com',
      ),
    ).toBe(false);
  });
});
