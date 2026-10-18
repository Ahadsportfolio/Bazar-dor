export const socialProviderNames = ["google", "github"] as const;

export type SocialProvider = (typeof socialProviderNames)[number];

const providerEnvironmentVariables = {
  google: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
  github: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
} as const;

export function getConfiguredSocialProviders(): Partial<
  Record<SocialProvider, { clientId: string; clientSecret: string }>
> {
  const providers: Partial<
    Record<SocialProvider, { clientId: string; clientSecret: string }>
  > = {};

  for (const provider of socialProviderNames) {
    const [clientIdVariable, clientSecretVariable] =
      providerEnvironmentVariables[provider];
    const clientId = process.env[clientIdVariable]?.trim();
    const clientSecret = process.env[clientSecretVariable]?.trim();

    if (
      clientId &&
      clientSecret &&
      clientId !== "..." &&
      clientSecret !== "..."
    ) {
      providers[provider] = { clientId, clientSecret };
    }
  }

  return providers;
}

export function getConfiguredSocialProviderNames(): SocialProvider[] {
  const providers = getConfiguredSocialProviders();
  return socialProviderNames.filter((provider) => providers[provider] !== undefined);
}
