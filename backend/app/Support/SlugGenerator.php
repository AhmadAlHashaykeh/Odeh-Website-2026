<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SlugGenerator
{
    public static function normalize(?string $slug): string
    {
        return Str::slug((string) $slug);
    }

    public static function fromTitle(string $title): string
    {
        return Str::slug($title);
    }

    /**
     * @param  array<string, mixed>  $scope
     */
    public static function unique(
        string $baseSlug,
        Model $model,
        ?string $exceptId = null,
        array $scope = [],
    ): string {
        $slug = static::normalize($baseSlug);
        $candidate = $slug;
        $counter = 1;

        while (static::exists($candidate, $model, $exceptId, $scope)) {
            $candidate = $slug.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }

    /**
     * @param  array<string, mixed>  $scope
     */
    private static function exists(
        string $slug,
        Model $model,
        ?string $exceptId,
        array $scope,
    ): bool {
        $query = $model->newQuery()->where('slug', $slug);

        foreach ($scope as $column => $value) {
            if ($value === null) {
                $query->whereNull($column);
            } else {
                $query->where($column, $value);
            }
        }

        if ($exceptId !== null) {
            $query->where($model->getKeyName(), '!=', $exceptId);
        }

        return $query->exists();
    }
}
