<?php

namespace App\Services;

use App\Support\PublicMediaUrl;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ImageUploadService
{
    public const MAX_BYTES = 5 * 1024 * 1024;

    public const MAX_WIDTH = 1920;

    public const WEBP_QUALITY = 80;

    /** @var array<string, string> */
    private const ALLOWED_MIMES = [
        'image/jpeg' => 'jpeg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    public function supportsWebp(): bool
    {
        return extension_loaded('gd') && function_exists('imagewebp');
    }

    /**
     * @return array{path: string, url: string, filename: string, mimeType: string, size: int}
     */
    public function upload(UploadedFile $file, string $module, string $field): array
    {
        if (! $this->supportsWebp()) {
            throw new RuntimeException(
                'WebP conversion is not available on this server. Enable the PHP GD extension with WebP support.'
            );
        }

        $this->validateFile($file);

        $image = $this->loadImage($file);

        if ($image === false) {
            throw new RuntimeException('The uploaded file is not a valid image.');
        }

        $width = imagesx($image);
        $height = imagesy($image);

        if ($width === false || $height === false || $width < 1 || $height < 1) {
            imagedestroy($image);

            throw new RuntimeException('The uploaded image has invalid dimensions.');
        }

        $image = $this->resizeIfNeeded($image, $width, $height);
        $filename = $this->generateFilename($field);
        $relativePath = 'uploads/'.$module.'/'.$filename;
        $disk = Storage::disk('public');

        $disk->makeDirectory('uploads/'.$module);
        $absolutePath = $disk->path($relativePath);

        if ($this->preservesAlpha($file)) {
            imagealphablending($image, false);
            imagesavealpha($image, true);
        }

        $converted = imagewebp($image, $absolutePath, self::WEBP_QUALITY);
        imagedestroy($image);

        if (! $converted || ! is_file($absolutePath)) {
            throw new RuntimeException('Failed to convert image to WebP.');
        }

        $size = filesize($absolutePath);

        if ($size === false) {
            throw new RuntimeException('Failed to read uploaded file size.');
        }

        $publicPath = '/storage/'.$relativePath;
        $reference = PublicMediaUrl::reference($publicPath);

        return [
            'path' => $reference['path'],
            'url' => $reference['url'],
            'filename' => $filename,
            'mimeType' => 'image/webp',
            'size' => $size,
        ];
    }

    private function validateFile(UploadedFile $file): void
    {
        if (! $file->isValid()) {
            throw new RuntimeException('The uploaded file is invalid.');
        }

        if ($file->getSize() > self::MAX_BYTES) {
            throw new RuntimeException('Image must not be larger than 5MB.');
        }

        $mime = $file->getMimeType() ?? '';
        $extension = strtolower($file->getClientOriginalExtension());

        if ($extension === 'svg' || $mime === 'image/svg+xml') {
            throw new RuntimeException('SVG uploads are not allowed.');
        }

        if (in_array($extension, ['php', 'phtml', 'phar', 'exe', 'sh', 'bat', 'cmd'], true)) {
            throw new RuntimeException('Executable file uploads are not allowed.');
        }

        if (! $this->isAllowedMime($mime, $extension)) {
            throw new RuntimeException('Unsupported image type. Allowed types: JPG, PNG, WebP.');
        }

        $dimensions = @getimagesize($file->getPathname());

        if ($dimensions === false) {
            throw new RuntimeException('The uploaded file is not a valid image.');
        }
    }

    private function isAllowedMime(string $mime, string $extension): bool
    {
        if (isset(self::ALLOWED_MIMES[$mime])) {
            return true;
        }

        if ($mime === 'image/avif' && function_exists('imagecreatefromavif')) {
            return in_array($extension, ['avif'], true);
        }

        return in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true);
    }

    private function loadImage(UploadedFile $file): \GdImage|false
    {
        $path = $file->getPathname();
        $mime = $file->getMimeType() ?? '';
        $extension = strtolower($file->getClientOriginalExtension());

        return match (true) {
            str_contains($mime, 'jpeg') || in_array($extension, ['jpg', 'jpeg'], true) => imagecreatefromjpeg($path),
            str_contains($mime, 'png') || $extension === 'png' => imagecreatefrompng($path),
            str_contains($mime, 'webp') || $extension === 'webp' => imagecreatefromwebp($path),
            (str_contains($mime, 'avif') || $extension === 'avif') && function_exists('imagecreatefromavif') => imagecreatefromavif($path),
            default => false,
        };
    }

    private function preservesAlpha(UploadedFile $file): bool
    {
        $mime = $file->getMimeType() ?? '';
        $extension = strtolower($file->getClientOriginalExtension());

        return str_contains($mime, 'png')
            || $extension === 'png'
            || str_contains($mime, 'webp')
            || $extension === 'webp'
            || str_contains($mime, 'avif')
            || $extension === 'avif';
    }

    /**
     * @param  \GdImage  $image
     */
    private function resizeIfNeeded($image, int $width, int $height): \GdImage
    {
        if ($width <= self::MAX_WIDTH) {
            return $image;
        }

        $newWidth = self::MAX_WIDTH;
        $newHeight = (int) round($height * ($newWidth / $width));
        $resized = imagecreatetruecolor($newWidth, $newHeight);

        if ($resized === false) {
            return $image;
        }

        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);

        if ($transparent !== false) {
            imagefill($resized, 0, 0, $transparent);
        }

        imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($image);

        return $resized;
    }

    private function generateFilename(string $field): string
    {
        $safeField = Str::slug($field) ?: 'image';

        return $safeField.'-'.Str::lower(Str::random(12)).'.webp';
    }
}
