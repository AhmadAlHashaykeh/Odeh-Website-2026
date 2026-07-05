<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        $name = fake()->unique()->jobTitle();

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->optional()->sentence(),
            'status' => 'active',
        ];
    }

    public function superAdmin(): static
    {
        return $this->state([
            'name' => 'Super Admin',
            'slug' => 'super-admin',
            'description' => 'Full system access.',
        ]);
    }
}
