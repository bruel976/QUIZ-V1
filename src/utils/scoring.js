// =============================================================
//  Utilitaires : mélange aléatoire, calcul du score et de la note
// =============================================================

// Mélange un tableau (algorithme de Fisher-Yates) en renvoyant une COPIE.
export function melanger(tableau) {
  const copie = [...tableau]
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copie[i], copie[j]] = [copie[j], copie[i]]
  }
  return copie
}

// Prépare les questions d'un PARCOURS pour une tentative :
//  - ne garde que les questions du parcours (même niveau + catégorie incluse)
//  - ordonne selon l'ordre des catégories du parcours (parcours.categories)
//  - mélange l'ordre des options de chaque question
export function preparerQuestions(questions, parcours) {
  const parCategorie = parcours.categories.flatMap((cat) =>
    questions.filter((q) => q.niveau === parcours.niveau && q.categorie === cat),
  )
  return parCategorie.map((q) => ({
    ...q,
    options: melanger(q.options),
  }))
}

// Renvoie la mention en fonction de la note sur 20 (barème Sirel976).
export function mention(noteSur20) {
  if (noteSur20 >= 16) return 'Très bien'
  if (noteSur20 >= 14) return 'Bien'
  if (noteSur20 >= 12) return 'Assez bien'
  if (noteSur20 >= 10) return 'Passable'
  return 'Insuffisant'
}

// Calcule le résultat complet à partir des questions et des réponses.
// reponses : objet { [idQuestion]: "valeur choisie" }
export function calculerResultat(questions, reponses) {
  let bonnes = 0
  const parCategorie = {}

  const details = questions.map((q) => {
    const reponseEtudiant = reponses[q.id] ?? null
    const correcte = reponseEtudiant === q.correct
    if (correcte) bonnes++

    if (!parCategorie[q.categorie]) {
      parCategorie[q.categorie] = { bonnes: 0, total: 0 }
    }
    parCategorie[q.categorie].total++
    if (correcte) parCategorie[q.categorie].bonnes++

    return { ...q, reponseEtudiant, correcte }
  })

  const total = questions.length
  const noteSur20 = total > 0 ? Math.round((bonnes / total) * 20 * 100) / 100 : 0

  return {
    bonnes,
    total,
    noteSur20,
    mention: mention(noteSur20),
    parCategorie,
    details,
  }
}

// Formate une date en français (ex : 03/06/2026 à 14:30).
export function dateFr(date) {
  const jj = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const aaaa = date.getFullYear()
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${jj}/${mm}/${aaaa} à ${hh}:${min}`
}
