# Quiz Jour 1 — HTML · CSS · JavaScript (Sirel976)

Mini-jeu de quiz interactif développé en **React + Vite** pour évaluer les bases du Jour 1 de la formation.

## Fonctionnalités

- 🧙 Parcours en **wizard** : accueil → quiz → résultats
- 👤 Saisie du **nom et prénom** de l'étudiant au démarrage
- ❓ **50 questions** : 17 HTML, 17 CSS, 16 JavaScript (variables & opérateurs)
- 🐛 Questions **théoriques** + **cas pratiques / bugs à corriger** (QCM)
- 🎓 **Mode examen** : aucune correction affichée pendant le quiz
- 🔀 Ordre des réponses **mélangé** à chaque tentative
- 📊 **Note /20** + mention + score par catégorie à la fin
- 📥 **Corrigé complet** et **export PDF** (jsPDF) avec le nom de l'étudiant

## Lancer le projet

```bash
npm install      # à faire une seule fois (nécessite internet)
npm run dev      # démarre le serveur de développement
```

Puis ouvrir l'adresse affichée (par défaut http://localhost:5173).

## Construire la version finale (optionnel)

```bash
npm run build    # génère le dossier dist/
npm run preview  # prévisualise la version de production
```

## Structure

```
src/
├── main.jsx                # point d'entrée React
├── App.jsx                 # état global du wizard
├── data/questions.js       # banque des 50 questions
├── components/
│   ├── Accueil.jsx         # saisie nom + prénom
│   ├── Quiz.jsx            # une question par écran
│   ├── ProgressBar.jsx     # barre de progression
│   └── Resultats.jsx       # note, corrigé, bouton PDF
├── utils/
│   ├── scoring.js          # mélange, score, note /20
│   └── pdf.js              # génération du PDF (jsPDF)
└── styles/index.css        # design wizard (charte Sirel976)
```

---
Sirel976 — Mamoudzou, Mayotte (976)
