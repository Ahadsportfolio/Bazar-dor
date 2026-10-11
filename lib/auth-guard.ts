import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function requireSession(redirectTo = "/") {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    const callback = new URLSearchParams({ callbackUrl: redirectTo });
    redirect(`/signin?${callback.toString()}`);
  }

  return session;
}
