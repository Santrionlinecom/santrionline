#!/usr/bin/env node
// Simple build size benchmark: runs vite build, measures output size summary.
const { execSync } = require('child_process');
const { statSync, readdirSync } = require('fs');
const { join } = require('path');

function dirSize(p){
  try { return readdirSync(p).reduce((a,f)=>{ const s=statSync(join(p,f)); return a + (s.isDirectory()?0:s.size);},0);} catch { return 0; }
}

try {
  console.log('[benchmark] building...');
  execSync('npm run build', { stdio: 'inherit' });
  const clientDir = join(process.cwd(), 'build', 'client');
  const serverDir = join(process.cwd(), 'build', 'server');
  const clientSize = dirSize(clientDir);
  const serverSize = dirSize(serverDir);
  console.log(JSON.stringify({ clientKB: +(clientSize/1024).toFixed(2), serverKB: +(serverSize/1024).toFixed(2) }));
} catch (e) {
  console.error('[benchmark] failed', e.message);
  process.exit(1);
}
