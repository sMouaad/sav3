# SAV3 Corporation Ottawa Ltd — Site Web (FR)

Ce dossier est un **site statique complet** à remettre au développeur web pour finalisation et hébergement.

## Fichiers inclus
- `index.html` — accueil, services commerciaux/résidentiels/spécialisés, références d'expérience, FAQ, formulaire de soumission.
- `carrieres.html` — page carrières avec formulaire de candidature spontanée.
- `confidentialite.html` — politique **provisoire** à valider.
- `merci.html` — page de confirmation des formulaires.
- `404.html` — page « introuvable » servie automatiquement par Netlify.
- `styles.css` — identité visuelle responsive SAV3.
- `script.js` — menu, onglets, logique des formulaires en consultation locale.
- `assets/` — logo et icône SAV3.
- `netlify.toml` — configuration Netlify (publication du dossier tel quel, sans build).
- `_headers` — en-têtes de sécurité HTTP (dont une Content-Security-Policy stricte).
- `_redirects` — rend `README.md` et `netlify.toml` inaccessibles au public (ce README contient des notes internes).
- `robots.txt` — autorise l'indexation ; ligne `Sitemap` à compléter une fois le domaine connu.

## Vérifier le rendu
Ouvrez `index.html` dans un navigateur ou servez ce dossier avec un serveur statique local (`python -m http.server 8000`). Les images de décoration sont chargées depuis Unsplash et nécessitent une connexion Internet. Remplacez-les par des photos de l’entreprise ou des photos dont la licence commerciale a été vérifiée.

En local (fichier ou `localhost`), l'envoi d'un formulaire affiche un message explicatif au lieu de tenter l'envoi.

## Mise en ligne et fonctionnement des formulaires
Les formulaires sont écrits pour le traitement des formulaires **Netlify Forms**. Ils ne transmettent **aucun message** lorsqu'on les ouvre localement : il faut publier le site sur un hébergement compatible, vérifier que la détection des formulaires est active et configurer les notifications des soumissions et candidatures vers une adresse e-mail professionnelle. Testez obligatoirement les deux formulaires après déploiement. Sur un autre hébergeur, il faudra créer un service backend ou connecter un fournisseur de formulaires et adapter les formulaires (et reproduire les en-têtes de `_headers`).

### Étapes de déploiement sur Netlify
1. Créer le site : glisser-déposer ce dossier sur app.netlify.com/drop, ou relier un dépôt Git (aucune commande de build, dossier publié : `.`).
2. **Site configuration → Forms** : activer la détection des formulaires (*Enable form detection*), puis **redéployer** pour que `soumission` et `candidature` soient détectés.
3. **Forms → Form notifications** : ajouter une notification e-mail vers l'adresse professionnelle pour chacun des deux formulaires.
4. **Domain management** : brancher le domaine définitif, définir le domaine principal et vérifier que le certificat HTTPS est émis.
5. Après déploiement, vérifier :
   - envoyer un test de chaque formulaire → redirection vers `merci.html` et réception de l'e-mail ;
   - `https://VOTRE-DOMAINE/README.md` renvoie bien une erreur 404 ;
   - une adresse inexistante affiche la page 404 SAV3 ;
   - aucune erreur « Content-Security-Policy » dans la console du navigateur.
6. Si un outil externe est ajouté (analytics, carte, polices), ajouter son domaine dans `_headers`, sinon il sera bloqué.

## À finaliser AVANT publication publique
Ces points dépendent de la direction ou de l'accès aux comptes ; ils ne peuvent pas être réglés dans le code seul.

1. Confirmer auprès de la direction le nom commercial exact, l'adresse professionnelle, le téléphone et le courriel à afficher (ces coordonnées ne sont pas inventées dans le site).
2. Obtenir l'autorisation écrite de mentionner **S&I Cleaning** et **United**, et valider la nature de ces collaborations. Retirer ensuite la mention « à confirmer avant la mise en ligne définitive » de la section Expérience de `index.html`.
3. Faire approuver la mention de **Walmart**, **Metro**, cliniques et bureaux administratifs en tant que lieux d'intervention ; ne pas les transformer en clients directs ni afficher leurs logos sans permission.
4. Vérifier que tous les services indiqués sont effectivement proposés, notamment le nettoyage résidentiel et après construction ; décrire les limites techniques de chaque service.
5. Compléter la page `confidentialite.html` et faire valider les obligations pertinentes, la gestion des données, les coordonnées du responsable et les durées de conservation (notamment Québec / Loi 25 selon l'activité). Retirer ensuite l'encadré « À compléter » et la balise `noindex` de cette page.
6. Vérifier droits et licences des photographies ; remplacer si possible les images de banque par des photos SAV3 (placées dans `assets/`, puis retirer `images.unsplash.com` de `_headers`).
7. Brancher le domaine, HTTPS, les notifications de formulaires, tester mobile et les redirections (voir « Étapes de déploiement »). Une fois le domaine connu : mettre une URL **absolue** dans `og:image` de `index.html`, ajouter `og:url` et `<link rel="canonical">`, créer `sitemap.xml` et compléter `robots.txt`. Ajouter au besoin un profil d'entreprise Google et un suivi d'analytics avec avis de confidentialité approprié.
8. Le site est **uniquement en français** ; une version anglaise nécessite une traduction complète, des liens de changement de langue et des métadonnées localisées.

## Note commerciale
Le site présente une expérience d'intervention dans plusieurs environnements. La formulation a été choisie pour éviter de laisser croire à une approbation officielle des chaînes citées. Il n'affirme pas de certifications, de notes, d'années d'expérience ou de garanties non vérifiées.
