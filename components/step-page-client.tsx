'use client'

import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Step {
  id: string
  title: string
  description: string
  whatItDoes: string
  whyItMatters: string
  challenges: string[]
  demo: React.ReactNode
}

interface StepPageClientProps {
  step: Step
  prevStepId: string | null
  nextStepId: string | null
}

export default function StepPageClient({ step, prevStepId, nextStepId }: StepPageClientProps) {
  const { t, i18n } = useTranslation(['step-page', 'common', 'steps'])
  const [stepContent, setStepContent] = useState({
    title: step.title,
    description: step.description,
    whatItDoes: step.whatItDoes,
    whyItMatters: step.whyItMatters,
    challenges: step.challenges
  })

  // Load translated content when language changes
  useEffect(() => {
    const loadStepContent = async () => {
      try {
        const currentLang = i18n.language || 'en'
        
        // Try to get translated content from i18n
        const translatedTitle = t(`steps:steps.${step.id}.title`, { defaultValue: step.title })
        const translatedDescription = t(`steps:steps.${step.id}.description`, { defaultValue: step.description })
        const translatedWhatItDoes = t(`steps:steps.${step.id}.whatItDoes`, { defaultValue: step.whatItDoes })
        const translatedWhyItMatters = t(`steps:steps.${step.id}.whyItMatters`, { defaultValue: step.whyItMatters })
        
        // Handle challenges array
        const challengesKey = `steps:steps.${step.id}.challenges`
        let translatedChallenges = step.challenges
        
        // Try to get translated challenges
        try {
          const challengesFromI18n = i18n.getResource(currentLang, 'steps', `steps.${step.id}.challenges`)
          if (challengesFromI18n && Array.isArray(challengesFromI18n)) {
            translatedChallenges = challengesFromI18n
          }
        } catch (e) {
          // Keep original challenges if translation fails
        }

        setStepContent({
          title: translatedTitle,
          description: translatedDescription,
          whatItDoes: translatedWhatItDoes,
          whyItMatters: translatedWhyItMatters,
          challenges: translatedChallenges
        })
      } catch (error) {
        console.error('Error loading step content:', error)
        // Keep original content on error
      }
    }

    loadStepContent()
  }, [i18n.language, step.id, step.title, step.description, step.whatItDoes, step.whyItMatters, step.challenges, t, i18n])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-2 py-10">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('step-page:navigation.backToOverview', 'Back to Overview')}
          </Link>
        </div>

        <header className="max-w-4xl mx-auto mb-12">
          <div className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
            Step {step.id}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            {stepContent.title}
          </h1>
          <p className="text-xl text-slate-300">{stepContent.description}</p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8">
          {/* Details Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-medium text-emerald-400 mb-3">
                {t('step-page:sections.whatItDoes', 'What It Does')}
              </h2>
              <p className="text-slate-300">{stepContent.whatItDoes}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-medium text-emerald-400 mb-3">
                {t('step-page:sections.whyItMatters', 'Why It Matters')}
              </h2>
              <p className="text-slate-300">{stepContent.whyItMatters}</p>
            </div>
          </section>

          {/* Challenges Section */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-medium text-emerald-400 mb-4">
              {t('step-page:sections.commonChallenges', 'Common Challenges')}
            </h2>
            <ul className="space-y-2">
              {stepContent.challenges.map((challenge, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-300 pl-2"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Demo Section */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-medium text-emerald-400 mb-4">
              {t('step-page:sections.interactiveDemo', 'Interactive Demo')}
            </h2>
            {step.demo}
          </section>

          {/* Respeak Call to Action */}
          <section className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-emerald-400 mb-2">
                  {t('step-page:cta.title', 'Skip the Complexity')}
                </h2>
                <p className="text-slate-300 mb-4">
                  {t('step-page:cta.description', 'Building a robust {{stepTitle}} solution is challenging. Respeak\'s Enterprise RAG Platform handles this complexity for you.', { stepTitle: stepContent.title })}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="https://meetings-eu1.hubspot.com/tim-rietz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm
                      font-medium transition-all flex items-center gap-2"
                  >
                    {t('step-page:cta.scheduleDemo', 'Schedule a Demo')}
                  </a>
                  <a
                    href="https://www.respeak.io/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm
                      font-medium transition-all flex items-center gap-2"
                  >
                    {t('step-page:cta.contactUs', 'Contact Us')}
                  </a>
                </div>
              </div>
              <div className="flex-shrink-0 hidden md:block">
                <a
                  href="https://www.linkedin.com/in/timrietz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{t('step-page:cta.followText', 'Follow')} {t('step-page:cta.drTimRietz', 'Dr. Tim Rietz')}</p>
                    <p className="text-xs text-slate-400">{t('step-page:cta.forMoreInsights', 'for more RAG insights')}</p>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="flex justify-between items-center mt-8">
            <div className="flex-1">
              {prevStepId && (
                <Link
                  href={`/steps/${prevStepId}`}
                  className="group inline-flex items-center text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  <div>
                    <div className="text-sm text-slate-400">{t('step-page:navigation.previous', 'Previous')}</div>
                    <div className="font-medium">{t(`steps:steps.${prevStepId}.title`, `Step ${prevStepId}`)}</div>
                  </div>
                </Link>
              )}
            </div>
            
            <div className="flex-1 text-right">
              {nextStepId && (
                <Link
                  href={`/steps/${nextStepId}`}
                  className="group inline-flex items-center text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <div>
                    <div className="text-sm text-slate-400">{t('step-page:navigation.next', 'Next')}</div>
                    <div className="font-medium">{t(`steps:steps.${nextStepId}.title`, `Step ${nextStepId}`)}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-10 text-center text-slate-400 border-t border-slate-800 mt-16">
          <p>{t('step-page:footer.copyright', '© 2025')} <a href="https://www.respeak.io" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Respeak GmbH</a>. {t('step-page:footer.allRightsReserved', 'All rights reserved')}.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="https://www.respeak.io" className="hover:text-emerald-400 transition-colors">{t('step-page:footer.website', 'Website')}</a>
            <a href="https://www.linkedin.com/company/respeak-io" className="hover:text-emerald-400 transition-colors">{t('step-page:footer.linkedin', 'LinkedIn')}</a>
            <a href="https://meetings-eu1.hubspot.com/tim-rietz" className="hover:text-emerald-400 transition-colors">{t('step-page:footer.bookDemo', 'Book a Demo')}</a>
          </div>
        </footer>
      </div>
    </div>
  )
} 