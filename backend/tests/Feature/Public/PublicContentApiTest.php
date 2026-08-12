<?php

namespace Tests\Feature\Public;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_home_endpoint_returns_content(): void
    {
        $this->getJson('/api/public/home')
            ->assertOk()
            ->assertJsonStructure(['data' => ['hero', 'about', 'services', 'projects']]);
    }

    public function test_public_projects_endpoint_returns_categories_and_projects(): void
    {
        $this->getJson('/api/public/projects')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'page',
                    'categories',
                    'projects',
                ],
            ]);
    }

    public function test_public_project_and_job_detail_urls_resolve(): void
    {
        $this->getJson('/api/public/projects/resort-hotel/fairmont-hotel')
            ->assertOk()
            ->assertJsonPath('data.slug', 'fairmont-hotel');

        $this->getJson('/api/public/jobs')
            ->assertOk();

        $jobs = $this->getJson('/api/public/careers')->json('data.jobs');
        $this->assertNotEmpty($jobs);

        $jobSlug = $jobs[0]['slug'];
        $this->getJson("/api/public/jobs/{$jobSlug}")
            ->assertOk()
            ->assertJsonPath('data.slug', $jobSlug);
    }

    public function test_public_careers_endpoint_returns_page_and_jobs(): void
    {
        $this->getJson('/api/public/careers')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'page' => ['meta', 'hero', 'intro', 'emptyState'],
                    'jobs',
                ],
            ]);
    }

    public function test_public_search_endpoint_returns_results(): void
    {
        $this->getJson('/api/public/search?q=structural')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_public_endpoints_do_not_require_authentication(): void
    {
        $endpoints = [
            '/api/public/about',
            '/api/public/navigation-footer',
            '/api/public/connect',
            '/api/public/website-settings',
            '/api/public/services',
            '/api/public/activities',
            '/api/public/team-members',
            '/api/public/legal-pages',
            '/api/public/seo',
        ];

        foreach ($endpoints as $endpoint) {
            $this->getJson($endpoint)->assertOk();
        }
    }
}
