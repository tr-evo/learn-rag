import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react"
import SourcePreprocessingDemo from "@/components/demos/source-preprocessing-demo"
import IntegrationsDemo from "@/components/demos/integrations-demo"
import MetadataTaggingDemo from "@/components/demos/metadata-tagging-demo"
import IndexingDemo from "@/components/demos/indexing-demo"
import ChunkingDesignDemo from "@/components/demos/chunking-design-demo"
import EmbeddingCreationDemo from "@/components/demos/embedding-creation-demo"
import QueryUnderstandingDemo from "@/components/demos/query-understanding-demo"
import HybridRetrievalDemo from "@/components/demos/hybrid-retrieval-demo"
import FilteringPermissionChecksDemo from "@/components/demos/filtering-permission-checks-demo"
import RerankingFusionDemo from "@/components/demos/reranking-fusion-demo"
import ContextAssemblyDemo from "@/components/demos/context-assembly-demo"
import AnswerGenerationDemo from "@/components/demos/answer-generation-demo"
import PostProcessingDemo from "@/components/demos/post-processing-demo"
import MonitoringEvaluationDemo from "@/components/demos/monitoring-evaluation-demo"
import FeedbackLoopDemo from "@/components/demos/feedback-loop-demo"
import { getStep, getStepList } from "@/lib/steps"

const demoMap: Record<string, JSX.Element> = {
  "1": <SourcePreprocessingDemo />,
  "2": <IntegrationsDemo />,
  "3": <MetadataTaggingDemo />,
  "4": <IndexingDemo />,
  "5": <ChunkingDesignDemo />,
  "6": <EmbeddingCreationDemo />,
  "7": <QueryUnderstandingDemo />,
  "8": <HybridRetrievalDemo />,
  "9": <FilteringPermissionChecksDemo />,
  "10": <RerankingFusionDemo />,
  "11": <ContextAssemblyDemo />,
  "12": <AnswerGenerationDemo />,
  "13": <PostProcessingDemo />,
  "14": <MonitoringEvaluationDemo />,
  "15": <FeedbackLoopDemo />,
}

export async function generateStaticParams() {
  const list = await getStepList('en')
  return list.map((step) => ({ id: step.id }))
}

export default async function StepPage({ params }: { params: { id: string; locale: string } }) {
  const { id: stepId, locale } = params
  const step = await getStep(locale, stepId)
  const steps = await getStepList(locale)

  if (!step) {
    notFound()
  }

  const currentIndex = steps.findIndex((s) => s.id === stepId)
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null

  const demo = demoMap[stepId]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-2 py-10">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Link>
        </div>

        <header className="max-w-4xl mx-auto mb-12">
          <div className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
            Step {step.id}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            {step.title}
          </h1>
          <p className="text-xl text-slate-300">{step.description}</p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8">
          {/* Details Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-medium text-emerald-400 mb-3">
                What It Does
              </h2>
              <p className="text-slate-300">{step.whatItDoes}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-medium text-emerald-400 mb-3">
                Why It Matters
              </h2>
              <p className="text-slate-300">{step.whyItMatters}</p>
            </div>
          </section>

          {/* Challenges Section */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-medium text-emerald-400 mb-4">
              Common Challenges
            </h2>
            <ul className="space-y-2">
              {step.challenges.map((challenge, i) => (
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
              Interactive Demo
            </h2>
            {demo}
          </section>

          {/* Respeak Call to Action */}
          <section className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-emerald-400 mb-2">
                  Skip the Complexity
                </h2>
                <p className="text-slate-300 mb-4">
                  Building a robust {step.title.toLowerCase()} solution is challenging.
                  Respeak's Enterprise RAG Platform handles this complexity for you.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="https://meetings-eu1.hubspot.com/tim-rietz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm
                      font-medium transition-all flex items-center gap-2"
                  >
                    Schedule a Demo
                  </a>
                  <a
                    href="https://www.respeak.io/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm
                      font-medium transition-all flex items-center gap-2"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
              <div className="flex-shrink-0 hidden md:block">
                <a
                  href="https://www.linkedin.com/in/timrietz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs">Follow <span className="font-medium">Dr. Tim Rietz</span></p>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            {prevStep ? (
              <Link
                href={`/steps/${prevStep.id}`}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  <span className="text-slate-400 text-sm block">Previous</span>
                  <span className="font-medium">{prevStep.title}</span>
                </span>
              </Link>
            ) : (
              <div></div>
            )}

            {nextStep ? (
              <Link
                href={`/steps/${nextStep.id}`}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
              >
                <span>
                  <span className="text-slate-400 text-sm block">Next</span>
                  <span className="font-medium">{nextStep.title}</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg transition-colors ml-auto"
              >
                <span className="font-medium">Back to Overview</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-2 py-8 text-center text-slate-400 border-t border-slate-800 mt-16">
        <p>© 2025 <a href="https://www.respeak.io" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Respeak GmbH</a>. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="https://www.respeak.io" className="hover:text-emerald-400 transition-colors">Website</a>
          <a href="https://www.linkedin.com/company/respeak-io" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
          <a href="https://meetings-eu1.hubspot.com/tim-rietz" className="hover:text-emerald-400 transition-colors">Book a Demo</a>
        </div>
      </footer>
    </div>
  )
}
