import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const [mode, input, filter, ...extra] = process.argv.slice(2);
const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
const require = createRequire(import.meta.url);
const cwd = fileURLToPath(new URL('../', import.meta.url));

function localUrl(input) {
  if (!input) return null;

  const url = URL.canParse(input) ? new URL(input) : null;
  if (!url || !['http:', 'https:'].includes(url.protocol) ||
      !localHosts.has(url.hostname) || url.username || url.password) {
    return null;
  }
  return url.href;
}

const target = mode === 'check' ? localUrl(input) : null;
const demo = mode === 'demo';
const validDemo = demo && (input === undefined || input === '--broken') && !filter;
const validCheck = mode === 'check' && target && !filter?.startsWith('-') && !extra.length;

if (!validDemo && !validCheck) {
  console.error('Demo: npm run demo -- [--broken]');
  console.error('Tu web: npm run check -- http://localhost:8000 [filtro-de-prueba]');
  console.error('Usa localhost, 127.0.0.1 o [::1] como destino local.');
  process.exit(2);
}

const args = [require.resolve('@playwright/test/cli'), 'test'];
if (validCheck && filter) args.push('--', filter);

const result = spawnSync(process.execPath, args, {
  cwd,
  stdio: 'inherit',
  env: {
    ...process.env,
    WEB_FLOW_DEMO: demo ? '1' : '0',
    WEB_FLOW_BROKEN: demo && input === '--broken' ? '1' : '0',
    WEB_FLOW_URL: target ?? '',
  },
});

if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;