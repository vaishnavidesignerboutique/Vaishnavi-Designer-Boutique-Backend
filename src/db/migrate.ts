import { db } from "./client.js";

const statements: string[] = [
  `CREATE TABLE IF NOT EXISTS admin_users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     name TEXT NOT NULL,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP
   )`,

  `CREATE TABLE IF NOT EXISTS inquiries (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT,
     service TEXT,
     message TEXT,
     preferred_date TEXT,
     status TEXT NOT NULL DEFAULT 'new',
     notes TEXT,
     source TEXT DEFAULT 'website',
     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
     updated_at TEXT DEFAULT CURRENT_TIMESTAMP
   )`,

  `CREATE INDEX IF NOT EXISTS idx_inquiries_status_created
     ON inquiries(status, created_at DESC)`,

  `CREATE TABLE IF NOT EXISTS blogs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     slug TEXT UNIQUE NOT NULL,
     title TEXT NOT NULL,
     excerpt TEXT,
     content_md TEXT NOT NULL,
     cover_image_url TEXT,
     seo_title TEXT,
     seo_description TEXT,
     tags TEXT,
     status TEXT NOT NULL DEFAULT 'draft',
     published_at TEXT,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
     updated_at TEXT DEFAULT CURRENT_TIMESTAMP
   )`,

  `CREATE INDEX IF NOT EXISTS idx_blogs_status_pub
     ON blogs(status, published_at DESC)`,
];

export async function migrate(): Promise<void> {
  for (const sql of statements) {
    await db.execute(sql);
  }
}

// CLI entrypoint: `npm run migrate`
const isDirectRun = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`;
if (isDirectRun) {
  migrate()
    .then(() => {
      console.log("[migrate] schema ready");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[migrate] failed", err);
      process.exit(1);
    });
}
