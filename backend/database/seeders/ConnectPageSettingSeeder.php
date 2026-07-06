<?php

namespace Database\Seeders;

use App\Models\ConnectPageSetting;
use Illuminate\Database\Seeder;

class ConnectPageSettingSeeder extends Seeder
{
    public function run(): void
    {
        $data = require __DIR__.'/data/connect_page.php';

        if (ConnectPageSetting::query()->exists()) {
            ConnectPageSetting::query()->first()->update($data);
        } else {
            ConnectPageSetting::query()->create($data);
        }
    }
}
