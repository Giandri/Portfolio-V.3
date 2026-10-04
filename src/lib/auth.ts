import { betterAuth } from "better-auth";
import { isAdminEmail } from "@/lib/admin-emails";

export const auth = betterAuth({
  appName: "Portfolio CMS",
  secret: process.env.AUTH_SECRET || undefined,
  baseURL: process.env.AUTH_URL || undefined,
  basePath: "/api/auth",

  emailAndPassword: { enabled: false },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    },
    github: {
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    },
  },

  user: {
    validateUserInfo: ({ user, source }) => {
      if (!isAdminEmail(user.email)) {
        return {
          error: "access_denied",
          errorDescription: "Email ini tidak terdaftar di ADMIN_EMAILS.",
        };
      }

      if (source.oauth?.providerId === "github") {
        const verified = (
          source.oauth.profile as { email_verified?: boolean } | undefined
        )?.email_verified;
        if (verified === false) {
          return {
            error: "email_not_verified",
            errorDescription: "Email GitHub belum terverifikasi.",
          };
        }
      }
    },
  },
});
