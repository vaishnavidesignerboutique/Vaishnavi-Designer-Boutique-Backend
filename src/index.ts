import { env } from "./config/env.js";
import { buildApp } from "./app.js";
import { migrate } from "./db/migrate.js";
import { seed } from "./db/seed.js";

async function main(): Promise<void> {
  console.log("[boot] env loaded, NODE_ENV=" + env.NODE_ENV);

  console.log("[boot] running migrations...");
  await migrate();
  console.log("[boot] migrations OK");

  console.log("[boot] seeding (idempotent)...");
  const { admins, blogs } = await seed();
  console.log(`[boot] admins=${admins}, new blog drafts=${blogs}`);

  const app = buildApp();
  app.listen(env.PORT, () => {
    console.log(`[boot] listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("[boot] fatal", err);
  process.exit(1);
});
