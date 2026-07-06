<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Support\Str;

trait MapsCamelCaseInput
{
    /**
     * @param  array<string, string>  $map
     */
    protected function mapCamelCaseInput(array $map): void
    {
        $merged = [];

        foreach ($map as $camel => $snake) {
            if ($this->has($camel) && ! $this->has($snake)) {
                $merged[$snake] = $this->input($camel);
            }
        }

        if ($merged !== []) {
            $this->merge($merged);
        }
    }

    protected function normalizeBoolean(mixed $value): ?bool
    {
        if ($value === null) {
            return null;
        }

        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            return match (Str::lower($value)) {
                'yes', 'true', '1' => true,
                'no', 'false', '0' => false,
                default => (bool) $value,
            };
        }

        return (bool) $value;
    }
}
