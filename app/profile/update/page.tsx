import { ProfileUpdatePageClient } from "@/components/site";
import { requireSession } from "@/lib/auth-guard";

export const instant = false;

export default async function ProfileUpdatePage() {
  await requireSession("/profile/update");
  return <ProfileUpdatePageClient />;
}