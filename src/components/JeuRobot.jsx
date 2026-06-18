import { useState, useEffect } from 'react'
import { DEFIS_ROBOT } from '../data/defisRobot.js'
import {
  ANGLE,
  executerProgramme,
  creerInstruction,
  ajouterInstruction,
  supprimerInstruction,
  modifierInstruction,
  compterBlocs,
} from '../utils/robot.js'

// Étiquettes des instructions simples affichées dans l'éditeur.
const LABELS = {
  avancer: '⬆️ Avancer',
  gauche: '↺ Tourner à gauche',
  droite: '↻ Tourner à droite',
}

// Jeu « Le robot sur la grille » — entraînement libre, sans note.
export default function JeuRobot({ onQuitter }) {
  const [indexDefi, setIndexDefi] = useState(0)
  const [programme, setProgramme] = useState([])
  const [frames, setFrames] = useState(null) // trace d'exécution en cours
  const [frameIndex, setFrameIndex] = useState(0)
  const [enCours, setEnCours] = useState(false) // animation en lecture
  const [bilan, setBilan] = useState(null) // { succes, collision }

  const defi = DEFIS_ROBOT[indexDefi]

  // État affiché du robot : pendant l'animation on suit la trace,
  // sinon on montre la position de départ.
  const etatRobot = frames ? frames[frameIndex] : defi.robot
  const animationFinie = frames !== null && !enCours

  // Avance l'animation image par image.
  useEffect(() => {
    if (!enCours || !frames) return undefined
    if (frameIndex >= frames.length - 1) {
      setEnCours(false)
      return undefined
    }
    const t = setTimeout(() => setFrameIndex((i) => i + 1), 420)
    return () => clearTimeout(t)
  }, [enCours, frameIndex, frames])

  // Remet le robot au départ et efface la trace (sans toucher au programme).
  function reinitialiser() {
    setFrames(null)
    setFrameIndex(0)
    setEnCours(false)
    setBilan(null)
  }

  // Change de défi : on repart d'un programme vierge.
  function choisirDefi(i) {
    setIndexDefi(i)
    setProgramme([])
    reinitialiser()
  }

  function ajouter(parentId, champ, type) {
    setProgramme((p) => ajouterInstruction(p, parentId, champ, creerInstruction(type)))
  }
  function supprimer(id) {
    setProgramme((p) => supprimerInstruction(p, id))
  }
  function changerN(id, valeur) {
    const n = Math.max(1, Math.min(10, Number(valeur) || 1))
    setProgramme((p) => modifierInstruction(p, id, { n }))
  }

  // Lance l'exécution du programme et démarre l'animation.
  function lancer() {
    if (programme.length === 0) return
    const resultat = executerProgramme(defi, programme)
    setFrames(resultat.frames)
    setFrameIndex(0)
    setBilan({ succes: resultat.succes, collision: resultat.collision })
    setEnCours(true)
  }

  // ---------- Rendu de la grille ----------
  function rendreGrille() {
    const cellules = []
    for (let y = 0; y < defi.rows; y += 1) {
      for (let x = 0; x < defi.cols; x += 1) {
        const mur = defi.murs.some((m) => m.x === x && m.y === y)
        const cible = defi.cible.x === x && defi.cible.y === y
        const robotIci = etatRobot.x === x && etatRobot.y === y
        const choc = robotIci && animationFinie && bilan?.collision
        cellules.push(
          <div
            key={`${x}-${y}`}
            className={`cellule${mur ? ' cellule-mur' : ''}${cible ? ' cellule-cible' : ''}`}
          >
            {cible && !robotIci && <span className="drapeau">🎯</span>}
            {robotIci && (
              <span className={`robot${choc ? ' robot-choc' : ''}`}>
                <span className="robot-emoji">🤖</span>
                <span
                  className="robot-cap"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${ANGLE[etatRobot.dir]}deg) translateY(-1.05em)`,
                  }}
                >
                  ▲
                </span>
              </span>
            )}
          </div>,
        )
      }
    }
    return (
      <div
        className="grille-robot"
        style={{
          gridTemplateColumns: `repeat(${defi.cols}, 1fr)`,
          gridTemplateRows: `repeat(${defi.rows}, 1fr)`,
          aspectRatio: `${defi.cols} / ${defi.rows}`,
        }}
      >
        {cellules}
      </div>
    )
  }

  // ---------- Rendu récursif de l'éditeur de blocs ----------
  function palette(parentId, champ, petite = false) {
    return (
      <div className={`palette${petite ? ' palette-petite' : ''}`}>
        <button type="button" onClick={() => ajouter(parentId, champ, 'avancer')}>＋ Avancer</button>
        <button type="button" onClick={() => ajouter(parentId, champ, 'gauche')}>＋ ↺ Gauche</button>
        <button type="button" onClick={() => ajouter(parentId, champ, 'droite')}>＋ ↻ Droite</button>
        <button type="button" onClick={() => ajouter(parentId, champ, 'repeter')}>＋ 🔁 Répéter</button>
        <button type="button" onClick={() => ajouter(parentId, champ, 'si')}>＋ ❓ Si mur</button>
      </div>
    )
  }

  function rendreInstruction(instr) {
    if (instr.type === 'repeter') {
      return (
        <li key={instr.id} className="bloc bloc-repeter">
          <div className="bloc-tete">
            <span className="bloc-label">🔁 Répéter</span>
            <input
              type="number"
              min="1"
              max="10"
              value={instr.n}
              disabled={enCours}
              onChange={(e) => changerN(instr.id, e.target.value)}
              className="bloc-n"
              aria-label="Nombre de répétitions"
            />
            <span>fois</span>
            <button
              type="button"
              className="bloc-suppr"
              disabled={enCours}
              onClick={() => supprimer(instr.id)}
              aria-label="Supprimer ce bloc"
            >
              ✕
            </button>
          </div>
          <ul className="bloc-corps">
            {instr.corps.map(rendreInstruction)}
            {!enCours && palette(instr.id, 'corps', true)}
          </ul>
        </li>
      )
    }
    if (instr.type === 'si') {
      return (
        <li key={instr.id} className="bloc bloc-si">
          <div className="bloc-tete">
            <span className="bloc-label">❓ Si mur devant</span>
            <button
              type="button"
              className="bloc-suppr"
              disabled={enCours}
              onClick={() => supprimer(instr.id)}
              aria-label="Supprimer ce bloc"
            >
              ✕
            </button>
          </div>
          <ul className="bloc-corps">
            {instr.corps.map(rendreInstruction)}
            {!enCours && palette(instr.id, 'corps', true)}
          </ul>
          <div className="bloc-sinon">Sinon</div>
          <ul className="bloc-corps">
            {instr.sinon.map(rendreInstruction)}
            {!enCours && palette(instr.id, 'sinon', true)}
          </ul>
        </li>
      )
    }
    return (
      <li key={instr.id} className="bloc bloc-simple">
        <span className="bloc-label">{LABELS[instr.type]}</span>
        <button
          type="button"
          className="bloc-suppr"
          disabled={enCours}
          onClick={() => supprimer(instr.id)}
          aria-label="Supprimer ce bloc"
        >
          ✕
        </button>
      </li>
    )
  }

  return (
    <div className="jeu-robot">
      <div className="badge-marque">🧩 Algorithmique · Jeu</div>
      <h1 className="titre-principal">Le robot sur la grille</h1>
      <p className="sous-titre">
        Assemble un programme avec des blocs pour amener le robot jusqu’au drapeau.
      </p>

      {/* Sélecteur de défis */}
      <div className="defis-onglets">
        {DEFIS_ROBOT.map((d, i) => (
          <button
            type="button"
            key={d.id}
            className={`defi-onglet${i === indexDefi ? ' defi-onglet-actif' : ''}`}
            onClick={() => choisirDefi(i)}
          >
            {d.titre}
          </button>
        ))}
      </div>

      <div className="bloc-regles">
        <p className="defi-consigne">{defi.consigne}</p>
        <p className="defi-astuce">💡 {defi.astuce}</p>
      </div>

      {/* Bandeau de résultat */}
      {animationFinie && bilan && (
        <div
          className={`bilan-jeu ${
            bilan.succes ? 'bilan-succes' : bilan.collision ? 'bilan-choc' : 'bilan-rate'
          }`}
        >
          {bilan.succes
            ? `🎉 Bravo ! Drapeau atteint en ${compterBlocs(programme)} bloc(s).`
            : bilan.collision
              ? '💥 Aïe ! Le robot a heurté un mur. Corrige ton programme.'
              : '🤖 Le robot n’a pas atteint le drapeau. Réessaie !'}
        </div>
      )}

      <div className="jeu-zone">
        {/* Colonne gauche : grille + commandes */}
        <div className="jeu-grille">
          {rendreGrille()}
          <div className="jeu-commandes">
            <button
              type="button"
              className="btn btn-principal"
              onClick={lancer}
              disabled={enCours || programme.length === 0}
            >
              ▶ Lancer
            </button>
            <button
              type="button"
              className="btn btn-secondaire"
              onClick={reinitialiser}
              disabled={enCours}
            >
              ↺ Réinitialiser
            </button>
          </div>
        </div>

        {/* Colonne droite : éditeur de programme */}
        <div className="jeu-programme">
          <div className="programme-tete">
            <h2>Mon programme</h2>
            <button
              type="button"
              className="lien-retour"
              onClick={() => {
                setProgramme([])
                reinitialiser()
              }}
              disabled={enCours}
            >
              🗑 Tout effacer
            </button>
          </div>
          <ul className="programme-liste">
            {programme.length === 0 && (
              <li className="programme-vide">
                Ajoute des blocs ci-dessous pour construire ton algorithme.
              </li>
            )}
            {programme.map(rendreInstruction)}
          </ul>
          {!enCours && palette(null, null)}
        </div>
      </div>

      <button type="button" className="btn btn-secondaire jeu-quitter" onClick={onQuitter}>
        ← Quitter le jeu
      </button>
    </div>
  )
}
