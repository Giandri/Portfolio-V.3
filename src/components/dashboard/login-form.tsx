"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/dashboard/panel";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { authClient } from "@/lib/auth-client";

const ACCESS_DENIED_MESSAGES: Record<string, string> = {
  access_denied: "Email ini tidak terdaftar, jadi akses ditolak.",
  email_not_verified: "Email GitHub belum terverifikasi.",
  AccessDenied: "Email ini tidak terdaftar, jadi akses ditolak.",
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.59-8.87Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

export function LoginForm({ error, next, allowlistConfigured }: { error?: string; next?: string; allowlistConfigured: boolean }) {
  const [pending, setPending] = useState<string | null>(null);

  async function signIn(provider: "google" | "github") {
    setPending(provider);
    await authClient.signIn.social({
      provider,
      callbackURL: next?.startsWith("/dashboard") ? next : "/dashboard",
      errorCallbackURL: "/login",
    });
    setPending(null);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <main className="w-full max-w-sm">
        <Panel>
          <h1 className="text-xl leading-tight font-semibold">Portfolio Dashboard</h1>
          <p className="mt-2 max-w-[72ch] text-sm text-muted-foreground">
            Kelola konten portfolio dari satu tempat.
          </p>

          {error ? (
            <div role="alert" className="mt-4">
              <StatusBadge tone="danger">
                {ACCESS_DENIED_MESSAGES[error] ??
                  "Gagal masuk. Periksa konfigurasi OAuth lalu coba lagi."}
              </StatusBadge>
            </div>
          ) : null}

          {!allowlistConfigured ? (
            <div className="mt-4">
              <StatusBadge tone="warning">
                Email kosong, jadi semua login ditolak.
              </StatusBadge>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 w-full justify-center rounded-sm border-border-strong px-3"
              disabled={pending !== null}
              onClick={() => void signIn("google")}
            >
              <GoogleMark />
              {pending === "google" ? "Menghubungkan…" : "Masuk dengan Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-8 w-full justify-center rounded-sm border-border-strong px-3"
              disabled={pending !== null}
              onClick={() => void signIn("github")}
            >
              <GitHubMark />
              {pending === "github" ? "Menghubungkan…" : "Masuk dengan GitHub"}
            </Button>
          </div>

          <p className="mt-4 text-xs text-faint">
            Yang tidak berkepentingan{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5">DILARANG_MASUK</code>,
            tanpa terkecuali.
          </p>
        </Panel>
      </main>
    </div>
  );
}
