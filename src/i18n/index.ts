import { fr as frRaw, type Dictionary } from './fr';
import { en as enRaw } from './en';
import type { Lang } from './routes';

/**
 * Typographie appliquée une seule fois au chargement, sur tout le dictionnaire :
 * - apostrophe typographique (’) dans les deux langues ;
 * - en français : espace insécable avant « : ; ? ! », à l'intérieur des guillemets et dans les nombres (8 000).
 * Les champs `value` (valeurs transmises par les formulaires) ne sont jamais modifiés.
 */
const NBSP = ' ';
const NNBSP = ' ';

const apostrophes = (s: string) => s.replace(/(\p{L})'(\p{L})/gu, '$1’$2');

const frenchTypography = (s: string) =>
  apostrophes(s)
    .replace(/ ([:;?!»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) (\d{3})\b/g, `$1${NNBSP}$2`);

function deepMap<T>(value: T, fn: (s: string) => string, key?: string): T {
  if (typeof value === 'string') return (key === 'value' ? value : fn(value)) as T;
  if (Array.isArray(value)) return value.map((v) => deepMap(v, fn)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepMap(v, fn, k)])) as T;
  }
  return value;
}

const dictionaries: Record<Lang, Dictionary> = {
  fr: deepMap(frRaw, frenchTypography),
  en: deepMap(enRaw, apostrophes),
};

export const useT = (lang: Lang) => dictionaries[lang];
export type { Dictionary };
