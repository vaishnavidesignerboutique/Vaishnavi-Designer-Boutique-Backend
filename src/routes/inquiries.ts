import { Router } from "express";
import { db } from "../db/client.js";
import { inquiryCreateSchema, inquiryUpdateSchema } from "../lib/validators.js";
import { requireAdmin } from "../middleware/auth.js";
import { inquiryRateLimiter } from "../middleware/rateLimit.js";
import { HttpError } from "../middleware/error.js";

export const inquiriesRouter = Router();

// Public — submit an inquiry
inquiriesRouter.post("/", inquiryRateLimiter, async (req, res, next) => {
  try {
    const body = inquiryCreateSchema.parse(req.body);
    // honeypot rejection (silent)
    if (body.hp && body.hp.length > 0) {
      res.status(202).json({ ok: true });
      return;
    }
    const result = await db.execute({
      sql: `INSERT INTO inquiries
              (name, phone, email, service, message, preferred_date)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        body.name,
        body.phone,
        body.email ?? null,
        body.service ?? null,
        body.message ?? null,
        body.preferredDate ?? null,
      ],
    });
    res.status(201).json({ ok: true, id: Number(result.lastInsertRowid ?? 0) });
  } catch (err) {
    next(err);
  }
});

// Admin — list
inquiriesRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const limit = Math.min(Number(req.query.limit ?? 50), 200);
    const offset = Math.max(Number(req.query.offset ?? 0), 0);

    const sql = status
      ? `SELECT * FROM inquiries WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
      : `SELECT * FROM inquiries ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const args = status ? [status, limit, offset] : [limit, offset];
    const result = await db.execute({ sql, args });
    res.json({ rows: result.rows, limit, offset });
  } catch (err) {
    next(err);
  }
});

// Admin — counts (for dashboard)
inquiriesRouter.get("/stats", requireAdmin, async (_req, res, next) => {
  try {
    const total = await db.execute("SELECT COUNT(*) AS n FROM inquiries");
    const newOnes = await db.execute("SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'");
    const week = await db.execute(
      "SELECT COUNT(*) AS n FROM inquiries WHERE created_at >= datetime('now','-7 days')",
    );
    res.json({
      total: Number(total.rows[0]?.n ?? 0),
      new: Number(newOnes.rows[0]?.n ?? 0),
      lastWeek: Number(week.rows[0]?.n ?? 0),
    });
  } catch (err) {
    next(err);
  }
});

// Admin — update status / notes
inquiriesRouter.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) throw new HttpError(400, "Invalid id");

    const body = inquiryUpdateSchema.parse(req.body);
    const sets: string[] = [];
    const args: (string | number)[] = [];
    if (body.status) {
      sets.push("status = ?");
      args.push(body.status);
    }
    if (body.notes !== undefined) {
      sets.push("notes = ?");
      args.push(body.notes);
    }
    if (sets.length === 0) throw new HttpError(400, "No fields to update");
    sets.push("updated_at = CURRENT_TIMESTAMP");
    args.push(id);

    await db.execute({
      sql: `UPDATE inquiries SET ${sets.join(", ")} WHERE id = ?`,
      args,
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
