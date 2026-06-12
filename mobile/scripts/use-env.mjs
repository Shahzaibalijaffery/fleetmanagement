import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2];

if (mode !== 'local' && mode !== 'live') {
  console.error('Usage: node scripts/use-env.mjs <local|live>');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

if (!fs.existsSync(envPath)) {
  if (!fs.existsSync(examplePath)) {
    console.error('Missing .env.example');
    process.exit(1);
  }
  fs.copyFileSync(examplePath, envPath);
  console.log('Created .env from .env.example');
}

let content = fs.readFileSync(envPath, 'utf8');

if (/^APP_ENV=.*/m.test(content)) {
  content = content.replace(/^APP_ENV=.*/m, `APP_ENV=${mode}`);
} else {
  content = `APP_ENV=${mode}\n${content}`;
}

fs.writeFileSync(envPath, content);

console.log(`APP_ENV=${mode}`);
console.log('Restart Metro: npm start -- --reset-cache');
