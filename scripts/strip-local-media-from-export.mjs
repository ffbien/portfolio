import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const exportRoot = resolve('out');
const ignoredLocalMediaCopy = resolve(exportRoot, 'media');

if (!ignoredLocalMediaCopy.startsWith(`${exportRoot}\\`) && !ignoredLocalMediaCopy.startsWith(`${exportRoot}/`)) {
  throw new Error(`Refusing to remove a path outside the export directory: ${ignoredLocalMediaCopy}`);
}

if (existsSync(ignoredLocalMediaCopy)) {
  rmSync(ignoredLocalMediaCopy, { recursive: true, force: true });
  console.log(`Removed ignored local media copy from ${ignoredLocalMediaCopy}`);
} else {
  console.log('No ignored local media copy was present in the static export.');
}
