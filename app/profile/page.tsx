import { ProfilePageClient } from "@/components/site";
import { requireSession } from "@/lib/auth-guard";

export const instant = false;

export default async function ProfilePage() {
  await requireSession("/profile");
  return <ProfilePageClient />;
}