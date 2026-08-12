<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\RolePermission;
use App\Support\CmsModules;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::query()->get()->keyBy('slug');

        $this->seedRole($roles['super-admin'], $this->allModules(true, true, true, true));

        $this->seedRole($roles['viewer'], $this->allModules(true, false, false, false));

        $this->seedRole($roles['content-manager'], array_merge(
            $this->moduleSet(CmsModules::DASHBOARD, true, false, false, false),
            $this->moduleSet(CmsModules::PROJECTS, true, true, true, false),
            $this->moduleSet(CmsModules::PROJECT_CATEGORIES, true, true, true, false),
            $this->moduleSet(CmsModules::SERVICES, true, true, true, false),
            $this->moduleSet(CmsModules::ACTIVITIES, true, true, true, false),
            $this->moduleSet(CmsModules::TEAM_MEMBERS, true, true, true, false),
            $this->moduleSet(CmsModules::TEAM_CATEGORIES, true, true, true, false),
            $this->moduleSet(CmsModules::HOME_PAGE, true, false, true, false),
            $this->moduleSet(CmsModules::ABOUT_PAGES, true, false, true, false),
            $this->moduleSet(CmsModules::NAVIGATION_FOOTER, true, false, true, false),
            $this->moduleSet(CmsModules::CONNECT_PAGE, true, false, true, false),
            $this->moduleSet(CmsModules::LEGAL_PAGES, true, false, true, false),
        ));

        $this->seedRole($roles['hr-manager'], array_merge(
            $this->moduleSet(CmsModules::DASHBOARD, true, false, false, false),
            $this->moduleSet(CmsModules::TEAM_MEMBERS, true, true, true, false),
            $this->moduleSet(CmsModules::TEAM_CATEGORIES, true, true, true, false),
            $this->moduleSet(CmsModules::JOBS, true, true, true, false),
            $this->moduleSet(CmsModules::APPLICATIONS, true, true, true, false),
            $this->moduleSet(CmsModules::CONTACT_MESSAGES, true, false, true, false),
        ));

        $this->seedRole($roles['seo-manager'], array_merge(
            $this->moduleSet(CmsModules::DASHBOARD, true, false, false, false),
            $this->moduleSet(CmsModules::SEO, true, false, true, false),
        ));
    }

    /**
     * @param  array<string, array<string, bool>>  $permissions
     */
    private function seedRole(Role $role, array $permissions): void
    {
        RolePermission::query()->where('role_id', $role->id)->delete();

        foreach (CmsModules::all() as $module) {
            $flags = $permissions[$module] ?? [
                'can_view' => false,
                'can_create' => false,
                'can_update' => false,
                'can_delete' => false,
            ];

            RolePermission::query()->create([
                'role_id' => $role->id,
                'module' => $module,
                'can_view' => $flags['can_view'],
                'can_create' => $flags['can_create'],
                'can_update' => $flags['can_update'],
                'can_delete' => $flags['can_delete'],
            ]);
        }
    }

    /**
     * @return array<string, array<string, bool>>
     */
    private function allModules(bool $view, bool $create, bool $update, bool $delete): array
    {
        $permissions = [];

        foreach (CmsModules::all() as $module) {
            $permissions[$module] = [
                'can_view' => $view,
                'can_create' => $create,
                'can_update' => $update,
                'can_delete' => $delete,
            ];
        }

        return $permissions;
    }

    /**
     * @return array<string, array<string, bool>>
     */
    private function moduleSet(string $module, bool $view, bool $create, bool $update, bool $delete): array
    {
        return [
            $module => [
                'can_view' => $view,
                'can_create' => $create,
                'can_update' => $update,
                'can_delete' => $delete,
            ],
        ];
    }
}
