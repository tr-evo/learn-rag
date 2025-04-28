"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

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

export default function RerankingFusionDemo() {
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
  const [initialResults, setInitialResults] = useState<typeof sampleDocuments>([])

  // State for reranking and fusion configuration
  const [enableReranking, setEnableReranking] = useState(true)
  const [enableFusion, setEnableFusion] = useState(false)
  const [fusionStrategy, setFusionStrategy] = useState("scoreBased")
  const [secondaryRetrievalMethod, setSecondaryRetrievalMethod] = useState("keyword")

  // State for the final results
  const [finalResults, setFinalResults] = useState<typeof sampleDocuments>([])

  // Simulation options
  const [simulateLatency, setSimulateLatency] = useState(false)
  const [simulateConflictingResults, setSimulateConflictingResults] = useState(false)

  // Calculate reranked documents based on selected method and weights
  const getRankedDocuments = () => {
    let rankedDocs = [...documents]

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
        // Simulate reciprocal rank fusion
        rankedDocs.sort((a, b) => b.relevanceScore + b.semanticScore - (a.relevanceScore + a.semanticScore))
      }
    } else {
      // Use base retrieval method without reranking
      const orderedIds = retrievalMethods2[retrievalMethod as keyof typeof retrievalMethods2]
      rankedDocs = orderedIds.map((id) => documents.find((doc) => doc.id === id)!)
    }

    return rankedDocs
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

    return sortedIds.map((id) => documents.find((doc) => doc.id === id)!)
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
    let results = [...sampleDocuments]
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
      } else if (rerankingMethod === "reciprocalRank") {
        // Keep the existing order but add simulated RRF scores
        results.forEach((doc, index) => {
          doc.rrf_score = 1.0 / (index + 1)
        })
      }
    }

    // Simulate conflicting results if enabled
    if (simulateConflictingResults) {
      // Create a conflicting document
      const conflictDoc = {
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
        isConflicting: true,
      }

      // Add to the beginning of results
      results.unshift(conflictDoc as any)
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
      } else if (rerankingMethod === "reciprocalRank") {
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
    let colorClass = "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"

    if (score >= 0.8) {
      colorClass = "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    } else if (score >= 0.6) {
      colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    }

    return <Badge className={colorClass}>{score.toFixed(2)}</Badge>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reranking & Fusion Demo</CardTitle>
        <CardDescription>Explore how reranking and fusion techniques improve search results</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reranking">Reranking</TabsTrigger>
            <TabsTrigger value="fusion">Fusion</TabsTrigger>
          </TabsList>

          <TabsContent value="reranking" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="use-reranking" checked={useReranking} onCheckedChange={setUseReranking} />
                  <Label htmlFor="use-reranking">Enable Reranking</Label>
                </div>

                <div className="space-y-2">
                  <Label>Base Retrieval Method</Label>
                  <Select
                    value={retrievalMethod}
                    onValueChange={setRetrievalMethod}
                    disabled={useReranking && rerankingMethod === "weighted-score"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select retrieval method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bm25">BM25 (Keyword)</SelectItem>
                      <SelectItem value="semantic">Semantic Search</SelectItem>
                      <SelectItem value="hybrid">Hybrid Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {useReranking && (
                  <>
                    <div className="space-y-2">
                      <Label>Reranking Method</Label>
                      <Select value={rerankingMethod} onValueChange={setRerankingMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reranking method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weighted-score">Weighted Score</SelectItem>
                          <SelectItem value="reciprocal-rank">Reciprocal Rank Fusion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {rerankingMethod === "weighted-score" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Relevance Weight: {weights.relevance.toFixed(1)}</Label>
                          </div>
                          <Slider
                            value={[weights.relevance * 10]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => setWeights({ ...weights, relevance: value[0] / 10 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Semantic Weight: {weights.semantic.toFixed(1)}</Label>
                          </div>
                          <Slider
                            value={[weights.semantic * 10]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => setWeights({ ...weights, semantic: value[0] / 10 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Recency Weight: {weights.recency.toFixed(1)}</Label>
                          </div>
                          <Slider
                            value={[weights.recency * 10]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => setWeights({ ...weights, recency: value[0] / 10 })}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Results</h3>
                <div className="space-y-3">
                  {displayedDocuments.map((doc, index) => (
                    <div key={doc.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{doc.title}</h4>
                        <Badge variant="outline">Rank {index + 1}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.content}</p>
                      {useReranking && rerankingMethod === "weighted-score" && (
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div>Relevance: {doc.relevanceScore.toFixed(2)}</div>
                          <div>Semantic: {doc.semanticScore.toFixed(2)}</div>
                          <div>Recency: {doc.recencyScore.toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fusion" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="use-fusion" checked={useFusion} onCheckedChange={setUseFusion} />
                  <Label htmlFor="use-fusion">Enable Fusion</Label>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">BM25 Results</h3>
                  <div className="space-y-2">
                    {retrievalMethods2.bm25.slice(0, 3).map((id, index) => {
                      const doc = documents.find((d) => d.id === id)!
                      return (
                        <div key={`bm25-${id}`} className="border rounded-md p-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{doc.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              Rank {index + 1}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Semantic Results</h3>
                  <div className="space-y-2">
                    {retrievalMethods2.semantic.slice(0, 3).map((id, index) => {
                      const doc = documents.find((d) => d.id === id)!
                      return (
                        <div key={`semantic-${id}`} className="border rounded-md p-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{doc.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              Rank {index + 1}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Fused Results</h3>
                <div className="space-y-3">
                  {displayedDocuments.map((doc, index) => (
                    <div key={doc.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{doc.title}</h4>
                        <Badge variant="outline">Rank {index + 1}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
