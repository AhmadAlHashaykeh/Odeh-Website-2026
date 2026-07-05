<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::before(function (User $user) {
            if ($user->isSuperAdmin()) {
                return true;
            }

            return null;
        });

        foreach (['view', 'create', 'update', 'delete'] as $action) {
            Gate::define("module.{$action}", function (User $user, string $module) use ($action): bool {
                return $user->hasModulePermission($module, $action);
            });
        }
    }
}
