// =============================================================
//  Contrôle d'intégrité de la banque de questions.
//  Lancer : node scripts/verifier-donnees.mjs
// =============================================================

import { questions } from '../src/data/questions.js'
import { PARCOURS } from '../src/data/niveaux.js'

let erreurs = 0
const check = (cond, msg) => {
  if (!cond) {
    console.error('✗', msg)
    erreurs++
  }
}

// Catégories autorisées (toutes celles déclarées par les parcours).
const categoriesConnues = new Set(PARCOURS.flatMap((p) => p.categories))

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
  check(
    categoriesConnues.has(q.categorie),
    `${q.id} : catégorie « ${q.categorie} » inconnue`,
  )
}

// Compte attendu pour chaque parcours (questions = niveau parent + catégories).
for (const p of PARCOURS) {
  const nb = questions.filter(
    (q) => q.niveau === p.niveau && p.categories.includes(q.categorie),
  ).length
  console.log(`Parcours ${p.id} (${p.titre}) : ${nb} questions`)
  check(
    nb === p.nbQuestions,
    `Parcours ${p.id} : attendu ${p.nbQuestions}, trouvé ${nb}`,
  )
}

// Vérifie qu'aucune question n'échappe à un parcours de son niveau.
for (const q of questions) {
  const couvert = PARCOURS.some(
    (p) => p.niveau === q.niveau && p.categories.includes(q.categorie),
  )
  check(couvert, `${q.id} : aucun parcours ne couvre cette question`)
}

if (erreurs) {
  console.error(`\n${erreurs} erreur(s) détectée(s).`)
  process.exit(1)
}
console.log(`\n✓ Données valides — ${questions.length} questions au total.`)
