import Link from "next/link"
import { ArrowRight, BookOpen, AlertTriangle, Zap } from "lucide-react"

export default function Home() {
  const steps = [
    {
      id: 1,
      title: "Source connection & preprocessing",
      description: "Converts every source to clean, deduplicated text.",
      pitfall: "Failed parsing or noisy leftovers hide data and add junk.",
    },
    {
      id: 2,
      title: "Integrations",
      description: "Links loaders->embeddings->index->LLM into one flow.",
      pitfall: "Interface mismatches or missing auth break the pipeline.",
    },
    {
      id: 3,
      title: "Metadata tagging",
      description: "Enables filtering, access control, and audit.",
      pitfall: "Missing or inconsistent tags block filters and leak data.",
    },
    {
      id: 4,
      title: "Indexing",
      description: "Lets queries hit millions of chunks in milliseconds.",
      pitfall: "Stale or partial index returns outdated or no results.",
    },
    {
      id: 5,
      title: "Chunking design",
      description: "Balances recall vs. context size.",
      pitfall: "Oversized chunks dilute relevance; undersized split answers.",
    },
    {
      id: 6,
      title: "Embedding creation & refresh",
      description: "Provides semantic search backbone.",
      pitfall: "Skipping refresh drifts quality; model changes invalidate vectors.",
    },
    {
      id: 7,
      title: "Query understanding",
      description: "Turns messy input into precise search intent.",
      pitfall: "Ambiguity or wrong rewrite misguides retrieval.",
    },
    {
      id: 8,
      title: "Hybrid retrieval",
      description: "Combines keyword precision with vector recall.",
      pitfall: "Poor score fusion slows or skews results.",
    },
    {
      id: 9,
      title: "Filtering & permission checks",
      description: "Removes off-topic or unauthorized chunks.",
      pitfall: "Over-filtering drops answers; under-filtering leaks secrets.",
    },
    {
      id: 10,
      title: "Reranking / fusion",
      description: "Elevates the most answer-rich passages.",
      pitfall: "Heavy models add latency; bad fusion repeats or misorders.",
    },
    {
      id: 11,
      title: "Context assembly",
      description: "Packs the best snippets into the prompt window.",
      pitfall: "Token overflow or duplication confuses the LLM.",
    },
    {
      id: 12,
      title: "Answer generation",
      description: "Produces the user-visible response.",
      pitfall: "Hallucinations if context misses facts or prompt misguides.",
    },
    {
      id: 13,
      title: "Post-processing",
      description: "Formats, cites, and sanity-checks output.",
      pitfall: "Weak fact-check passes errors; over-editing distorts meaning.",
    },
    {
      id: 14,
      title: "Monitoring & evaluation",
      description: "Reveals quality, latency, and drift.",
      pitfall: "Wrong metrics hide failures; poor logging thwarts debugging.",
    },
    {
      id: 15,
      title: "Feedback loop",
      description: "Feeds findings back to improve all stages.",
      pitfall: "Ignoring feedback lets issues persist or regressions slip in.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/20 to-transparent"></div>
        
        <header className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            RAG Explorer
        </h1>
          <p className="text-xl md:text-2xl text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            An interactive journey through the Retrieval Augmented Generation pipeline — 
            explore each component, understand pitfalls, and master implementation.
          </p>
          <div className="flex justify-center">
            <a 
              href="#steps" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full 
                text-lg font-semibold transition-all transform hover:scale-105 
                flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
            >
              <Zap className="h-5 w-5" />
              Start Learning
            </a>
          </div>
      </header>
      </div>

      {/* Main Content */}
      <main id="steps" className="container mx-auto px-4 py-16">
        {/* RAG Process Overview - Now placed above the step grid */}
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          The RAG Process at a Glance
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
            <h3 className="text-xl font-bold text-emerald-400 mt-4 mb-3">Data Ingestion</h3>
            <p className="text-slate-300 mb-3">Prepare, clean, and index source data</p>
            <div className="text-amber-300/80 text-sm">
              Steps: 1-6
            </div>
            
            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                <path d="M5 12h14M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <h3 className="text-xl font-bold text-emerald-400 mt-4 mb-3">Retrieval</h3>
            <p className="text-slate-300 mb-3">Find and rank relevant information</p>
            <div className="text-amber-300/80 text-sm">
              Steps: 7-10
            </div>
            
            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                <path d="M5 12h14M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <h3 className="text-xl font-bold text-emerald-400 mt-4 mb-3">Generation</h3>
            <p className="text-slate-300 mb-3">Create and improve responses</p>
            <div className="text-amber-300/80 text-sm">
              Steps: 11-15
            </div>
          </div>
        </div>
        
        {/* Key Benefits Section */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 md:p-8 max-w-4xl mx-auto mb-20
          shadow-lg">
          <h3 className="text-lg font-medium text-emerald-400 mb-4">Key Benefits of RAG</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <h4 className="font-medium text-white mb-2">Reduced Hallucinations</h4>
              <p className="text-slate-300 text-sm">Ground responses in factual data rather than training data memorization</p>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <h4 className="font-medium text-white mb-2">Up-to-date Information</h4>
              <p className="text-slate-300 text-sm">Access fresh data not available during model training</p>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h4 className="font-medium text-white mb-2">Source Attribution</h4>
              <p className="text-slate-300 text-sm">Provide citations and evidence for generated content</p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"/>
                <line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
              <h4 className="font-medium text-white mb-2">Domain Specialization</h4>
              <p className="text-slate-300 text-sm">Enhance performance on specific topics without fine-tuning</p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Grid with Phase Labels */}
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          The RAG Pipeline: Step by Step
        </h2>
        
        {/* Phase 1 Label */}
        <div className="mb-8">
          <div className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-lg text-lg font-medium mb-4">
            Phase 1: Data Ingestion
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
                    <span className="transition-all group-hover:mr-2">Explore</span>
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
            Phase 2: Retrieval
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
                    <span className="transition-all group-hover:mr-2">Explore</span>
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
            Phase 3: Generation
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
                    <span className="transition-all group-hover:mr-2">Explore</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-400 border-t border-slate-800">
        <p>© {new Date().getFullYear()} RAG Learning Experience</p>
      </footer>
    </div>
  )
}
