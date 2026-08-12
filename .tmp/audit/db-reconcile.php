<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

require __DIR__ . '/../../backend/vendor/autoload.php';
$app = require __DIR__ . '/../../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$tables = [
    'services', 'project_categories', 'projects', 'activities', 'team_categories', 'team_members', 'jobs', 'job_applications',
    'about_page_settings', 'legal_pages', 'contact_messages', 'navigation_footer_settings', 'seo_pages', 'website_settings',
    'home_page_settings', 'connect_page_settings', 'users', 'roles', 'role_permissions',
];

$out = [];
foreach ($tables as $t) {
    try {
        if (!Schema::hasTable($t)) {
            $out[$t] = ['error' => 'missing table'];
            continue;
        }
        $total = DB::table($t)->count();
        $active = null;
        $statuses = null;
        $cols = Schema::getColumnListing($t);
        if (in_array('is_active', $cols, true)) {
            $active = DB::table($t)->where('is_active', 1)->count();
        } elseif (in_array('status', $cols, true)) {
            $active = DB::table($t)->whereIn('status', ['active', 'published', 'open', 'new', 'reviewed', 'hired'])->count();
            $statuses = DB::table($t)->select('status', DB::raw('count(*) as c'))->groupBy('status')->pluck('c', 'status');
        }
        $soft = in_array('deleted_at', $cols, true) ? DB::table($t)->whereNotNull('deleted_at')->count() : 0;
        $row = ['total' => $total, 'active' => $active, 'soft' => $soft, 'columns' => $cols];
        if ($statuses) {
            $row['statuses'] = $statuses;
        }
        $out[$t] = $row;
    } catch (Throwable $e) {
        $out[$t] = ['error' => $e->getMessage()];
    }
}

function pick($table, $cols, $limit = 30)
{
    $existing = array_values(array_intersect($cols, Schema::getColumnListing($table)));
    if (!$existing) {
        return [];
    }
    return DB::table($table)->select($existing)->limit($limit)->get();
}

$mediaSamples = [
    'projects' => pick('projects', ['id', 'slug', 'title', 'cover_image', 'gallery', 'is_active', 'status', 'project_category_id']),
    'services' => pick('services', ['id', 'slug', 'title', 'image', 'is_active']),
    'activities' => pick('activities', ['id', 'slug', 'title', 'cover_image', 'image', 'gallery', 'is_active']),
    'team_members' => pick('team_members', ['id', 'name', 'photo', 'image', 'is_active', 'team_category_id', 'category']),
    'project_categories' => pick('project_categories', ['id', 'slug', 'name', 'title', 'image', 'cover_image', 'is_active']),
    'jobs' => pick('jobs', ['id', 'slug', 'title', 'is_active', 'status']),
];

// Storage file existence checks for DB image paths
$brokenStorage = [];
$checked = 0;
$missing = 0;
$paths = [];
foreach (['projects' => 'cover_image', 'services' => 'image', 'activities' => 'cover_image', 'team_members' => 'photo', 'project_categories' => 'image'] as $table => $col) {
    if (!Schema::hasTable($table) || !Schema::hasColumn($table, $col)) {
        // try alternate
        continue;
    }
    foreach (DB::table($table)->whereNotNull($col)->pluck($col, 'id') as $id => $path) {
        $checked++;
        $rel = $path;
        $rel = preg_replace('#^/?storage/#', '', $rel);
        $rel = ltrim((string) $rel, '/');
        $abs = storage_path('app/public/' . $rel);
        $exists = is_file($abs) || is_file(public_path('storage/' . $rel));
        // also if path is /assets/ it lives on frontend
        $isAsset = str_contains((string) $path, '/assets/');
        $paths[] = [
            'table' => $table,
            'id' => $id,
            'db' => $path,
            'resolved' => $abs,
            'exists' => $exists,
            'is_asset' => $isAsset,
        ];
        if (!$exists && !$isAsset) {
            $missing++;
            $brokenStorage[] = ['table' => $table, 'id' => $id, 'db' => $path];
        }
    }
}

$payload = [
    'counts' => $out,
    'mediaSamples' => $mediaSamples,
    'storageCheck' => [
        'checked' => $checked,
        'missingFromStorage' => $missing,
        'broken' => $brokenStorage,
        'samplePaths' => array_slice($paths, 0, 40),
    ],
    'appUrl' => config('app.url'),
    'publicDiskUrl' => config('filesystems.disks.public.url'),
];

file_put_contents(__DIR__ . '/db-counts.json', json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo "OK checked={$checked} missing={$missing}\n";
echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
