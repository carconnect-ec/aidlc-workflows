#!/usr/bin/env node

'use strict';

const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const PKG_ROOT     = path.join(__dirname, '..');
const PROJECT_ROOT = process.cwd();

const SOURCE_RULES   = path.join(PKG_ROOT, 'aidlc-rules', 'aws-aidlc-rules');
const SOURCE_DETAILS = path.join(PKG_ROOT, 'aidlc-rules', 'aws-aidlc-rule-details');

// ── Utilidades ────────────────────────────────────────────────────────────────

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    log(`Eliminado: ${path.relative(PROJECT_ROOT, dir)}`);
  }
}

// Elimina un directorio solo si está vacío
function removeIfEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  if (fs.readdirSync(dir).length === 0) {
    fs.rmSync(dir, { recursive: true, force: true });
    log(`Eliminado (vacío): ${path.relative(PROJECT_ROOT, dir)}`);
  }
}

function log(msg) {
  console.log(`  ${msg}`);
}

function validateSources() {
  if (!fs.existsSync(SOURCE_RULES) || !fs.existsSync(SOURCE_DETAILS)) {
    console.error('Error: archivos de AI-DLC no encontrados en el paquete.');
    process.exit(1);
  }
}

// Normaliza una entrada de gitignore para comparación (quita / inicial y espacios)
function normalizeIgnoreEntry(entry) {
  return entry.trim().replace(/^\//, '');
}

function addToGitignore(entries) {
  const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
  const existing = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf8')
    : '';

  const existingNormalized = existing.split('\n').map(normalizeIgnoreEntry);
  const missing = entries.filter(e => !existingNormalized.includes(normalizeIgnoreEntry(e)));

  if (missing.length > 0) {
    fs.writeFileSync(gitignorePath, existing + `\n# AI-DLC\n${missing.join('\n')}\n`);
    log(`.gitignore: ${missing.join(', ')}`);
  } else {
    log('.gitignore: sin cambios.');
  }
}

function removeFromGitignore() {
  const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
  if (!fs.existsSync(gitignorePath)) return;

  const content = fs.readFileSync(gitignorePath, 'utf8');
  // Elimina el bloque "# AI-DLC\n..." agregado por este script
  const cleaned = content.replace(/\n# AI-DLC\n[^\n]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  if (cleaned !== content) {
    fs.writeFileSync(gitignorePath, cleaned);
    log('.gitignore: entrada de AI-DLC eliminada.');
  }
}

// Actualiza o crea CLAUDE.md con el import de AI-DLC.
// Si ya tiene un import de core-workflow.md, lo reemplaza por el nuevo.
// Si no tiene ninguno, lo agrega al inicio preservando el contenido existente.
function updateClaudeMd(importLine) {
  const claudeMdPath = path.join(PROJECT_ROOT, 'CLAUDE.md');

  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf8');
    const lines   = content.split('\n');
    const idx     = lines.findIndex(l => l.includes('core-workflow.md'));

    if (idx !== -1) {
      if (lines[idx] === importLine) {
        log('CLAUDE.md: import ya es correcto, sin cambios.');
        return;
      }
      lines[idx] = importLine;
      fs.writeFileSync(claudeMdPath, lines.join('\n'));
      log('CLAUDE.md: import actualizado.');
    } else {
      fs.writeFileSync(claudeMdPath, `${importLine}\n\n${content}`);
      log('CLAUDE.md: import agregado al inicio.');
    }
  } else {
    fs.writeFileSync(claudeMdPath, `${importLine}\n`);
    log('CLAUDE.md: creado.');
  }
}

// Limpia la entrada de AI-DLC de CLAUDE.md
function cleanClaudeMd() {
  const claudeMdPath = path.join(PROJECT_ROOT, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdPath)) return;

  const content = fs.readFileSync(claudeMdPath, 'utf8');
  const lines   = content.split('\n');
  const idx     = lines.findIndex(l => l.includes('core-workflow.md'));
  if (idx === -1) return;

  lines.splice(idx, 1);
  const cleaned = lines.join('\n').replace(/^\n+/, '');
  if (cleaned.trim() === '') {
    fs.unlinkSync(claudeMdPath);
    log('CLAUDE.md: eliminado (estaba vacío sin el import).');
  } else {
    fs.writeFileSync(claudeMdPath, cleaned);
    log('CLAUDE.md: import de AI-DLC eliminado.');
  }
}

// ── Detección del modo anterior ───────────────────────────────────────────────

function detectPreviousMode() {
  const hasAidlcRuleDetails = fs.existsSync(path.join(PROJECT_ROOT, '.aidlc-rule-details'));
  const hasKiroSteering     = fs.existsSync(path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'));

  if (hasAidlcRuleDetails && hasKiroSteering) return 'C';
  if (hasAidlcRuleDetails) return 'A';
  if (hasKiroSteering)     return 'B';
  return null;
}

// ── Modos de setup ────────────────────────────────────────────────────────────

function setupClaudeCode() {
  // Limpia todo lo de Kiro si venía de modo B o C
  removeDir(path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'));
  removeDir(path.join(PROJECT_ROOT, '.kiro', 'aws-aidlc-rule-details'));
  removeIfEmpty(path.join(PROJECT_ROOT, '.kiro', 'steering'));
  removeIfEmpty(path.join(PROJECT_ROOT, '.kiro'));

  log('Copiando rule details...');
  copyDir(SOURCE_DETAILS, path.join(PROJECT_ROOT, '.aidlc-rule-details'));

  log('Copiando core-workflow...');
  copyDir(SOURCE_RULES, path.join(PROJECT_ROOT, '.aidlc-rules'));

  updateClaudeMd('@.aidlc-rules/core-workflow.md');
}

function setupKiro() {
  // Limpia lo de Claude Code si venía de modo A o C
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rule-details'));
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rules'));
  cleanClaudeMd();

  log('Copiando steering rules...');
  copyDir(SOURCE_RULES, path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'));

  log('Copiando rule details...');
  copyDir(SOURCE_DETAILS, path.join(PROJECT_ROOT, '.kiro', 'aws-aidlc-rule-details'));
}

function setupBoth() {
  // Limpia carpetas de modo A que ya no se necesitan
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rule-details'));
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rules'));

  log('Copiando steering rules...');
  copyDir(SOURCE_RULES, path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'));

  log('Copiando rule details...');
  copyDir(SOURCE_DETAILS, path.join(PROJECT_ROOT, '.kiro', 'aws-aidlc-rule-details'));

  // CLAUDE.md importa desde el steering de Kiro — una sola copia, sin duplicación
  updateClaudeMd('@.kiro/steering/aws-aidlc-rules/core-workflow.md');
}

function uninstall() {
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rules'));
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rule-details'));
  removeDir(path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'));
  removeDir(path.join(PROJECT_ROOT, '.kiro', 'aws-aidlc-rule-details'));
  removeIfEmpty(path.join(PROJECT_ROOT, '.kiro', 'steering'));
  removeIfEmpty(path.join(PROJECT_ROOT, '.kiro'));
  cleanClaudeMd();
  removeFromGitignore();
}

// ── Main ──────────────────────────────────────────────────────────────────────

validateSources();

const previousMode = detectPreviousMode();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('\nConfigurando AI-DLC para CarConnect...\n');

if (previousMode) {
  const labels = { A: 'Claude Code', B: 'Kiro', C: 'Ambas' };
  console.log(`  Setup anterior detectado: ${labels[previousMode]}\n`);
}

console.log('¿Qué herramienta vas a usar en este proyecto?\n');
console.log('  A) Claude Code');
console.log('  B) Kiro');
console.log('  C) Ambas');
console.log('  D) Desinstalar AI-DLC de este proyecto\n');

rl.question('Respuesta: ', (answer) => {
  rl.close();
  console.log();

  const choice = answer.trim().toUpperCase();

  if (choice === 'D') {
    console.log('Desinstalando AI-DLC...\n');
    uninstall();
    console.log('\nAI-DLC eliminado del proyecto.\n');
    return;
  }

  const modeMap = {
    'A': { label: 'Claude Code', fn: setupClaudeCode },
    'B': { label: 'Kiro',        fn: setupKiro },
    'C': { label: 'Ambas',       fn: setupBoth },
  };

  if (!modeMap[choice]) {
    console.error('Opción no válida. Usa A, B, C o D.');
    process.exit(1);
  }

  console.log(`Configurando para ${modeMap[choice].label}...\n`);
  modeMap[choice].fn();

  const commitFiles = {
    A: 'CLAUDE.md, .aidlc-rules/, .aidlc-rule-details/',
    B: '.kiro/steering/, .kiro/aws-aidlc-rule-details/',
    C: 'CLAUDE.md, .kiro/steering/, .kiro/aws-aidlc-rule-details/',
  };

  console.log('\nAI-DLC listo.\n');
  console.log(`  Commitea: ${commitFiles[choice]}`);
  console.log('  Commitea también: aidlc-docs/ al cerrar cada feature (es documentación del proyecto)\n');
  console.log('  Para usar: "Using AI-DLC, [descripción de tu tarea]"\n');
});
