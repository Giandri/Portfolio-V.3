import type { Metadata } from "next";
import { LoginForm } from "@/components/dashboard/login-form";
import { hasAdminAllowlist } from "@/lib/admin-emails";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <LoginForm
      error={error}
      next={next}
      allowlistConfigured={hasAdminAllowlist()}
    />
  );
}
