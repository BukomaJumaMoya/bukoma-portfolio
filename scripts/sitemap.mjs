// Writes public/sitemap.xml from the pages and the project files, so projects
// added in the CMS are listed for search engines on the next deploy.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { siteUrl } = JSON.parse(readFileSync(join(root, 'src/content/profile.json'), 'utf8'))
const projectsDir = join(root, 'src/content/projects')
const slugs = readdirSync(projectsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(projectsDir, f), 'utf8')).slug)

const paths = ['', 'work', 'experience', 'leadership', 'about', 'contact', ...slugs.map((s) => `work/${s}`)]
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${siteUrl}/${p}</loc></url>`).join('\n')}
</urlset>
`
writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`sitemap: ${paths.length} urls`)
