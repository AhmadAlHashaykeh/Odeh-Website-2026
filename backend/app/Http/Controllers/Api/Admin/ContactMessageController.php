<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Admin\Concerns\AuthorizesCmsModule;
use App\Http\Controllers\Api\Admin\Concerns\HandlesAdminListing;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactMessageRequest;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use App\Support\CmsModules;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    use AuthorizesCmsModule, HandlesAdminListing;

    public function index(Request $request): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::CONTACT_MESSAGES);

        $query = ContactMessage::query()->with('assignedUser');

        $this->applySearch($query, $request->query('search'), [
            'full_name', 'email', 'phone', 'company', 'subject', 'message',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        if ($request->has('assignedUser')) {
            $assignedUser = $request->query('assignedUser');

            if ($assignedUser === '' || $assignedUser === 'null') {
                $query->whereNull('assigned_user_id');
            } elseif ($assignedUser !== null) {
                $query->where('assigned_user_id', $assignedUser);
            }
        }

        $query->orderByDesc('created_at');

        $paginator = $query->paginate($this->perPage($request));

        return $this->paginatedResponse($paginator, ContactMessageResource::class);
    }

    public function show(ContactMessage $contactMessage): JsonResponse
    {
        $this->authorizeModuleView(CmsModules::CONTACT_MESSAGES);

        $contactMessage->load('assignedUser');

        return $this->singleResponse(new ContactMessageResource($contactMessage));
    }

    public function update(UpdateContactMessageRequest $request, ContactMessage $contactMessage): JsonResponse
    {
        $this->authorizeModuleUpdate(CmsModules::CONTACT_MESSAGES);

        $contactMessage->update($request->validated());
        $contactMessage->load('assignedUser');

        return $this->singleResponse(new ContactMessageResource($contactMessage));
    }
}
