# Vanilla 🍦

Vanilla is a feminine, modern recipe management application built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

- Personalized home screen with category browsing
- Ingredient-based discovery flow
- Recipe listing and detail pages
- Favorites and profile areas
- Create recipe form layout
- Responsive mobile navigation
- Supabase-ready architecture and environment setup

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase

## Local setup

1. Copy `.env.example` to `.env`.
2. Add your Supabase values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Install dependencies:

```bash
npm install
```

4. Run the app:

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Deployment on Vercel

1. Import the project into Vercel.
2. Set the two Supabase environment variables.
3. Ensure SPA routing is configured using a rewrite to `index.html`.
4. Deploy.

## Notes

This project is structured as a polished front-end foundation and includes Supabase-ready integration points for auth, storage, and database access.
