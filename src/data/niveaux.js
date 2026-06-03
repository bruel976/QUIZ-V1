// =============================================================
//  Définition des NIVEAUX et de leurs PARCOURS (Sirel976)
//
//  Un niveau regroupe plusieurs parcours (options de quiz).
//  Chaque parcours déclare :
//    - niveau     : l'id du niveau parent (sert au filtrage des questions)
//    - categories : les catégories incluses, dans l'ordre d'affichage
//  Les questions sont filtrées par (niveau + categorie), donc aucune
//  question n'a besoin de connaître son parcours.
// =============================================================

export const NIVEAUX = [
  {
    id: 1,
    titre: 'Niveau 1',
    sousTitre: 'Les bases',
    parcours: [
      {
        id: 'n1-htmlcss',
        niveau: 1,
        titre: 'HTML / CSS — bases',
        theme: 'Balises, attributs, mise en forme',
        categories: ['HTML', 'CSS'],
        nbQuestions: 34,
      },
      {
        id: 'n1-js',
        niveau: 1,
        titre: 'JavaScript — bases',
        theme: 'Variables & opérateurs',
        categories: ['JS'],
        nbQuestions: 16,
      },
    ],
  },
  {
    id: 2,
    titre: 'Niveau 2',
    sousTitre: 'Intermédiaire',
    parcours: [
      {
        id: 'n2-js',
        niveau: 2,
        titre: 'JavaScript intermédiaire',
        theme: 'Conditions · Boucles · Fonctions',
        categories: ['Conditions', 'Boucles', 'Fonctions'],
        nbQuestions: 25,
      },
      {
        id: 'n2-htmlcss',
        niveau: 2,
        titre: 'HTML / CSS intermédiaire',
        theme: 'Flexbox, Grid, sémantique, accessibilité',
        categories: ['CSS', 'HTML'],
        nbQuestions: 25,
      },
    ],
  },
]

// Liste à plat de tous les parcours (pratique pour les vérifications).
export const PARCOURS = NIVEAUX.flatMap((n) => n.parcours)

// Retrouve un niveau par son identifiant (ou null).
export function niveauParId(id) {
  return NIVEAUX.find((n) => n.id === id) ?? null
}

// Retrouve un parcours par son identifiant (ou null).
export function parcoursParId(id) {
  return PARCOURS.find((p) => p.id === id) ?? null
}
