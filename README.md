BazarDor is a responsive Bangla market-price dashboard for browsing everyday products, comparing prices across markets, and tracking daily price changes.

## Features

- Live product and category data from the BazarDor API, with a local catalog fallback when the API is unavailable.
- Responsive category navigation, price ticker, risers/fallers, and searchable-at-a-glance product cards.
- Numeric price sorting and Bengali-number currency/change formatting.
- Dynamic product and category routes with friendly not-found handling on direct page loads.
- BetterAuth email/password sign-in, optional Google/GitHub OAuth, and protected product details.
- Shared demo-account sign-in button that provisions its public demo user on first use.
- Profile view and name updates through BetterAuth, with success/error toast notifications.
- Loading skeletons and mobile-friendly layouts.

## Technologies

- Next.js App Router and React
- TypeScript
- Tailwind CSS v4 and DaisyUI
- BetterAuth with MongoDB
- BazarDor Workers API
- Lucide React and React Hot Toast

## Run Locally

Requires Node.js 20.9 or newer.

```bash
npm install
```

Copy `.env.example` to `.env.local`, then set a MongoDB connection string and `BETTER_AUTH_SECRET` to a random secret. For example:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Google and GitHub sign-in require OAuth credentials. Add each provider's client ID and secret to `.env.local`; configure its callback URL as `http://localhost:3000/api/auth/callback/google` or `http://localhost:3000/api/auth/callback/github`.

The sign-in and sign-up pages also include a shared demo-account button. The demo user is created automatically on its first use, so visitors can try the protected pages without setting up OAuth. Do not use the demo account for private data.

```bash
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Required, private signing secret; use a unique random value in every environment. |
| `BETTER_AUTH_URL` | Public base URL for BetterAuth, such as `http://localhost:3000`. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Optional, comma-separated exact origins to trust in addition to the configured app and Vercel URLs. |
| `MONGODB_URI` | MongoDB connection string used by BetterAuth. `BETTER_AUTH_MONGODB_URI` is accepted as a legacy alias. |
| `MONGODB_DATABASE` | Optional database name; if omitted, MongoDB uses the database from the connection string. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth credentials. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional GitHub OAuth credentials. |
| `BAZARDOR_API_URL` | Optional override for the primary market API base URL. |

The API adapter tries the primary Workers API and its documented alternative, then falls back to the bundled sample catalog if both are unavailable.

## Deployment Notes

Dynamic product and category routes are rendered on demand and can be refreshed directly. Configure all auth environment variables on the hosting platform. For Vercel previews, leave `BETTER_AUTH_URL` unset to use the branch URL automatically, or set it to that preview's exact URL; do not set it to `localhost`. Vercel preview branch and deployment URLs are trusted automatically; add any custom preview alias to `BETTER_AUTH_TRUSTED_ORIGINS` as a comma-separated exact origin (for example, `https://auth-dev.example.com`). The browser auth client uses the current page's origin, so it does not need a separate public app URL. Use a MongoDB deployment that supports transactions when enabling the MongoDB adapter with its client. Google/GitHub OAuth also needs production callback URLs registered with each provider.