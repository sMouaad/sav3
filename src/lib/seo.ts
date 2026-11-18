import { site } from '../config/site';
import { htmlLang, routes, type Lang } from '../i18n/routes';

/** Données structurées schema.org (JSON-LD). Aucune donnée non confirmée n'est ajoutée. */

export function organizationLd(lang: Lang, origin: string, description: string) {
  const { phone, email, address } = site.contact;
  return {
    '@context': 'https://schema.org',
    '@type': 'CleaningService',
    '@id': `${origin}/#organization`,
    name: site.legalName,
    alternateName: site.shortName,
    url: new URL(routes.home[lang], origin).href,
    logo: `${origin}/icon-512.png`,
    image: `${origin}/og-image-${lang}.jpg`,
    description,
    slogan: site.motto.join(' • '),
    areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })),
    availableLanguage: [htmlLang.fr, htmlLang.en],
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: address.street,
            addressLocality: address.city,
            addressRegion: address.region,
            postalCode: address.postalCode,
            addressCountry: address.country,
          },
        }
      : {}),
  };
}

export function websiteLd(lang: Lang, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: new URL(routes.home[lang], origin).href,
    name: site.legalName,
    inLanguage: htmlLang[lang],
    publisher: { '@id': `${origin}/#organization` },
  };
}

export function breadcrumbLd(items: { name: string; href: string }[], origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.href, origin).href,
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
