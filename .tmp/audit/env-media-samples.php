<?php
require __DIR__ . '/../../backend/vendor/autoload.php';
$app = require __DIR__ . '/../../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$out = [
  'app_url' => config('app.url'),
  'public_disk_url' => config('filesystems.disks.public.url'),
  'job_postings' => [
    'total' => DB::table('job_postings')->count(),
    'by_status' => DB::table('job_postings')->select('status', DB::raw('count(*) as c'))->groupBy('status')->pluck('c','status'),
    'rows' => DB::table('job_postings')->select('id','slug','title','status')->get(),
  ],
  'sample_project_covers' => DB::table('projects')->select('id','slug','cover_image','status')->limit(10)->get(),
  'sample_team_photos' => DB::table('team_members')->select('id','full_name','photo','status')->limit(10)->get(),
];
// PublicMediaUrl sample
$sample = \App\Support\PublicMediaUrl::reference('/assets/services/design-solutions.webp');
$sample2 = \App\Support\PublicMediaUrl::reference('/storage/uploads/demo.webp');
$sample3 = \App\Support\PublicMediaUrl::reference('/odeh-logo2.png');
$out['PublicMediaUrl_samples'] = compact('sample','sample2','sample3');
file_put_contents(__DIR__.'/env-media-samples.json', json_encode($out, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
echo json_encode($out, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
