/* ───────────────────────────────────────────────────────────────
   Pre-start schema sync.

   Pushes the Prisma schema when DATABASE_URL is configured, but NEVER
   exits non-zero. This runs as `npm run db:push:safe && npm start`, so
   a non-zero exit here kills the container before the API ever binds a
   port — which is how an unreachable database (a suspended/expired Neon
   instance, a network blip) took the whole service down in a crash loop.

   Most of this API — every PDF and image tool — needs no database at all.
   Degrading to guest mode is strictly better than being entirely offline.
   `/ready` reports the real database status either way.
   ─────────────────────────────────────────────────────────────── */
const { execSync } = require('child_process');

if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL set — skipping schema push (guest mode).');
  process.exit(0);
}

try {
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  console.log('Schema push complete.');
} catch (err) {
  console.error(
    '\nWARNING: `prisma db push` failed — starting the API anyway.\n' +
      'Database-backed features (accounts, history, favorites, admin) will be\n' +
      'degraded until the database is reachable. Check DATABASE_URL and that the\n' +
      'database is awake. Reason: ' +
      (err && err.message ? err.message.split('\n')[0] : String(err)) +
      '\n'
  );
  process.exit(0); // deliberately non-fatal
}
