"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample documents for the demo
const sampleDocuments = [
  {
    id: 1,
    title: "Introduction to Vector Databases",
    content:
      "Vector databases are specialized database systems designed to store and query high-dimensional vector data efficiently. Unlike traditional databases that excel at exact matches, vector databases are optimized for similarity search.",
    source: "Technical Documentation",
    date: "2023-03-15",
    // Different scores from different retrieval methods
    scores: {
      vector: 0.82,
      keyword: 0.45,
      crossEncoder: 0.91,
      bm25: 0.58,
    },
    // Simulated features for reranking
    features: {
      queryOverlap: 0.6,
      documentRecency: 0.7,
      documentAuthority: 0.9,
    },
  },
  {
    id: 2,
    title: "Understanding Embedding Models",
    content:
      "Embedding models convert text into high-dimensional vectors. These vectors typically have hundreds or thousands of dimensions, with each dimension representing some aspect of the text's meaning.",
    source: "AI Blog",
    date: "2023-05-22",
    scores: {
      vector: 0.78,
      keyword: 0.37,
      crossEncoder: 0.82,
      bm25: 0.41,
    },
    features: {
      queryOverlap: 0.5,
      documentRecency: 0.8,
      documentAuthority: 0.7,
    },
  },
  {
    id: 3,
    title: "Vector Search Algorithms",
    content:
      "Vector search algorithms like HNSW and IVF enable efficient approximate nearest neighbor search in high-dimensional spaces, making them ideal for similarity search in large vector databases.",
    source: "Research Paper",
    date: "2023-02-10",
    scores: {
      vector: 0.75,
      keyword: 0.88,
      crossEncoder: 0.87,
      bm25: 0.79,
    },
    features: {
      queryOverlap: 0.8,
      documentRecency: 0.5,
      documentAuthority: 0.95,
    },
  },
  {
    id: 4,
    title: "Comparing Database Technologies",
    content:
      "When comparing traditional databases with vector databases, consider your use case. SQL databases excel at exact matches and joins, while vector databases prioritize similarity search and approximate matching.",
    source: "Tech Comparison",
    date: "2023-06-05",
    scores: {
      vector: 0.69,
      keyword: 0.91,
      crossEncoder: 0.76,
      bm25: 0.87,
    },
    features: {
      queryOverlap: 0.7,
      documentRecency: 0.9,
      documentAuthority: 0.6,
    },
  },
  {
    id: 5,
    title: "Implementing Vector Search",
    content:
      "Implementing vector search requires selecting an appropriate embedding model, creating a vector index, and choosing a distance metric like cosine similarity or Euclidean distance.",
    source: "Developer Guide",
    date: "2023-04-28",
    scores: {
      vector: 0.86,
      keyword: 0.55,
      crossEncoder: 0.88,
      bm25: 0.62,
    },
    features: {
      queryOverlap: 0.7,
      documentRecency: 0.8,
      documentAuthority: 0.8,
    },
  },
  {
    id: 6,
    title: "PostgreSQL and pgvector Extension",
    content:
      "PostgreSQL's pgvector extension adds vector similarity search capabilities to this popular relational database, enabling hybrid search combining traditional SQL queries with vector similarity.",
    source: "Database Documentation",
    date: "2023-01-17",
    scores: {
      vector: 0.64,
      keyword: 0.79,
      crossEncoder: 0.72,
      bm25: 0.85,
    },
    features: {
      queryOverlap: 0.5,
      documentRecency: 0.3,
      documentAuthority: 0.8,
    },
  },
  {
    id: 7,
    title: "Semantic Search Applications",
    content:
      "Semantic search powered by vector databases enables applications like document retrieval, recommendation systems, and image search that understand the meaning behind queries rather than just matching keywords.",
    source: "Use Case Study",
    date: "2023-05-30",
    scores: {
      vector: 0.74,
      keyword: 0.48,
      crossEncoder: 0.81,
      bm25: 0.56,
    },
    features: {
      queryOverlap: 0.6,
      documentRecency: 0.85,
      documentAuthority: 0.75,
    },
  },
  {
    id: 8,
    title: "Database Performance Benchmarks",
    content:
      "When benchmarking database performance, consider metrics like query latency, throughput, and recall. Vector databases optimize for approximate nearest neighbor search speed and recall@k metrics.",
    source: "Benchmark Report",
    date: "2023-03-02",
    scores: {
      vector: 0.67,
      keyword: 0.83,
      crossEncoder: 0.75,
      bm25: 0.89,
    },
    features: {
      queryOverlap: 0.65,
      documentRecency: 0.6,
      documentAuthority: 0.85,
    },
  },
]

// Different reranking methods
const rerankingMethods = {
  none: {
    name: "No Reranking",
    description: "Use only the initial retrieval scores without reranking",
  },
  crossEncoder: {
    name: "Cross-Encoder Model",
    description: "Uses a transformer model to directly score query-document pairs",
    latency: "High",
    complexity: "High",
    quality: "Excellent",
  },
  linearCombination: {
    name: "Feature Combination",
    description: "Combines multiple features with learned weights",
    latency: "Medium",
    complexity: "Medium",
    quality: "Good",
  },
  reciprocalRank: {
    name: "Reciprocal Rank Fusion",
    description: "Combines ranked lists based on position rather than scores",
    latency: "Low",
    complexity: "Low",
    quality: "Fair",
  },
}

// Different fusion strategies
const fusionStrategies = {
  none: {
    name: "No Fusion",
    description: "Use only a single retrieval source",
  },
  scoreBased: {
    name: "Score-Based Fusion",
    description: "Normalize and combine scores from different retrievers",
  },
  rankBased: {
    name: "Rank-Based Fusion",
    description: "Combine results based on their positions in each ranked list",
  },
}

// Mock document data
const documents = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    content: "Machine learning is a subset of artificial intelligence...",
    relevanceScore: 0.65,
    semanticScore: 0.78,
    recencyScore: 0.92,
  },
  {
    id: 2,
    title: "Deep Learning Fundamentals",
    content: "Deep learning is a subset of machine learning that uses neural networks...",
    relevanceScore: 0.82,
    semanticScore: 0.85,
    recencyScore: 0.45,
  },
  {
    id: 3,
    title: "Natural Language Processing",
    content: "NLP is a field of AI that gives computers the ability to understand text...",
    relevanceScore: 0.71,
    semanticScore: 0.68,
    recencyScore: 0.88,
  },
  {
    id: 4,
    title: "Computer Vision Applications",
    content: "Computer vision enables machines to interpret and make decisions based on visual data...",
    relevanceScore: 0.58,
    semanticScore: 0.52,
    recencyScore: 0.76,
  },
  {
    id: 5,
    title: "Reinforcement Learning",
    content: "Reinforcement learning is training algorithms to make sequences of decisions...",
    relevanceScore: 0.73,
    semanticScore: 0.61,
    recencyScore: 0.83,
  },
]

// Different retrieval methods
const retrievalMethods2 = {
  bm25: [1, 3, 5, 2, 4], // Document IDs in order of relevance for BM25
  semantic: [2, 1, 3, 5, 4], // Document IDs for semantic search
  hybrid: [2, 1, 3, 5, 4], // Document IDs for hybrid search
}

// For TypeScript - extend the document type with rrf_score
type EnhancedDocument = typeof sampleDocuments[0] & { rrf_score?: number }
type RerankedDocument = typeof documents[0] & { rrf_score?: number }

export default function RerankingFusionDemo() {
  const { t } = useTranslation('demos')
  const [activeTab, setActiveTab] = useState("reranking")
  const [rerankingMethod, setRerankingMethod] = useState("reciprocal-rank")
  const [weights, setWeights] = useState({ relevance: 0.4, semantic: 0.4, recency: 0.2 })
  const [retrievalMethod, setRetrievalMethod] = useState("semantic")
  const [useReranking, setUseReranking] = useState(true)
  const [useFusion, setUseFusion] = useState(false)
  // State for query and retrieval configuration
  const [query, setQuery] = useState("vector database search")
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasQueried, setHasQueried] = useState(false)

  // State for retrieval methods
  const [initialResults, setInitialResults] = useState<EnhancedDocument[]>([])

  // State for reranking and fusion configuration
  const [enableReranking, setEnableReranking] = useState(true)
  const [enableFusion, setEnableFusion] = useState(false)
  const [fusionStrategy, setFusionStrategy] = useState("scoreBased")
  const [secondaryRetrievalMethod, setSecondaryRetrievalMethod] = useState("keyword")

  // State for the final results
  const [finalResults, setFinalResults] = useState<EnhancedDocument[]>([])

  // Simulation options
  const [simulateLatency, setSimulateLatency] = useState(false)
  const [simulateConflictingResults, setSimulateConflictingResults] = useState(false)

  // Calculate reranked documents based on selected method and weights
  const getRankedDocuments = () => {
    let rankedDocs = [...documents] as RerankedDocument[]

    // First, use base retrieval method to get initial ordering
    const orderedIds = retrievalMethods2[retrievalMethod as keyof typeof retrievalMethods2]
    rankedDocs = orderedIds.map((id) => documents.find((doc) => doc.id === id)!) as RerankedDocument[]

    // Only apply reranking if it's enabled
    if (useReranking) {
      if (rerankingMethod === "weighted-score") {
        rankedDocs.sort((a, b) => {
          const scoreA =
            a.relevanceScore * weights.relevance + a.semanticScore * weights.semantic + a.recencyScore * weights.recency
          const scoreB =
            b.relevanceScore * weights.relevance + b.semanticScore * weights.semantic + b.recencyScore * weights.recency
          return scoreB - scoreA
        })
      } else if (rerankingMethod === "reciprocal-rank") {
        // Apply RRF to the rankedDocs, but only if reranking is enabled
        // First, assign initial RRF scores based on position
        rankedDocs.forEach((doc, index) => {
          const rank = index + 1;
          doc.rrf_score = 1.0 / (rank + 60); // k=60 is common in RRF
        });

        // Create a second ranking based on recency
        const recencyRanking = [...rankedDocs].sort((a, b) => b.recencyScore - a.recencyScore);

        // Add RRF scores from recency ranking
        recencyRanking.forEach((doc, index) => {
          const rank = index + 1;
          const docInResults = rankedDocs.find(d => d.id === doc.id);
          if (docInResults) {
            docInResults.rrf_score = (docInResults.rrf_score || 0) + 1.0 / (rank + 60);
          }
        });

        // Sort by combined RRF scores
        rankedDocs.sort((a, b) => ((b.rrf_score || 0) - (a.rrf_score || 0)));
      }
    }

    return rankedDocs;
  }

  // Get documents for fusion demonstration
  const getFusedDocuments = () => {
    if (!useFusion) {
      return getRankedDocuments()
    }

    // Simple fusion example: combine BM25 and semantic search results
    const bm25Docs = retrievalMethods2.bm25.map((id, index) => ({
      id,
      rank: index + 1,
      score: 1.0 / (index + 1), // Reciprocal rank
    }))

    const semanticDocs = retrievalMethods2.semantic.map((id, index) => ({
      id,
      rank: index + 1,
      score: 1.0 / (index + 1), // Reciprocal rank
    }))

    // Combine scores using reciprocal rank fusion
    const fusedScores = new Map()
      ;[...bm25Docs, ...semanticDocs].forEach((item) => {
        const currentScore = fusedScores.get(item.id) || 0
        fusedScores.set(item.id, currentScore + item.score)
      })

    // Sort by fused scores
    const sortedIds = [...fusedScores.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0])

    return sortedIds.map((id) => documents.find((doc) => doc.id === id)!) as RerankedDocument[]
  }

  const displayedDocuments = activeTab === "fusion" ? getFusedDocuments() : getRankedDocuments()

  // Perform search with configured reranking and fusion
  const performSearch = async () => {
    if (!query.trim()) return

    setIsProcessing(true)

    // Simulate initial retrieval
    const retrievalDelay = simulateLatency ? 500 : 100
    await new Promise((resolve) => setTimeout(resolve, retrievalDelay))

    // Get initial results based on selected method
    let results: EnhancedDocument[] = [...sampleDocuments]
      .sort((a, b) => {
        return b.scores[retrievalMethod as keyof typeof b.scores] - a.scores[retrievalMethod as keyof typeof a.scores]
      })
      .slice(0, 5) // Top 5 results

    setInitialResults(results)

    // Apply fusion if enabled
    if (enableFusion) {
      const fusionDelay = simulateLatency ? 700 : 150
      await new Promise((resolve) => setTimeout(resolve, fusionDelay))

      // Get secondary results
      const secondaryResults = [...sampleDocuments]
        .sort((a, b) => {
          return (
            b.scores[secondaryRetrievalMethod as keyof typeof b.scores] -
            a.scores[secondaryRetrievalMethod as keyof typeof a.scores]
          )
        })
        .slice(0, 5) // Top 5 results

      // Apply fusion strategy
      if (fusionStrategy === "scoreBased") {
        // Score-based fusion (normalize and combine scores)
        const combinedResults = new Map()

        // Process primary results
        results.forEach((doc) => {
          combinedResults.set(doc.id, {
            doc,
            score: doc.scores[retrievalMethod as keyof typeof doc.scores],
          })
        })

        // Process secondary results
        secondaryResults.forEach((doc) => {
          if (combinedResults.has(doc.id)) {
            // Document exists in both result sets
            const current = combinedResults.get(doc.id)
            current.score = (current.score + doc.scores[secondaryRetrievalMethod as keyof typeof doc.scores]) / 2
            combinedResults.set(doc.id, current)
          } else {
            // New document
            combinedResults.set(doc.id, {
              doc,
              score: doc.scores[secondaryRetrievalMethod as keyof typeof doc.scores] * 0.8, // Slight discount for secondary results
            })
          }
        })

        // Convert map back to array and sort
        results = Array.from(combinedResults.values())
          .sort((a, b) => b.score - a.score)
          .map((item) => item.doc)
          .slice(0, 6) // Take top 6 after fusion
      } else if (fusionStrategy === "rankBased") {
        // Rank-based fusion (combine based on positions)
        const combinedResults = new Map()

        // Process primary results with reciprocal rank
        results.forEach((doc, index) => {
          const rank = index + 1
          combinedResults.set(doc.id, {
            doc,
            score: 1.0 / rank,
          })
        })

        // Process secondary results
        secondaryResults.forEach((doc, index) => {
          const rank = index + 1
          if (combinedResults.has(doc.id)) {
            // Document exists in both result sets
            const current = combinedResults.get(doc.id)
            current.score += 0.8 / rank // Secondary results get 80% weight
            combinedResults.set(doc.id, current)
          } else {
            // New document
            combinedResults.set(doc.id, {
              doc,
              score: 0.8 / rank, // Secondary results get 80% weight
            })
          }
        })

        // Convert map back to array and sort
        results = Array.from(combinedResults.values())
          .sort((a, b) => b.score - a.score)
          .map((item) => item.doc)
          .slice(0, 6) // Take top 6 after fusion
      }
    }

    // Apply reranking if enabled
    if (enableReranking) {
      const rerankingDelay = simulateLatency ? 1200 : 300
      await new Promise((resolve) => setTimeout(resolve, rerankingDelay))

      if (rerankingMethod === "crossEncoder") {
        // Simulate cross-encoder reranking (uses pre-computed scores for demo)
        results = results.sort((a, b) => {
          return b.scores.crossEncoder - a.scores.crossEncoder
        })
      } else if (rerankingMethod === "linearCombination") {
        // Simulate linear combination of features
        results = results.sort((a, b) => {
          const scoreA =
            0.6 * a.features.queryOverlap + 0.25 * a.features.documentRecency + 0.15 * a.features.documentAuthority
          const scoreB =
            0.6 * b.features.queryOverlap + 0.25 * b.features.documentRecency + 0.15 * b.features.documentAuthority
          return scoreB - scoreA
        })
      } else if (rerankingMethod === "reciprocal-rank") {
        // Actually implement reciprocal rank fusion

        // In a real system, RRF combines results from multiple retrievers
        // For this demo, we'll simulate two rankings:
        // 1. The current ranking based on the retrievalMethod
        // 2. A ranking based on document recency

        // First, assign RRF scores based on current positions
        results.forEach((doc, index) => {
          const rank = index + 1
          doc.rrf_score = 1.0 / (rank + 60) // k=60 is common in RRF
        })

        // Create a second ranking based on document recency
        const recencyRanking = [...results].sort((a, b) =>
          b.features.documentRecency - a.features.documentRecency
        )

        // Add RRF scores from recency ranking
        recencyRanking.forEach((doc, index) => {
          const rank = index + 1
          const docInResults = results.find(d => d.id === doc.id)
          if (docInResults) {
            docInResults.rrf_score = (docInResults.rrf_score || 0) + 1.0 / (rank + 60)
          }
        })

        // Sort by combined RRF scores
        results.sort((a, b) => (b.rrf_score || 0) - (a.rrf_score || 0))
      }
    }

    // Simulate conflicting results if enabled
    if (simulateConflictingResults) {
      // Create a conflicting document
      const conflictDoc: EnhancedDocument = {
        id: 100,
        title: "Conflicting Information on Vector Databases",
        content:
          "IMPORTANT UPDATE: Vector databases are NOT recommended for production use due to recent stability issues discovered in most implementations. Use traditional databases with full-text search instead.",
        source: "Recent Advisory",
        date: "2023-06-28",
        scores: {
          vector: 0.92, // Very high score to ensure it appears at the top
          keyword: 0.94,
          crossEncoder: 0.95,
          bm25: 0.93,
        },
        features: {
          queryOverlap: 0.9,
          documentRecency: 1.0,
          documentAuthority: 0.5,
        },
      }

      // Add to the beginning of results
      results.unshift(conflictDoc)
      results = results.slice(0, 5) // Keep top 5
    }

    setFinalResults(results)
    setIsProcessing(false)
    setHasQueried(true)
  }

  // Calculate processing time estimates
  const getProcessingTimeEstimate = () => {
    let time = 100 // Base retrieval time

    if (enableFusion) {
      time += 150 // Fusion time
    }

    if (enableReranking) {
      if (rerankingMethod === "crossEncoder") {
        time += 500 // Cross-encoder is slow
      } else if (rerankingMethod === "linearCombination") {
        time += 200 // Feature combination is medium
      } else if (rerankingMethod === "reciprocal-rank") {
        time += 50 // RRF is fast
      }
    }

    if (simulateLatency) {
      time *= 3 // Simulate slower processing
    }

    return `~${time}ms`
  }

  // Render a score badge with appropriate color based on score
  const renderScoreBadge = (score: number) => {
    let colorClass = "bg-red-900/20 border border-red-500/30 text-red-300"

    if (score >= 0.8) {
      colorClass = "bg-emerald-900/20 border border-emerald-500/50 text-emerald-300"
    } else if (score >= 0.6) {
      colorClass = "bg-amber-900/20 border border-amber-500/30 text-amber-300"
    }

    return <Badge className={`${colorClass} transition-colors`}>{score.toFixed(2)}</Badge>
  }

  return (
    <div className="w-full bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-slate-200 font-medium text-xl">{t('rerankingFusion.title')}</h2>
          <p className="text-slate-400">{t('rerankingFusion.subtitle')}</p>
        </div>
      </div>
      <div className="p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 p-1 rounded-lg">
            <TabsTrigger
              value="reranking"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md transition-all"
            >
              {t('rerankingFusion.reranking')}
            </TabsTrigger>
            <TabsTrigger
              value="fusion"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md transition-all"
            >
              {t('rerankingFusion.fusion')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reranking" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="use-reranking"
                    checked={useReranking}
                    onCheckedChange={setUseReranking}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                  />
                  <Label htmlFor="use-reranking" className="text-slate-300">{t('rerankingFusion.enableReranking')}</Label>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t('rerankingFusion.baseRetrievalMethod')}</Label>
                  <Select
                    value={retrievalMethod}
                    onValueChange={setRetrievalMethod}
                    disabled={useReranking && rerankingMethod === "weighted-score"}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder={t('rerankingFusion.selectRetrievalMethod')} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                      <SelectItem value="bm25">{t('rerankingFusion.bm25Keyword')}</SelectItem>
                      <SelectItem value="semantic">{t('rerankingFusion.semanticSearch')}</SelectItem>
                      <SelectItem value="hybrid">{t('rerankingFusion.hybridSearch')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {useReranking && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-slate-300">{t('rerankingFusion.rerankingMethod')}</Label>
                      <Select value={rerankingMethod} onValueChange={setRerankingMethod}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                          <SelectValue placeholder={t('rerankingFusion.selectRerankingMethod')} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                          <SelectItem value="weighted-score">{t('rerankingFusion.weightedScore')}</SelectItem>
                          <SelectItem value="reciprocal-rank">{t('rerankingFusion.reciprocalRankFusion')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {rerankingMethod === "reciprocal-rank" && (
                      <Alert className="bg-slate-900/20 border border-slate-700 text-slate-300">
                        <AlertCircle className="h-4 w-4 text-emerald-400" />
                        <AlertTitle className="text-slate-200">{t('rerankingFusion.rrfTitle')}</AlertTitle>
                        <AlertDescription className="text-slate-400">
                          <p className="text-sm mt-2">
                            {t('rerankingFusion.rrfDescription1')}
                          </p>
                          <p className="text-sm mt-2">
                            {t('rerankingFusion.rrfDescription2')}
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}

                    {rerankingMethod === "weighted-score" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-slate-300">{t('rerankingFusion.relevanceWeight')}: {weights.relevance.toFixed(1)}</Label>
                          </div>
                          <Slider
                            value={[weights.relevance * 10]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => setWeights({ ...weights, relevance: value[0] / 10 })}
                            className="data-[state=active]:bg-emerald-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-slate-300">{t('rerankingFusion.semanticWeight')}: {weights.semantic.toFixed(1)}</Label>
                          </div>
                          <Slider
                            value={[weights.semantic * 10]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => setWeights({ ...weights, semantic: value[0] / 10 })}
                            className="data-[state=active]:bg-emerald-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-slate-300">{t('rerankingFusion.recencyWeight')}: {weights.recency.toFixed(1)}</Label>
                          </div>
                          <Slider
                            value={[weights.recency * 10]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => setWeights({ ...weights, recency: value[0] / 10 })}
                            className="data-[state=active]:bg-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all">
                <h3 className="text-lg font-medium mb-4 text-slate-200">{t('rerankingFusion.results')}</h3>
                <div className="space-y-3">
                  {displayedDocuments.map((doc, index) => (
                    <div key={doc.id} className="border border-slate-700 rounded-lg p-3 bg-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all shadow-md">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-slate-200">{doc.title}</h4>
                        <Badge className="bg-slate-800 text-slate-300 dark:bg-slate-700 dark:text-slate-200">{t('rerankingFusion.rank')} {index + 1}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{doc.content}</p>
                      {useReranking && rerankingMethod === "weighted-score" && (
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-300">
                          <div>{t('rerankingFusion.relevance')}: {doc.relevanceScore.toFixed(2)}</div>
                          <div>{t('rerankingFusion.semantic')}: {doc.semanticScore.toFixed(2)}</div>
                          <div>{t('rerankingFusion.recency')}: {doc.recencyScore.toFixed(2)}</div>
                        </div>
                      )}
                      {useReranking && rerankingMethod === "reciprocal-rank" && doc.rrf_score && (
                        <div className="mt-2 text-xs text-slate-300">
                          <div>{t('rerankingFusion.rrfScore')}: {doc.rrf_score.toFixed(3)}</div>
                          {'features' in doc && (
                            <div className="mt-1 grid grid-cols-2 gap-2">
                              <div>{t('rerankingFusion.recency')}: {(doc as any).features.documentRecency.toFixed(2)}</div>
                              <div>{t('rerankingFusion.queryOverlap')}: {(doc as any).features.queryOverlap.toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fusion" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="use-fusion"
                    checked={useFusion}
                    onCheckedChange={setUseFusion}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                  />
                  <Label htmlFor="use-fusion" className="text-slate-300">{t('rerankingFusion.enableFusion')}</Label>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all">
                  <h3 className="text-lg font-medium mb-4 text-slate-200">{t('rerankingFusion.bm25Results')}</h3>
                  <div className="space-y-2">
                    {retrievalMethods2.bm25.slice(0, 3).map((id, index) => {
                      const doc = documents.find((d) => d.id === id)!
                      return (
                        <div key={`bm25-${id}`} className="border border-slate-700 rounded-lg p-2 bg-slate-800/50 hover:border-emerald-500/30 transition-all">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm text-slate-200">{doc.title}</h4>
                            <Badge className="bg-slate-800 text-slate-300 dark:bg-slate-700 dark:text-slate-200 text-xs">
                              {t('rerankingFusion.rank')} {index + 1}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all">
                  <h3 className="text-lg font-medium mb-4 text-slate-200">{t('rerankingFusion.semanticResults')}</h3>
                  <div className="space-y-2">
                    {retrievalMethods2.semantic.slice(0, 3).map((id, index) => {
                      const doc = documents.find((d) => d.id === id)!
                      return (
                        <div key={`semantic-${id}`} className="border border-slate-700 rounded-lg p-2 bg-slate-800/50 hover:border-emerald-500/30 transition-all">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm text-slate-200">{doc.title}</h4>
                            <Badge className="bg-slate-800 text-slate-300 dark:bg-slate-700 dark:text-slate-200 text-xs">
                              {t('rerankingFusion.rank')} {index + 1}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all">
                <h3 className="text-lg font-medium mb-4 text-slate-200">{t('rerankingFusion.fusedResults')}</h3>
                <div className="space-y-3">
                  {displayedDocuments.map((doc, index) => (
                    <div key={doc.id} className="border border-slate-700 rounded-lg p-3 bg-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all shadow-md">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-slate-200">{doc.title}</h4>
                        <Badge className="bg-slate-800 text-slate-300 dark:bg-slate-700 dark:text-slate-200">{t('rerankingFusion.rank')} {index + 1}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{doc.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
