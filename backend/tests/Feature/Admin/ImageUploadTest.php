<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use App\Services\ImageUploadService;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ImageUploadTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        $this->seed(RolePermissionSeeder::class);
        Storage::fake('public');

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        $this->admin = User::factory()->create(['role_id' => $role->id]);
    }

    public function test_jpg_upload_is_converted_to_webp(): void
    {
        if (! app(ImageUploadService::class)->supportsWebp()) {
            $this->markTestSkipped('GD WebP support is not available in this PHP environment.');
        }

        Sanctum::actingAs($this->admin);

        $image = UploadedFile::fake()->image('project-cover.jpg', 1200, 800);

        $response = $this->post('/api/admin/uploads/image', [
            'image' => $image,
            'module' => 'projects',
            'field' => 'coverImage',
        ], ['Accept' => 'application/json']);

        $response->assertOk()
            ->assertJsonPath('data.mimeType', 'image/webp')
            ->assertJsonStructure([
                'data' => ['path', 'filename', 'mimeType', 'size'],
            ]);

        $path = $response->json('data.path');
        $this->assertIsString($path);
        $this->assertStringStartsWith('/storage/uploads/projects/', $path);
        $this->assertStringEndsWith('.webp', $path);

        $storagePath = str_replace('/storage/', '', $path);
        Storage::disk('public')->assertExists($storagePath);
    }

    public function test_png_upload_is_converted_to_webp(): void
    {
        if (! app(ImageUploadService::class)->supportsWebp()) {
            $this->markTestSkipped('GD WebP support is not available in this PHP environment.');
        }

        Sanctum::actingAs($this->admin);

        $image = UploadedFile::fake()->image('service-icon.png', 400, 400);

        $response = $this->post('/api/admin/uploads/image', [
            'image' => $image,
            'module' => 'services',
            'field' => 'icon',
        ], ['Accept' => 'application/json']);

        $response->assertOk();
        $this->assertStringEndsWith('.webp', (string) $response->json('data.path'));
    }

    public function test_invalid_file_is_rejected(): void
    {
        Sanctum::actingAs($this->admin);

        $file = UploadedFile::fake()->create('notes.txt', 10, 'text/plain');

        $response = $this->post('/api/admin/uploads/image', [
            'image' => $file,
            'module' => 'projects',
            'field' => 'coverImage',
        ], ['Accept' => 'application/json']);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_oversized_file_is_rejected(): void
    {
        Sanctum::actingAs($this->admin);

        $file = UploadedFile::fake()->create('large.jpg', 6000, 'image/jpeg');

        $response = $this->post('/api/admin/uploads/image', [
            'image' => $file,
            'module' => 'projects',
            'field' => 'coverImage',
        ], ['Accept' => 'application/json']);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_unsupported_module_is_rejected(): void
    {
        Sanctum::actingAs($this->admin);

        $image = UploadedFile::fake()->image('cover.jpg');

        $response = $this->post('/api/admin/uploads/image', [
            'image' => $image,
            'module' => 'unknown-module',
            'field' => 'coverImage',
        ], ['Accept' => 'application/json']);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['module']);
    }

    public function test_unsupported_field_is_rejected(): void
    {
        Sanctum::actingAs($this->admin);

        $image = UploadedFile::fake()->image('cover.jpg');

        $response = $this->post('/api/admin/uploads/image', [
            'image' => $image,
            'module' => 'projects',
            'field' => 'unknownField',
        ], ['Accept' => 'application/json']);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['field']);
    }

    public function test_upload_requires_authentication(): void
    {
        $image = UploadedFile::fake()->image('cover.jpg');

        $this->post('/api/admin/uploads/image', [
            'image' => $image,
            'module' => 'projects',
            'field' => 'coverImage',
        ], ['Accept' => 'application/json'])->assertUnauthorized();
    }
}
