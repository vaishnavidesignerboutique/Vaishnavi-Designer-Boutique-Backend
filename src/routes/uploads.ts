import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { signUpload } from "../lib/cloudinary.js";

export const uploadsRouter = Router();

uploadsRouter.post("/sign", requireAdmin, (req, res) => {
  const folder = typeof req.body?.folder === "string" && req.body.folder ? req.body.folder : "vdb";
  res.json(signUpload(folder));
});
