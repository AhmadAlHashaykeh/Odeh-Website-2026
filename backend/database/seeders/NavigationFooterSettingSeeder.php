<?php

namespace Database\Seeders;

use App\Models\NavigationFooterSetting;
use App\Support\CmsNavigationDefaults;
use Illuminate\Database\Seeder;

class NavigationFooterSettingSeeder extends Seeder
{
    public function run(): void
    {
        $data = CmsNavigationDefaults::settings();

        if (NavigationFooterSetting::query()->exists()) {
            NavigationFooterSetting::query()->first()->update($data);
        } else {
            NavigationFooterSetting::query()->create($data);
        }
    }
}
