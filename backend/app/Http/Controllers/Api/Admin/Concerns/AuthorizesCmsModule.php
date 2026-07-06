<?php

namespace App\Http\Controllers\Api\Admin\Concerns;

trait AuthorizesCmsModule
{
    protected function authorizeModuleView(string $module): void
    {
        $this->authorize('module.view', $module);
    }

    protected function authorizeModuleCreate(string $module): void
    {
        $this->authorize('module.create', $module);
    }

    protected function authorizeModuleUpdate(string $module): void
    {
        $this->authorize('module.update', $module);
    }

    protected function authorizeModuleDelete(string $module): void
    {
        $this->authorize('module.delete', $module);
    }
}
