import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react"
import StepPageClient from "@/components/step-page-client"
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
import fs from 'fs'
import path from 'path'

// Step configuration with demo components
const stepDemos = {
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

// Generate static params for all step IDs
export async function generateStaticParams() {
  const stepIds = Object.keys(stepDemos)
  return stepIds.map((id) => ({
    id: id,
  }))
}

// Load step data from locale files at build time
function getStepData(stepId: string, locale: string = 'en') {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'steps.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const stepData = data.steps[stepId]
    
    if (!stepData) {
      return null
    }

    return {
      id: stepId,
      title: stepData.title,
      description: stepData.description,
      whatItDoes: stepData.whatItDoes || "Content not available in this language",
      whyItMatters: stepData.whyItMatters || "Content not available in this language",
      challenges: stepData.challenges || [],
      demo: stepDemos[stepId as keyof typeof stepDemos] || null,
    }
  } catch (error) {
    console.error('Error loading step data:', error)
    return null
  }
}

export default async function StepPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stepId = id
  
  // Load English data at build time (client will handle i18n)
  const step = getStepData(stepId, 'en')

  if (!step) {
    notFound()
  }

  // Get previous and next steps - only pass the step IDs, let client handle translation
  const allStepIds = Object.keys(stepDemos)
  const currentIndex = allStepIds.findIndex((s) => s === stepId)
  const prevStepId = currentIndex > 0 ? allStepIds[currentIndex - 1] : null
  const nextStepId = currentIndex < allStepIds.length - 1 ? allStepIds[currentIndex + 1] : null

  return <StepPageClient step={step} prevStepId={prevStepId} nextStepId={nextStepId} />
}
