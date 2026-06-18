// =============================================================
//  Défis du jeu « Le robot sur la grille » (module Algorithmique)
//  Difficulté croissante : séquence → virage → boucle → murs →
//  conditions (Si mur devant).
//
//  Repère : x = colonne (→), y = ligne (↓), origine en haut à gauche.
//  dir : 'N' | 'E' | 'S' | 'O'. murs : cases infranchissables.
// =============================================================

export const DEFIS_ROBOT = [
  {
    id: 'droite',
    titre: '1 · Ligne droite',
    consigne: 'Amène le robot 🤖 jusqu’au drapeau 🎯, tout droit.',
    astuce: 'Plutôt que d’empiler des « Avancer », essaie un bloc « Répéter ».',
    cols: 5,
    rows: 3,
    robot: { x: 0, y: 1, dir: 'E' },
    cible: { x: 4, y: 1 },
    murs: [],
  },
  {
    id: 'virage',
    titre: '2 · Le virage',
    consigne: 'Le drapeau est en haut à droite : il faudra tourner en chemin.',
    astuce: 'Avance jusqu’au coin, puis « Tourner à gauche » pour monter.',
    cols: 5,
    rows: 5,
    robot: { x: 0, y: 4, dir: 'E' },
    cible: { x: 4, y: 0 },
    murs: [],
  },
  {
    id: 'longue',
    titre: '3 · La longue ligne',
    consigne: 'Un long couloir… écris le programme le plus COURT possible.',
    astuce: 'Une boucle « Répéter N fois » remplace 7 « Avancer ».',
    cols: 8,
    rows: 3,
    robot: { x: 0, y: 1, dir: 'E' },
    cible: { x: 7, y: 1 },
    murs: [],
  },
  {
    id: 'detour',
    titre: '4 · Le détour',
    consigne: 'Un mur barre le passage : contourne-le pour rejoindre le drapeau.',
    astuce: 'Monte (ou descends), longe le mur, puis redescends vers la cible.',
    cols: 5,
    rows: 5,
    robot: { x: 0, y: 2, dir: 'E' },
    cible: { x: 4, y: 2 },
    murs: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
  },
  {
    id: 'mur',
    titre: '5 · Suis le mur',
    consigne:
      'Programme une règle générale avec « Si mur devant » : tourne quand un mur te bloque, sinon avance.',
    astuce: 'Répéter 7 fois { Si mur devant → Tourner à droite, Sinon → Avancer }.',
    cols: 5,
    rows: 5,
    robot: { x: 0, y: 0, dir: 'E' },
    cible: { x: 2, y: 4 },
    murs: [
      { x: 3, y: 0 },
      { x: 1, y: 4 },
      { x: 3, y: 4 },
    ],
  },
]
