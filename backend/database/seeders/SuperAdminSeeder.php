<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::query()->where('slug', 'super-admin')->firstOrFail();

        User::query()->updateOrCreate(
            ['email' => 'admin@odeh.local'],
            [
                'full_name' => 'ODEH Super Admin',
                'password' => Hash::make('OdehLocalDev2026!'),
                'role_id' => $role->id,
                'department' => 'Executive',
                'status' => 'active',
                'access_scope' => 'Full CMS',
                'two_factor_enabled' => false,
            ],
        );
    }
}
