// =============================================================
//  Définition des MODULES (EC), de leurs NIVEAUX et PARCOURS (Sirel976)
//
//  Hiérarchie :
//    MODULE (EC)  →  NIVEAU  →  PARCOURS
//
//  - Un module (Élément Constitutif) regroupe une matière (Web statique,
//    Web dynamique, Composants d'ordinateur…).
//  - Chaque module contient plusieurs niveaux (1, 2, …).
//  - Chaque niveau contient un ou plusieurs parcours (options de quiz).
//  - Un parcours déclare :
//      module     : l'id du module parent
//      niveau     : l'id du niveau parent (sert au filtrage des questions)
//      categories : les catégories incluses, dans l'ordre d'affichage
//  Les questions sont filtrées par (niveau + categorie). Comme les catégories
//  sont propres à chaque module, aucune collision entre modules.
// =============================================================

export const MODULES = [
  {
    id: 'web-statique',
    titre: 'Web statique',
    sousTitre: 'HTML & CSS',
    icone: '🌐',
    description: 'Structurer et mettre en forme une page web.',
    niveaux: [
      {
        id: 1,
        titre: 'Niveau 1',
        sousTitre: 'Les bases',
        parcours: [
          {
            id: 'n1-htmlcss',
            module: 'web-statique',
            niveau: 1,
            titre: 'HTML / CSS — bases',
            theme: 'Balises, attributs, mise en forme',
            categories: ['HTML', 'CSS'],
            nbQuestions: 34,
          },
        ],
      },
      {
        id: 2,
        titre: 'Niveau 2',
        sousTitre: 'Intermédiaire',
        parcours: [
          {
            id: 'n2-htmlcss',
            module: 'web-statique',
            niveau: 2,
            titre: 'HTML / CSS intermédiaire',
            theme: 'Flexbox, Grid, sémantique, accessibilité',
            categories: ['CSS', 'HTML'],
            nbQuestions: 25,
          },
        ],
      },
    ],
  },
  {
    id: 'web-dynamique',
    titre: 'Web dynamique',
    sousTitre: 'JavaScript',
    icone: '⚡',
    description: 'Rendre une page interactive avec JavaScript.',
    niveaux: [
      {
        id: 1,
        titre: 'Niveau 1',
        sousTitre: 'Les bases',
        parcours: [
          {
            id: 'n1-js',
            module: 'web-dynamique',
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
            module: 'web-dynamique',
            niveau: 2,
            titre: 'JavaScript intermédiaire',
            theme: 'Conditions · Boucles · Fonctions',
            categories: ['Conditions', 'Boucles', 'Fonctions'],
            nbQuestions: 25,
          },
        ],
      },
    ],
  },
  {
    id: 'composants',
    titre: "Composants d'ordinateur",
    sousTitre: 'Matériel & architecture',
    icone: '🖥️',
    description: 'Identifier et comprendre les composants matériels.',
    niveaux: [
      {
        id: 1,
        titre: 'Niveau 1',
        sousTitre: 'Les bases du matériel',
        parcours: [
          {
            id: 'comp-n1',
            module: 'composants',
            niveau: 1,
            titre: 'Le matériel — bases',
            theme: 'Processeur, mémoire, carte mère, périphériques',
            categories: ['Processeur', 'Mémoire', 'Carte-mère', 'Périphériques'],
            nbQuestions: 25,
          },
        ],
      },
      {
        id: 2,
        titre: 'Niveau 2',
        sousTitre: 'Approfondissement',
        parcours: [
          {
            id: 'comp-n2',
            module: 'composants',
            niveau: 2,
            titre: 'Le matériel — approfondissement',
            theme: 'Architecture, performances, assemblage',
            categories: ['Processeur', 'Mémoire', 'Carte-mère', 'Périphériques'],
            nbQuestions: 25,
          },
        ],
      },
    ],
  },
  {
    id: 'algorithme',
    titre: 'Algorithmique',
    sousTitre: 'Logique & pseudo-code',
    icone: '🧩',
    description: 'Raisonner et construire des algorithmes en pseudo-code.',
    niveaux: [
      {
        id: 1,
        titre: 'Niveau 1',
        sousTitre: 'Les bases',
        parcours: [
          {
            id: 'algo-n1',
            module: 'algorithme',
            niveau: 1,
            titre: 'Algorithmique — bases',
            theme: 'Variables, conditions, boucles (pseudo-code)',
            categories: ['Variables', 'Conditions', 'Boucles'],
            nbQuestions: 13,
          },
        ],
      },
      {
        id: 2,
        titre: 'Niveau 2',
        sousTitre: 'Intermédiaire',
        parcours: [
          {
            id: 'algo-n2',
            module: 'algorithme',
            niveau: 2,
            titre: 'Algorithmique intermédiaire',
            theme: 'Tableaux, recherches/tris, complexité',
            categories: ['Tableaux', 'Complexité'],
            nbQuestions: 12,
          },
        ],
      },
      {
        id: 3,
        titre: 'Défis du robot',
        sousTitre: 'Jeu — séquences, boucles & conditions',
        parcours: [
          {
            id: 'algo-jeu-robot',
            module: 'algorithme',
            niveau: 3,
            jeu: 'robot',
            titre: 'Le robot sur la grille',
            theme: 'Programmer un robot avec des blocs',
            categories: [],
            nbQuestions: 0,
          },
        ],
      },
    ],
  },
]

// Liste à plat de tous les niveaux (avec leur module parent en référence).
export const NIVEAUX = MODULES.flatMap((m) => m.niveaux)

// Liste à plat de tous les parcours (pratique pour les vérifications).
export const PARCOURS = MODULES.flatMap((m) =>
  m.niveaux.flatMap((n) => n.parcours),
)

// Retrouve un module par son identifiant (ou null).
export function moduleParId(id) {
  return MODULES.find((m) => m.id === id) ?? null
}

// Retrouve un parcours par son identifiant (ou null).
export function parcoursParId(id) {
  return PARCOURS.find((p) => p.id === id) ?? null
}
