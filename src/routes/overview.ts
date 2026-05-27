import { Router } from "express";
import { db } from "../db/client.js";
import { requireAdmin } from "../middleware/auth.js";

export const overviewRouter = Router();

function n(v: unknown): number {
  return Number(v ?? 0);
}

// Build a zero-filled list of the last `days` calendar dates (UTC, YYYY-MM-DD).
function lastNDates(days: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// Admin — single payload powering the dashboard
overviewRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const [
      total,
      byStatus,
      lastWeek,
      prevWeek,
      series,
      byService,
      blogStatus,
      recentBlogs,
      recentInquiries,
    ] = await Promise.all([
      db.execute("SELECT COUNT(*) AS n FROM inquiries"),
      db.execute("SELECT status, COUNT(*) AS n FROM inquiries GROUP BY status"),
      db.execute(
        "SELECT COUNT(*) AS n FROM inquiries WHERE created_at >= datetime('now','-7 days')",
      ),
      db.execute(
        "SELECT COUNT(*) AS n FROM inquiries WHERE created_at >= datetime('now','-14 days') AND created_at < datetime('now','-7 days')",
      ),
      db.execute(
        "SELECT date(created_at) AS d, COUNT(*) AS n FROM inquiries WHERE created_at >= datetime('now','-29 days') GROUP BY date(created_at)",
      ),
      db.execute(
        "SELECT service, COUNT(*) AS n FROM inquiries WHERE service IS NOT NULL AND service != '' GROUP BY service ORDER BY n DESC LIMIT 6",
      ),
      db.execute("SELECT status, COUNT(*) AS n FROM blogs GROUP BY status"),
      db.execute(
        "SELECT id, title, status, updated_at FROM blogs ORDER BY updated_at DESC LIMIT 6",
      ),
      db.execute(
        "SELECT id, name, service, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 6",
      ),
    ]);

    const statusCounts: Record<string, number> = { new: 0, contacted: 0, closed: 0 };
    for (const row of byStatus.rows) {
      statusCounts[String(row.status)] = n(row.n);
    }

    const seriesMap = new Map<string, number>();
    for (const row of series.rows) seriesMap.set(String(row.d), n(row.n));
    const filledSeries = lastNDates(30).map((date) => ({
      date,
      count: seriesMap.get(date) ?? 0,
    }));

    const blogCounts: Record<string, number> = {};
    for (const row of blogStatus.rows) {
      blogCounts[String(row.status)] = n(row.n);
    }
    const blogsPublished = blogCounts.published ?? 0;
    const blogsDraft = blogCounts.draft ?? 0;

    const lw = n(lastWeek.rows[0]?.n);
    const pw = n(prevWeek.rows[0]?.n);
    const trendPct = pw === 0 ? (lw > 0 ? 100 : 0) : Math.round(((lw - pw) / pw) * 100);

    res.json({
      inquiries: {
        total: n(total.rows[0]?.n),
        byStatus: statusCounts,
        lastWeek: lw,
        prevWeek: pw,
        trendPct,
        series: filledSeries,
        byService: byService.rows.map((r) => ({
          service: String(r.service),
          count: n(r.n),
        })),
      },
      blogs: {
        total: blogsPublished + blogsDraft,
        published: blogsPublished,
        draft: blogsDraft,
        recent: recentBlogs.rows.map((r) => ({
          id: n(r.id),
          title: String(r.title),
          status: String(r.status),
          updatedAt: String(r.updated_at),
        })),
      },
      recentInquiries: recentInquiries.rows.map((r) => ({
        id: n(r.id),
        name: String(r.name),
        service: r.service ? String(r.service) : null,
        status: String(r.status),
        createdAt: String(r.created_at),
      })),
    });
  } catch (err) {
    next(err);
  }
});
