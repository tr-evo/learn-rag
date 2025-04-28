import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Retrieval Augmented Generation
        </h1>
        <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-8">
          An interactive guide to understanding RAG systems
        </p>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-500 z-0"></div>

          <div className="relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center mb-16 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                  <Link href={`/steps/${step.id}`} className="group">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                      <h3 className="text-xl font-bold mb-2 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <span className="inline-block bg-emerald-600 dark:bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                          {step.id}
                        </span>
                        <span>{step.title}</span>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">{step.description}</p>
                      <p className="text-red-500 dark:text-red-400 text-sm italic">Pitfall: {step.pitfall}</p>
                      <div className={`mt-4 flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Learn more <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="bg-emerald-500 w-6 h-6 rounded-full"></div>
                </div>

                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-slate-600 dark:text-slate-400">
        <p>© {new Date().getFullYear()} RAG Learning Experience</p>
      </footer>
    </div>
  )
}
