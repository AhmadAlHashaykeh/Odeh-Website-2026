<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class PublicMediaUrl
{
    /**
     * @return array{path: string, url: string}|null
     */
    public static function reference(?string $path): ?array
    {
        if ($path === null || trim($path) === '') {
            return null;
        }

        $path = trim($path);

        if (self::isAbsoluteUrl($path)) {
            return [
                'path' => $path,
                'url' => $path,
            ];
        }

        if (str_starts_with($path, '/storage/')) {
            $storageRelative = substr($path, strlen('/storage/'));

            return [
                'path' => $path,
                'url' => url(Storage::disk('public')->url($storageRelative)),
            ];
        }

        return [
            'path' => $path,
            'url' => $path,
        ];
    }

    /**
     * @param  array<int, mixed>|null  $gallery
     * @return array<int, mixed>
     */
    public static function transformGallery(?array $gallery): array
    {
        if (! is_array($gallery)) {
            return [];
        }

        return array_values(array_map(function (mixed $item): mixed {
            if (! is_array($item)) {
                return $item;
            }

            if (isset($item['src']) && is_string($item['src'])) {
                $reference = self::reference($item['src']);

                if ($reference !== null) {
                    $item['path'] = $reference['path'];
                    $item['url'] = $reference['url'];
                }
            }

            return $item;
        }, $gallery));
    }

    /**
     * @param  array<string, mixed>|null  $image
     * @return array<string, mixed>|null
     */
    public static function transformImageObject(?array $image): ?array
    {
        if (! is_array($image)) {
            return $image;
        }

        if (isset($image['src']) && is_string($image['src'])) {
            $reference = self::reference($image['src']);

            if ($reference !== null) {
                $image['path'] = $reference['path'];
                $image['url'] = $reference['url'];
            }
        }

        return $image;
    }

    public static function transformPayload(mixed $data): mixed
    {
        if (! is_array($data)) {
            return $data;
        }

        $stringImageKeys = [
            'coverImage',
            'featuredImage',
            'photo',
            'posterImage',
            'backgroundImage',
            'image',
            'logoSrc',
            'faviconSrc',
        ];

        foreach ($data as $key => $value) {
            if ($key === 'icon') {
                // Service icons may be media paths; social/nav icons are bare keys (e.g. "facebook").
                // Also unwrap previously corrupted {path,url} icon-key objects.
                $data[$key] = self::normalizeIconValue($value);
            } elseif (in_array($key, $stringImageKeys, true) && is_string($value)) {
                $data[$key] = self::reference($value);
            } elseif (($key === 'gallery' || $key === 'images') && is_array($value)) {
                $data[$key] = self::transformGallery($value);
            } elseif ($key === 'logo' && is_array($value)) {
                $data[$key] = self::transformImageObject($value);
            } elseif ($key === 'favicon' && is_array($value)) {
                $data[$key] = self::transformImageObject($value);
            } elseif ($key === 'image' && is_array($value)) {
                $data[$key] = self::transformImageObject($value);
            } elseif (is_array($value)) {
                $data[$key] = self::transformPayload($value);
            }
        }

        return $data;
    }

    private static function isAbsoluteUrl(string $path): bool
    {
        return str_contains($path, '://');
    }

    private static function looksLikeMediaPath(string $path): bool
    {
        $path = trim($path);

        if ($path === '') {
            return false;
        }

        return self::isAbsoluteUrl($path)
            || str_starts_with($path, '/storage/')
            || str_starts_with($path, 'storage/')
            || str_starts_with($path, '/');
    }

    private static function normalizeIconValue(mixed $value): mixed
    {
        if (is_string($value)) {
            return self::looksLikeMediaPath($value) ? self::reference($value) : $value;
        }

        if (! is_array($value)) {
            return $value;
        }

        $candidate = null;
        foreach (['path', 'src', 'url'] as $field) {
            if (isset($value[$field]) && is_string($value[$field]) && trim($value[$field]) !== '') {
                $candidate = trim($value[$field]);
                break;
            }
        }

        if ($candidate === null) {
            return $value;
        }

        if (self::looksLikeMediaPath($candidate)) {
            return self::reference($candidate);
        }

        return $candidate;
    }
}
