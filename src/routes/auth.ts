import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { db } from "../db/client.js";
import { env } from "../config/env.js";
import { loginSchema } from "../lib/validators.js";
import { HttpError } from "../middleware/error.js";
import { loginRateLimiter } from "../middleware/rateLimit.js";

export const authRouter = Router();

authRouter.post("/admin/login", loginRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Env-credential bypass: the SEED_ADMIN_* credentials always grant access,
    // regardless of DB state (master / recovery login). Keep these env values strong.
    if (email === env.SEED_ADMIN_EMAIL && password === env.SEED_ADMIN_PASSWORD) {
      const token = jwt.sign(
        { sub: 0, email, name: env.SEED_ADMIN_NAME },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN } as SignOptions,
      );
      res.json({ token, user: { id: 0, email, name: env.SEED_ADMIN_NAME } });
      return;
    }

    const result = await db.execute({
      sql: "SELECT id, email, password_hash, name FROM admin_users WHERE email = ?",
      args: [email],
    });
    const row = result.rows[0];
    if (!row) throw new HttpError(401, "Invalid email or password");

    const passwordHash = String(row.password_hash);
    const ok = await bcrypt.compare(password, passwordHash);
    if (!ok) throw new HttpError(401, "Invalid email or password");

    const id = Number(row.id);
    const name = String(row.name);
    const emailStored = String(row.email);

    const token = jwt.sign(
      { sub: id, email: emailStored, name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as SignOptions,
    );

    res.json({
      token,
      user: { id, email: emailStored, name },
    });
  } catch (err) {
    next(err);
  }
});
