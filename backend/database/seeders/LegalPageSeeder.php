<?php

namespace Database\Seeders;

use App\Models\LegalPage;
use Illuminate\Database\Seeder;

class LegalPageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            require __DIR__.'/data/legal_privacy_policy.php',
            require __DIR__.'/data/legal_terms_and_conditions.php',
        ];

        foreach ($pages as $page) {
            LegalPage::query()->updateOrCreate(
                ['slug' => $page['slug']],
                [
                    'title' => $page['title'],
                    'hero' => $page['hero'],
                    'sections' => $page['sections'],
                    'publication_status' => $page['publication_status'],
                ]
            );
        }
    }
}
