# Site NZO1 Coaching

Landing page de coaching Fortnite pour **NZO1** (analyse du jeu + performance/mental).
Site **statique** (HTML / CSS / JS) — aucun serveur requis, il s'ouvre directement dans un navigateur.

## Lancer le site
Double-clique sur `index.html`, ou ouvre le dossier dans un navigateur.

## Structure
```
index.html            → la page principale
mentions-legales.html → mentions légales + politique de confidentialité (RGPD)
styles.css            → toute la charte graphique
script.js             → planning de réservation, avis, cookies, animations
assets/               → mets ta photo ici : assets/nzo1.jpg
```

## À COMPLÉTER (repéré par un badge orange « À MODIFIER » sur le site)

1. **Ta photo** — dépose ton portrait dans `assets/nzo1.jpg`
   (format portrait conseillé, ~800 × 1000 px). Elle remplace automatiquement le bloc bleu du haut.

2. **Les prix** — dans `index.html`, section « Mes offres ».
   Remplace les `__ €` par tes vrais tarifs et ajuste le détail de chaque formule
   (Découverte / Progression / Élite — tu peux renommer).

3. **Les avis** — section « Ils ont progressé avec moi ».
   Remplace les 3 avis « exemple » par tes vrais retours (prénom + texte).

## Comment ça marche

- **Planning de réservation** : le visiteur choisit un jour (14 jours à l'avance, hors dimanche)
  et un créneau de 30 min (14h → 21h30 par défaut). En validant, **un e-mail pré-rempli**
  s'ouvre vers `nzo1.contact@gmail.com` avec toutes les infos. Tu confirmes ensuite le RDV.
  - Pour changer les horaires : `script.js`, variables `START_HOUR` / `END_HOUR`.
  - Pour ouvrir le dimanche : `script.js`, retire la ligne `if (dow === 0) continue;`.

- **Avis** : quand quelqu'un laisse un avis, il s'affiche tout de suite (dans **son** navigateur)
  ET un e-mail t'est envoyé pour validation. Les avis ne sont pas partagés entre visiteurs
  (site statique). Pour des avis publics et permanents, on pourra brancher plus tard un
  petit service (Google Form, ou un mini back-end).

- **Cookies / RGPD** : aucun traceur. Le bandeau informe simplement et garde le choix du visiteur.

## Passer à un vrai agenda (optionnel, plus tard)
Si tu crées un compte **Calendly**, on remplace le planning maison par ton agenda en temps réel
(intégration en quelques lignes). Le reste du site ne change pas.

## Mise en ligne
Le site peut être hébergé gratuitement (GitHub Pages, Netlify, etc.).
Pense alors à compléter l'**hébergeur** dans `mentions-legales.html`.

---
Réalisé par décoince-toi.
