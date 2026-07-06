<?php

namespace App\Concerns;

use App\Services\SeoRegistryService;

trait SyncsSeoRegistry
{
    protected static function bootSyncsSeoRegistry(): void
    {
        static::created(function (self $model): void {
            app(SeoRegistryService::class)->registerModel($model);
        });

        static::updated(function (self $model): void {
            app(SeoRegistryService::class)->syncModel($model);
        });

        static::deleted(function (self $model): void {
            app(SeoRegistryService::class)->removeModel($model);
        });
    }
}
