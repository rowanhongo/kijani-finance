# Kijani Finance

Low-interest loans for Kenyan farmers and traders, secured by cereals stored in certified warehouses.

- Record stock held in a certified warehouse (cereals only for now)
- Borrow up to 90% of the stock's invoice value over 7, 14 or 30 days
- Receive the advance as stablecoin in a Stellar wallet
- Repay to release the stock; each stock deposit and advance gets a ledger reference so the same harvest cannot be pledged twice
- Kijani assistant chat for borrower questions

Very early MVP. Data is stored in the browser (localStorage) and ledger references are simulated. Interest, Stellar recording and warehouse verification are not implemented yet.

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Run locally

```sh
npm i
npm run dev
```

## Build

```sh
npm run build
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run test` - run tests

## Environment

Copy `.env.example` to `.env` and fill in your keys. Example variables used by this project:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only)
- VITE_SUPABASE_BUCKET (default: recordings)
- VITE_APIFREE_LLM_KEY

Do not commit `.env`. It is ignored by `.gitignore`.

## Deploy (Netlify)

1. In Netlify Dashboard set the environment variables listed above.
	 - For serverless functions add the server-only keys (do NOT prefix with VITE_):
		 - APIFREE_LLM_KEY (apifreellm key)
		 - SUPABASE_SERVICE_ROLE_KEY (Supabase service role key)
		 - SUPABASE_URL (your Supabase project URL)
		 - VITE_SUPABASE_BUCKET (optional, default: recordings)
2. Set the build command to:

```sh
npm run build
```

3. Set the publish directory to `dist`.

Notes: keep service role keys only on server-side functions. The client should use only `VITE_` prefixed variables.
