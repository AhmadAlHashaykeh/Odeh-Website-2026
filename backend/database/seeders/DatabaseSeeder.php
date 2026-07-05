<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            SuperAdminSeeder::class,
            HomePageSettingSeeder::class,
            AboutPageSettingSeeder::class,
            NavigationFooterSettingSeeder::class,
            ConnectPageSettingSeeder::class,
            WebsiteSettingSeeder::class,
            LegalPageSeeder::class,
        ]);
    }
}
