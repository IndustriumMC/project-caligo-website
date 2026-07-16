# Project Caligo website

A compact static landing page for Mirage, Project Caligo's Minecraft server meshing technology.

## Run locally

```bash
npm run dev
```

Then open `http://localhost:4173`.

## Production build

```bash
npm run build
npm start
```

The production-ready static site is generated in `dist/`. The build has no external dependencies.

## Deploy to Vercel

1. Import this Git repository into Vercel.
2. Keep the configuration detected from `vercel.json`:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy the project.

Vercel will serve the site as static files and apply the cache and security headers defined in `vercel.json`.

## Connect a custom domain

1. Open the Vercel project and go to **Settings > Domains**.
2. Add the apex domain, such as `projectcaligo.com`.
3. Add the `www` domain as well if it will be used.
4. Apply the DNS records Vercel displays at the domain registrar.
5. Choose the preferred domain in Vercel and redirect the other hostname to it.

Vercel provisions and renews HTTPS automatically after the DNS records have propagated.

## Before publishing

Replace the `contact@projectcaligo.com` email address in `index.html` if the public contact address is different.
