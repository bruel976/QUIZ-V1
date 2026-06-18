import { useState, useMemo } from 'react'
import { questions as banque } from './data/questions.js'
import { preparerQuestions, calculerResultat } from './utils/scoring.js'
import Accueil from './components/Accueil.jsx'
import Quiz from './components/Quiz.jsx'
import Resultats from './components/Resultats.jsx'
import JeuRobot from './components/JeuRobot.jsx'

// Les étapes du wizard (le jeu est un parcours « libre », sans note)
const ETAPES = { ACCUEIL: 'accueil', QUIZ: 'quiz', RESULTATS: 'resultats', JEU: 'jeu' }

export default function App() {
  const [etape, setEtape] = useState(ETAPES.ACCUEIL)
  const [etudiant, setEtudiant] = useState({ nom: '', prenom: '' })
  const [module, setModule] = useState(null) // module (EC) choisi sur l'accueil
  const [niveau, setNiveau] = useState(null) // niveau choisi sur l'accueil
  const [parcours, setParcours] = useState(null) // parcours (option) choisi
  const [reponses, setReponses] = useState({}) // { [idQuestion]: valeur }
  const [tentative, setTentative] = useState(0) // change → on régénère les questions

  // Questions préparées pour le parcours choisi (vide tant qu'aucun parcours).
  // Recalculé à chaque nouvelle tentative ou changement de parcours.
  const questions = useMemo(
    () => (parcours ? preparerQuestions(banque, parcours) : []),
    [tentative, parcours],
  )

  // Démarrage du quiz depuis l'écran d'accueil
  function demarrer(infos) {
    setEtudiant({ nom: infos.nom, prenom: infos.prenom })
    setModule(infos.module)
    setNiveau(infos.niveau)
    setParcours(infos.parcours)
    setReponses({})
    setEtape(ETAPES.QUIZ)
  }

  // Lancement d'un jeu (parcours marqué `jeu`) depuis l'écran d'accueil
  function jouer(infos) {
    setModule(infos.module)
    setNiveau(infos.niveau)
    setParcours(infos.parcours)
    setEtape(ETAPES.JEU)
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
    setModule(null)
    setNiveau(null)
    setParcours(null)
    setEtape(ETAPES.ACCUEIL)
  }

  const resultat = useMemo(() => {
    if (etape !== ETAPES.RESULTATS) return null
    return calculerResultat(questions, reponses)
  }, [etape, questions, reponses])

  return (
    <div className="app">
      <main className="carte-wizard">
        {etape === ETAPES.ACCUEIL && <Accueil onDemarrer={demarrer} onJouer={jouer} />}

        {etape === ETAPES.JEU && <JeuRobot onQuitter={recommencer} />}

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
            module={module}
            niveau={niveau}
            parcours={parcours}
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
