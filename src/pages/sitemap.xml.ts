import type { APIRoute } from 'astro';
import { htmlLang, locales, routes, unlistedRoutes, type RouteKey } from '../i18n/routes';
import { site as config } from '../config/site';

/** Sitemap bilingue avec liens hreflang (les pages FR et EN ont des adresses différentes). */
export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('http://localhost:4321')).origin;
  const keys = (Object.keys(routes) as RouteKey[]).filter(
    (key) => !unlistedRoutes.includes(key) && !(key === 'privacy' && !config.privacy.finalized),
  );

  const entries = keys.flatMap((key) =>
    locales.map((lang) => {
      const alternates = locales
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${htmlLang[l]}" href="${origin}${routes[key][l]}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${routes[key].fr}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${origin}${routes[key][lang]}</loc>\n${alternates}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
