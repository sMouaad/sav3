export const locales = ['fr', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'fr';

export const htmlLang: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA' };
export const ogLocale: Record<Lang, string> = { fr: 'fr_CA', en: 'en_CA' };

/** Chemins de chaque page dans chaque langue. Les pages FR sont à la racine, les pages EN sous /en/. */
export const routes = {
  home: { fr: '/', en: '/en/' },
  services: { fr: '/services/', en: '/en/services/' },
  quote: { fr: '/soumission/', en: '/en/quote/' },
  careers: { fr: '/carrieres/', en: '/en/careers/' },
  privacy: { fr: '/confidentialite/', en: '/en/privacy/' },
  thanks: { fr: '/merci/', en: '/en/thank-you/' },
  notFound: { fr: '/404/', en: '/en/404/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

export const path = (key: RouteKey, lang: Lang, hash?: string) => routes[key][lang] + (hash ? `#${hash}` : '');

export const otherLang = (lang: Lang): Lang => (lang === 'fr' ? 'en' : 'fr');

/** Pages exclues du sitemap (confirmation, erreurs). */
export const unlistedRoutes: RouteKey[] = ['thanks', 'notFound'];
