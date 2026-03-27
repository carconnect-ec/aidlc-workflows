#!/usr/bin/env node

'use strict';

const crypto   = require('crypto');
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const PKG_ROOT     = path.join(__dirname, '..');
const PROJECT_ROOT = process.cwd();

const SOURCE_RULES   = path.join(PKG_ROOT, 'aidlc-rules', 'aws-aidlc-rules');
const SOURCE_DETAILS = path.join(PKG_ROOT, 'aidlc-rules', 'aws-aidlc-rule-details');

// ── Utilidades ────────────────────────────────────────────────────────────────

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

// ── Manifest ──────────────────────────────────────────────────────────────────
// El manifest registra el hash SHA-256 de cada archivo copiado desde el paquete.
// Al re-ejecutar el setup, si el archivo en el proyecto tiene un hash diferente
// al del manifest, el usuario lo modificó — no se sobreescribe.
// Archivos agregados por el proyecto (sin entrada en el manifest) tampoco se tocan.

const MANIFEST_PATH = path.join(PROJECT_ROOT, '.aidlc-manifest.json');

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function saveManifest(mode, fileMaps) {
  const files = Object.assign({}, ...fileMaps);
  const manifest = {
    version: 1,
    mode,
    date: new Date().toISOString().slice(0, 10),
    files,
  };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

// Copia srcDir -> destDir de forma inteligente:
//   - Archivos nuevos (no existen en dest): se copian siempre.
//   - Archivos sin cambios locales (hash en dest == hash en manifest): se actualizan.
//   - Archivos modificados por el proyecto (hash difiere del manifest): se omiten con aviso.
//   - Archivos propios del proyecto en dest (sin entrada en manifest): nunca se tocan.
//
// destPrefix: ruta de destDir relativa a PROJECT_ROOT (se usa como clave en el manifest).
// manifestFiles: manifest.files del setup anterior, o null para primera instalación.
//
// Retorna { relPath: hash } de todos los archivos resultantes en dest (para el nuevo manifest).
function smartCopyDir(srcDir, destDir, manifestFiles, destPrefix) {
  fs.mkdirSync(destDir, { recursive: true });

  const fileMap = {};
  const skipped = [];

  function walk(src, dest, prefix) {
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath  = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      const relPath  = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        walk(srcPath, destPath, relPath);
        continue;
      }

      const srcHash = hashFile(srcPath);

      if (manifestFiles && fs.existsSync(destPath)) {
        const manifestHash = manifestFiles[relPath];
        if (manifestHash !== undefined) {
          const destHash = hashFile(destPath);
          if (destHash !== manifestHash) {
            // El proyecto modificó este archivo — respetamos sus cambios
            skipped.push(relPath);
            fileMap[relPath] = destHash;
            continue;
          }
        }
      }

      fs.copyFileSync(srcPath, destPath);
      fileMap[relPath] = srcHash;
    }
  }

  walk(srcDir, destDir, destPrefix);

  if (skipped.length > 0) {
    log(`Omitidos por cambios locales (${skipped.length}):`);
    skipped.forEach(f => log(`  -> ${f}`));
  }

  return fileMap;
}

// ── Detección del modo anterior ───────────────────────────────────────────────

function detectPreviousMode() {
  // El manifest es la fuente autoritativa: setupBoth (modo C) no crea .aidlc-rule-details/
  // (usa .kiro/aws-aidlc-rule-details/), por lo que la detección por directorio no distingue
  // entre B y C. Leemos el manifest primero si existe.
  const saved = loadManifest();
  if (saved && saved.mode) return saved.mode;

  const hasAidlcRuleDetails = fs.existsSync(path.join(PROJECT_ROOT, '.aidlc-rule-details'));
  const hasKiroSteering     = fs.existsSync(path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'));

  if (hasAidlcRuleDetails && hasKiroSteering) return 'C';
  if (hasAidlcRuleDetails) return 'A';
  if (hasKiroSteering)     return 'B';
  return null;
}

// ── Modos de setup ────────────────────────────────────────────────────────────

function setupClaudeCode(manifestFiles) {
  // Limpia todo lo de Kiro si venía de modo B o C
  removeDir(path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'));
  removeDir(path.join(PROJECT_ROOT, '.kiro', 'aws-aidlc-rule-details'));
  removeIfEmpty(path.join(PROJECT_ROOT, '.kiro', 'steering'));
  removeIfEmpty(path.join(PROJECT_ROOT, '.kiro'));

  log('Copiando rule details...');
  const detailsMap = smartCopyDir(SOURCE_DETAILS, path.join(PROJECT_ROOT, '.aidlc-rule-details'), manifestFiles, '.aidlc-rule-details');

  log('Copiando core-workflow...');
  const rulesMap = smartCopyDir(SOURCE_RULES, path.join(PROJECT_ROOT, '.aidlc-rules'), manifestFiles, '.aidlc-rules');

  updateClaudeMd('@.aidlc-rules/core-workflow.md');
  saveManifest('A', [detailsMap, rulesMap]);
}

function setupKiro(manifestFiles) {
  // Limpia lo de Claude Code si venía de modo A o C
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rule-details'));
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rules'));
  cleanClaudeMd();

  log('Copiando steering rules...');
  const rulesMap = smartCopyDir(SOURCE_RULES, path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'), manifestFiles, '.kiro/steering/aws-aidlc-rules');

  log('Copiando rule details...');
  const detailsMap = smartCopyDir(SOURCE_DETAILS, path.join(PROJECT_ROOT, '.kiro', 'aws-aidlc-rule-details'), manifestFiles, '.kiro/aws-aidlc-rule-details');

  saveManifest('B', [rulesMap, detailsMap]);
}

function setupBoth(manifestFiles) {
  // Limpia carpetas de modo A que ya no se necesitan
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rule-details'));
  removeDir(path.join(PROJECT_ROOT, '.aidlc-rules'));

  log('Copiando steering rules...');
  const rulesMap = smartCopyDir(SOURCE_RULES, path.join(PROJECT_ROOT, '.kiro', 'steering', 'aws-aidlc-rules'), manifestFiles, '.kiro/steering/aws-aidlc-rules');

  log('Copiando rule details...');
  const detailsMap = smartCopyDir(SOURCE_DETAILS, path.join(PROJECT_ROOT, '.kiro', 'aws-aidlc-rule-details'), manifestFiles, '.kiro/aws-aidlc-rule-details');

  // CLAUDE.md importa desde el steering de Kiro — una sola copia, sin duplicación
  updateClaudeMd('@.kiro/steering/aws-aidlc-rules/core-workflow.md');
  saveManifest('C', [rulesMap, detailsMap]);
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
  if (fs.existsSync(MANIFEST_PATH)) {
    fs.unlinkSync(MANIFEST_PATH);
    log('Eliminado: .aidlc-manifest.json');
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

validateSources();

const previousMode = detectPreviousMode();
const manifest     = loadManifest();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('\nConfigurando AI-DLC para CarConnect...\n');

if (previousMode) {
  const labels = { A: 'Claude Code', B: 'Kiro', C: 'Ambas' };
  console.log(`  Setup anterior detectado: ${labels[previousMode]}\n`);
}

console.log('¿Con qué herramienta de IA trabajás en este proyecto?\n');
console.log('  A) Claude Code          — agente de Anthropic en la terminal / IDE');
console.log('                            instala reglas en .aidlc-rules/ y las importa en CLAUDE.md');
console.log('');
console.log('  B) Kiro                 — IDE de Amazon con soporte nativo de steering');
console.log('                            instala reglas en .kiro/steering/aws-aidlc-rules/');
console.log('');
console.log('  C) Claude Code + Kiro   — ambas herramientas en el mismo proyecto');
console.log('                            usa una sola copia en .kiro/steering/ (CLAUDE.md la importa)');
console.log('');
console.log('  D) Desinstalar          — elimina todos los archivos de AI-DLC del proyecto\n');

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

  // Siempre pasamos manifest.files (si existe) a smartCopyDir.
  // La protección funciona por path: si el destino comparte paths con el manifest
  // (mismo modo, o B<->C que usan los mismos dirs de kiro), los archivos modificados
  // localmente se respetan. Si los paths no coinciden (ej. A->B), las entradas del
  // manifest no hacen match y se trata como instalación limpia — sin riesgo.
  const manifestFiles = manifest ? manifest.files : null;

  console.log(`Configurando para ${modeMap[choice].label}...\n`);
  modeMap[choice].fn(manifestFiles);

  const commitFiles = {
    A: 'CLAUDE.md, .aidlc-rules/, .aidlc-rule-details/, .aidlc-manifest.json',
    B: '.kiro/steering/, .kiro/aws-aidlc-rule-details/, .aidlc-manifest.json',
    C: 'CLAUDE.md, .kiro/steering/, .kiro/aws-aidlc-rule-details/, .aidlc-manifest.json',
  };

  console.log('\nAI-DLC listo.\n');
  console.log(`  Commitea: ${commitFiles[choice]}`);
  console.log('  Commitea también: aidlc-docs/ al cerrar cada feature (es documentación del proyecto)\n');
  console.log('  Para usar: "Using AI-DLC, [descripción de tu tarea]"\n');
});
