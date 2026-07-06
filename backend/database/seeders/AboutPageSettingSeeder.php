<?php

namespace Database\Seeders;

use App\Models\AboutPageSetting;
use Illuminate\Database\Seeder;

class AboutPageSettingSeeder extends Seeder
{
    public function run(): void
    {
        $data = require __DIR__.'/data/about_page.php';

        if (AboutPageSetting::query()->exists()) {
            AboutPageSetting::query()->first()->update($data);
        } else {
            AboutPageSetting::query()->create($data);
        }
    }
}
