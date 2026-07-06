<?php

namespace Database\Seeders;

use App\Models\WebsiteSetting;
use Illuminate\Database\Seeder;

class WebsiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $data = require __DIR__.'/data/website_settings.php';

        if (WebsiteSetting::query()->exists()) {
            WebsiteSetting::query()->first()->update($data);
        } else {
            WebsiteSetting::query()->create($data);
        }
    }
}
