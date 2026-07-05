<?php

use App\Http\Controllers\Api\Admin\ActivityController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\JobController;
use App\Http\Controllers\Api\Admin\ProjectCategoryController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\ServiceController;
use App\Http\Controllers\Api\Admin\TeamMemberController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', LoginController::class);
    Route::post('logout', LogoutController::class)->middleware('auth:sanctum');
    Route::get('user', UserController::class)->middleware('auth:sanctum');
});

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);

    Route::apiResource('project-categories', ProjectCategoryController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('activities', ActivityController::class);
    Route::apiResource('team-members', TeamMemberController::class);
    Route::apiResource('jobs', JobController::class);
});
