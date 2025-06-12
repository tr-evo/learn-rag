"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, AlertTriangle, Zap, ExternalLink, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import LanguageSwitcher from "@/components/language-switcher"

export default function Home() {
  const { t, ready } = useTranslation(['home', 'common', 'steps'])
  const [showCta, setShowCta] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Show CTA after 45 seconds on the page
    const timer = setTimeout(() => {
      setShowCta(true)
    }, 45000)

    // Show welcome message on first visit
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome) {
      setShowWelcome(true)
      localStorage.setItem('hasSeenWelcome', 'true')
      
      // Auto-hide welcome after 8 seconds
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(false)
      }, 8000)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(welcomeTimer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  const steps = Array.from({ length: 15 }, (_, i) => {
    const stepId = (i + 1).toString()
    return {
      id: i + 1,
      title: ready ? t(`steps:steps.${stepId}.title`) : `Step ${stepId}`,
      description: ready ? t(`steps:steps.${stepId}.description`) : 'Loading...',
      pitfall: ready ? t(`steps:steps.${stepId}.pitfall`) : 'Loading...',
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/20 to-transparent"></div>

        <header className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            {t('home:hero.title', 'RAG Explorer')}
          </h1>
          <p className="text-xl md:text-2xl text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            {t('home:hero.subtitle', 'An interactive journey through the Retrieval Augmented Generation pipeline — explore each component, understand pitfalls, and master implementation.')}
          </p>
          <div className="text-center text-slate-300 mb-6">
            <p>{t('home:hero.broughtBy', 'Brought to you by')} <a href="https://www.respeak.io/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-semibold"><img src="/Respeak_fav.png" alt="Respeak" className="inline-block h-4 w-4 mr-2" />Respeak</a> — {t('home:hero.enterpriseRag', 'Enterprise RAG Platform')}</p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              href="/steps/1" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full 
                text-lg font-semibold transition-all transform hover:scale-105 
                flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
            >
              <Zap className="h-5 w-5" />
              {t('common:buttons.startLearning', 'Start Learning')}
            </Link>
            <a
              href="https://www.respeak.io/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-full 
                text-lg font-semibold transition-all transform hover:scale-105 
                flex items-center gap-2 shadow-lg"
            >
              <ExternalLink className="h-5 w-5" />
              {t('common:buttons.getRagSolution', 'Get a RAG Solution')}
            </a>
          </div>
        </header>
      </div>

      {/* Welcome Message */}
      {showWelcome && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md animate-slide-up">
          <div className="bg-emerald-600 border border-emerald-700 rounded-lg shadow-xl p-5 relative">
            <button 
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-2 text-emerald-300 hover:text-white"
              aria-label="Close welcome message"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <span role="img" aria-label="waving hand">👋</span> {t('home:welcome.title', 'Welcome to RAG Explorer!')}
            </h3>
            <p className="text-emerald-100 text-sm">
              {t('home:welcome.message', "Ready to dive into the world of Retrieval Augmented Generation? We'll guide you through each step of building powerful, knowledge-grounded AI systems. Enjoy the journey!")}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="steps" className="container mx-auto px-4 py-16">
        {/* RAG Process Overview - Now placed above the step grid */}
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          {t('home:overview.title', 'The RAG Process at a Glance')}
        </h2>

        {/* Phase Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Data Ingestion */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 relative
            hover:border-emerald-500/30 transition-all group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white 
              px-4 py-1 rounded-full text-sm font-medium">
              Phase 1
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mt-4 mb-3">{t('home:overview.phase1.title', 'Data Ingestion')}</h3>
            <p className="text-slate-300 mb-3">{t('home:overview.phase1.description', 'Prepare, clean, and index source data')}</p>
            <div className="text-amber-300/80 text-sm">
              {t('home:overview.phase1.steps', 'Steps: 1-6')}
            </div>

            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                <path d="M5 12h14M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Retrieval */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 relative
            hover:border-emerald-500/30 transition-all group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white 
              px-4 py-1 rounded-full text-sm font-medium">
              Phase 2
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mt-4 mb-3">{t('home:overview.phase2.title', 'Retrieval')}</h3>
            <p className="text-slate-300 mb-3">{t('home:overview.phase2.description', 'Find and rank relevant information')}</p>
            <div className="text-amber-300/80 text-sm">
              {t('home:overview.phase2.steps', 'Steps: 7-10')}
            </div>

            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                <path d="M5 12h14M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Generation */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 relative
            hover:border-emerald-500/30 transition-all group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white 
              px-4 py-1 rounded-full text-sm font-medium">
              Phase 3
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mt-4 mb-3">{t('home:overview.phase3.title', 'Generation')}</h3>
            <p className="text-slate-300 mb-3">{t('home:overview.phase3.description', 'Create and improve responses')}</p>
            <div className="text-amber-300/80 text-sm">
              {t('home:overview.phase3.steps', 'Steps: 11-15')}
            </div>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 md:p-8 max-w-4xl mx-auto mb-20
          shadow-lg">
          <h3 className="text-lg font-medium text-emerald-400 mb-4">{t('home:benefits.title', 'Key Benefits of RAG')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <h4 className="font-medium text-white mb-2">{t('home:benefits.reducedHallucinations.title', 'Reduced Hallucinations')}</h4>
              <p className="text-slate-300 text-sm">{t('home:benefits.reducedHallucinations.description', 'Ground responses in factual data rather than training data memorization')}</p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <h4 className="font-medium text-white mb-2">{t('home:benefits.upToDate.title', 'Up-to-date Information')}</h4>
              <p className="text-slate-300 text-sm">{t('home:benefits.upToDate.description', 'Access fresh data not available during model training')}</p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h4 className="font-medium text-white mb-2">{t('home:benefits.sourceAttribution.title', 'Source Attribution')}</h4>
              <p className="text-slate-300 text-sm">{t('home:benefits.sourceAttribution.description', 'Provide citations and evidence for generated content')}</p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <h4 className="font-medium text-white mb-2">{t('home:benefits.domainSpecialization.title', 'Domain Specialization')}</h4>
              <p className="text-slate-300 text-sm">{t('home:benefits.domainSpecialization.description', 'Enhance performance on specific topics without fine-tuning')}</p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Grid with Phase Labels */}
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          {t('home:pipeline.title', 'The RAG Pipeline: Step by Step')}
        </h2>

        {/* Phase 1 Label */}
        <div className="mb-8">
          <div className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-lg text-lg font-medium mb-4">
            {t('home:phases.phase1', 'Phase 1: Data Ingestion')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {steps.slice(0, 6).map((step) => (
              <Link
                href={`/steps/${step.id}`}
                key={step.id}
                className="group"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl 
                  shadow-lg p-6 h-full transition-all duration-300 
                  hover:bg-slate-700/50 hover:border-emerald-500/50
                  hover:shadow-emerald-500/10 hover:-translate-y-1">

                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 
                      text-white rounded-full w-10 h-10 flex items-center justify-center
                      shadow-inner shadow-emerald-700">
                      {step.id}
                    </div>
                    <h3 className="text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <div className="mb-4 pl-14">
                    <div className="flex items-start gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{step.description}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-300/80 text-sm">{step.pitfall}</p>
                    </div>
                  </div>

                  <div className="pl-14 mt-6 flex items-center text-emerald-400 group-hover:text-emerald-300">
                    <span className="transition-all group-hover:mr-2">{t('home:stepCard.explore', 'Explore')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Phase 2 Label */}
        <div className="mb-8">
          <div className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-lg text-lg font-medium mb-4">
            {t('home:phases.phase2', 'Phase 2: Retrieval')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {steps.slice(6, 10).map((step) => (
              <Link
                href={`/steps/${step.id}`}
                key={step.id}
                className="group"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl 
                  shadow-lg p-6 h-full transition-all duration-300 
                  hover:bg-slate-700/50 hover:border-emerald-500/50
                  hover:shadow-emerald-500/10 hover:-translate-y-1">

                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 
                      text-white rounded-full w-10 h-10 flex items-center justify-center
                      shadow-inner shadow-emerald-700">
                      {step.id}
                    </div>
                    <h3 className="text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <div className="mb-4 pl-14">
                    <div className="flex items-start gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{step.description}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-300/80 text-sm">{step.pitfall}</p>
                    </div>
                  </div>

                  <div className="pl-14 mt-6 flex items-center text-emerald-400 group-hover:text-emerald-300">
                    <span className="transition-all group-hover:mr-2">{t('home:stepCard.explore', 'Explore')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Phase 3 Label */}
        <div>
          <div className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-lg text-lg font-medium mb-4">
            {t('home:phases.phase3', 'Phase 3: Generation')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.slice(10).map((step) => (
              <Link
                href={`/steps/${step.id}`}
                key={step.id}
                className="group"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl 
                  shadow-lg p-6 h-full transition-all duration-300 
                  hover:bg-slate-700/50 hover:border-emerald-500/50
                  hover:shadow-emerald-500/10 hover:-translate-y-1">

                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 
                      text-white rounded-full w-10 h-10 flex items-center justify-center
                      shadow-inner shadow-emerald-700">
                      {step.id}
                    </div>
                    <h3 className="text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <div className="mb-4 pl-14">
                    <div className="flex items-start gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{step.description}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-300/80 text-sm">{step.pitfall}</p>
                    </div>
                  </div>

                  <div className="pl-14 mt-6 flex items-center text-emerald-400 group-hover:text-emerald-300">
                    <span className="transition-all group-hover:mr-2">{t('home:stepCard.explore', 'Explore')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Popup CTA */}
      {showCta && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-slide-up">
          <div className="bg-emerald-900 border border-emerald-700 rounded-lg shadow-xl p-5 relative">
            <button
              onClick={() => setShowCta(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              {t('home:popup.title', 'Skip the RAG Complexity')}
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              {t('home:popup.description', 'Building a RAG system from scratch can be challenging. Let us handle the hard parts for you with our enterprise-ready platform.')}
            </p>
            <div className="flex gap-3">
              <a
                href="https://meetings-eu1.hubspot.com/tim-rietz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex-1 text-center"
              >
                {t('home:popup.scheduleDemo', 'Schedule a Demo')}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Respeak Call to Action Section - Add before footer */}
      <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-8 max-w-4xl mx-auto mb-16 mt-20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-emerald-400 mb-3">{t('home:cta.title', 'Skip the RAG Complexity')}</h3>
            <p className="text-slate-300 mb-4">
              {t('home:cta.description', 'Building RAG systems from scratch is challenging. Respeak provides an out-of-the-box RAG platform with cutting-edge information extraction, table parsing, and image understanding.')}
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://meetings-eu1.hubspot.com/tim-rietz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg
                  font-medium transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                {t('home:cta.scheduleDemo', 'Schedule a Demo')}
              </a>
              <a
                href="https://www.respeak.io"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg
                  font-medium transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                {t('home:cta.visitRespeak', 'Visit Respeak')}
              </a>
            </div>
          </div>
          <div className="flex-shrink-0 border-l border-emerald-700 pl-6 hidden md:block">
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
                <p className="font-medium">{t('home:cta.followText', 'Follow Dr. Tim Rietz')}</p>
                <p className="text-xs text-slate-400">{t('home:cta.followSubtext', 'for more RAG insights')}</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 text-center text-slate-400 border-t border-slate-800">
        <p>{t('home:footer.copyright', '© 2025')} <a href="https://www.respeak.io" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Respeak GmbH</a>. {t('home:footer.allRightsReserved', 'All rights reserved')}.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="https://www.respeak.io" className="hover:text-emerald-400 transition-colors">{t('home:footer.website', 'Website')}</a>
          <a href="https://www.linkedin.com/company/respeak-io" className="hover:text-emerald-400 transition-colors">{t('home:footer.linkedin', 'LinkedIn')}</a>
          <a href="https://meetings-eu1.hubspot.com/tim-rietz" className="hover:text-emerald-400 transition-colors">{t('home:footer.bookDemo', 'Book a Demo')}</a>
        </div>
      </footer>
    </div>
  )
}
