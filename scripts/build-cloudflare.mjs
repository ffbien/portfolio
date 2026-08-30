import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = process.cwd();
const nextCli = resolve(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
const exportRoot = resolve(projectRoot, 'out');
const excludedMediaCopies = [
  resolve(exportRoot, 'media'),
  resolve(exportRoot, 'portfolio-media'),
];

const result = spawnSync(process.execPath, [nextCli, 'build'], {
  cwd: projectRoot,
  env: {
    ...process.env,
    NEXT_PUBLIC_BASE_PATH: '',
    NEXT_PUBLIC_MEDIA_BASE_URL: 'https://ffbien.github.io/portfolio',
  },
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

for (const mediaCopy of excludedMediaCopies) {
  if (!mediaCopy.startsWith(`${exportRoot}\\`) && !mediaCopy.startsWith(`${exportRoot}/`)) {
    throw new Error(`Refusing to remove a path outside the export directory: ${mediaCopy}`);
  }

  if (existsSync(mediaCopy)) {
    rmSync(mediaCopy, { recursive: true, force: true });
    console.log(`Removed Cloudflare-incompatible media copy from ${mediaCopy}`);
  }
}
