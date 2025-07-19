#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

function getGitCommitHash() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

function getGitShortCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

function getGitCommitMessage() {
  try {
    return execSync('git log -1 --pretty=%s', { encoding: 'utf8' }).trim().replace(/"/g, '\\"');
  } catch (error) {
    return 'unknown';
  }
}

function getBuildTime() {
  return new Date().toISOString();
}

function injectVersionInfo() {
  const workerPath = join(__dirname, 'src', 'worker', 'index.ts');
  let workerContent = readFileSync(workerPath, 'utf8');
  
  const version = packageJson.version;
  const commitHash = getGitShortCommitHash();
  const fullCommitHash = getGitCommitHash();
  const commitMessage = getGitCommitMessage();
  const buildTime = getBuildTime();
  
  // Replace placeholders with actual values
  workerContent = workerContent
    .replace('__VERSION__', version)
    .replace('__COMMIT_HASH__', `${commitHash} (${fullCommitHash})`)
    .replace('__BUILD_TIME__', buildTime)
    .replace('__COMMIT_MESSAGE__', commitMessage);
  
  writeFileSync(workerPath, workerContent);
  
  console.log(`✅ Version info injected:`);
  console.log(`   Version: ${version}`);
  console.log(`   Commit: ${commitHash} (${fullCommitHash})`);
  console.log(`   Commit Summary: ${commitMessage}`);
  console.log(`   Build Time: ${buildTime}`);
}

// Restore original placeholders after build
function restorePlaceholders() {
  const workerPath = join(__dirname, 'src', 'worker', 'index.ts');
  let workerContent = readFileSync(workerPath, 'utf8');
  
  // Replace any actual values back with placeholders using more robust regex
  workerContent = workerContent
    .replace(/version: "[^"]*"/, 'version: "__VERSION__"')
    .replace(/commitHash: "[^"]*"/, 'commitHash: "__COMMIT_HASH__"')
    .replace(/buildTime: "[^"]*"/, 'buildTime: "__BUILD_TIME__"')
    .replace(/commitMessage: "[^"]*"/s, 'commitMessage: "__COMMIT_MESSAGE__"');
  
  writeFileSync(workerPath, workerContent);
}

const command = process.argv[2];

if (command === 'inject') {
  injectVersionInfo();
} else if (command === 'restore') {
  restorePlaceholders();
} else {
  console.error('Usage: node build-version.js [inject|restore]');
  process.exit(1);
}
