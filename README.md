# Bukoma Juma Moya — portfolio

React 19, TypeScript, Tailwind CSS 4, Motion and React Router 7, built with Vite. Live at https://bukomajumamoya.vercel.app.

## Editing content (no code)

Go to **https://bukomajumamoya.vercel.app/admin** and sign in with a GitHub access token (see below).

| Section | What you edit |
| --- | --- |
| Projects | Every project and its case study. Add, remove, reorder, feature on the home page. |
| Site content → Profile and contact | Name, role, availability, contact details, CV, portrait, socials, principles |
| Site content → Page headlines | The headline and intro on each page, and the footer line |
| Site content → Home page model | The Devices / Services / Data layers in the opening section |
| Site content → Experience | Roles and the full timeline |
| Site content → Stack and skills | Skill areas, skills with evidence, and what you'd rather not do |
| Site content → Leadership and speaking | Progression, lessons, service, talks and formats |
| Site content → About and working together | Ways to work together and how an engagement runs |

**Publishing:** saving in the editor commits the change to this repository. Vercel rebuilds and the site updates in about a minute. If a change ever breaks the build, the live site stays on the previous version, and the change can be undone from the repository history.

**Images and files** uploaded in the editor go to `public/uploads/`.

### Signing in

1. On GitHub: Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
2. Repository access: only `BukomaJumaMoya/bukoma-portfolio`. Permissions: **Contents: Read and write**.
3. In the editor, choose **Sign In Using Access Token** and paste it. The browser remembers it until you sign out.

## Developing

```bash
npm install
npm run dev       # http://localhost:4321 (the editor is at /admin/index.html)
npm run build     # sitemap + type-check + production build into dist/
npm run lint      # type-check + formatting check
npm run format    # format everything with Prettier
```

Content lives in `src/content/` as JSON. `src/data/` loads and types it; components never hold content. The editor's fields are defined in `public/admin/config.yml`; keep it in step with the JSON when adding a new kind of content.

## Contact form

Set `VITE_CONTACT_ENDPOINT` in Vercel (see `.env.example`) to a Formspree-compatible endpoint to receive messages directly. Without it, the form opens the visitor's email app with the message already written.

## Design system

The site is drawn like a set of engineering drawings: each project's architecture is a single-line schematic (`components/Schematic.tsx`), and facts sit in title blocks (`TitleBlock` in `components/ui.tsx`). Pages use a 12-column grid with sticky side-heads (`Section`). Colour tokens are in `src/index.css`.

Motion is reserved for the opening sequence, the schematic pulse, and responses to what the visitor does. Everything respects `prefers-reduced-motion`.

## Deploying

Pushes to `main` deploy to production on Vercel. `vercel.json` pins the build settings, routes `/admin` to the editor, redirects the previous site's URLs permanently, and caches hashed assets for a year.
