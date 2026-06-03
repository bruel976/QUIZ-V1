# Design — Système de niveaux pour le Quiz (Sirel976)

Date : 2026-06-03

> **Révision (2026-06-03) — Niveaux à plusieurs parcours.**
> Le modèle a évolué : un **niveau** contient désormais plusieurs **parcours**
> (options de quiz), et l'accueil se fait en **2 étapes** (niveau → parcours).
> - **Niveau 1** → `n1-htmlcss` (HTML/CSS bases, 34 q.) · `n1-js` (JS bases, 16 q.)
> - **Niveau 2** → `n2-js` (Conditions/Boucles/Fonctions, 25 q.) · `n2-htmlcss`
>   (HTML/CSS intermédiaire : Flexbox, Grid, sémantique, accessibilité, 25 q.)
> - Filtrage par `(niveau + catégories)` du parcours → **aucune question à re-tagger** ;
>   le N1 se scinde « gratuitement ». `preparerQuestions(questions, parcours)`.
> - Données pilotées par `NIVEAUX[].parcours[]` dans `src/data/niveaux.js`
>   (+ exports `PARCOURS`, `niveauParId`, `parcoursParId`).
> - `App` porte `niveau` + `parcours` ; `Accueil` gère les 2 étapes (avec
>   « ← Changer de niveau ») ; `Resultats`/`pdf` affichent niveau + parcours.
> - Script d'intégrité : vérifie le **compte par parcours** (34/16/25/25 = 100).
> Les sections ci-dessous décrivent la conception initiale (niveau mono-thème) ;
> la révision ci-dessus prévaut en cas de divergence.

## Objectif

Ajouter un système de **niveaux** au quiz existant (React + Vite).

- **Niveau 1** = le quiz actuel : HTML · CSS · JavaScript (bases) — 50 questions.
- **Niveau 2** = JavaScript : **Conditions**, **Boucles**, **Fonctions** — ~25 questions.

Il n'est **pas** nécessaire de terminer le Niveau 1 pour accéder au Niveau 2.
Au démarrage, l'étudiant **choisit d'abord le niveau** (sur l'écran d'accueil),
puis renseigne son identité.

## Modèle de données

### Nouveau fichier `src/data/niveaux.js`

```js
export const NIVEAUX = [
  {
    id: 1,
    titre: 'Niveau 1',
    theme: 'HTML · CSS · JavaScript (bases)',
    categories: ['HTML', 'CSS', 'JS'],
    nbQuestions: 50,
    description: '17 HTML, 17 CSS, 16 JavaScript (variables & opérateurs).',
  },
  {
    id: 2,
    titre: 'Niveau 2',
    theme: 'JavaScript — Conditions · Boucles · Fonctions',
    categories: ['Conditions', 'Boucles', 'Fonctions'],
    nbQuestions: 25,
    description: 'Conditions, boucles et fonctions en JavaScript.',
  },
]
```

### Questions (`src/data/questions.js`)

- Chaque question reçoit un champ **`niveau: 1 | 2`**.
- Les 50 questions actuelles → `niveau: 1` (catégories HTML/CSS/JS inchangées).
- ~25 nouvelles questions → `niveau: 2`, réparties :
  - **Conditions** (~8) : `if/else`, `switch`, `==` vs `===`, `&&`/`||`, ternaire.
  - **Boucles** (~8) : `for`, `while`, `do...while`, `break`/`continue`, parcours de tableau.
  - **Fonctions** (~9) : déclaration, paramètres, `return`, fonctions fléchées, portée.
- Modèle inchangé : `{ id, niveau, categorie, type, enonce, code, options, correct, explication }`.
- Mélange théorie + bugs à corriger, style cohérent avec l'existant
  (exemples Mayotte/Sirel976 quand c'est naturel).
- `correct` reste stocké **par valeur** (et non par index) pour autoriser le mélange.
- `ORDRE_CATEGORIES` est remplacé par l'ordre porté par chaque niveau (`niveau.categories`).
  L'export `ORDRE_CATEGORIES` peut être conservé pour rétrocompatibilité du Niveau 1.

## Logique (`src/utils/scoring.js`)

- `preparerQuestions(banque, niveau)` :
  - filtre les questions par `q.niveau === niveau.id` ;
  - les ordonne selon `niveau.categories` ;
  - conserve le mélange des options (Fisher-Yates) existant.
- `calculerResultat` **inchangé** : il agrège déjà par `categorie`.
- `mention`, `dateFr` inchangés.

## Parcours

### `src/components/Accueil.jsx`

- Affiche **deux cartes de niveau** (N1 / N2) sélectionnables (radio/cartes cliquables),
  au-dessus de la saisie nom/prénom.
- Le bloc « Avant de commencer » s'adapte au niveau choisi
  (nombre de questions + thèmes via `niveau.description`).
- Le bouton « Commencer » reste **désactivé** tant que le niveau **et**
  l'identité (nom + prénom) ne sont pas renseignés.
- `onDemarrer({ nom, prenom, niveau })` transmet aussi le niveau choisi.

### `src/App.jsx`

- Nouvel état `niveau` (par défaut : Niveau 1 ou `null` jusqu'au choix).
- `demarrer(infos)` enregistre `infos.niveau`.
- `questions` recalculé sur `[tentative, niveau]` via `preparerQuestions(banque, niveau)`.
- `niveau` transmis à `Resultats`.
- `recommencer` réinitialise aussi le niveau (retour à l'accueil pour rechoisir).

### `src/components/Quiz.jsx`

- **Inchangé** : composant générique piloté par les `questions` reçues.

## Résultats & PDF

### `src/components/Resultats.jsx`

- Le sous-titre affiche le niveau passé (ex. « Niveau 2 — Conditions · Boucles · Fonctions »).
- Les badges de catégorie utilisent les nouvelles catégories (`Conditions`, `Boucles`, `Fonctions`).

### `src/utils/pdf.js`

- `genererPDF` reçoit le `niveau` ; l'en-tête du PDF reprend `niveau.theme`
  au lieu du libellé figé « Quiz Jour 1 : HTML · CSS · JavaScript (bases) ».

## Styles (`src/styles/index.css`)

- Styles des **cartes de sélection de niveau** sur l'accueil (état sélectionné inclus).
- Badges de couleur pour `badge-conditions`, `badge-boucles`, `badge-fonctions`
  (cohérents avec la charte Sirel976).

## Hors périmètre (inchangé)

- Algorithme de scoring et note /20.
- Barre de progression.
- Mode examen (aucune correction pendant le quiz).
- Mélange des options.

## Critères de réussite

1. L'accueil impose le choix d'un niveau avant de démarrer.
2. Le Niveau 1 reproduit exactement le quiz actuel (50 questions HTML/CSS/JS).
3. Le Niveau 2 propose ~25 questions Conditions/Boucles/Fonctions.
4. Les résultats et le PDF mentionnent le niveau passé.
5. Le projet démarre sans erreur (`npm run dev`) et se construit (`npm run build`).
