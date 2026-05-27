import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const inquiryCreateSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[0-9 +()-]+$/, "Phone may only contain digits, spaces, + ( ) -"),
  email: z.string().email().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  service: z.string().max(80).optional(),
  message: z.string().max(2000).optional(),
  preferredDate: z.string().max(40).optional(),
  // honeypot — must be empty
  hp: z.string().max(0).optional(),
});

export const inquiryUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]).optional(),
  notes: z.string().max(2000).optional(),
});

export const blogCreateSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().max(500).optional(),
  contentMd: z.string().min(20),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  seoTitle: z.string().max(80).optional(),
  seoDescription: z.string().max(180).optional(),
  tags: z.string().max(200).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const blogUpdateSchema = blogCreateSchema.partial();

export type LoginInput = z.infer<typeof loginSchema>;
export type InquiryCreateInput = z.infer<typeof inquiryCreateSchema>;
export type InquiryUpdateInput = z.infer<typeof inquiryUpdateSchema>;
export type BlogCreateInput = z.infer<typeof blogCreateSchema>;
export type BlogUpdateInput = z.infer<typeof blogUpdateSchema>;
