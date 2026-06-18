// =============================================================
//  Jeu « Le robot sur la grille » — interpréteur & manipulation
//  des blocs de programme (module Algorithmique).
//
//  Repère : x = colonne (→), y = ligne (↓). Le haut de la grille
//  correspond à y = 0. Sortir de la grille ou toucher un mur =
//  collision.
// =============================================================

// Sens dans l'ordre horaire : tourner à droite avance dans ce tableau.
export const DIRECTIONS = ['N', 'E', 'S', 'O']

const DELTA = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  O: { dx: -1, dy: 0 },
}

// Angle de rotation (en degrés) pour orienter le robot à l'écran.
export const ANGLE = { N: 0, E: 90, S: 180, O: 270 }

// Renvoie la nouvelle direction après un quart de tour.
export function tourner(dir, sens) {
  const i = DIRECTIONS.indexOf(dir)
  const j = sens === 'droite' ? (i + 1) % 4 : (i + 3) % 4
  return DIRECTIONS[j]
}

// Case située juste devant le robot.
function caseDevant(etat) {
  const d = DELTA[etat.dir]
  return { x: etat.x + d.dx, y: etat.y + d.dy }
}

// Vrai si la case (x, y) est un mur ou hors de la grille.
function estMur(defi, x, y) {
  if (x < 0 || y < 0 || x >= defi.cols || y >= defi.rows) return true
  return defi.murs.some((m) => m.x === x && m.y === y)
}

// Vrai s'il y a un mur (ou un bord) juste devant le robot.
export function murEnFace(defi, etat) {
  const c = caseDevant(etat)
  return estMur(defi, c.x, c.y)
}

// Exécute un programme sur un défi.
// Renvoie { frames, succes, collision, etatFinal } :
//  - frames : la suite des états du robot (pour l'animation)
//  - succes : le robot est sur la cible sans avoir percuté de mur
//  - collision : le robot a tenté d'avancer dans un mur / un bord
export function executerProgramme(defi, programme) {
  let etat = { x: defi.robot.x, y: defi.robot.y, dir: defi.robot.dir }
  const frames = [{ ...etat, action: 'depart' }]
  let collision = false
  let pas = 0
  const MAX = 2000 // garde-fou (les boucles « Répéter » sont finies)

  function avancer() {
    const c = caseDevant(etat)
    if (estMur(defi, c.x, c.y)) {
      collision = true
      frames.push({ ...etat, action: 'collision' })
      return
    }
    etat = { ...etat, x: c.x, y: c.y }
    frames.push({ ...etat, action: 'avancer' })
  }

  function pivoter(sens) {
    etat = { ...etat, dir: tourner(etat.dir, sens) }
    frames.push({ ...etat, action: 'tourner' })
  }

  function execBloc(liste) {
    for (const instr of liste) {
      if (collision || pas > MAX) return
      pas += 1
      switch (instr.type) {
        case 'avancer':
          avancer()
          break
        case 'gauche':
          pivoter('gauche')
          break
        case 'droite':
          pivoter('droite')
          break
        case 'repeter':
          for (let i = 0; i < instr.n; i += 1) {
            if (collision || pas > MAX) return
            execBloc(instr.corps)
          }
          break
        case 'si':
          if (murEnFace(defi, etat)) execBloc(instr.corps)
          else execBloc(instr.sinon)
          break
        default:
          break
      }
    }
  }

  execBloc(programme)
  const succes =
    !collision && etat.x === defi.cible.x && etat.y === defi.cible.y
  return { frames, succes, collision, etatFinal: etat }
}

// ---------- Manipulation de l'arbre de programme ----------
// Chaque instruction porte un id unique. Les blocs « repeter » et
// « si » contiennent des sous-listes (corps / sinon).

let compteurId = 0
export function nouvelId() {
  compteurId += 1
  return `b${compteurId}`
}

export function creerInstruction(type) {
  const base = { id: nouvelId(), type }
  if (type === 'repeter') return { ...base, n: 3, corps: [] }
  if (type === 'si') return { ...base, corps: [], sinon: [] }
  return base
}

// Ajoute une instruction. parentId === null → racine du programme.
// champ vaut 'corps' ou 'sinon' pour viser l'intérieur d'un bloc.
export function ajouterInstruction(programme, parentId, champ, instr) {
  if (parentId === null) return [...programme, instr]
  return programme.map((i) => {
    if (i.id === parentId) {
      return { ...i, [champ]: [...i[champ], instr] }
    }
    if (i.type === 'repeter') {
      return { ...i, corps: ajouterInstruction(i.corps, parentId, champ, instr) }
    }
    if (i.type === 'si') {
      return {
        ...i,
        corps: ajouterInstruction(i.corps, parentId, champ, instr),
        sinon: ajouterInstruction(i.sinon, parentId, champ, instr),
      }
    }
    return i
  })
}

export function supprimerInstruction(programme, id) {
  return programme
    .filter((i) => i.id !== id)
    .map((i) => {
      if (i.type === 'repeter') {
        return { ...i, corps: supprimerInstruction(i.corps, id) }
      }
      if (i.type === 'si') {
        return {
          ...i,
          corps: supprimerInstruction(i.corps, id),
          sinon: supprimerInstruction(i.sinon, id),
        }
      }
      return i
    })
}

export function modifierInstruction(programme, id, patch) {
  return programme.map((i) => {
    if (i.id === id) return { ...i, ...patch }
    if (i.type === 'repeter') {
      return { ...i, corps: modifierInstruction(i.corps, id, patch) }
    }
    if (i.type === 'si') {
      return {
        ...i,
        corps: modifierInstruction(i.corps, id, patch),
        sinon: modifierInstruction(i.sinon, id, patch),
      }
    }
    return i
  })
}

// Nombre total de blocs (utilisé pour féliciter « résolu en N blocs »).
export function compterBlocs(programme) {
  return programme.reduce((n, i) => {
    if (i.type === 'repeter') return n + 1 + compterBlocs(i.corps)
    if (i.type === 'si') return n + 1 + compterBlocs(i.corps) + compterBlocs(i.sinon)
    return n + 1
  }, 0)
}
