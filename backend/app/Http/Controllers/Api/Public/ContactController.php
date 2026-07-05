<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        ContactMessage::query()->create($request->validated());

        return response()->json([
            'message' => 'Your message has been submitted successfully.',
        ], 201);
    }
}
