# Amid Hassan, portfolio (orbit)

Next.js (App Router), TypeScript and Three.js. A scroll-driven exoplanet scene with an orbiting spaceship.

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # static site in out/
```

## Edit the content
Everything lives in `lib/content.ts` (commits, projects, skills, TOEFL, links).
The 3D scene is `components/SpaceScene.tsx` and its shaders are in `lib/shaders.ts`. Resume files are in `public/`.

## Deploy
- Vercel: import the GitHub repo, no settings needed.
- GitHub Pages: push `out/` (or use an Actions workflow). If the site lives at
  `username.github.io/repo`, add `basePath: '/repo'` to `next.config.mjs`.
# portfolio-website-orbit
