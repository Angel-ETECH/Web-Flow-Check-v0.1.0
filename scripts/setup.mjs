#!/usr/bin/env node
import { cpSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../', import.meta.url));
const [mode, path, ...extra] = process.argv.slice(2);
const agentFolders = new Map([
  ['codex', '.agents/skills'],
  ['claude-code', '.claude/skills'],
  ['antigravity', '.gemini/config/skills'],
]);
const files = [
  'LICENSE', 'README.md', 'SKILL.md', 'agents', 'demo', 'docs', 'examples',
  'npm-shrinkwrap.json', 'package.json', 'playwright.config.mjs', 'scripts',
];

function setup() {
  const agentFolder = agentFolders.get(path ?? 'codex');
  if (extra.length || (mode === 'skill' && !agentFolder) || (mode === 'workspace' && !path) ||
      !['skill', 'workspace'].includes(mode)) {
    throw new Error('Uso: npm run install:skill -- [codex|claude-code|antigravity] | npm run init -- <carpeta-nueva>');
  }

  const target = mode === 'skill'
    ? join(homedir(), agentFolder, 'web-flow-check')
    : resolve(path);

  // Check the source before creating the destination.
  const available = new Set(readdirSync(source));
  const missing = files.filter(file => !available.has(file));
  if (missing.length) throw new Error(`Faltan archivos en el paquete: ${missing.join(', ')}`);

  mkdirSync(dirname(target), { recursive: true });
  mkdirSync(target);
  for (const file of files) {
    cpSync(join(source, file), join(target, file), { recursive: true });
  }
  writeFileSync(join(target, '.gitignore'), 'node_modules/\nplaywright-report/\ntest-results/\n.env\n.env.*\n');
  mkdirSync(join(target, 'checks'));
  console.log(mode === 'skill' ? `Skill instalada en ${target}` : `Entorno creado en ${target}`);
}

try {
  setup();
} catch (error) {
  if (error.code === 'EEXIST') {
    console.error('La carpeta de destino ya existe. Usa la instalación existente o elige otra carpeta.');
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
}
