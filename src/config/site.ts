/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONFIGURATION DE L'ENTREPRISE — à valider par la direction avant le lancement
 * ─────────────────────────────────────────────────────────────────────────────
 *  Toutes les informations sensibles ou à confirmer sont regroupées ici.
 *  Une valeur `null` n'est jamais affichée : rien n'est inventé sur le site.
 *  Après modification : `npm run build` (ou un nouveau déploiement Netlify).
 */

export interface PostalAddress {
  street: string;
  city: string;
  region: string; // ex. 'ON' ou 'QC'
  postalCode: string;
  country: string; // ex. 'CA'
}

export interface PrivacyOfficer {
  name: string;
  title: string;
  email: string;
}

export const site = {
  legalName: 'SAV3 Corporation Ottawa Ltd',
  shortName: 'SAV3',
  motto: ['Power', 'Passion', 'Integrity'] as const,

  /** TEMPORARY MAINTENANCE NOTICE - remove after update (src/components/MaintenanceNotice.astro). false = avis masqué. */
  maintenanceNotice: true,
  areaServed: ['Ottawa', 'Gatineau'] as const,

  /** Coordonnées publiques — À CONFIRMER (README, point 1). */
  contact: {
    /** Format affiché tel quel, ex. '613 555-0123'. */
    phone: null as string | null,
    email: null as string | null,
    address: null as PostalAddress | null,
  },

  /** Références d'expérience (README, points 2 et 3). */
  references: {
    /** Afficher les collaborations S&I Cleaning et United. */
    showPartners: true,
    /** Passer à true une fois l'autorisation écrite obtenue : retire la mention « à confirmer ». */
    partnersApproved: false,
    /** false = remplace « Walmart » et « Metro » par des catégories génériques si l'approbation n'est pas obtenue. */
    showVenueBrands: true,
  },

  /** Politique de confidentialité (README, point 5). */
  privacy: {
    /** Passer à true quand la politique est validée : retire l'encadré « à compléter » et autorise l'indexation. */
    finalized: false,
    /** Personne responsable de la protection des renseignements personnels (Loi 25). */
    officer: null as PrivacyOfficer | null,
    /** Date de dernière mise à jour affichée (AAAA-MM-JJ). */
    lastUpdated: '2026-11-05',
  },
};

export type Site = typeof site;

/** Lien tel: à partir du numéro affiché. */
export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')}`;
