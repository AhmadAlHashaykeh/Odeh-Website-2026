import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'public', 'video-slider.mp4');
const output = path.join(root, 'public', 'hero-poster.jpg');

execFileSync(
  ffmpeg,
  ['-ss', '0.1', '-i', input, '-frames:v', '1', '-q:v', '2', '-y', output],
  { stdio: 'inherit' },
);

console.log(`Poster saved to ${output}`);
