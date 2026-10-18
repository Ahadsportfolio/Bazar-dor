import { SigninPageClient } from "@/components/site";
import { getConfiguredSocialProviderNames } from "@/lib/social-providers";

export default function SigninPage() {
  return (
    <SigninPageClient
      enabledSocialProviders={getConfiguredSocialProviderNames()}
    />
  );
}
