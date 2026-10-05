import { ProfileForm } from "@/components/dashboard/profile-form";
import { getProfile } from "@/lib/data/dashboard";
import type { Localized, LocalizedList } from "@/lib/validations/localized";

export const metadata = { title: "Profile" };

function asLocalized(value: unknown): Localized {
  if (value && typeof value === "object") {
    const record = value as { id?: unknown; en?: unknown };
    return {
      id: typeof record.id === "string" ? record.id : "",
      en: typeof record.en === "string" ? record.en : "",
    };
  }
  return { id: "", en: "" };
}

function asLocalizedList(value: unknown): LocalizedList {
  if (value && typeof value === "object") {
    const record = value as { id?: unknown; en?: unknown };
    return {
      id: Array.isArray(record.id) ? record.id.map(String) : [],
      en: Array.isArray(record.en) ? record.en.map(String) : [],
    };
  }
  return { id: [], en: [] };
}

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="p-6">
        <p className="text-sm text-muted-foreground">
          Profil belum ada. Jalankan `npm run db:seed` untuk mengisinya.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Perubahan langsung tampil di halaman publik setelah disimpan.
        </p>
      </div>

      <ProfileForm
        initial={{
          name: profile.name,
          headline: asLocalized(profile.headline),
          roles: asLocalizedList(profile.roles),
          location: asLocalized(profile.location),
          longBio: asLocalized(profile.longBio),
          publicEmail: profile.publicEmail ?? "",
          resumeUrl: profile.resumeUrl ?? "",
          resumeFileName: profile.resumeFileName ?? "",
          avatarUrl: profile.avatarUrl ?? "",
          greetingOpening: asLocalized(profile.greetingOpening),
          greetingClosing: asLocalized(profile.greetingClosing),
          ctaLabel: asLocalized(profile.ctaLabel),
        }}
      />
    </main>
  );
}