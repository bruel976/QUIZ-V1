# Système de niveaux du Quiz — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un choix de niveau au quiz : Niveau 1 (HTML/CSS/JS, existant) et Niveau 2 (JavaScript : Conditions, Boucles, Fonctions), sélectionnable sur l'écran d'accueil.

**Architecture:** Les niveaux sont décrits comme données (`src/data/niveaux.js`). Chaque question porte un champ `niveau`. La préparation des questions filtre/ordonne par niveau. L'accueil pilote le choix du niveau et le transmet à l'app, aux résultats et au PDF. Le composant Quiz et le scoring restent inchangés (ils sont génériques).

**Tech Stack:** React 18, Vite 5, jsPDF, ES Modules.

> ⚠️ **Consigne projet : ne JAMAIS committer.** Toutes les étapes « Checkpoint » ci-dessous indiquent un point de vérification. **L'utilisateur committe lui-même** quand il le souhaite — aucune commande `git commit` dans ce plan.

> ℹ️ **Tests :** le projet n'a pas de framework de test. La vérification automatisée se fait via un script Node de contrôle d'intégrité des données (Tâche 5) + le build Vite (Tâche 11). Les composants React se vérifient via `npm run dev` (Tâche 11).

---

## Structure des fichiers

| Fichier | Rôle | Action |
|---|---|---|
| `src/data/niveaux.js` | Définition des 2 niveaux | **Créer** |
| `src/data/questions.js` | Banque de questions + champ `niveau` + 25 questions N2 | **Modifier** |
| `src/utils/scoring.js` | `preparerQuestions(banque, niveau)` | **Modifier** |
| `scripts/verifier-donnees.mjs` | Contrôle d'intégrité des données | **Créer** |
| `src/App.jsx` | État `niveau`, propagation | **Modifier** |
| `src/components/Accueil.jsx` | Sélection du niveau + identité | **Modifier** |
| `src/components/Resultats.jsx` | Affichage du niveau | **Modifier** |
| `src/utils/pdf.js` | Thème du niveau dans l'en-tête | **Modifier** |
| `src/styles/index.css` | Cartes de niveau + badges | **Modifier** |

---

### Task 1 : Créer la définition des niveaux

**Files:**
- Create: `src/data/niveaux.js`

- [ ] **Step 1 : Écrire `src/data/niveaux.js`**

```js
// =============================================================
//  Définition des NIVEAUX du quiz (Sirel976)
//  Chaque niveau liste ses catégories dans l'ordre d'affichage.
// =============================================================

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
    description: 'Conditions (if/else, switch), boucles (for, while) et fonctions.',
  },
]

// Retrouve un niveau par son identifiant (ou null).
export function niveauParId(id) {
  return NIVEAUX.find((n) => n.id === id) ?? null
}
```

- [ ] **Step 2 : Checkpoint** — fichier créé, exports `NIVEAUX` et `niveauParId`.

---

### Task 2 : Ajouter le champ `niveau: 1` aux questions existantes

**Files:**
- Modify: `src/data/questions.js`

- [ ] **Step 1 : Mettre à jour le commentaire d'en-tête**

Dans le bloc commentaire du modèle de données (haut du fichier), ajouter la ligne `niveau` :

```js
//  {
//    id          : identifiant unique
//    niveau      : 1 | 2   (niveau auquel appartient la question)
//    categorie   : "HTML" | "CSS" | "JS" | "Conditions" | "Boucles" | "Fonctions"
//    type        : "theorie" | "bug"
//    enonce      : la question posée
//    code        : extrait de code à afficher (ou null)
//    options     : 4 réponses possibles
//    correct     : la BONNE réponse (doit être présente dans options)
//    explication : correction pédagogique affichée à la fin
//  }
```

- [ ] **Step 2 : Ajouter `niveau: 1` à chaque question existante**

Chaque objet question existant doit recevoir `niveau: 1,` juste après l'`id`. Exemple :

```js
  {
    id: 'html-01',
    niveau: 1,
    categorie: 'HTML',
    ...
  },
```

Appliquer ce changement à **toutes les 50 questions** (html-*, css-*, js-*).
Astuce : la ligne `id: '...',` est suivie de `categorie:` — insérer `niveau: 1,` entre les deux pour chaque question.

- [ ] **Step 3 : Vérifier visuellement**

Run: `grep -c "niveau: 1," src/data/questions.js`
Expected: `50`

- [ ] **Step 4 : Checkpoint** — les 50 questions portent `niveau: 1`.

---

### Task 3 : Ajouter les 25 questions du Niveau 2

**Files:**
- Modify: `src/data/questions.js`

- [ ] **Step 1 : Insérer les 25 questions avant le `]` fermant du tableau `questions`**

Ajouter ce bloc juste après la dernière question (`js-16`) et **avant** le `]` qui ferme `export const questions = [`.

```js
  // ============================================================
  //  NIVEAU 2 — Conditions (8)
  // ============================================================
  {
    id: 'cond-01',
    niveau: 2,
    categorie: 'Conditions',
    type: 'theorie',
    enonce: 'Quel opérateur teste l’égalité STRICTE (même valeur ET même type) ?',
    code: null,
    options: ['===', '==', '=', '!='],
    correct: '===',
    explication: '=== compare la valeur ET le type sans conversion. == convertit les types, = est une affectation.',
  },
  {
    id: 'cond-02',
    niveau: 2,
    categorie: 'Conditions',
    type: 'theorie',
    enonce: 'Dans un switch, quel mot-clé arrête l’exécution d’un cas ?',
    code: 'switch (jour) {\n  case "lundi":\n    console.log("Début");\n    ___;\n}',
    options: ['break', 'stop', 'exit', 'return'],
    correct: 'break',
    explication: 'break sort du switch. Sans lui, l’exécution « tombe » dans les cas suivants (fall-through).',
  },
  {
    id: 'cond-03',
    niveau: 2,
    categorie: 'Conditions',
    type: 'bug',
    enonce: 'Pourquoi cette condition est-elle TOUJOURS vraie ?',
    code: 'let age = 15;\nif (age = 18) {\n  console.log("Majeur");\n}',
    options: [
      'On a utilisé = (affectation) au lieu de == ou ===',
      'age vaut bien 18 dès le départ',
      'if ne fonctionne pas avec les nombres',
      'Il manque un point-virgule',
    ],
    correct: 'On a utilisé = (affectation) au lieu de == ou ===',
    explication: 'age = 18 affecte 18 à age et renvoie 18 (valeur « truthy »). Il faut age === 18 pour comparer.',
  },
  {
    id: 'cond-04',
    niveau: 2,
    categorie: 'Conditions',
    type: 'theorie',
    enonce: 'Que renvoie cette expression ?',
    code: '5 > 3 && 2 > 4',
    options: ['false', 'true', 'undefined', 'Erreur'],
    correct: 'false',
    explication: '&& (ET) exige les DEUX côtés vrais. 5 > 3 est vrai mais 2 > 4 est faux → false.',
  },
  {
    id: 'cond-05',
    niveau: 2,
    categorie: 'Conditions',
    type: 'theorie',
    enonce: 'Que contient resultat si note vaut 8 ?',
    code: 'let note = 8;\nlet resultat = (note >= 10) ? "Admis" : "Recalé";',
    options: ['"Recalé"', '"Admis"', 'true', 'undefined'],
    correct: '"Recalé"',
    explication: 'L’opérateur ternaire : condition ? siVrai : siFaux. note >= 10 est faux → "Recalé".',
  },
  {
    id: 'cond-06',
    niveau: 2,
    categorie: 'Conditions',
    type: 'theorie',
    enonce: 'Que renvoie cette comparaison ?',
    code: '"5" == 5',
    options: ['true', 'false', 'Erreur', 'undefined'],
    correct: 'true',
    explication: '== convertit les types avant de comparer : "5" devient 5, donc l’égalité est vraie.',
  },
  {
    id: 'cond-07',
    niveau: 2,
    categorie: 'Conditions',
    type: 'theorie',
    enonce: 'Que renvoie cette comparaison stricte ?',
    code: '"5" === 5',
    options: ['false', 'true', 'Erreur', 'undefined'],
    correct: 'false',
    explication: '=== ne convertit pas : une chaîne ("5") et un nombre (5) sont de types différents → false.',
  },
  {
    id: 'cond-08',
    niveau: 2,
    categorie: 'Conditions',
    type: 'theorie',
    enonce: 'Qu’affiche ce code si h vaut 14 ?',
    code: 'let h = 14;\nif (h < 12) {\n  console.log("Matin");\n} else if (h < 18) {\n  console.log("Après-midi");\n} else {\n  console.log("Soir");\n}',
    options: ['"Après-midi"', '"Matin"', '"Soir"', 'rien'],
    correct: '"Après-midi"',
    explication: 'h < 12 est faux, h < 18 est vrai → "Après-midi". Le else final n’est pas atteint.',
  },

  // ============================================================
  //  NIVEAU 2 — Boucles (8)
  // ============================================================
  {
    id: 'bcl-01',
    niveau: 2,
    categorie: 'Boucles',
    type: 'theorie',
    enonce: 'Combien de fois cette boucle s’exécute-t-elle ?',
    code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
    options: ['5', '4', '6', 'à l’infini'],
    correct: '5',
    explication: 'i va de 0 à 4 (tant que i < 5) : 0, 1, 2, 3, 4 → 5 itérations.',
  },
  {
    id: 'bcl-02',
    niveau: 2,
    categorie: 'Boucles',
    type: 'theorie',
    enonce: 'Que fait l’instruction break dans une boucle ?',
    code: null,
    options: [
      'Elle sort immédiatement de la boucle',
      'Elle passe à l’itération suivante',
      'Elle recommence la boucle au début',
      'Elle met la boucle en pause',
    ],
    correct: 'Elle sort immédiatement de la boucle',
    explication: 'break interrompt complètement la boucle. Pour seulement sauter une itération, on utilise continue.',
  },
  {
    id: 'bcl-03',
    niveau: 2,
    categorie: 'Boucles',
    type: 'theorie',
    enonce: 'Que fait l’instruction continue dans une boucle ?',
    code: null,
    options: [
      'Elle passe directement à l’itération suivante',
      'Elle sort de la boucle',
      'Elle arrête le programme',
      'Elle inverse l’ordre de la boucle',
    ],
    correct: 'Elle passe directement à l’itération suivante',
    explication: 'continue saute le reste du corps et passe au tour suivant. break, lui, sort de la boucle.',
  },
  {
    id: 'bcl-04',
    niveau: 2,
    categorie: 'Boucles',
    type: 'bug',
    enonce: 'Pourquoi cette boucle ne s’arrête JAMAIS ?',
    code: 'let i = 0;\nwhile (i < 3) {\n  console.log(i);\n}',
    options: [
      'On n’incrémente jamais i (i++ manquant)',
      'while ne fonctionne pas avec <',
      'i ne devrait pas commencer à 0',
      'Il manque les accolades',
    ],
    correct: 'On n’incrémente jamais i (i++ manquant)',
    explication: 'i reste à 0, donc i < 3 est toujours vrai. Il faut ajouter i++ dans le corps de la boucle.',
  },
  {
    id: 'bcl-05',
    niveau: 2,
    categorie: 'Boucles',
    type: 'theorie',
    enonce: 'Au minimum, combien de fois s’exécute le corps d’une boucle do...while ?',
    code: 'do {\n  console.log("au moins une fois");\n} while (condition);',
    options: ['1', '0', 'à l’infini', 'impossible à savoir'],
    correct: '1',
    explication: 'do...while teste la condition APRÈS le corps : il s’exécute donc au moins une fois.',
  },
  {
    id: 'bcl-06',
    niveau: 2,
    categorie: 'Boucles',
    type: 'theorie',
    enonce: 'Combien de lignes ce code affiche-t-il ?',
    code: 'let fruits = ["mangue", "banane", "papaye"];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}',
    options: ['3', '2', '4', '0'],
    correct: '3',
    explication: 'fruits.length vaut 3 ; la boucle affiche chaque élément : mangue, banane, papaye.',
  },
  {
    id: 'bcl-07',
    niveau: 2,
    categorie: 'Boucles',
    type: 'theorie',
    enonce: 'Que vaut total à la fin de ce code ?',
    code: 'let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}',
    options: ['6', '3', '5', '9'],
    correct: '6',
    explication: 'total accumule 1 + 2 + 3 = 6 (i va de 1 à 3 inclus).',
  },
  {
    id: 'bcl-08',
    niveau: 2,
    categorie: 'Boucles',
    type: 'bug',
    enonce: 'Pourquoi ce code n’affiche-t-il RIEN ?',
    code: 'for (let i = 0; i > 5; i++) {\n  console.log(i);\n}',
    options: [
      'La condition i > 5 est fausse dès le départ (i vaut 0)',
      'Il faut écrire i++ avant la condition',
      'for n’accepte pas l’opérateur >',
      'i n’est pas défini',
    ],
    correct: 'La condition i > 5 est fausse dès le départ (i vaut 0)',
    explication: 'La boucle teste i > 5 avant le 1er tour : 0 > 5 est faux, le corps n’est jamais exécuté. Il fallait i < 5.',
  },

  // ============================================================
  //  NIVEAU 2 — Fonctions (9)
  // ============================================================
  {
    id: 'fct-01',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'theorie',
    enonce: 'Quel mot-clé déclare une fonction classique en JavaScript ?',
    code: null,
    options: ['function', 'func', 'def', 'fonction'],
    correct: 'function',
    explication: 'On déclare avec le mot-clé function (ex. : function saluer() {}).',
  },
  {
    id: 'fct-02',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'theorie',
    enonce: 'Que renvoie une fonction qui n’a pas d’instruction return ?',
    code: 'function rien() {\n  let x = 5;\n}',
    options: ['undefined', 'null', '0', 'une erreur'],
    correct: 'undefined',
    explication: 'Sans return, une fonction renvoie undefined par défaut.',
  },
  {
    id: 'fct-03',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'theorie',
    enonce: 'Que vaut double(4) ?',
    code: 'const double = (n) => n * 2;',
    options: ['8', '4', '"44"', 'undefined'],
    correct: '8',
    explication: 'Fonction fléchée sans accolades : la valeur de n * 2 est renvoyée automatiquement → 8.',
  },
  {
    id: 'fct-04',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'theorie',
    enonce: 'Que renvoie saluer("Sira") ?',
    code: 'function saluer(prenom) {\n  return "Bonjour " + prenom;\n}',
    options: ['"Bonjour Sira"', '"Bonjour prenom"', '"Bonjour "', 'undefined'],
    correct: '"Bonjour Sira"',
    explication: 'L’argument "Sira" remplace le paramètre prenom : "Bonjour " + "Sira" = "Bonjour Sira".',
  },
  {
    id: 'fct-05',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'bug',
    enonce: 'Que vaut r, et pourquoi ?',
    code: 'function addition(a, b) {\n  a + b;\n}\nlet r = addition(2, 3);',
    options: ['undefined (il manque return)', '5', '"5"', 'une erreur'],
    correct: 'undefined (il manque return)',
    explication: 'Le résultat a + b est calculé mais jamais renvoyé. Il faut écrire return a + b;.',
  },
  {
    id: 'fct-06',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'theorie',
    enonce: 'Comment APPELLE-t-on une fonction nommée demarrer ?',
    code: null,
    options: ['demarrer()', 'demarrer', 'call demarrer', 'run demarrer()'],
    correct: 'demarrer()',
    explication: 'On exécute une fonction en ajoutant les parenthèses : demarrer(). Sans elles, on désigne la fonction sans l’exécuter.',
  },
  {
    id: 'fct-07',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'theorie',
    enonce: 'Que se passe-t-il à la dernière ligne ?',
    code: 'function f() {\n  let x = 10;\n}\nconsole.log(x);',
    options: [
      'Erreur : x n’existe pas en dehors de la fonction',
      'Affiche 10',
      'Affiche undefined',
      'Affiche null',
    ],
    correct: 'Erreur : x n’existe pas en dehors de la fonction',
    explication: 'x est local à f() (portée de bloc). En dehors, x n’est pas défini → ReferenceError.',
  },
  {
    id: 'fct-08',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'theorie',
    enonce: 'Que renvoie aire(3, 4) ?',
    code: 'function aire(largeur, hauteur) {\n  return largeur * hauteur;\n}',
    options: ['12', '7', '"34"', 'undefined'],
    correct: '12',
    explication: 'Deux paramètres : largeur = 3, hauteur = 4 → 3 * 4 = 12.',
  },
  {
    id: 'fct-09',
    niveau: 2,
    categorie: 'Fonctions',
    type: 'bug',
    enonce: 'Que renvoie carre(5) ?',
    code: 'const carre = (n) => { n * n; };',
    options: ['undefined (return manquant dans les accolades)', '25', '5', 'une erreur'],
    correct: 'undefined (return manquant dans les accolades)',
    explication: 'Avec des accolades { }, une fonction fléchée a besoin d’un return explicite. Ici il manque → undefined.',
  },
```

- [ ] **Step 2 : Vérifier le nombre de questions N2**

Run: `grep -c "niveau: 2," src/data/questions.js`
Expected: `25`

- [ ] **Step 3 : Checkpoint** — 25 questions N2 ajoutées (8 Conditions, 8 Boucles, 9 Fonctions).

---

### Task 4 : Adapter `preparerQuestions` au niveau

**Files:**
- Modify: `src/utils/scoring.js:5` (import) et `src/utils/scoring.js:20-28` (fonction)

- [ ] **Step 1 : Retirer l’import devenu inutile**

Supprimer la ligne :
```js
import { ORDRE_CATEGORIES } from '../data/questions.js'
```

- [ ] **Step 2 : Remplacer `preparerQuestions`**

Remplacer la fonction existante par :

```js
// Prépare les questions d'un NIVEAU pour une tentative :
//  - ne garde que les questions du niveau (q.niveau === niveau.id)
//  - ordonne selon l'ordre des catégories du niveau (niveau.categories)
//  - mélange l'ordre des options de chaque question
export function preparerQuestions(questions, niveau) {
  const parCategorie = niveau.categories.flatMap((cat) =>
    questions.filter((q) => q.niveau === niveau.id && q.categorie === cat),
  )
  return parCategorie.map((q) => ({
    ...q,
    options: melanger(q.options),
  }))
}
```

- [ ] **Step 3 : Checkpoint** — `preparerQuestions` prend `(questions, niveau)` et n’importe plus `ORDRE_CATEGORIES`.

---

### Task 5 : Script de vérification des données (test automatisé)

**Files:**
- Create: `scripts/verifier-donnees.mjs`

- [ ] **Step 1 : Écrire le script**

```js
// =============================================================
//  Contrôle d'intégrité de la banque de questions.
//  Lancer : node scripts/verifier-donnees.mjs
// =============================================================

import { questions } from '../src/data/questions.js'
import { NIVEAUX } from '../src/data/niveaux.js'

let erreurs = 0
const check = (cond, msg) => {
  if (!cond) {
    console.error('✗', msg)
    erreurs++
  }
}

const idsVus = new Set()
for (const q of questions) {
  check(!idsVus.has(q.id), `id dupliqué : ${q.id}`)
  idsVus.add(q.id)
  check([1, 2].includes(q.niveau), `${q.id} : niveau invalide (${q.niveau})`)
  check(
    Array.isArray(q.options) && q.options.length === 4,
    `${q.id} : doit avoir exactement 4 options`,
  )
  check(q.options.includes(q.correct), `${q.id} : 'correct' absent des options`)
  const niv = NIVEAUX.find((n) => n.id === q.niveau)
  check(
    niv && niv.categories.includes(q.categorie),
    `${q.id} : catégorie « ${q.categorie} » hors du niveau ${q.niveau}`,
  )
}

for (const n of NIVEAUX) {
  const nb = questions.filter((q) => q.niveau === n.id).length
  console.log(`Niveau ${n.id} (${n.theme}) : ${nb} questions`)
}

const n1 = questions.filter((q) => q.niveau === 1).length
const n2 = questions.filter((q) => q.niveau === 2).length
check(n1 === 50, `Niveau 1 doit avoir 50 questions (trouvé ${n1})`)
check(n2 >= 24 && n2 <= 26, `Niveau 2 doit avoir ~25 questions (trouvé ${n2})`)

if (erreurs) {
  console.error(`\n${erreurs} erreur(s) détectée(s).`)
  process.exit(1)
}
console.log('\n✓ Données valides.')
```

- [ ] **Step 2 : Lancer le script**

Run: `node scripts/verifier-donnees.mjs`
Expected: affichage des comptes (Niveau 1 : 50, Niveau 2 : 25) puis `✓ Données valides.` (code de sortie 0)

- [ ] **Step 3 : Checkpoint** — intégrité des données validée automatiquement.

---

### Task 6 : Propager le niveau dans `App.jsx`

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1 : Mettre à jour les imports et l’état**

Remplacer l’en-tête du composant. Ajouter l’import et l’état `niveau`, et adapter `useMemo` :

```jsx
import { useState, useMemo } from 'react'
import { questions as banque } from './data/questions.js'
import { preparerQuestions, calculerResultat } from './utils/scoring.js'
import Accueil from './components/Accueil.jsx'
import Quiz from './components/Quiz.jsx'
import Resultats from './components/Resultats.jsx'

// Les trois étapes du wizard
const ETAPES = { ACCUEIL: 'accueil', QUIZ: 'quiz', RESULTATS: 'resultats' }

export default function App() {
  const [etape, setEtape] = useState(ETAPES.ACCUEIL)
  const [etudiant, setEtudiant] = useState({ nom: '', prenom: '' })
  const [niveau, setNiveau] = useState(null) // niveau choisi sur l'accueil
  const [reponses, setReponses] = useState({}) // { [idQuestion]: valeur }
  const [tentative, setTentative] = useState(0) // change → on régénère les questions

  // Questions préparées pour le niveau choisi (vide tant qu'aucun niveau).
  const questions = useMemo(
    () => (niveau ? preparerQuestions(banque, niveau) : []),
    [tentative, niveau],
  )
```

- [ ] **Step 2 : Mettre à jour `demarrer` et `recommencer`**

```jsx
  // Démarrage du quiz depuis l'écran d'accueil
  function demarrer(infos) {
    setEtudiant({ nom: infos.nom, prenom: infos.prenom })
    setNiveau(infos.niveau)
    setReponses({})
    setEtape(ETAPES.QUIZ)
  }
```

```jsx
  // Recommencer : retour à l'accueil pour rechoisir niveau et identité
  function recommencer() {
    setTentative((t) => t + 1)
    setReponses({})
    setEtudiant({ nom: '', prenom: '' })
    setNiveau(null)
    setEtape(ETAPES.ACCUEIL)
  }
```

- [ ] **Step 3 : Passer `niveau` au composant Resultats**

Remplacer le bloc de rendu des résultats :

```jsx
        {etape === ETAPES.RESULTATS && resultat && (
          <Resultats
            etudiant={etudiant}
            niveau={niveau}
            resultat={resultat}
            onRecommencer={recommencer}
          />
        )}
```

- [ ] **Step 4 : Checkpoint** — `App` gère l’état `niveau` et le transmet aux résultats.

---

### Task 7 : Sélection du niveau dans `Accueil.jsx`

**Files:**
- Modify: `src/components/Accueil.jsx`

- [ ] **Step 1 : Réécrire le composant**

```jsx
import { useState } from 'react'
import { NIVEAUX } from '../data/niveaux.js'

// Écran d'accueil : choix du NIVEAU puis saisie du nom/prénom.
export default function Accueil({ onDemarrer }) {
  const [niveauId, setNiveauId] = useState(null)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')

  const niveau = NIVEAUX.find((n) => n.id === niveauId) ?? null

  // Le bouton n'est actif que si un niveau est choisi ET les champs remplis.
  const pret = niveau !== null && nom.trim() !== '' && prenom.trim() !== ''

  function soumettre(e) {
    e.preventDefault()
    if (!pret) return
    onDemarrer({ nom: nom.trim(), prenom: prenom.trim(), niveau })
  }

  return (
    <div className="accueil">
      <div className="badge-marque">Sirel976 · Formation</div>
      <h1 className="titre-principal">Quiz JavaScript</h1>
      <p className="sous-titre">Choisissez votre niveau pour commencer</p>

      <div className="choix-niveaux">
        {NIVEAUX.map((n) => (
          <button
            type="button"
            key={n.id}
            className={`carte-niveau ${niveauId === n.id ? 'carte-niveau-active' : ''}`}
            onClick={() => setNiveauId(n.id)}
            aria-pressed={niveauId === n.id}
          >
            <span className="niveau-titre">{n.titre}</span>
            <span className="niveau-theme">{n.theme}</span>
            <span className="niveau-desc">{n.description}</span>
            <span className="niveau-nb">{n.nbQuestions} questions</span>
          </button>
        ))}
      </div>

      <div className="bloc-regles">
        <h2>Avant de commencer</h2>
        {niveau ? (
          <ul>
            <li>
              <strong>{niveau.titre}</strong> — {niveau.theme}.
            </li>
            <li>
              <strong>{niveau.nbQuestions} questions</strong> : {niveau.description}
            </li>
            <li>Une question par écran, vous pouvez <strong>revenir en arrière</strong>.</li>
            <li>Mode examen : <strong>aucune correction</strong> n’est affichée pendant le quiz.</li>
            <li>À la fin : votre <strong>note /20</strong>, le corrigé complet et un <strong>PDF</strong> à télécharger.</li>
          </ul>
        ) : (
          <p className="aide-saisie">Sélectionnez d’abord un niveau ci-dessus.</p>
        )}
      </div>

      <form className="formulaire-identite" onSubmit={soumettre}>
        <div className="champ">
          <label htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Votre prénom"
            autoComplete="given-name"
          />
        </div>
        <div className="champ">
          <label htmlFor="nom">Nom</label>
          <input
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Votre nom"
            autoComplete="family-name"
          />
        </div>
        <button type="submit" className="btn btn-principal" disabled={!pret}>
          Commencer le quiz →
        </button>
        {!pret && (
          <p className="aide-saisie">
            Choisissez un niveau et renseignez votre prénom et votre nom.
          </p>
        )}
      </form>
    </div>
  )
}
```

- [ ] **Step 2 : Checkpoint** — l’accueil impose le choix d’un niveau avant de démarrer.

---

### Task 8 : Afficher le niveau dans `Resultats.jsx`

**Files:**
- Modify: `src/components/Resultats.jsx:1-17` (signature + en-tête) et appels PDF

- [ ] **Step 1 : Accepter le prop `niveau` et le transmettre au PDF**

Remplacer le haut du composant :

```jsx
import { genererPDF } from '../utils/pdf.js'

// Écran final : note, score par catégorie, corrigé complet, export PDF.
export default function Resultats({ etudiant, niveau, resultat, onRecommencer }) {
  const reussite = resultat.noteSur20 >= 10

  function telecharger() {
    genererPDF({ nom: etudiant.nom, prenom: etudiant.prenom, niveau, resultat })
  }

  return (
    <div className="resultats">
      <div className="badge-marque">Résultat · {niveau.titre}</div>
      <h1 className="titre-principal">Quiz terminé !</h1>
      <p className="sous-titre">
        Bravo {etudiant.prenom} {etudiant.nom} — {niveau.titre} · {niveau.theme}
      </p>
```

(Le reste du composant — carte note, scores par catégorie, corrigé, actions — reste **inchangé**.)

- [ ] **Step 2 : Checkpoint** — les résultats affichent le niveau passé.

---

### Task 9 : Thème du niveau dans le PDF (`pdf.js`)

**Files:**
- Modify: `src/utils/pdf.js:14` (signature) et `src/utils/pdf.js:38` (sous-titre en-tête)

- [ ] **Step 1 : Ajouter `niveau` à la signature**

Remplacer :
```js
export function genererPDF({ nom, prenom, resultat }) {
```
par :
```js
export function genererPDF({ nom, prenom, niveau, resultat }) {
```

- [ ] **Step 2 : Utiliser le thème du niveau dans l’en-tête**

Remplacer la ligne :
```js
  doc.text('Quiz Jour 1 : HTML · CSS · JavaScript (bases)', marge, 23)
```
par :
```js
  doc.text(`Quiz ${niveau.titre} : ${niveau.theme}`, marge, 23)
```

- [ ] **Step 3 : Checkpoint** — l’en-tête PDF reflète le niveau passé.

---

### Task 10 : Styles (cartes de niveau + badges)

**Files:**
- Modify: `src/styles/index.css` (ajouts en fin de fichier)

- [ ] **Step 1 : Vérifier les variables de couleur existantes**

Run: `grep -nE "badge-html|badge-css|badge-js|--" src/styles/index.css | head -30`
Expected: voir les classes `badge-*` et d’éventuelles variables CSS (`--navy`, etc.) à réutiliser pour la cohérence.

- [ ] **Step 2 : Ajouter les styles en fin de fichier**

Ajouter à la fin de `src/styles/index.css` :

```css
/* ===== Choix du niveau (accueil) ===== */
.choix-niveaux {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 18px 0;
}
@media (max-width: 560px) {
  .choix-niveaux {
    grid-template-columns: 1fr;
  }
}
.carte-niveau {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  padding: 16px;
  border: 2px solid #d7d7e0;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.05s;
}
.carte-niveau:hover {
  border-color: #000063;
}
.carte-niveau:active {
  transform: scale(0.99);
}
.carte-niveau-active {
  border-color: #000063;
  box-shadow: 0 0 0 3px rgba(0, 0, 99, 0.15);
}
.niveau-titre {
  font-weight: 700;
  font-size: 1.05rem;
  color: #000063;
}
.niveau-theme {
  font-weight: 600;
  font-size: 0.92rem;
}
.niveau-desc {
  font-size: 0.85rem;
  color: #5a5a5a;
}
.niveau-nb {
  margin-top: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #168246;
}

/* ===== Badges des catégories du Niveau 2 ===== */
.badge-conditions {
  background: #6d28d9;
  color: #fff;
}
.badge-boucles {
  background: #b45309;
  color: #fff;
}
.badge-fonctions {
  background: #0e7490;
  color: #fff;
}
```

> Note : les classes de badge sont générées par `badge-${q.categorie.toLowerCase()}`, donc `Conditions` → `badge-conditions`, `Boucles` → `badge-boucles`, `Fonctions` → `badge-fonctions`. Aucune accentuation dans ces noms de catégorie : les classes sont valides.

- [ ] **Step 3 : Checkpoint** — cartes de niveau et badges N2 stylés.

---

### Task 11 : Vérification finale (build + exécution)

**Files:** aucun (vérification)

- [ ] **Step 1 : Relancer le contrôle des données**

Run: `node scripts/verifier-donnees.mjs`
Expected: `✓ Données valides.`

- [ ] **Step 2 : Build de production**

Run: `npm run build`
Expected: build Vite réussi, dossier `dist/` généré, **aucune erreur**.

- [ ] **Step 3 : Vérification manuelle en dev**

Run: `npm run dev` puis ouvrir l’URL affichée.
Vérifier :
1. L’accueil propose **Niveau 1** et **Niveau 2** ; le bouton « Commencer » est désactivé tant qu’aucun niveau n’est choisi.
2. Niveau 1 → 50 questions HTML/CSS/JS (comportement identique à avant).
3. Niveau 2 → 25 questions Conditions/Boucles/Fonctions (badges colorés).
4. Écran de résultats : le niveau est affiché ; le PDF téléchargé montre le bon thème dans l’en-tête.
5. « Recommencer » ramène à l’accueil et permet de rechoisir le niveau.

- [ ] **Step 4 : Checkpoint final** — fonctionnalité complète et vérifiée. **L’utilisateur committe lui-même.**

---

## Self-review (auteur du plan)

- **Couverture spec :** niveaux (T1), champ `niveau` (T2), questions N2 incl. boucles (T3), préparation par niveau (T4), accueil/choix (T7), propagation App (T6), résultats (T8), PDF (T9), styles (T10), vérif (T5+T11). ✅
- **Placeholders :** aucun — tout le code est fourni intégralement.
- **Cohérence des signatures :** `preparerQuestions(banque, niveau)` (T4) ↔ appel dans `App` (T6) ↔ `onDemarrer({nom, prenom, niveau})` (T7) ↔ `Resultats({etudiant, niveau, resultat, onRecommencer})` (T8) ↔ `genererPDF({nom, prenom, niveau, resultat})` (T8 appel ↔ T9 signature). ✅
- **Catégories ↔ classes CSS :** `Conditions/Boucles/Fonctions` → `badge-conditions/boucles/fonctions` (sans accents). ✅
