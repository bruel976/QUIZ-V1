import { useState } from 'react'
import { NIVEAUX } from '../data/niveaux.js'

// Écran d'accueil en 2 étapes :
//   1. choix du NIVEAU
//   2. choix du PARCOURS du niveau + saisie nom/prénom
export default function Accueil({ onDemarrer }) {
  const [niveauId, setNiveauId] = useState(null)
  const [parcoursId, setParcoursId] = useState(null)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')

  const niveau = NIVEAUX.find((n) => n.id === niveauId) ?? null
  const parcours = niveau?.parcours.find((p) => p.id === parcoursId) ?? null

  // Le bouton n'est actif que si un parcours est choisi ET les champs remplis.
  const pret = parcours !== null && nom.trim() !== '' && prenom.trim() !== ''

  // Revenir au choix du niveau (étape 1).
  function changerNiveau() {
    setNiveauId(null)
    setParcoursId(null)
  }

  function soumettre(e) {
    e.preventDefault()
    if (!pret) return
    onDemarrer({ nom: nom.trim(), prenom: prenom.trim(), niveau, parcours })
  }

  return (
    <div className="accueil">
      <div className="badge-marque">Sirel976 · Formation</div>
      <h1 className="titre-principal">Quiz JavaScript</h1>

      {/* ----- Étape 1 : choix du niveau ----- */}
      {!niveau && (
        <>
          <p className="sous-titre">Étape 1 — Choisissez votre niveau</p>
          <div className="choix-niveaux">
            {NIVEAUX.map((n) => (
              <button
                type="button"
                key={n.id}
                className="carte-niveau"
                onClick={() => setNiveauId(n.id)}
              >
                <span className="niveau-titre">{n.titre}</span>
                <span className="niveau-theme">{n.sousTitre}</span>
                <span className="niveau-desc">
                  {n.parcours.length} parcours disponibles
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ----- Étape 2 : choix du parcours + identité ----- */}
      {niveau && (
        <>
          <p className="sous-titre">
            Étape 2 — {niveau.titre} · {niveau.sousTitre}
          </p>
          <button type="button" className="lien-retour" onClick={changerNiveau}>
            ← Changer de niveau
          </button>

          <div className="choix-niveaux">
            {niveau.parcours.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`carte-niveau ${parcoursId === p.id ? 'carte-niveau-active' : ''}`}
                onClick={() => setParcoursId(p.id)}
                aria-pressed={parcoursId === p.id}
              >
                <span className="niveau-titre">{p.titre}</span>
                <span className="niveau-theme">{p.theme}</span>
                <span className="niveau-nb">{p.nbQuestions} questions</span>
              </button>
            ))}
          </div>

          <div className="bloc-regles">
            <h2>Avant de commencer</h2>
            {parcours ? (
              <ul>
                <li>
                  <strong>{parcours.titre}</strong> — {parcours.theme}.
                </li>
                <li>
                  <strong>{parcours.nbQuestions} questions</strong>, une par écran,
                  vous pouvez <strong>revenir en arrière</strong>.
                </li>
                <li>Mode examen : <strong>aucune correction</strong> n’est affichée pendant le quiz.</li>
                <li>À la fin : votre <strong>note /20</strong>, le corrigé complet et un <strong>PDF</strong> à télécharger.</li>
              </ul>
            ) : (
              <p className="aide-saisie">Sélectionnez un parcours ci-dessus.</p>
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
                Choisissez un parcours et renseignez votre prénom et votre nom.
              </p>
            )}
          </form>
        </>
      )}
    </div>
  )
}
