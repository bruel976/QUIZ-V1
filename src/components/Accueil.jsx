import { useState } from 'react'

// Écran d'accueil : saisie du nom et du prénom avant de commencer.
export default function Accueil({ onDemarrer }) {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')

  // Le bouton n'est actif que si les deux champs sont remplis.
  const pret = nom.trim() !== '' && prenom.trim() !== ''

  function soumettre(e) {
    e.preventDefault()
    if (!pret) return
    onDemarrer({ nom: nom.trim(), prenom: prenom.trim() })
  }

  return (
    <div className="accueil">
      <div className="badge-marque">Sirel976 · Formation</div>
      <h1 className="titre-principal">Quiz Jour 1</h1>
      <p className="sous-titre">HTML · CSS · JavaScript — les bases</p>

      <div className="bloc-regles">
        <h2>Avant de commencer</h2>
        <ul>
          <li><strong>50 questions</strong> : 17 HTML, 17 CSS, 16 JavaScript.</li>
          <li>Une question par écran, vous pouvez <strong>revenir en arrière</strong>.</li>
          <li>Mode examen : <strong>aucune correction</strong> n’est affichée pendant le quiz.</li>
          <li>À la fin : votre <strong>note /20</strong>, le corrigé complet et un <strong>PDF</strong> à télécharger.</li>
        </ul>
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
            Renseignez votre prénom et votre nom pour activer le bouton.
          </p>
        )}
      </form>
    </div>
  )
}
