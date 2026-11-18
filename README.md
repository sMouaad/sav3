# SAV3 Corporation Ottawa Ltd — Site Web

Site vitrine bilingue (français par défaut, anglais sous `/en/`) construit avec **[Astro](https://astro.build) 7**.
Il est généré en pages HTML statiques, presque sans JavaScript, et conçu pour **Netlify** (hébergement + Netlify Forms).

| | |
|---|---|
| Pages | Accueil, Services, Demande de soumission (formulaire en 3 étapes), Carrières, Confidentialité, Merci, 404 — en FR et en EN |
| Performance (Lighthouse mobile) | 99 · Accessibilité 100 · Bonnes pratiques 100 · SEO 100 |
| Accessibilité | WCAG 2.2 AA : 0 violation axe-core sur toutes les pages, 6 largeurs d'écran testées (360 → 1440 px) |
| Vie privée | Aucun service tiers : polices, images et scripts servis par le site lui-même ; aucun témoin (cookie) |
| Sécurité | Content-Security-Policy stricte, aucun script ni style en ligne |

---

## Démarrage rapide

Prérequis : **Node.js 22.23.4 ou plus récent** (voir `.nvmrc` ; avec nvm : `nvm use`).

```bash
npm install        # installe les dépendances
npm run dev        # aperçu avec rechargement automatique → http://localhost:4321
npm run build      # génère le site final dans dist/
npm run preview    # sert dist/ localement pour vérifier le build
npm run check      # vérification TypeScript / Astro
```

En local, les formulaires valident les champs mais **n'envoient rien** (un message l'indique) : l'envoi n'existe qu'une fois le site publié sur Netlify.

---

## Où modifier quoi

| Je veux modifier… | Fichier |
|---|---|
| Téléphone, courriel, adresse, approbations, responsable de la confidentialité | **`src/config/site.ts`** |
| Textes en français | `src/i18n/fr.ts` |
| Textes en anglais | `src/i18n/en.ts` (doit avoir exactement la même structure que `fr.ts` — vérifié par TypeScript) |
| Adresses des pages (FR/EN) | `src/i18n/routes.ts` |
| Photos | `src/assets/photos/` (optimisées automatiquement en AVIF/WebP au build) |
| Logo vectoriel, favicon, image de partage | `public/brand/`, `public/favicon.svg`, `public/og-image-fr.jpg`, `public/og-image-en.jpg` |
| Couleurs, typographie, espacements | `src/styles/global.css` (variables CSS en tête de fichier) |
| En-têtes de sécurité, redirections | `public/_headers`, `public/_redirects` |

Les espaces insécables de la typographie française (« : ; ? ! ») et les apostrophes typographiques sont ajoutées automatiquement : écrivez les textes normalement.

### `src/config/site.ts` — les interrupteurs de lancement

Rien n'est inventé sur le site : une valeur `null` n'est jamais affichée.

- `contact.phone`, `contact.email`, `contact.address` — dès qu'ils sont renseignés, ils apparaissent dans l'en-tête, le pied de page, la page de soumission et les données structurées Google.
- `references.partnersApproved` — passer à `true` après l'autorisation écrite de S&I Cleaning et United (retire la mention « à confirmer »). `showPartners: false` masque complètement le bloc.
- `references.showVenueBrands` — `false` remplace « Walmart » et « Metro » par des catégories génériques si l'approbation n'est pas obtenue.
- `privacy.finalized` — passer à `true` quand la politique est validée (retire l'avertissement, autorise l'indexation, ajoute la page au sitemap). Renseigner aussi `privacy.officer` et `privacy.lastUpdated`.

---

## Structure

```
src/
  config/site.ts          ← informations de l'entreprise et interrupteurs de lancement
  i18n/                   ← textes FR/EN, routes, typographie
  layouts/BaseLayout.astro← <head> : SEO, hreflang, Open Graph, JSON-LD
  components/             ← en-tête, pied de page, logo, icônes, sections
    home/                 ← sections de la page d'accueil
    forms/                ← champs et formulaires (Netlify Forms)
  views/                  ← une vue par type de page (partagée FR/EN)
  pages/                  ← routes : FR à la racine, EN dans pages/en/
  scripts/                ← JS : menu mobile, validation et envoi des formulaires
  styles/                 ← système de design et styles des formulaires
public/                   ← fichiers copiés tels quels (logo, icônes, _headers, _redirects)
legacy/                   ← ancienne version HTML statique, conservée pour référence (non publiée)
```

---

## Formulaires (Netlify Forms)

Deux formulaires, **partagés par les versions française et anglaise** :

| Nom Netlify | Page FR | Page EN | Champs |
|---|---|---|---|
| `soumission` | `/soumission/` | `/en/quote/` | type_batiment, service, ville, superficie, frequence, visite, details, nom, entreprise, courriel, telephone, contact_prefere, consentement, langue |
| `candidature` | `/carrieres/` | `/en/careers/` | nom, telephone, courriel, ville, experience, disponibilite[], message, consentement, langue |

- Les **valeurs transmises sont toujours en français**, quelle que soit la langue du visiteur ; le champ `langue` (`fr`/`en`) indique dans quelle langue répondre.
- Protection anti-pourriel : champ piège (honeypot) `bot-field`.
- Avec JavaScript : validation avec messages dans la langue de la page, formulaire en étapes, envoi en arrière-plan, puis redirection vers `/merci/` ou `/en/thank-you/`.
- Sans JavaScript : le formulaire reste complet et fonctionne avec la validation native du navigateur.

---

## Mise en ligne sur Netlify

1. **Créer le site** depuis un dépôt Git (recommandé) : Netlify lit `netlify.toml` (commande `npm run build`, dossier `dist`, Node 22.23.4).
   La variable `URL` fournie par Netlify sert automatiquement d'adresse canonique (balises canonical, hreflang, sitemap, images de partage).
   *Alternative* : `SITE_URL=https://www.votre-domaine.ca npm run build`, puis glisser-déposer le dossier `dist/` sur app.netlify.com/drop.
2. **Site configuration → Forms** : activer la détection des formulaires (*Enable form detection*), puis **redéployer**.
3. **Forms → Form notifications** : ajouter une notification par courriel pour `soumission` et pour `candidature`.
4. **Domain management** : brancher le domaine, définir le domaine principal, vérifier le certificat HTTPS.
5. **Après déploiement**, vérifier :
   - un envoi de test de chaque formulaire, en français **et** en anglais → page de remerciement + courriel reçu ;
   - une adresse inexistante → page 404 (et `/en/xyz` → 404 en anglais) ;
   - `/sitemap.xml` et `/robots.txt` contiennent bien le domaine définitif ;
   - aucune erreur « Content-Security-Policy » dans la console du navigateur ;
   - l'aperçu de partage (par exemple avec l'inspecteur de publication de LinkedIn ou de Facebook).
6. Ensuite : soumettre `/sitemap.xml` dans Google Search Console et créer le profil d'entreprise Google.

> Ajout d'un outil externe (Google Analytics, carte, vidéo, police Web…) : ajoutez son domaine dans `public/_headers`, sinon il sera bloqué, **et** mettez à jour la politique de confidentialité, qui affirme actuellement l'absence de témoins et de ressources tierces.

---

## À finaliser AVANT la publication publique

Ces points relèvent de la direction ; le code est prêt à les recevoir.

1. **Coordonnées** : confirmer le nom commercial exact, le téléphone, le courriel et l'adresse, puis les saisir dans `src/config/site.ts`.
2. **Références** : obtenir l'autorisation écrite de mentionner **S&I Cleaning** et **United**, puis `partnersApproved: true` (ou `showPartners: false`).
3. **Lieux d'intervention** : faire approuver la mention de **Walmart** et **Metro** comme lieux d'intervention (jamais comme clients ni avec leurs logos), sinon `showVenueBrands: false`.
4. **Services** : vérifier que tous les services listés sont réellement offerts (notamment résidentiel et après construction) et que les encadrés « Bon à savoir » décrivent correctement les limites de chaque catégorie.
5. **Confidentialité (Loi 25)** : faire valider la politique (`src/i18n/fr.ts` et `en.ts`, section `privacy`), désigner la personne responsable (`privacy.officer`), les durées de conservation, puis `privacy.finalized: true`.
6. **Photos** : les trois photos actuelles proviennent d'Unsplash (licence Unsplash, usage commercial permis) ; idéalement, les remplacer par des photos réelles des équipes SAV3 dans `src/assets/photos/` en gardant les mêmes noms de fichiers.
7. **Version anglaise** : faire relire les textes anglais avec le même soin que les textes français (même règle : aucune affirmation non vérifiée).
8. **Logo** : le logo a été vectorisé (SVG) à partir de l'image d'origine ; si l'entreprise possède le fichier vectoriel original de son graphiste, le substituer dans `public/brand/`.

## Note commerciale

La formulation évite de laisser croire à une approbation officielle des enseignes citées. Le site n'affirme aucune certification, note, année d'expérience, délai de réponse ou garantie non vérifiés. Conservez cette règle lors de toute modification des textes, dans les deux langues.
