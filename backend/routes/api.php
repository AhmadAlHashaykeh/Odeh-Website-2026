<?php

use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\RolePermissionController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\JobApplicationController;
use App\Http\Controllers\Api\Public\ContactController as PublicContactController;
use App\Http\Controllers\Api\Public\JobApplicationController as PublicJobApplicationController;
use App\Http\Controllers\Api\Admin\AboutPageSettingController;
use App\Http\Controllers\Api\Admin\ActivityController;
use App\Http\Controllers\Api\Admin\ConnectPageSettingController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\HomePageSettingController;
use App\Http\Controllers\Api\Admin\JobController;
use App\Http\Controllers\Api\Admin\LegalPageController;
use App\Http\Controllers\Api\Admin\NavigationFooterSettingController;
use App\Http\Controllers\Api\Admin\ProjectCategoryController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\SeoPageController;
use App\Http\Controllers\Api\Admin\ServiceController;
use App\Http\Controllers\Api\Admin\TeamMemberController;
use App\Http\Controllers\Api\Admin\WebsiteSettingController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function () {
    Route::post('contact', [PublicContactController::class, 'store']);
    Route::post('jobs/{slug}/applications', [PublicJobApplicationController::class, 'store']);
});

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

    Route::get('home-page', [HomePageSettingController::class, 'show']);
    Route::put('home-page', [HomePageSettingController::class, 'update']);

    Route::get('about-pages', [AboutPageSettingController::class, 'show']);
    Route::put('about-pages', [AboutPageSettingController::class, 'update']);

    Route::get('navigation-footer', [NavigationFooterSettingController::class, 'show']);
    Route::put('navigation-footer', [NavigationFooterSettingController::class, 'update']);

    Route::get('connect-page', [ConnectPageSettingController::class, 'show']);
    Route::put('connect-page', [ConnectPageSettingController::class, 'update']);

    Route::get('website-settings', [WebsiteSettingController::class, 'show']);
    Route::put('website-settings', [WebsiteSettingController::class, 'update']);
    Route::patch('website-settings/{section}', [WebsiteSettingController::class, 'updateSection']);

    Route::get('legal-pages', [LegalPageController::class, 'index']);
    Route::get('legal-pages/{legalPage:slug}', [LegalPageController::class, 'show']);
    Route::put('legal-pages/{legalPage:slug}', [LegalPageController::class, 'update']);

    Route::get('seo', [SeoPageController::class, 'index']);
    Route::get('seo/{seoPage}', [SeoPageController::class, 'show']);
    Route::patch('seo/{seoPage}', [SeoPageController::class, 'update']);

    Route::get('contact-messages', [ContactMessageController::class, 'index']);
    Route::get('contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
    Route::patch('contact-messages/{contactMessage}', [ContactMessageController::class, 'update']);

    Route::get('job-applications', [JobApplicationController::class, 'index']);
    Route::get('job-applications/{jobApplication}', [JobApplicationController::class, 'show']);
    Route::patch('job-applications/{jobApplication}', [JobApplicationController::class, 'update']);
    Route::get('job-applications/{jobApplication}/cv', [JobApplicationController::class, 'downloadCv']);

    Route::apiResource('users', AdminUserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::get('roles/{role}/permissions', [RolePermissionController::class, 'index']);
    Route::put('roles/{role}/permissions', [RolePermissionController::class, 'update']);
});
