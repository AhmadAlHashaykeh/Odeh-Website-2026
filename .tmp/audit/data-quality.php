<?php
require __DIR__ . '/../../backend/vendor/autoload.php';
$app = require __DIR__ . '/../../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$storageCounts = [];
foreach (['projects' => 'cover_image', 'services' => 'image', 'activities' => 'cover_image', 'team_members' => 'photo', 'project_categories' => 'cover_image'] as $t => $c) {
    $storageCounts[$t] = [
        'storage_like' => DB::table($t)->where($c, 'like', '%/storage/%')->orWhere($c, 'like', 'storage/%')->count(),
        'assets_like' => DB::table($t)->where($c, 'like', '%/assets/%')->count(),
        'null_or_empty' => DB::table($t)->whereNull($c)->orWhere($c, '')->count(),
        'total' => DB::table($t)->count(),
    ];
}

$emptySlug = DB::table('projects')->where(function ($q) {
    $q->where('slug', '')->orWhereNull('slug');
})->get(['id', 'title', 'slug', 'cover_image', 'status']);

$auditMembers = DB::table('team_members')->where('full_name', 'like', '%Audit%')->get(['id', 'full_name', 'photo', 'status', 'team_category_id']);

$badCovers = DB::table('projects')->where('cover_image', 'like', '%//%')->get(['id', 'title', 'slug', 'cover_image']);

// verify storage URL HTTP against wrong APP_URL host
$out = compact('storageCounts', 'emptySlug', 'auditMembers', 'badCovers');
$out['app_url'] = config('app.url');
$out['public_disk_url'] = config('filesystems.disks.public.url');

file_put_contents(__DIR__ . '/data-quality.json', json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
