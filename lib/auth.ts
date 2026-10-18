import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { getConfiguredSocialProviders } from "@/lib/social-providers";

const mongoUri =
  process.env.MONGODB_URI?.trim() ||
  process.env.BETTER_AUTH_MONGODB_URI?.trim();
const secret = process.env.BETTER_AUTH_SECRET?.trim();

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI (or BETTER_AUTH_MONGODB_URI) must be configured for Better Auth.",
  );
}

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters.");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};
const client = globalForMongo.mongoClient ?? new MongoClient(mongoUri);
const db = client.db(process.env.MONGODB_DATABASE);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const socialProviders = getConfiguredSocialProviders();

const vercelProductionURL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const vercelPreviewURL =
  process.env.VERCEL_BRANCH_URL ||
  process.env.VERCEL_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelBaseURL =
  process.env.VERCEL_ENV === "production"
    ? vercelProductionURL
    : vercelPreviewURL;
const baseURL =
  process.env.BETTER_AUTH_URL?.trim() ||
  (vercelBaseURL ? `https://${vercelBaseURL}` : "http://localhost:3000");
const additionalTrustedOrigins =
  process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

export const auth = betterAuth({
  secret,
  baseURL,
  database: mongodbAdapter(db, { client }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: Array.from(
    new Set([
      baseURL,
      ...(process.env.VERCEL_BRANCH_URL
        ? [`https://${process.env.VERCEL_BRANCH_URL}`]
        : []),
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
        : []),
      ...additionalTrustedOrigins,
    ]),
  ),
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
});
