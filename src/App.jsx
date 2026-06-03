import { useState, useMemo } from 'react'
import { questions as banque } from './data/questions.js'
import { preparerQuestions, calculerResultat } from './utils/scoring.js'
import Accueil from './components/Accueil.jsx'
import Quiz from './components/Quiz.jsx'
import Resultats from './components/Resultats.jsx'

// Les trois étapes du wizard
const ETAPES = { ACCUEIL: 'accueil', QUIZ: 'quiz', RESULTATS: 'resultats' }

export default function App() {
  const [etape, setEtape] = useState(ETAPES.ACCUEIL)
  const [etudiant, setEtudiant] = useState({ nom: '', prenom: '' })
  const [reponses, setReponses] = useState({}) // { [idQuestion]: valeur }
  const [tentative, setTentative] = useState(0) // change → on régénère les questions

  // Questions préparées (catégories ordonnées + options mélangées).
  // Recalculé à chaque nouvelle tentative.
  const questions = useMemo(
    () => preparerQuestions(banque),
    [tentative],
  )

  // Démarrage du quiz depuis l'écran d'accueil
  function demarrer(infos) {
    setEtudiant(infos)
    setReponses({})
    setEtape(ETAPES.QUIZ)
  }

  // Enregistre / met à jour la réponse d'une question
  function repondre(idQuestion, valeur) {
    setReponses((prec) => ({ ...prec, [idQuestion]: valeur }))
  }

  // Fin du quiz → écran de résultats
  function terminer() {
    setEtape(ETAPES.RESULTATS)
  }

  // Recommencer : on régénère un nouveau jeu de questions mélangées
  function recommencer() {
    setTentative((t) => t + 1)
    setReponses({})
    setEtudiant({ nom: '', prenom: '' })
    setEtape(ETAPES.ACCUEIL)
  }

  const resultat = useMemo(() => {
    if (etape !== ETAPES.RESULTATS) return null
    return calculerResultat(questions, reponses)
  }, [etape, questions, reponses])

  return (
    <div className="app">
      <main className="carte-wizard">
        {etape === ETAPES.ACCUEIL && <Accueil onDemarrer={demarrer} />}

        {etape === ETAPES.QUIZ && (
          <Quiz
            questions={questions}
            reponses={reponses}
            onRepondre={repondre}
            onTerminer={terminer}
          />
        )}

        {etape === ETAPES.RESULTATS && resultat && (
          <Resultats
            etudiant={etudiant}
            resultat={resultat}
            onRecommencer={recommencer}
          />
        )}
      </main>
      <footer className="pied-page">
        Sirel976 — Formation JavaScript · Jour 1 · Mamoudzou, Mayotte (976)
      </footer>
    </div>
  )
}
