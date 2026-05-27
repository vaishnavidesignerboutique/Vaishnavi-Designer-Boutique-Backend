import bcrypt from "bcryptjs";
import { db } from "./client.js";
import { env } from "../config/env.js";

type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  seo_title: string;
  seo_description: string;
  tags: string;
};

const seedPosts: SeedPost[] = [
  {
    slug: "blouse-design-by-body-type-lucknow-guide",
    title: "How to choose the right blouse design for your body type — a Lucknow guide",
    excerpt:
      "A simple, body-positive guide from Vaishnavi Designer Boutique on picking blouse necklines, sleeves and back designs that flatter your shape.",
    seo_title: "Blouse Design by Body Type — Lucknow Boutique Guide",
    seo_description:
      "Lucknow boutique guide to choosing blouse necklines, sleeves and backs by body type. Tips from Vaishnavi Designer Boutique stitching atelier.",
    tags: "blouse, stitching, body-type, lucknow",
    content_md: `# How to choose the right blouse design for your body type

Every saree starts with the blouse. Get the blouse right and the whole drape sings; get it wrong and the most beautiful silk feels off. After years of fitting clients at our Lucknow atelier, here is the simple framework we use.

## Start with the shoulder line
Before fabric, before neckline — we measure the shoulder. A blouse that sits one centimetre off the shoulder bone is the difference between "stitched" and "tailored".

## Necklines by face shape
- **Round face:** V-neck, sweetheart, or deep U — anything that elongates.
- **Oval face:** the most forgiving — try boat necks, square, or high collar.
- **Heart-shaped face:** scoop or wide round to balance the jaw.
- **Long face:** boat neck or off-shoulder to add width.

## Sleeves by arm shape
Three-quarter sleeves with a soft cuff are universally flattering for Indian arms. For slimmer arms, puff sleeves or bell sleeves are having a moment in Lucknow this year.

## Back designs that work for weddings
Keyhole, tie-up, or a single thin band — anything more becomes a styling problem under the pallu. We always stitch a removable hook so you can swap looks the same day.

## Coming in for a fitting
Bring two references and the saree itself. We will measure across the shoulder, bust, waist and arm length, and walk you through fabric, lining and padded vs unpadded options.

## FAQs

**How many fittings do I need?**
For a fresh blouse, two — first muslin, then final. For an alteration, usually one.

**Can you copy a blouse I already own?**
Yes. Bring it along; we trace the pattern.

**Do you do padded blouses?**
Yes, with detachable foam cups so the blouse can be washed normally.
`,
  },
  {
    slug: "bridal-lehenga-checklist-lucknow",
    title: "Bridal lehenga shopping in Lucknow: a complete checklist before your fitting",
    excerpt:
      "From first measurement to final dupatta, the full checklist Vaishnavi Designer Boutique gives every Lucknow bride.",
    seo_title: "Bridal Lehenga Checklist — Lucknow Boutique",
    seo_description:
      "Vaishnavi Designer Boutique's complete Lucknow bridal lehenga checklist: fittings, fabric, blouse, dupatta, timeline and budget tips.",
    tags: "bridal, lehenga, wedding, lucknow",
    content_md: `# Bridal lehenga shopping in Lucknow: a complete checklist

The Lucknow wedding season runs long, and so do bridal-lehenga decisions. Here is the checklist we hand to every bride at her first consultation.

## 1. Start three months out (minimum)
A custom-stitched bridal lehenga needs at least eight to ten weeks. Less than that and we are rushing the embroidery.

## 2. Decide the silhouette first, fabric second
A-line, mermaid, flared circular, or a kalidar panel lehenga — each fabric drapes differently across these. Pick the shape, then the cloth.

## 3. Bring reference photos
Two or three is the right number. More than that, and the design becomes a remix instead of yours.

## 4. Choose the blouse and dupatta with the lehenga
A blouse that does not echo the lehenga's motif looks pasted on. The dupatta is the third character — heavy net, georgette, or organza all change the silhouette.

## 5. Measurements
You will be measured at three points across two weeks. Weight fluctuates near the wedding; we leave 1 cm of seam allowance both sides for last-minute alterations.

## 6. Budget honestly
Tell us the total budget upfront. We will allocate it across fabric, embroidery, lining and blouse so nothing comes out unbalanced.

## 7. Trial run the full look
We do a full-look trial — lehenga, blouse, dupatta, even the petticoat — at least ten days before the wedding.

## FAQs

**Can you copy a designer lehenga I saw online?**
Pattern-wise yes, motif-for-motif no — that crosses into copying someone's signature work. We will inspire from it and design something original.

**How much does a bridal lehenga cost at Vaishnavi Designer Boutique?**
It depends entirely on fabric and embroidery. Talk to us; we will give you an honest range during the first consultation.
`,
  },
  {
    slug: "saree-fall-pico-guide",
    title: "Saree fall and pico — what every saree lover should know",
    excerpt:
      "Why fall and pico matter, when to redo them, and how to care for your saree afterwards. From Vaishnavi Designer Boutique, Lucknow.",
    seo_title: "Saree Fall and Pico Guide — Lucknow Boutique",
    seo_description:
      "Saree fall and pico guide from Vaishnavi Designer Boutique in Lucknow: when to do it, why it matters, and how to keep your saree wearable for years.",
    tags: "saree, fall, pico, care, lucknow",
    content_md: `# Saree fall and pico — what every saree lover should know

A new saree is not ready to drape until it has been finished with **fall** and **pico**. Both are tiny pieces of stitching that change everything about how a saree falls.

## What is "fall"?
A 4–5 inch strip of fabric stitched along the lower edge of the saree, on the inside. It adds weight so the saree falls cleanly and protects the bottom edge from wear when you walk.

## What is "pico"?
The narrow rolled-hem finish along the entire raw edge of the saree, done on a special machine. Without pico, the fabric frays.

## When to get fall and pico done
- Right after buying any new saree before its first wear.
- After a deep wash that has pulled at the bottom edge.
- Whenever you notice the fall fabric peeling off — usually after two seasons.

## Choosing the fall fabric
Match the fall weight to the saree fabric: soft cotton fall for chiffon and georgette, a slightly stiffer fall for silk and Banarasi.

## Care after fall and pico
Always dry-clean heavy silk and Banarasi. For cotton and georgette, gentle hand wash, dry in shade, and iron on low.

## FAQs

**How long does fall and pico take?**
Same day to one day at our Lucknow atelier.

**Do you do fall and pico on bridal lehenga dupattas?**
Yes — and it is essential. We use the lightest possible fall for net dupattas.
`,
  },
  {
    slug: "party-wear-trends-lucknow",
    title: "Party-wear trends in Lucknow this season: silhouettes our clients love",
    excerpt:
      "From corseted blouses to flared shararas, the party-wear silhouettes Lucknow women are asking for at Vaishnavi Designer Boutique this season.",
    seo_title: "Lucknow Party-Wear Trends — Vaishnavi Designer Boutique",
    seo_description:
      "The party-wear silhouettes, fabrics and necklines Lucknow women love this season, from the Vaishnavi Designer Boutique atelier.",
    tags: "party-wear, trends, lucknow, dresses",
    content_md: `# Party-wear trends in Lucknow this season

Every season the requests shift. Here is what Lucknow women are asking us to design right now.

## Corseted blouses with traditional skirts
A structured corset blouse paired with a flared lehenga skirt or sharara is the standout look this season. It works for sangeets, cocktail nights, and even reception outfits.

## Sharara sets in pastels
Mint, dusty rose, butter yellow — pastels are dominating sharara orders. We stitch them with a lightly padded blouse and matched dupatta.

## Indo-western gowns
A fitted bodice with an Anarkali-style flare, in georgette or organza, with subtle gota or zardozi at the neckline. Popular for engagement parties.

## Statement sleeves
Puff sleeves, bell sleeves, ruffle tiers — sleeves are doing the heavy lifting this season.

## Fabric notes
Velvets are returning for winter. Organza and chanderi own the daytime. Tissue is making a comeback for sangeet outfits.

## Coming in for a fitting
Bring your event date — we plan the construction backwards from there.

## FAQs

**How much fabric do I need for a sharara?**
We measure and source the fabric for you — usually 4–6 metres depending on flare.

**Can you stitch from fabric I already own?**
Yes. Bring it in and we will assess weight, drape and quantity before quoting.
`,
  },
  {
    slug: "silk-georgette-chiffon-care-guide",
    title: "Caring for silk, georgette and chiffon — a wardrobe guide",
    excerpt:
      "Practical care advice for the three fabrics every Indian wardrobe lives in. From Vaishnavi Designer Boutique, Lucknow.",
    seo_title: "Silk, Georgette & Chiffon Care Guide — Lucknow Boutique",
    seo_description:
      "How to wash, store and iron silk, georgette and chiffon sarees and blouses. Practical care guide from Vaishnavi Designer Boutique in Lucknow.",
    tags: "fabric-care, silk, georgette, chiffon, lucknow",
    content_md: `# Caring for silk, georgette and chiffon

The right care doubles the life of a saree. Here is what we tell every client at Vaishnavi Designer Boutique.

## Silk
- Dry-clean only for the first two washes.
- Hand-wash with a mild detergent only after the first two cleans.
- Never wring; press in a towel to remove water.
- Store with muslin folds; refold every three months to avoid creases.

## Georgette
- Gentle hand wash with cold water and very mild detergent.
- Dry in shade only — direct sun fades georgette quickly.
- Iron on the lowest steam setting through a thin muslin cloth.

## Chiffon
- The most delicate of the three. Dry-cleaning is safest.
- If hand-washing, do not soak for more than two minutes.
- Hang to dry on a wide padded hanger to avoid pulls.

## General storage tips
- Lucknow's humidity is the enemy. Add a small silica sachet to each saree fold.
- Use muslin or unbleached cotton covers, never plastic.
- Air your wardrobe every few weeks during the monsoon.

## FAQs

**My silk saree has a faint stain — can you save it?**
Bring it to us; in most cases yes, with the right pre-clean.

**Do you offer storage advice or services?**
Advice yes, free of cost. We do not store client garments.
`,
  },
  {
    slug: "first-boutique-consultation-what-to-expect",
    title: "What to expect at your first boutique consultation",
    excerpt:
      "A friendly walk-through of your first visit to Vaishnavi Designer Boutique in Lucknow — measurements, design talk, timeline, pricing.",
    seo_title: "Your First Boutique Consultation — Vaishnavi Designer Boutique Lucknow",
    seo_description:
      "What to bring, what we ask, and how a first consultation works at Vaishnavi Designer Boutique in Lucknow. Friendly, no-pressure walk-through.",
    tags: "consultation, boutique, lucknow, getting-started",
    content_md: `# What to expect at your first boutique consultation

Walking into a designer boutique for the first time can feel a little intimidating. It doesn't have to be. Here is exactly how a first consultation runs at our Lucknow atelier.

## Before you come in
Bring two or three reference photos and, if possible, the event date. If you have fabric or an existing garment to copy, bring that too.

## The first 10 minutes — the conversation
We start with your event, the look you are after, your comfort level, and your budget. Honest answers here save weeks later.

## Measurements
Nine to twelve measurements, depending on the garment. We use the same notebook for repeat clients so the second visit is faster.

## Fabric and design walk-through
We pull options from our fabric library, discuss linings, embroidery, and any embellishment. You leave with a written sketch or photo of the agreed design.

## Pricing
Pricing is shared upfront, in writing. No surprises at delivery.

## Timeline
A typical custom blouse: 7–10 days. A dress or party-wear lehenga: 2–4 weeks. A bridal lehenga: 8–10 weeks minimum.

## Coming in
We are based in Lucknow. Walk-in, or call ahead — we will hold a slot.

## FAQs

**Do I need an appointment?**
Walk-ins are welcome, but Saturdays and bridal-season weekends fill up. Calling helps.

**What if I do not like the first sketch?**
We revise — that is what consultation is for. Designing is a back-and-forth.
`,
  },
];

export async function seed(): Promise<{ admins: number; blogs: number }> {
  // Admin user
  const adminCheck = await db.execute({
    sql: "SELECT id FROM admin_users WHERE email = ?",
    args: [env.SEED_ADMIN_EMAIL],
  });
  let admins = adminCheck.rows.length;
  if (admins === 0) {
    const hash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 10);
    await db.execute({
      sql: "INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)",
      args: [env.SEED_ADMIN_EMAIL, hash, env.SEED_ADMIN_NAME],
    });
    admins = 1;
  }

  // Blog posts (only insert if slug doesn't exist)
  let blogs = 0;
  for (const post of seedPosts) {
    const exists = await db.execute({
      sql: "SELECT id FROM blogs WHERE slug = ?",
      args: [post.slug],
    });
    if (exists.rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO blogs
          (slug, title, excerpt, content_md, seo_title, seo_description, tags, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
        args: [
          post.slug,
          post.title,
          post.excerpt,
          post.content_md,
          post.seo_title,
          post.seo_description,
          post.tags,
        ],
      });
      blogs += 1;
    }
  }

  return { admins, blogs };
}

const isDirectRun = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`;
if (isDirectRun) {
  seed()
    .then((counts) => {
      console.log(`[seed] admins=${counts.admins}, new blog drafts=${counts.blogs}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("[seed] failed", err);
      process.exit(1);
    });
}
