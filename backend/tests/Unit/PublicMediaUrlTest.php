<?php

namespace Tests\Unit;

use App\Support\PublicMediaUrl;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class PublicMediaUrlTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        URL::forceRootUrl(null);
        parent::tearDown();
    }

    public function test_storage_path_returns_absolute_url_from_app_url(): void
    {
        Storage::fake('public');
        URL::forceRootUrl('http://127.0.0.1:8000');
        config(['app.url' => 'http://127.0.0.1:8000']);

        $reference = PublicMediaUrl::reference('/storage/uploads/projects/example.webp');

        $this->assertSame('/storage/uploads/projects/example.webp', $reference['path']);
        $this->assertSame(
            'http://127.0.0.1:8000/storage/uploads/projects/example.webp',
            $reference['url'],
        );
    }

    public function test_frontend_asset_paths_keep_relative_url_fallback(): void
    {
        $reference = PublicMediaUrl::reference('/assets/projects/example.webp');

        $this->assertSame('/assets/projects/example.webp', $reference['path']);
        $this->assertSame('/assets/projects/example.webp', $reference['url']);
    }

    public function test_gallery_items_receive_path_and_url(): void
    {
        Storage::fake('public');
        URL::forceRootUrl('https://cms.example.com');
        URL::forceScheme('https');
        config(['app.url' => 'https://cms.example.com']);

        $gallery = PublicMediaUrl::transformGallery([
            ['src' => '/storage/uploads/projects/gallery-1.webp', 'alt' => 'One'],
        ]);

        $this->assertSame('/storage/uploads/projects/gallery-1.webp', $gallery[0]['path']);
        $this->assertSame(
            'https://cms.example.com/storage/uploads/projects/gallery-1.webp',
            $gallery[0]['url'],
        );
    }

    public function test_social_icon_keys_are_not_converted_to_media_references(): void
    {
        $payload = PublicMediaUrl::transformPayload([
            'socialLinks' => [
                ['label' => 'Facebook', 'href' => 'https://facebook.com', 'icon' => 'facebook'],
            ],
            'navigationItems' => [
                [
                    'label' => 'About',
                    'dropdown' => [
                        ['label' => 'Overview', 'icon' => 'overview'],
                    ],
                ],
            ],
        ]);

        $this->assertSame('facebook', $payload['socialLinks'][0]['icon']);
        $this->assertSame('overview', $payload['navigationItems'][0]['dropdown'][0]['icon']);
    }

    public function test_corrupted_social_icon_objects_are_unwrapped_to_keys(): void
    {
        $payload = PublicMediaUrl::transformPayload([
            'socialLinks' => [
                [
                    'label' => 'Facebook',
                    'href' => 'https://facebook.com',
                    'icon' => ['path' => 'facebook', 'url' => 'facebook'],
                ],
            ],
        ]);

        $this->assertSame('facebook', $payload['socialLinks'][0]['icon']);
    }

    public function test_service_icon_media_paths_are_still_transformed(): void
    {
        Storage::fake('public');
        URL::forceRootUrl('http://127.0.0.1:8000');
        config(['app.url' => 'http://127.0.0.1:8000']);

        $payload = PublicMediaUrl::transformPayload([
            'icon' => '/storage/uploads/services/icon.svg',
        ]);

        $this->assertSame('/storage/uploads/services/icon.svg', $payload['icon']['path']);
        $this->assertSame(
            'http://127.0.0.1:8000/storage/uploads/services/icon.svg',
            $payload['icon']['url'],
        );
    }

    public function test_absolute_urls_remain_unchanged(): void
    {
        $reference = PublicMediaUrl::reference('https://cdn.example.com/logo.webp');

        $this->assertSame('https://cdn.example.com/logo.webp', $reference['path']);
        $this->assertSame('https://cdn.example.com/logo.webp', $reference['url']);
    }
}
