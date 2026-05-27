import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { inquiriesRouter } from "./routes/inquiries.js";
import { blogsRouter, adminBlogsRouter } from "./routes/blogs.js";
import { uploadsRouter } from "./routes/uploads.js";
import { errorHandler, notFound } from "./middleware/error.js";

export function buildApp(): express.Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: false,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/inquiries", inquiriesRouter);
  app.use("/blogs", blogsRouter);
  app.use("/admin/blogs", adminBlogsRouter);
  app.use("/uploads", uploadsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
