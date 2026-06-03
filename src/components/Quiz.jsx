import { useState } from 'react'
import ProgressBar from './ProgressBar.jsx'

// Cœur du quiz : une question par écran, navigation libre, sans feedback.
export default function Quiz({ questions, reponses, onRepondre, onTerminer }) {
  const [index, setIndex] = useState(0)
  const total = questions.length
  const q = questions[index]

  const estDerniere = index === total - 1
  const nbRepondu = Object.keys(reponses).length
  const nbManquant = total - nbRepondu

  function precedent() {
    setIndex((i) => Math.max(0, i - 1))
  }

  function suivant() {
    setIndex((i) => Math.min(total - 1, i + 1))
  }

  function terminer() {
    if (nbManquant > 0) {
      const ok = window.confirm(
        `Il reste ${nbManquant} question(s) sans réponse.\n` +
          `Les questions non répondues seront comptées comme fausses.\n\n` +
          `Voulez-vous vraiment terminer le quiz ?`,
      )
      if (!ok) return
    }
    onTerminer()
  }

  return (
    <div className="quiz">
      <ProgressBar index={index} total={total} nbRepondu={nbRepondu} />

      <div className="badges">
        <span className={`badge badge-${q.categorie.toLowerCase()}`}>
          {q.categorie}
        </span>
        <span className={`badge badge-type badge-${q.type}`}>
          {q.type === 'bug' ? '🐛 Bug à corriger' : 'Théorie'}
        </span>
      </div>

      <h2 className="enonce">{q.enonce}</h2>

      {q.code && (
        <pre className="bloc-code">
          <code>{q.code}</code>
        </pre>
      )}

      <div className="options">
        {q.options.map((option) => {
          const choisie = reponses[q.id] === option
          return (
            <label
              key={option}
              className={`option ${choisie ? 'option-choisie' : ''}`}
            >
              <input
                type="radio"
                name={q.id}
                value={option}
                checked={choisie}
                onChange={() => onRepondre(q.id, option)}
              />
              <span className="option-texte">{option}</span>
            </label>
          )
        })}
      </div>

      <div className="navigation">
        <button
          type="button"
          className="btn btn-secondaire"
          onClick={precedent}
          disabled={index === 0}
        >
          ← Précédent
        </button>

        {estDerniere ? (
          <button type="button" className="btn btn-principal" onClick={terminer}>
            Terminer le quiz ✓
          </button>
        ) : (
          <button type="button" className="btn btn-principal" onClick={suivant}>
            Suivant →
          </button>
        )}
      </div>
    </div>
  )
}
