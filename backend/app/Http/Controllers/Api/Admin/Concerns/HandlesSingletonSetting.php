<?php

namespace App\Http\Controllers\Api\Admin\Concerns;

use Illuminate\Database\Eloquent\Model;

trait HandlesSingletonSetting
{
    /**
     * @param  class-string<Model>  $modelClass
     */
    protected function resolveSingleton(string $modelClass): Model
    {
        $existing = $modelClass::query()->first();

        if ($existing !== null) {
            return $existing;
        }

        return $modelClass::query()->create([]);
    }
}
