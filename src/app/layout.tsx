import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { LanguageProvider } from "@/context/language-provider";
import { getSiteContent } from "@/lib/content";
import { db } from "@/lib/db";
import { pickLocalized } from "@/lib/i18n-content";

// Konten datang dari database, jadi halaman harus dirender per-request agar
// perubahan dari dashboard admin langsung terlihat.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata SEO diambil dari tabel `SiteSetting` (dikelola di dashboard).
 * Bahasa diambil dari varian `en` karena pilihan bahasa pengguna disimpan di
 * localStorage sehingga tidak tersedia di server.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.siteSetting
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  const title = settings?.siteTitle ?? "Portfolio";
  const description = settings?.description
    ? pickLocalized(settings.description, "en")
    : "";

  // Open Graph butuh URL absolut, jadi path relatif diprefix siteUrl.
  const base = settings?.siteUrl?.replace(/\/$/, "");
  const ogImage = settings?.ogImage
    ? base && settings.ogImage.startsWith("/")
      ? `${base}${settings.ogImage}`
      : settings.ogImage
    : null;

  return {
    title,
    description: description || undefined,
    ...(settings?.favicon ? { icons: { icon: settings.favicon } } : {}),
    openGraph: {
      title,
      description: description || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=aktura@400&display=swap"
          rel="stylesheet"
          suppressHydrationWarning
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Almendra:wght@400&display=swap"
          rel="stylesheet"
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <LanguageProvider content={content}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
