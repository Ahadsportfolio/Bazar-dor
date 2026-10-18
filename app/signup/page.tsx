import { SignupPageClient } from "@/components/site";
import { getConfiguredSocialProviderNames } from "@/lib/social-providers";

export default function SignupPage() {
  return (
    <SignupPageClient
      enabledSocialProviders={getConfiguredSocialProviderNames()}
    />
  );
}
