// Barre de progression + compteur de questions.
export default function ProgressBar({ index, total, nbRepondu }) {
  const pourcent = Math.round(((index + 1) / total) * 100)

  return (
    <div className="progression">
      <div className="progression-infos">
        <span>
          Question <strong>{index + 1}</strong> / {total}
        </span>
        <span className="progression-repondu">{nbRepondu} répondue(s)</span>
      </div>
      <div className="barre" role="progressbar" aria-valuenow={pourcent} aria-valuemin={0} aria-valuemax={100}>
        <div className="barre-remplie" style={{ width: `${pourcent}%` }} />
      </div>
    </div>
  )
}
