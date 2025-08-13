/* eslint-env node */
const { spawn } = require('child_process');

console.log('Starting automatic migration...');

const drizzle = spawn('pnpm', ['drizzle-kit', 'push:sqlite', '--config=drizzle.config.ts'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'pipe'],
});

// Auto-respond to prompts
drizzle.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);

  // Auto-respond to table creation prompts
  if (output.includes('table will be created') || output.includes('created or renamed')) {
    setTimeout(() => {
      drizzle.stdin.write('\n'); // Send enter key
    }, 100);
  }
});

drizzle.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

drizzle.on('close', (code) => {
  console.log(`Migration completed with code ${code}`);

  // After migration, run seed
  if (code === 0) {
    console.log('Starting seed data upload...');
    const seed = spawn(
      'pnpm',
      [
        'wrangler',
        'd1',
        'execute',
        'santrionline-db',
        '--file=production-seed.sql',
        '--remote',
        '--env',
        'production',
      ],
      {
        stdio: 'inherit',
      },
    );

    seed.on('close', (seedCode) => {
      console.log(`Seed completed with code ${seedCode}`);
    });
  }
});
