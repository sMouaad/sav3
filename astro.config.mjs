// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Adresse publique du site, utilisée pour les URL canoniques, les balises hreflang,
 * les images de partage (Open Graph) et le sitemap.
 * - Sur Netlify (déploiement Git ou CLI), la variable URL est fournie automatiquement.
 * - Pour un build local destiné à la production, définissez SITE_URL (ex. SITE_URL=https://www.exemple.ca npm run build).
 */
const site = process.env.SITE_URL || process.env.URL || 'http://localhost:4321';

if (!process.env.SITE_URL && !process.env.URL && process.argv.includes('build')) {
  console.warn('\n⚠  SITE_URL non défini : les URL canoniques et le sitemap pointeront vers http://localhost:4321.\n');
}

export default defineConfig({
  site,
  trailingSlash: 'always',
  server: {
    // Domaines de tunnel autorisés pour partager un aperçu local (npm run dev / npm run preview).
    // N'a aucun effet sur le site publié sur Netlify.
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.app'],
  },
  build: {
    format: 'directory',
    // Feuilles de style toujours externes : compatible avec la Content-Security-Policy stricte (style-src 'self').
    inlineStylesheets: 'never',
  },
  vite: {
    // `npm run preview` utilise le serveur d'aperçu de Vite, qui a sa propre liste d'hôtes autorisés.
    preview: {
      allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.app'],
    },
    build: {
      // Aucun fichier intégré en data: URI ; tout est servi depuis le domaine du site.
      assetsInlineLimit: 0,
    },
  },
});
