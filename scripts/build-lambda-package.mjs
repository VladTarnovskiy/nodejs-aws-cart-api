import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const out = path.join(root, '.lambda-package');

execSync('npm run build', { cwd: root, stdio: 'inherit' });

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'dist'), out, { recursive: true });
fs.copyFileSync(
  path.join(root, 'package.json'),
  path.join(out, 'package.json'),
);
fs.copyFileSync(
  path.join(root, 'package-lock.json'),
  path.join(out, 'package-lock.json'),
);

execSync('npm ci --omit=dev', { cwd: out, stdio: 'inherit' });
