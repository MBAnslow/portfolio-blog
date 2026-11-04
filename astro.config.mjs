import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

const [owner = 'MBAnslow', repository = ''] = (
  process.env.GITHUB_REPOSITORY ?? '/'
).split('/')
const isUserSite = repository.endsWith('.github.io')
const base = repository && !isUserSite ? `/${repository}` : '/'

export default defineConfig({
  site: `https://${owner.toLowerCase()}.github.io`,
  base,
  output: 'static',
  integrations: [react(), sitemap()],
  server: {
    port: 4323,
    host: true,
  },
  vite: {
    server: {
      headers: {
        'Cache-Control': 'no-store',
      },
      watch: {
        // OneDrive does not emit reliable fs events, so Vite otherwise
        // keeps serving stale CSS/JS until a manual restart.
        usePolling: true,
        interval: 150,
      },
    },
  },
})
