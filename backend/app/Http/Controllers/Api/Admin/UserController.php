<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UserController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::USERS_ROLES);

        $query = User::query()->with('role');

        $this->applySearch($query, $request->query('search'), [
            'full_name', 'email', 'department', 'access_scope',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($role = $request->query('role')) {
            $query->where('role_id', $role);
        }

        $query->orderBy('full_name');

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, UserResource::class);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorizeModuleCreate(CmsModules::USERS_ROLES);

        $user = User::query()->create($request->validated());
        $user->load('role');

        return $this->singleResponse(new UserResource($user), 201);
    }

    public function show(User $user): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::USERS_ROLES);

        $user->load('role');

        return $this->singleResponse(new UserResource($user));
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::USERS_ROLES);

        $data = $request->validated();

        if (array_key_exists('password', $data) && blank($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);
        $user->load('role');

        return $this->singleResponse(new UserResource($user));
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorizeModuleDelete(CmsModules::USERS_ROLES);

        if ($user->id === request()->user()?->id) {
            throw new HttpException(422, 'You cannot delete your own account.');
        }

        $user->load('role');

        if ($user->isLastSuperAdmin()) {
            throw new HttpException(422, 'Cannot delete the last Super Admin.');
        }

        $user->delete();

        return response()->json(null, 204);
    }
}
