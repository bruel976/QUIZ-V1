// =============================================================
//  Génération du PDF de résultat (jsPDF)
// =============================================================

import { jsPDF } from 'jspdf'
import { dateFr } from './scoring.js'

// Couleurs de la charte Sirel976
const NAVY = [0, 0, 99]
const VERT = [22, 130, 70]
const ROUGE = [193, 18, 31]
const GRIS = [90, 90, 90]

export function genererPDF({ nom, prenom, module, niveau, parcours, resultat }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marge = 18
  let y = 0

  // Saut de page automatique si on dépasse le bas de la feuille.
  const verifierPage = (hauteurNecessaire = 10) => {
    if (y + hauteurNecessaire > pageH - marge) {
      doc.addPage()
      y = marge
    }
  }

  // ---- En-tête ----
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageW, 32, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(`Sirel976 — Formation · ${module.titre}`, marge, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`${niveau.titre} — ${parcours.titre} : ${parcours.theme}`, marge, 23)
  y = 44

  // ---- Identité de l'étudiant ----
  doc.setTextColor(...NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Attestation de résultat', marge, y)
  y += 9

  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Étudiant : ${prenom} ${nom}`, marge, y)
  y += 7
  doc.text(`Date : ${dateFr(new Date())}`, marge, y)
  y += 12

  // ---- Encadré de la note ----
  const reussite = resultat.noteSur20 >= 10
  doc.setFillColor(...(reussite ? VERT : ROUGE))
  doc.roundedRect(marge, y, pageW - marge * 2, 26, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(`Note : ${resultat.noteSur20} / 20`, marge + 6, y + 12)
  doc.setFontSize(13)
  doc.text(`Mention : ${resultat.mention}`, marge + 6, y + 21)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(
    `${resultat.bonnes} / ${resultat.total} bonnes réponses`,
    pageW - marge - 6,
    y + 16,
    { align: 'right' },
  )
  y += 36

  // ---- Détail par catégorie ----
  doc.setTextColor(...NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Score par catégorie', marge, y)
  y += 8

  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  Object.entries(resultat.parCategorie).forEach(([cat, s]) => {
    verifierPage(8)
    doc.text(`• ${cat} : ${s.bonnes} / ${s.total}`, marge + 4, y)
    y += 7
  })
  y += 6

  // ---- Corrigé détaillé ----
  verifierPage(14)
  doc.setTextColor(...NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Corrigé détaillé', marge, y)
  y += 9

  const largeurTexte = pageW - marge * 2 - 4

  resultat.details.forEach((q, index) => {
    verifierPage(28)

    // Énoncé
    doc.setTextColor(...NAVY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    const enonceLignes = doc.splitTextToSize(
      `${index + 1}. [${q.categorie}] ${q.enonce}`,
      largeurTexte,
    )
    doc.text(enonceLignes, marge, y)
    y += enonceLignes.length * 5

    // Extrait de code éventuel
    if (q.code) {
      doc.setFont('courier', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...GRIS)
      const codeLignes = doc.splitTextToSize(q.code, largeurTexte)
      verifierPage(codeLignes.length * 4.5 + 4)
      doc.text(codeLignes, marge + 2, y)
      y += codeLignes.length * 4.5 + 1
    }

    // Réponse de l'étudiant
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...(q.correcte ? VERT : ROUGE))
    const symbole = q.correcte ? '[OK]' : '[X]'
    const reponse = q.reponseEtudiant ?? '(aucune réponse)'
    const repLignes = doc.splitTextToSize(
      `${symbole} Votre réponse : ${reponse}`,
      largeurTexte,
    )
    verifierPage(repLignes.length * 5)
    doc.text(repLignes, marge + 2, y)
    y += repLignes.length * 5

    // Bonne réponse (si erreur)
    if (!q.correcte) {
      doc.setTextColor(...VERT)
      const bonneLignes = doc.splitTextToSize(
        `Bonne réponse : ${q.correct}`,
        largeurTexte,
      )
      verifierPage(bonneLignes.length * 5)
      doc.text(bonneLignes, marge + 2, y)
      y += bonneLignes.length * 5
    }

    // Explication
    doc.setTextColor(...GRIS)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    const expLignes = doc.splitTextToSize(`→ ${q.explication}`, largeurTexte)
    verifierPage(expLignes.length * 4.5 + 4)
    doc.text(expLignes, marge + 2, y)
    y += expLignes.length * 4.5 + 6
  })

  // ---- Pied de page sur toutes les pages ----
  const nbPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= nbPages; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...GRIS)
    doc.text('Sirel976 — Mamoudzou, Mayotte (976)', marge, pageH - 8)
    doc.text(`Page ${p} / ${nbPages}`, pageW - marge, pageH - 8, {
      align: 'right',
    })
  }

  // ---- Téléchargement ----
  const nomFichier = `resultat-quiz-${prenom}-${nom}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  doc.save(`${nomFichier}.pdf`)
}
