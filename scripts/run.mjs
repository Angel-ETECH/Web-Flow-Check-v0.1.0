import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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

function prepareRuntime() {
  if (!existsSync(new URL('../node_modules/@playwright/test/cli.js', import.meta.url))) {
    console.log('Preparando Playwright para la primera ejecución…');
    const npm = process.env.npm_execpath;
    if (!npm) throw new Error('Ejecuta este comando con npm run.');
    run([npm, 'ci', '--include=dev', '--no-audit', '--no-fund']);
  }

  const cli = require.resolve('@playwright/test/cli');
  const { chromium } = require('@playwright/test');
  if (!existsSync(chromium.executablePath())) {
    console.log('Descargando Chromium para las pruebas locales…');
    run([cli, 'install', 'chromium', '--no-shell']);
  }
  return cli;
}

function run(args) {
  const child = spawnSync(process.execPath, args, { cwd, stdio: 'inherit' });
  if (child.error) throw child.error;
  if (child.status !== 0) throw new Error('No se pudo preparar el navegador de pruebas. Revisa la salida y vuelve a ejecutar el comando.');
}

let cli;
try {
  cli = prepareRuntime();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const args = [cli, 'test'];
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
