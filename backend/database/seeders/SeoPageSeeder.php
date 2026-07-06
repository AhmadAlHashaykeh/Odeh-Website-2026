<?php

namespace Database\Seeders;

use App\Services\SeoRegistryService;
use Illuminate\Database\Seeder;

class SeoPageSeeder extends Seeder
{
    public function run(): void
    {
        app(SeoRegistryService::class)->registerStaticPages();
    }
}
