import { useState } from 'react'
import { MODULES } from '../data/niveaux.js'

// Écran d'accueil en 2 étapes :
//   1. choix du MODULE (EC : Web statique, Web dynamique, Composants…)
//   2. choix du NIVEAU + saisie nom/prénom
// Chaque niveau ne contient qu'un parcours : il est sélectionné automatiquement.
export default function Accueil({ onDemarrer, onJouer }) {
  const [moduleId, setModuleId] = useState(null)
  const [niveauId, setNiveauId] = useState(null)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')

  const module = MODULES.find((m) => m.id === moduleId) ?? null
  const niveau = module?.niveaux.find((n) => n.id === niveauId) ?? null
  const parcours = niveau?.parcours[0] ?? null

  // Le bouton n'est actif que si un niveau est choisi ET les champs remplis.
  const pret = parcours !== null && nom.trim() !== '' && prenom.trim() !== ''

  // Revenir au choix du module (étape 1).
  function changerModule() {
    setModuleId(null)
    setNiveauId(null)
  }

  function soumettre(e) {
    e.preventDefault()
    if (!pret) return
    onDemarrer({ nom: nom.trim(), prenom: prenom.trim(), module, niveau, parcours })
  }

  return (
    <div className="accueil">
      <div className="badge-marque">Sirel976 · Formation</div>
      <h1 className="titre-principal">Quiz de formation</h1>

      {/* ----- Étape 1 : choix du module (EC) ----- */}
      {!module && (
        <>
          <p className="sous-titre">Étape 1 — Choisissez votre module</p>
          <div className="choix-niveaux">
            {MODULES.map((m) => (
              <button
                type="button"
                key={m.id}
                className="carte-niveau carte-module"
                onClick={() => setModuleId(m.id)}
              >
                <span className="module-icone" aria-hidden="true">{m.icone}</span>
                <span className="niveau-titre">{m.titre}</span>
                <span className="niveau-theme">{m.sousTitre}</span>
                <span className="niveau-desc">{m.description}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ----- Étape 2 : choix du niveau + identité ----- */}
      {module && (
        <>
          <p className="sous-titre">
            Étape 2 — {module.icone} {module.titre} · Choisissez votre niveau
          </p>
          <button type="button" className="lien-retour" onClick={changerModule}>
            ← Changer de module
          </button>

          <div className="choix-niveaux">
            {module.niveaux.map((n) => {
              const p = n.parcours[0]
              const estJeu = Boolean(p.jeu)
              return (
                <button
                  type="button"
                  key={n.id}
                  className={`carte-niveau ${estJeu ? 'carte-jeu' : ''} ${
                    !estJeu && niveauId === n.id ? 'carte-niveau-active' : ''
                  }`}
                  onClick={() =>
                    estJeu
                      ? onJouer({ module, niveau: n, parcours: p })
                      : setNiveauId(n.id)
                  }
                  aria-pressed={!estJeu && niveauId === n.id}
                >
                  <span className="niveau-titre">{n.titre}</span>
                  <span className="niveau-theme">{n.sousTitre}</span>
                  <span className="niveau-nb">
                    {estJeu ? '🤖 Jouer →' : `${p.nbQuestions} questions`}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="bloc-regles">
            <h2>Avant de commencer</h2>
            {parcours ? (
              <ul>
                <li>
                  <strong>{module.titre}</strong> · {niveau.titre} — {parcours.theme}.
                </li>
                <li>
                  <strong>{parcours.nbQuestions} questions</strong>, une par écran,
                  vous pouvez <strong>revenir en arrière</strong>.
                </li>
                <li>Mode examen : <strong>aucune correction</strong> n’est affichée pendant le quiz.</li>
                <li>À la fin : votre <strong>note /20</strong>, le corrigé complet et un <strong>PDF</strong> à télécharger.</li>
              </ul>
            ) : (
              <p className="aide-saisie">Sélectionnez un niveau ci-dessus.</p>
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
        </>
      )}
    </div>
  )
}
