<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasUuid;

    protected $fillable = [
        'full_name',
        'email',
        'password',
        'role_id',
        'department',
        'status',
        'access_scope',
        'two_factor_enabled',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'status' => UserStatus::class,
            'two_factor_enabled' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function assignedContactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class, 'assigned_user_id');
    }

    public function isSuperAdmin(): bool
    {
        return $this->role?->isSuperAdmin() ?? false;
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::Active;
    }

    public function hasModulePermission(string $module, string $action): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($this->role_id === null) {
            return false;
        }

        $permission = RolePermission::query()
            ->where('role_id', $this->role_id)
            ->where('module', $module)
            ->first();

        if ($permission === null) {
            return false;
        }

        return match ($action) {
            'view' => $permission->can_view,
            'create' => $permission->can_create,
            'update' => $permission->can_update,
            'delete' => $permission->can_delete,
            default => false,
        };
    }

    public static function superAdminCount(): int
    {
        return static::query()
            ->whereHas('role', fn ($query) => $query->where('slug', 'super-admin'))
            ->count();
    }

    public function isLastSuperAdmin(): bool
    {
        return $this->isSuperAdmin() && static::superAdminCount() <= 1;
    }
}
