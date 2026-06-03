import { genererPDF } from '../utils/pdf.js'

// Écran final : note, score par catégorie, corrigé complet, export PDF.
export default function Resultats({ etudiant, niveau, parcours, resultat, onRecommencer }) {
  const reussite = resultat.noteSur20 >= 10

  function telecharger() {
    genererPDF({ nom: etudiant.nom, prenom: etudiant.prenom, niveau, parcours, resultat })
  }

  return (
    <div className="resultats">
      <div className="badge-marque">Résultat · {niveau.titre}</div>
      <h1 className="titre-principal">Quiz terminé !</h1>
      <p className="sous-titre">
        Bravo {etudiant.prenom} {etudiant.nom} — {niveau.titre} · {parcours.titre}
      </p>

      <div className={`carte-note ${reussite ? 'note-reussie' : 'note-echec'}`}>
        <div className="note-chiffre">{resultat.noteSur20}<span>/20</span></div>
        <div className="note-details">
          <div className="note-mention">{resultat.mention}</div>
          <div className="note-sous">
            {resultat.bonnes} / {resultat.total} bonnes réponses
          </div>
        </div>
      </div>

      <div className="score-categories">
        {Object.entries(resultat.parCategorie).map(([cat, s]) => {
          const pct = Math.round((s.bonnes / s.total) * 100)
          return (
            <div key={cat} className="categorie-ligne">
              <div className="categorie-tete">
                <span className={`badge badge-${cat.toLowerCase()}`}>{cat}</span>
                <span className="categorie-score">
                  {s.bonnes} / {s.total}
                </span>
              </div>
              <div className="barre">
                <div className="barre-remplie" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="actions-resultats">
        <button type="button" className="btn btn-principal" onClick={telecharger}>
          📥 Télécharger mon résultat (PDF)
        </button>
        <button type="button" className="btn btn-secondaire" onClick={onRecommencer}>
          ↻ Recommencer
        </button>
      </div>

      <h2 className="titre-corrige">Corrigé détaillé</h2>
      <ol className="liste-corrige">
        {resultat.details.map((q) => (
          <li
            key={q.id}
            className={`corrige-item ${q.correcte ? 'item-juste' : 'item-faux'}`}
          >
            <div className="corrige-tete">
              <span className={`badge badge-${q.categorie.toLowerCase()}`}>
                {q.categorie}
              </span>
              <span className="corrige-statut">
                {q.correcte ? '✓ Juste' : '✗ Faux'}
              </span>
            </div>
            <p className="corrige-enonce">{q.enonce}</p>
            {q.code && (
              <pre className="bloc-code">
                <code>{q.code}</code>
              </pre>
            )}
            <p className="corrige-reponse">
              Votre réponse :{' '}
              <span className={q.correcte ? 'txt-juste' : 'txt-faux'}>
                {q.reponseEtudiant ?? '(aucune réponse)'}
              </span>
            </p>
            {!q.correcte && (
              <p className="corrige-bonne">
                Bonne réponse : <span className="txt-juste">{q.correct}</span>
              </p>
            )}
            <p className="corrige-explication">→ {q.explication}</p>
          </li>
        ))}
      </ol>

      <div className="actions-resultats actions-bas">
        <button type="button" className="btn btn-principal" onClick={telecharger}>
          📥 Télécharger mon résultat (PDF)
        </button>
      </div>
    </div>
  )
}
