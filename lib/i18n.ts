export const locales = ['en', 'de'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'

export const ui = {
  en: {
    startLearning: 'Start Learning',
    getSolution: 'Get a RAG Solution',
    hero: 'RAG Explorer',
    tagline:
      'An interactive journey through the Retrieval Augmented Generation pipeline — explore each component, understand pitfalls, and master implementation.',
    processHeader: 'The RAG Process at a Glance',
    benefitsTitle: 'Key Benefits of RAG',
    stepHeader: 'The RAG Pipeline: Step by Step',
    skipComplexityTitle: 'Skip the RAG Complexity',
    skipComplexityDesc:
      "Building a RAG system from scratch can be challenging. Let us handle the hard parts for you with our enterprise-ready platform.",
  },
  de: {
    startLearning: 'Jetzt starten',
    getSolution: 'RAG-Lösung anfragen',
    hero: 'RAG Explorer',
    tagline:
      'Eine interaktive Reise durch die Retrieval-Augmented-Generation-Pipeline – erkunde jede Komponente, verstehe Fallstricke und meistere die Umsetzung.',
    processHeader: 'Der RAG-Prozess im Überblick',
    benefitsTitle: 'Wichtige Vorteile von RAG',
    stepHeader: 'Die RAG-Pipeline Schritt für Schritt',
    skipComplexityTitle: 'Komplexität überspringen',
    skipComplexityDesc:
      'Der Aufbau eines RAG-Systems von Grund auf ist herausfordernd. Unsere Enterprise-Plattform übernimmt die schwierigen Teile für dich.',
  },
} as const

export function getLocale(locale: string | undefined): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale
}
