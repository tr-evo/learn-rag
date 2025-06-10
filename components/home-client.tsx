'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, AlertTriangle, Zap, ExternalLink, X } from 'lucide-react'
import LanguageSwitcher from '@/components/language-switcher'

export type HomeClientProps = {
  lang: string
  t: Record<string, string>
}

export default function HomeClient({ lang, t }: HomeClientProps) {
  const [showCta, setShowCta] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowCta(true), 45000)
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome) {
      setShowWelcome(true)
      localStorage.setItem('hasSeenWelcome', 'true')
      const welcomeTimer = setTimeout(() => setShowWelcome(false), 8000)
      return () => {
        clearTimeout(timer)
        clearTimeout(welcomeTimer)
      }
    }
    return () => clearTimeout(timer)
  }, [])

  const steps = [
    { id: 1, title: 'Source connection & preprocessing', description: 'Converts every source to clean, deduplicated text.', pitfall: 'Failed parsing or noisy leftovers hide data and add junk.' },
    { id: 2, title: 'Integrations', description: 'Links loaders->embeddings->index->LLM into one flow.', pitfall: 'Interface mismatches or missing auth break the pipeline.' },
    { id: 3, title: 'Metadata tagging', description: 'Enables filtering, access control, and audit.', pitfall: 'Missing or inconsistent tags block filters and leak data.' },
    { id: 4, title: 'Indexing', description: 'Lets queries hit millions of chunks in milliseconds.', pitfall: 'Stale or partial index returns outdated or no results.' },
    { id: 5, title: 'Chunking design', description: 'Balances recall vs. context size.', pitfall: 'Oversized chunks dilute relevance; undersized split answers.' },
    { id: 6, title: 'Embedding creation & refresh', description: 'Provides semantic search backbone.', pitfall: 'Skipping refresh drifts quality; model changes invalidate vectors.' },
    { id: 7, title: 'Query understanding', description: 'Turns messy input into precise search intent.', pitfall: 'Ambiguity or wrong rewrite misguides retrieval.' },
    { id: 8, title: 'Hybrid retrieval', description: 'Combines keyword precision with vector recall.', pitfall: 'Poor score fusion slows or skews results.' },
    { id: 9, title: 'Filtering & permission checks', description: 'Removes off-topic or unauthorized chunks.', pitfall: 'Over-filtering drops answers; under-filtering leaks secrets.' },
    { id: 10, title: 'Reranking / fusion', description: 'Elevates the most answer-rich passages.', pitfall: 'Heavy models add latency; bad fusion repeats or misorders.' },
    { id: 11, title: 'Context assembly', description: 'Packs the best snippets into the prompt window.', pitfall: 'Token overflow or duplication confuses the LLM.' },
    { id: 12, title: 'Answer generation', description: 'Produces the user-visible response.', pitfall: 'Hallucinations if context misses facts or prompt misguides.' },
    { id: 13, title: 'Post-processing', description: 'Formats, cites, and sanity-checks output.', pitfall: 'Weak fact-check passes errors; over-editing distorts meaning.' },
    { id: 14, title: 'Monitoring & evaluation', description: 'Reveals quality, latency, and drift.', pitfall: 'Wrong metrics hide failures; poor logging thwarts debugging.' },
    { id: 15, title: 'Feedback loop', description: 'Feeds findings back to improve all stages.', pitfall: 'Ignoring feedback lets issues persist or regressions slip in.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/20 to-transparent"></div>
        <header className="container mx-auto px-4 py-16 relative z-10">
          <div className="absolute top-4 right-4"><LanguageSwitcher /></div>
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            {t.hero}
          </h1>
          <p className="text-xl md:text-2xl text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            {t.tagline}
          </p>
          <div className="text-center text-slate-300 mb-6">
            <p>
              Brought to you by{' '}
              <a
                href="https://www.respeak.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <img src="/Respeak_fav.png" alt="Respeak" className="inline-block h-4 w-4 mr-2" />Respeak
              </a>{' '}
              — Enterprise RAG Platform
            </p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href={`/${lang}/steps/1`}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
            >
              <Zap className="h-5 w-5" />
              {t.startLearning}
            </Link>
            <a
              href="https://www.respeak.io/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <ExternalLink className="h-5 w-5" />
              {t.getSolution}
            </a>
          </div>
        </header>
      </div>

      {/* Welcome Message */}
      {showWelcome && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md animate-slide-up">
          <div className="bg-emerald-600 border border-emerald-700 rounded-lg shadow-xl p-5 relative">
            <button onClick={() => setShowWelcome(false)} className="absolute top-2 right-2 text-emerald-300 hover:text-white" aria-label="Close welcome message">
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <span role="img" aria-label="waving hand">
                👋
              </span>{' '}
              Welcome to RAG Explorer!
            </h3>
            <p className="text-emerald-100 text-sm">
              Ready to dive into the world of Retrieval Augmented Generation? We'll guide you through each step of building powerful, knowledge-grounded AI systems. Enjoy the journey!
            </p>
          </div>
        </div>
      )}

      {/* Main Content - truncated for brevity */}
      {/* ... existing content including steps and CTA sections ... */}

    </div>
  )
}
