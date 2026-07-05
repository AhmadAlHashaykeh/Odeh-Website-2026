<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Full system access across all CMS modules, settings, and user management.',
            ],
            [
                'name' => 'Content Manager',
                'slug' => 'content-manager',
                'description' => 'Manage projects, services, activities, and public-facing content pages.',
            ],
            [
                'name' => 'HR Manager',
                'slug' => 'hr-manager',
                'description' => 'Oversee careers, applications, team members, and recruitment workflows.',
            ],
            [
                'name' => 'SEO Manager',
                'slug' => 'seo-manager',
                'description' => 'Configure metadata, indexing rules, and search visibility settings.',
            ],
            [
                'name' => 'Viewer',
                'slug' => 'viewer',
                'description' => 'Read-only access to CMS modules for review and reporting purposes.',
            ],
        ];

        foreach ($roles as $role) {
            Role::query()->updateOrCreate(
                ['slug' => $role['slug']],
                $role,
            );
        }
    }
}
