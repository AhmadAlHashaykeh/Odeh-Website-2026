<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreImageUploadRequest;
use App\Services\ImageUploadService;
use App\Support\UploadModuleFields;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class ImageUploadController extends Controller
{
    public function store(StoreImageUploadRequest $request, ImageUploadService $imageUploadService): JsonResponse
    {
        $module = (string) $request->input('module');
        $field = (string) $request->input('field');
        $cmsModule = UploadModuleFields::cmsModuleFor($module);

        if ($cmsModule === null) {
            return response()->json([
                'message' => 'Unsupported upload module.',
            ], 422);
        }

        $this->authorize('module.update', $cmsModule);

        try {
            $result = $imageUploadService->upload(
                $request->file('image'),
                $module,
                $field,
            );
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json([
            'data' => $result,
        ]);
    }
}
