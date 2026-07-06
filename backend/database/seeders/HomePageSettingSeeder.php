<?php

namespace Database\Seeders;

use App\Models\HomePageSetting;
use Illuminate\Database\Seeder;

class HomePageSettingSeeder extends Seeder
{
    public function run(): void
    {
        $data = require __DIR__.'/data/home_page.php';

        if (HomePageSetting::query()->exists()) {
            HomePageSetting::query()->first()->update($data);
        } else {
            HomePageSetting::query()->create($data);
        }
    }
}
