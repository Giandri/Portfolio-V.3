-- Kolom SEO untuk SiteSetting: Open Graph image, favicon, dan URL situs.
-- Semua nullable supaya baris singleton yang sudah ada tidak perlu di-backfill.

ALTER TABLE "SiteSetting" ADD COLUMN "ogImage" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "favicon" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "siteUrl" TEXT;