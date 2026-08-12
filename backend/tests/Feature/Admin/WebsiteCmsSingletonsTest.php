<?php

namespace Tests\Feature\Admin;

use App\Enums\LegalPagePublicationStatus;
use App\Models\AboutPageSetting;
use App\Models\ConnectPageSetting;
use App\Models\HomePageSetting;
use App\Models\LegalPage;
use App\Models\NavigationFooterSetting;
use App\Models\Role;
use App\Models\User;
use App\Models\WebsiteSetting;
use Database\Seeders\AboutPageSettingSeeder;
use Database\Seeders\ConnectPageSettingSeeder;
use Database\Seeders\HomePageSettingSeeder;
use Database\Seeders\LegalPageSeeder;
use Database\Seeders\NavigationFooterSettingSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\WebsiteSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WebsiteCmsSingletonsTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        $this->seed([
            HomePageSettingSeeder::class,
            AboutPageSettingSeeder::class,
            NavigationFooterSettingSeeder::class,
            ConnectPageSettingSeeder::class,
            WebsiteSettingSeeder::class,
            LegalPageSeeder::class,
        ]);

        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();
        $this->user = User::factory()->create(['role_id' => $role->id]);
    }

    /**
     * @return array<int, array{0: string, 1: string}>
     */
    public static function singletonReadEndpointsProvider(): array
    {
        return [
            ['/api/admin/home-page', HomePageSetting::class],
            ['/api/admin/about-pages', AboutPageSetting::class],
            ['/api/admin/navigation-footer', NavigationFooterSetting::class],
            ['/api/admin/connect-page', ConnectPageSetting::class],
            ['/api/admin/website-settings', WebsiteSetting::class],
        ];
    }

    /**
     * @dataProvider singletonReadEndpointsProvider
     */
    public function test_unauthenticated_user_cannot_access_singleton_endpoints(string $endpoint): void
    {
        $this->getJson($endpoint)->assertUnauthorized();
        $this->putJson($endpoint, [])->assertUnauthorized();
    }

    /**
     * @dataProvider singletonReadEndpointsProvider
     */
    public function test_authenticated_user_can_read_each_singleton(string $endpoint): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson($endpoint);

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_authenticated_user_can_update_home_page_singleton(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/admin/home-page', [
            'hero' => [
                'id' => 'hero',
                'headingMain' => 'UPDATED HEADING',
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.hero.headingMain', 'UPDATED HEADING');

        $this->assertSame('UPDATED HEADING', HomePageSetting::query()->first()->hero['headingMain']);
    }

    public function test_authenticated_user_can_update_about_pages_singleton(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/admin/about-pages', [
            'overview' => ['hero' => ['title' => 'Updated Overview']],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.overview.hero.title', 'Updated Overview');
    }

    public function test_authenticated_user_can_update_about_team_and_activities_page_shells(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/admin/about-pages', [
            'team' => [
                'meta' => [
                    'title' => 'Updated Team Meta',
                    'description' => 'Updated team meta description.',
                ],
                'hero' => [
                    'label' => 'Updated Team Label',
                    'title' => 'Updated Team Title',
                    'subtitle' => 'Updated Team Subtitle',
                    'description' => 'Updated team hero description.',
                    'backgroundImage' => '/assets/about/team/hero.webp',
                ],
            ],
            'activities' => [
                'meta' => [
                    'title' => 'Updated Activities Meta',
                    'description' => 'Updated activities meta description.',
                ],
                'hero' => [
                    'label' => 'Updated Activities Label',
                    'title' => 'Updated Activities Title',
                    'description' => 'Updated activities hero description.',
                    'backgroundImage' => '/assets/about/activities/hero.jpg',
                ],
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.team.hero.title', 'Updated Team Title')
            ->assertJsonPath('data.team.hero.subtitle', 'Updated Team Subtitle')
            ->assertJsonPath('data.team.meta.title', 'Updated Team Meta')
            ->assertJsonPath('data.activities.hero.title', 'Updated Activities Title')
            ->assertJsonPath('data.activities.meta.title', 'Updated Activities Meta');

        $setting = AboutPageSetting::query()->first();

        $this->assertSame('Updated Team Title', $setting->team['hero']['title']);
        $this->assertSame('Updated Team Subtitle', $setting->team['hero']['subtitle']);
        $this->assertSame('Updated Team Meta', $setting->team['meta']['title']);
        $this->assertSame('Updated Activities Title', $setting->activities['hero']['title']);
        $this->assertSame('Updated Activities Meta', $setting->activities['meta']['title']);
        $this->assertArrayNotHasKey('hero-title', $setting->team['hero']);
        $this->assertArrayNotHasKey('meta-title', $setting->team['meta']);
    }

    public function test_authenticated_user_can_update_navigation_footer_singleton(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/admin/navigation-footer', [
            'copyright' => ['companyName' => 'Updated Company'],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.copyright.companyName', 'Updated Company');
    }

    public function test_authenticated_user_can_update_connect_page_singleton(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/admin/connect-page', [
            'tagline' => 'Updated tagline',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.tagline', 'Updated tagline');
    }

    public function test_authenticated_user_can_update_website_settings_singleton(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/admin/website-settings', [
            'general' => ['websiteName' => 'Updated Website Name'],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.general.websiteName', 'Updated Website Name');
    }

    public function test_website_settings_section_patch_updates_only_requested_section(): void
    {
        Sanctum::actingAs($this->user);

        $original = WebsiteSetting::query()->firstOrFail();
        $originalOverlay = $original->search_placeholders['overlayPlaceholder'] ?? null;

        $response = $this->patchJson('/api/admin/website-settings/search-placeholders', [
            'pagePlaceholder' => 'Only page placeholder updated',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.search.pagePlaceholder', 'Only page placeholder updated')
            ->assertJsonPath('data.search.overlayPlaceholder', $originalOverlay);

        $fresh = WebsiteSetting::query()->firstOrFail();
        $this->assertSame('Only page placeholder updated', $fresh->search_placeholders['pagePlaceholder']);
        $this->assertSame($originalOverlay, $fresh->search_placeholders['overlayPlaceholder']);
        $this->assertSame($original->search_limits, $fresh->search_limits);
    }

    public function test_website_settings_section_patch_rejects_unknown_section(): void
    {
        Sanctum::actingAs($this->user);

        $this->patchJson('/api/admin/website-settings/unknown-section', [
            'websiteName' => 'Should not apply',
        ])->assertNotFound();
    }

    public function test_legal_pages_list_returns_seeded_legal_pages(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/admin/legal-pages');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['slug' => 'privacy-policy'])
            ->assertJsonFragment(['slug' => 'terms-and-conditions']);
    }

    public function test_legal_page_show_and_update_work(): void
    {
        Sanctum::actingAs($this->user);

        $this->getJson('/api/admin/legal-pages/privacy-policy')
            ->assertOk()
            ->assertJsonPath('data.slug', 'privacy-policy');

        $response = $this->putJson('/api/admin/legal-pages/privacy-policy', [
            'title' => 'Updated Privacy Policy',
            'publicationStatus' => 'draft',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'Updated Privacy Policy')
            ->assertJsonPath('data.publicationStatus', 'draft');

        $this->assertSame(
            LegalPagePublicationStatus::Draft,
            LegalPage::query()->where('slug', 'privacy-policy')->first()->publication_status
        );
    }

    public function test_legal_page_create_and_delete_routes_do_not_exist(): void
    {
        Sanctum::actingAs($this->user);

        $this->postJson('/api/admin/legal-pages', [
            'slug' => 'new-page',
            'title' => 'New Page',
        ])->assertMethodNotAllowed();

        $this->deleteJson('/api/admin/legal-pages/privacy-policy')->assertMethodNotAllowed();

        $registeredRoutes = collect(Route::getRoutes())
            ->filter(fn ($route) => str_starts_with($route->uri(), 'api/admin/legal-pages'))
            ->map(fn ($route) => implode('|', $route->methods()).':'.$route->uri())
            ->values()
            ->all();

        $this->assertContains('GET|HEAD:api/admin/legal-pages', $registeredRoutes);
        $this->assertContains('GET|HEAD:api/admin/legal-pages/{legalPage}', $registeredRoutes);
        $this->assertContains('PUT:api/admin/legal-pages/{legalPage}', $registeredRoutes);
        $this->assertNotContains('POST:api/admin/legal-pages', $registeredRoutes);
        $this->assertNotContains('DELETE:api/admin/legal-pages/{legalPage}', $registeredRoutes);
    }

    public function test_unauthenticated_user_cannot_access_legal_pages(): void
    {
        $this->getJson('/api/admin/legal-pages')->assertUnauthorized();
        $this->getJson('/api/admin/legal-pages/privacy-policy')->assertUnauthorized();
        $this->putJson('/api/admin/legal-pages/privacy-policy', [])->assertUnauthorized();
    }

    public function test_dashboard_stats_includes_public_pages_count(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertOk()
            ->assertJsonPath('data.publicPages', 6);
    }
}
