import { Router } from "express";
import { db } from "../db/client.js";
import { blogCreateSchema, blogUpdateSchema } from "../lib/validators.js";
import { requireAdmin } from "../middleware/auth.js";
import { HttpError } from "../middleware/error.js";
import { slugify } from "../lib/slug.js";

export const blogsRouter = Router();

// PUBLIC: list published posts
blogsRouter.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 20), 50);
    const offset = Math.max(Number(req.query.offset ?? 0), 0);
    const result = await db.execute({
      sql: `SELECT id, slug, title, excerpt, cover_image_url, tags, published_at
            FROM blogs
            WHERE status = 'published'
            ORDER BY published_at DESC
            LIMIT ? OFFSET ?`,
      args: [limit, offset],
    });
    res.json({ rows: result.rows, limit, offset });
  } catch (err) {
    next(err);
  }
});

// PUBLIC: single published post by slug
blogsRouter.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await db.execute({
      sql: `SELECT * FROM blogs WHERE slug = ? AND status = 'published'`,
      args: [slug],
    });
    const row = result.rows[0];
    if (!row) throw new HttpError(404, "Post not found");
    res.json({ post: row });
  } catch (err) {
    next(err);
  }
});

// ADMIN: list all (drafts + published)
export const adminBlogsRouter = Router();

adminBlogsRouter.use(requireAdmin);

adminBlogsRouter.get("/", async (_req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT id, slug, title, excerpt, cover_image_url, tags, status, published_at, created_at, updated_at
       FROM blogs ORDER BY created_at DESC`,
    );
    res.json({ rows: result.rows });
  } catch (err) {
    next(err);
  }
});

adminBlogsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) throw new HttpError(400, "Invalid id");
    const result = await db.execute({
      sql: "SELECT * FROM blogs WHERE id = ?",
      args: [id],
    });
    const row = result.rows[0];
    if (!row) throw new HttpError(404, "Post not found");
    res.json({ post: row });
  } catch (err) {
    next(err);
  }
});

adminBlogsRouter.post("/", async (req, res, next) => {
  try {
    const body = blogCreateSchema.parse(req.body);
    const slug = body.slug ?? slugify(body.title);
    const publishedAt = body.status === "published" ? new Date().toISOString() : null;

    const result = await db.execute({
      sql: `INSERT INTO blogs
        (slug, title, excerpt, content_md, cover_image_url, seo_title, seo_description, tags, status, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        slug,
        body.title,
        body.excerpt ?? null,
        body.contentMd,
        body.coverImageUrl || null,
        body.seoTitle ?? null,
        body.seoDescription ?? null,
        body.tags ?? null,
        body.status,
        publishedAt,
      ],
    });
    res.status(201).json({ id: Number(result.lastInsertRowid ?? 0), slug });
  } catch (err) {
    next(err);
  }
});

adminBlogsRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) throw new HttpError(400, "Invalid id");

    const body = blogUpdateSchema.parse(req.body);
    const sets: string[] = [];
    const args: (string | number | null)[] = [];

    const map: [keyof typeof body, string][] = [
      ["title", "title"],
      ["slug", "slug"],
      ["excerpt", "excerpt"],
      ["contentMd", "content_md"],
      ["coverImageUrl", "cover_image_url"],
      ["seoTitle", "seo_title"],
      ["seoDescription", "seo_description"],
      ["tags", "tags"],
      ["status", "status"],
    ];
    for (const [k, col] of map) {
      if (body[k] !== undefined) {
        sets.push(`${col} = ?`);
        args.push(body[k] as string);
      }
    }
    if (body.status === "published") {
      sets.push("published_at = COALESCE(published_at, CURRENT_TIMESTAMP)");
    }
    if (sets.length === 0) throw new HttpError(400, "No fields to update");
    sets.push("updated_at = CURRENT_TIMESTAMP");
    args.push(id);

    await db.execute({
      sql: `UPDATE blogs SET ${sets.join(", ")} WHERE id = ?`,
      args,
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

adminBlogsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) throw new HttpError(400, "Invalid id");
    await db.execute({ sql: "DELETE FROM blogs WHERE id = ?", args: [id] });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
