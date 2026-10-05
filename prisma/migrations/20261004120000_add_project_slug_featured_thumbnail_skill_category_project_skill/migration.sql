-- Menambah slug/featured/thumbnail ke Project, category ke Skill,
-- dan mengganti join implisit _ProjectToSkill dengan ProjectSkill eksplisit
-- supaya urutan techStack per project bisa diatur.

-- 1. Kolom baru di Project. slug nullable dulu supaya data lama bisa di-backfill.
ALTER TABLE "Project" ADD COLUMN "slug" TEXT;
ALTER TABLE "Project" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Project" ADD COLUMN "thumbnail" TEXT;

-- 2. Backfill slug dari judul (field `en`). Slug harus unik.
UPDATE "Project" SET "slug" = lower(regexp_replace("title"->>'en', '[^a-zA-Z0-9]+', '-', 'g'));

-- 3. Jaga uniqueness kalau ada judul yang slug-nya sama.
UPDATE "Project" p
SET "slug" = p."slug" || '-' || substr(p."id", 1, 6)
WHERE p."slug" IN (
  SELECT "slug" FROM "Project" GROUP BY "slug" HAVING count(*) > 1
);

-- 4. slug wajib + unique.
ALTER TABLE "Project" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- 5. Index untuk query halaman publik (published + order).
CREATE INDEX "Project_status_order_idx" ON "Project"("status", "order");

-- 6. category di Skill, default supaya baris lama aman.
ALTER TABLE "Skill" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Lainnya';

-- 7. Join eksplisit ProjectSkill, salin data dari _ProjectToSkill (31 baris).
CREATE TABLE "ProjectSkill" (
    "projectId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("projectId", "skillId")
);

INSERT INTO "ProjectSkill" ("projectId", "skillId", "order")
SELECT "A", "B", 0 FROM "_ProjectToSkill";

CREATE INDEX "ProjectSkill_skillId_idx" ON "ProjectSkill"("skillId");

ALTER TABLE "ProjectSkill"
    ADD CONSTRAINT "ProjectSkill_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectSkill"
    ADD CONSTRAINT "ProjectSkill_skillId_fkey"
    FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 8. Buang join implisit yang sudah tidak dipakai.
DROP TABLE "_ProjectToSkill";