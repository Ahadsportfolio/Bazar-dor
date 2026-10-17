import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const mongoUri =
  process.env.MONGODB_URI ??
  process.env.BETTER_AUTH_MONGODB_URI ??
  "mongodb://127.0.0.1:27017/bazar-dor";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};
const client = globalForMongo.mongoClient ?? new MongoClient(mongoUri);
const db = client.db(process.env.MONGODB_DATABASE);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== "..."
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  process.env.GITHUB_CLIENT_ID !== "..."
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

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
  process.env.BETTER_AUTH_URL ||
  (vercelBaseURL ? `https://${vercelBaseURL}` : "http://localhost:3000");
const additionalTrustedOrigins =
  process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "build_time_secret_placeholder_must_be_32_chars_long",
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
