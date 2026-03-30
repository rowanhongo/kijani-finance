# SHERIA

Legal practice management — matters, documents, calendar, timesheets, and AI chat.

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

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm run test` — run tests

## Environment

Copy `.env.example` to `.env` and fill in your keys. Example variables used by this project:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only)
- VITE_SUPABASE_BUCKET (default: recordings)
- VITE_APIFREE_LLM_KEY

Do not commit `.env` — it is ignored by `.gitignore`.

## Deploy (Netlify)

1. In Netlify Dashboard set the environment variables listed above.
2. Set the build command to:

```sh
npm run build
```

3. Set the publish directory to `dist`.

Notes: keep service role keys only on server-side functions. The client should use only `VITE_` prefixed variables.
