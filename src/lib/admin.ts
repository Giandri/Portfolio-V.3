import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-emails";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user || !isAdminEmail(session.user.email)) {
    redirect("/login");
  }

  return session;
}
