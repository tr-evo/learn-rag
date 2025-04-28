"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cpu, Search, RefreshCw, AlertCircle, CheckCircle2, Clock, BarChart3, Layers, History } from "lucide-react"

// Sample text chunks for the demo
const sampleChunks = [
  {
    id: 1,
    text: "Vector embeddings are numerical representations of text that capture semantic meaning. They allow machines to understand similarities between different pieces of text based on their content rather than just matching keywords.",
    category: "Technical",
    lastUpdated: new Date("2023-06-15"),
  },
  {
    id: 2,
    text: "Embedding models convert text into high-dimensional vectors. These vectors typically have hundreds or thousands of dimensions, with each dimension representing some aspect of the text's meaning.",
    category: "Technical",
    lastUpdated: new Date("2023-07-22"),
  },
  {
    id: 3,
    text: "Regular embedding refreshes are crucial for RAG systems. When source documents change, their embeddings must be updated to ensure the retrieval system returns current information.",
    category: "Best Practice",
    lastUpdated: new Date("2023-08-10"),
  },
  {
    id: 4,
    text: "The quality of embeddings directly impacts retrieval performance. Better embeddings lead to more accurate semantic search results and ultimately better RAG outputs.",
    category: "Best Practice",
    lastUpdated: new Date("2023-05-05"),
  },
  {
    id: 5,
    text: "Our company's Q2 financial results exceeded expectations with a 15% revenue increase compared to the previous quarter. The board has approved a special dividend for shareholders.",
    category: "Financial",
    lastUpdated: new Date("2023-07-15"),
  },
]

// Updated version of chunk 5 to demonstrate embedding drift
const updatedChunk5 = {
  id: 5,
  text: "Our company's Q2 financial results exceeded expectations with a 15% revenue increase compared to the previous quarter. However, due to increased costs, the board has decided to postpone the previously planned special dividend.",
  category: "Financial",
  lastUpdated: new Date(),
}

// Sample embedding models for the demo
const embeddingModels = [
  {
    id: "basic",
    name: "Basic Embedding Model",
    dimensions: 128,
    quality: "Low",
    speed: "Fast",
    cost: "Low",
  },
  {
    id: "standard",
    name: "Standard Embedding Model",
    dimensions: 384,
    quality: "Medium",
    speed: "Medium",
    cost: "Medium",
  },
  {
    id: "advanced",
    name: "Advanced Embedding Model",
    dimensions: 768,
    quality: "High",
    speed: "Slow",
    cost: "High",
  },
]

// Function to generate a pseudo-random embedding vector
const generateEmbedding = (text: string, modelId: string, seed = 0): number[] => {
  // This is a simplified simulation - in reality, embedding models are much more complex
  // We're using the text length, character codes, and a seed to generate a deterministic but varied vector

  const dimensions = embeddingModels.find((m) => m.id === modelId)?.dimensions || 128
  const vector: number[] = []

  // Use text characteristics to seed the vector
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }

  // Generate vector components
  for (let i = 0; i < dimensions; i++) {
    // Use a combination of the hash, position, seed, and some text characteristics
    const val = Math.sin(i * hash * 0.001 + seed) * 0.5
    vector.push(val)
  }

  return vector
}

// Function to calculate cosine similarity between two vectors
const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export default function EmbeddingCreationDemo() {
  // State for embedding configuration
  const [selectedModel, setSelectedModel] = useState(embeddingModels[1])
  const [chunks, setChunks] = useState(sampleChunks)
  const [embeddings, setEmbeddings] = useState<Record<number, number[]>>({})
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ id: number, similarity: number }>>([])
  const [isSearching, setIsSearching] = useState(false)

  // State for simulating issues
  const [simulateOutdatedEmbeddings, setSimulateOutdatedEmbeddings] = useState(false)
  const [simulateModelChange, setSimulateModelChange] = useState(false)
  const [simulateIncompleteEmbeddings, setSimulateIncompleteEmbeddings] = useState(false)

  // Ref for the canvas to visualize embeddings
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate embeddings for all chunks
  const generateAllEmbeddings = () => {
    setIsGenerating(true)

    // Simulate processing delay
    setTimeout(() => {
      const newEmbeddings: Record<number, number[]> = {}

      chunks.forEach(chunk => {
        // Skip some chunks if simulating incomplete embeddings
        if (simulateIncompleteEmbeddings && chunk.id % 3 === 0) {
          return
        }

        newEmbeddings[chunk.id] = generateEmbedding(chunk.text, selectedModel.id)
      })

      setEmbeddings(newEmbeddings)
      setLastRefreshed(new Date())
      setIsGenerating(false)
    }, 1000)
  }

  // Update a specific chunk and its embedding
  const updateChunk = (chunkId: number) => {
    if (chunkId === 5) {
      // Update chunk 5 with new content
      setChunks(prev => prev.map(chunk =>
        chunk.id === 5 ? updatedChunk5 : chunk
      ))

      // If not simulating outdated embeddings, also update the embedding
      if (!simulateOutdatedEmbeddings) {
        setEmbeddings(prev => ({
          ...prev,
          5: generateEmbedding(updatedChunk5.text, selectedModel.id)
        }))
      }
    }
  }

  // Perform search using embeddings
  const performSearch = () => {
    if (!searchQuery.trim() || Object.keys(embeddings).length === 0) return

    setIsSearching(true)

    // Generate embedding for the search query
    const queryEmbedding = generateEmbedding(searchQuery, selectedModel.id)

    // Calculate similarity with all chunk embeddings
    setTimeout(() => {
      const results = Object.entries(embeddings).map(([idStr, embedding]) => {
        const id = Number.parseInt(idStr)
        const similarity = cosineSimilarity(queryEmbedding, embedding)
        return { id, similarity }
      })

      // Sort by similarity (descending)
      results.sort((a, b) => b.similarity - a.similarity)

      // Take top 3 results
      setSearchResults(results.slice(0, 3))
      setIsSearching(false)
    }, 500)
  }

  // Effect to visualize embeddings in 2D
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // We'll visualize embeddings in 2D using PCA-like projection (simplified)
    // In a real system, you'd use proper dimensionality reduction like t-SNE or UMAP

    // Draw background grid
    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 0.5
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Function to project high-dimensional vector to 2D
    const projectTo2D = (vector: number[]) => {
      // Simple projection - just use first two dimensions
      // In reality, you'd use PCA, t-SNE, or UMAP
      const x = (Math.sin(vector[0] * 10) * 0.5 + 0.5) * canvas.width * 0.8 + canvas.width * 0.1
      const y = (Math.sin(vector[1] * 10) * 0.5 + 0.5) * canvas.height * 0.8 + canvas.height * 0.1
      return { x, y }
    }

    // Draw embeddings
    Object.entries(embeddings).forEach(([idStr, embedding]) => {
      const id = Number.parseInt(idStr)
      const chunk = chunks.find(c => c.id === id)
      const { x, y } = projectTo2D(embedding)

      // Draw point
      ctx.fillStyle = chunk?.category === "Technical"
        ? "rgba(59, 130, 246, 0.8)"
        : chunk?.category === "Best Practice"
          ? "rgba(16, 185, 129, 0.8)"
          : "rgba(249, 115, 22, 0.8)"

      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#000000"
      ctx.font = "10px Arial"
      ctx.fillText(`#${id}`, x + 10, y)
    })

    // Draw search query if available
    if (searchQuery && isSearching) {
      const queryEmbedding = generateEmbedding(searchQuery, selectedModel.id)
      const { x, y } = projectTo2D(queryEmbedding)

      ctx.fillStyle = "rgba(220, 38, 38, 0.8)"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#000000"
      ctx.font = "10px Arial"
      ctx.fillText("Query", x + 10, y)
    }
  }, [embeddings, chunks, searchQuery, isSearching, selectedModel.id])

  // Effect to handle model change simulation
  useEffect(() => {
    if (simulateModelChange && Object.keys(embeddings).length > 0) {
      // Clear embeddings when model changes to simulate incompatibility
      setEmbeddings({})
      setLastRefreshed(null)
    }
  }, [simulateModelChange])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="creation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creation">Embedding Creation</TabsTrigger>
          <TabsTrigger value="refresh">Embedding Refresh</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
        </TabsList>

        {/* Embedding Creation Tab */}
        <TabsContent value="creation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Embedding Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Embedding Configuration
                </CardTitle>
                <CardDescription>Configure embedding model and generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Embedding Model</Label>
                  <Select
                    value={selectedModel.id}
                    onValueChange={(value) => {
                      const model = embeddingModels.find(m => m.id === value)
                      if (model) setSelectedModel(model)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select embedding model" />
                    </SelectTrigger>
                    <SelectContent>
                      {embeddingModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} ({model.dimensions}d)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-center">
                      <div className="text-xs text-slate-500 mb-1">Quality</div>
                      <div className="font-medium">{selectedModel.quality}</div>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-center">
                      <div className="text-xs text-slate-500 mb-1">Speed</div>
                      <div className="font-medium">{selectedModel.speed}</div>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-center">
                      <div className="text-xs text-slate-500 mb-1">Cost</div>
                      <div className="font-medium">{selectedModel.cost}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Text Chunks</Label>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {chunks.map(chunk => (
                      <div key={chunk.id} className="p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">Chunk #{chunk.id}</span>
                          <Badge variant="outline">{chunk.category}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{chunk.text}</p>
                        <div className="text-xs text-slate-500 mt-1">
                          Last updated: {chunk.lastUpdated.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Embedding Status</Label>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Embeddings Generated:</span>
                      <span className="font-medium">{Object.keys(embeddings).length} / {chunks.length}</span>
                    </div>
                    {lastRefreshed && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">Last Refreshed:</span>
                        <span className="font-medium">{lastRefreshed.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={generateAllEmbeddings}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate Embeddings"}
                </Button>
              </CardFooter>
            </Card>

            {/* Embedding Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Embedding Visualization
                </CardTitle>
                <CardDescription>2D projection of high-dimensional embeddings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-1 bg-white">
                  <canvas ref={canvasRef} width={400} height={300} className="w-full h-[300px] rounded" />
                </div>
                <div className="flex justify-center mt-4 gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Technical</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs">Best Practice</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs">Financial</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-slate-500 text-center">
                Note: This is a simplified 2D projection. Real embeddings have {selectedModel.dimensions} dimensions.
              </CardFooter>
            </Card>
          </div>

          {/* Search with Embeddings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search with Embeddings
              </CardTitle>
              <CardDescription>See how embeddings enable semantic search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  onClick={performSearch}
                  disabled={isSearching || !searchQuery.trim() || Object.keys(embeddings).length === 0}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {Object.keys(embeddings).length === 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>No embeddings generated yet. Click "Generate Embeddings" to create embeddings for the text chunks.</span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Search Results</h3>
                  {searchResults.map(result => {
                    const chunk = chunks.find(c => c.id === result.id)
                    return chunk ? (
                      <div key={result.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">Chunk #{chunk.id}</span>
                          <Badge>{(result.similarity * 100).toFixed(1)}% match</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{chunk.text}</p>
                      </div>
                    ) : null
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embedding Refresh Tab */}
        <TabsContent value="refresh" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Refresh Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Embedding Refresh
                </CardTitle>
                <CardDescription>Simulate content changes and embedding updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <h3 className="font-medium mb-2">Financial Report (Chunk #5)</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    {chunks.find(c => c.id === 5)?.text}
                  </p>
                  <Button onClick={() => updateChunk(5)} size="sm">Update Content</Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="outdated-embeddings" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Simulate Outdated Embeddings
                    </Label>
                    <Switch
                      id="outdated-embeddings"
                      checked={simulateOutdatedEmbeddings}
                      onCheckedChange={setSimulateOutdatedEmbeddings}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, content updates won't refresh embeddings, simulating outdated embeddings.
                  </p>
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <h3 className="font-medium mb-2">Embedding Refresh Status</h3>
                  {lastRefreshed ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Full Refresh:</span>
                        <span className="font-medium">{lastRefreshed.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Embedding Count:</span>
                        <span className="font-medium">{Object.keys(embeddings).length} / {chunks.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Status:</span>
                        {simulateOutdatedEmbeddings ? (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                            Potentially Outdated
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                            Up to Date
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No embeddings generated yet.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={generateAllEmbeddings}
                  disabled={isGenerating}
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isGenerating ? "Refreshing..." : "Refresh All Embeddings"}
                </Button>
              </CardFooter>
            </Card>

            {/* Embedding Drift Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Embedding Drift
                </CardTitle>
                <CardDescription>Visualize how content changes affect search results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <h3 className="font-medium mb-2">Search for "dividend"</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSearchQuery("dividend")
                        performSearch()
                      }}
                      disabled={Object.keys(embeddings).length === 0}
                    >
                      Run Search
                    </Button>
                    <span className="text-sm text-slate-500">See how results change after content update</span>
                  </div>

                  {searchResults.length > 0 && searchQuery.toLowerCase().includes("dividend") && (
                    <div className="space-y-3">
                      {searchResults.map(result => {
                        const chunk = chunks.find(c => c.id === result.id)
                        return chunk ? (
                          <div key={result.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                            <div className="flex justify-between items-start">
                              <span className="font-medium">Chunk #{chunk.id}</span>
                              <Badge>{(result.similarity * 100).toFixed(1)}% match</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{chunk.text}</p>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                </div>

                {simulateOutdatedEmbeddings && chunks.find(c => c.id === 5)?.text.includes("postpone") && (
                  <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      Embedding Drift Detected
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      The content about dividends has changed (they're now postponed), but the embedding hasn't been updated.
                      This causes the search to still return this document for "dividend" queries with high confidence,
                      potentially leading to incorrect information being provided.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Refresh Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Common Refresh Challenges</CardTitle>
              <CardDescription>Issues to consider when managing embedding updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Refresh Frequency
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Determining how often to refresh embeddings is a balancing act. Too frequent updates waste resources,
                    while infrequent updates risk outdated information. Consider content change frequency and criticality.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Model Compatibility
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Changing embedding models requires careful planning. Different models produce incompatible vectors,
                    necessitating a full reindex. Version your embeddings to track which model generated each vector.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Cost Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Embedding generation can be expensive at scale. Implement incremental updates to only refresh changed
                    content, and consider batching updates to reduce API costs and computational overhead.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Embedding Model Comparison</CardTitle>
              <CardDescription>Compare different embedding models and their characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-3">Model Type</th>
                      <th className="text-left p-3">Dimensions</th>
                      <th className="text-left p-3">Best For</th>
                      <th className="text-left p-3">Advantages</th>
                      <th className="text-left p-3">Disadvantages</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium">Small Models<br />(128-384d)</td>
                      <td className="p-3">128-384</td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Simple applications</li>
                          <li>Large document sets</li>
                          <li>Cost-sensitive deployments</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Fast generation</li>
                          <li>Lower storage requirements</li>
                          <li>Lower API costs</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Less semantic precision</li>
                          <li>Poorer handling of nuance</li>
                          <li>May miss subtle relationships</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium">Medium Models<br />(512-768d)</td>
                      <td className="p-3">512-768</td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>General purpose RAG</li>
                          <li>Balanced applications</li>
                          <li>Most documentation</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Good balance of quality/cost</li>
                          <li>Reasonable generation speed</li>
                          <li>Good semantic understanding</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>May struggle with specialized domains</li>
                          <li>Moderate storage requirements</li>
                          <li>Medium API costs</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Large Models<br />(1024-1536d+)</td>
                      <td className="p-3">1024-1536+</td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Complex semantic tasks</li>
                          <li>Specialized domains</li>
                          <li>High-precision requirements</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Highest semantic precision</li>
                          <li>Better cross-lingual capabilities</li>
                          <li>Better for complex queries</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Slower generation</li>
                          <li>Higher storage requirements</li>
                          <li>Higher API costs</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Change Simulation</CardTitle>
                <CardDescription>See what happens when you change embedding models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="model-change" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Simulate Model Change
                    </Label>
                    <Switch
                      id="model-change"
                      checked={simulateModelChange}
                      onCheckedChange={setSimulateModelChange}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, changing the embedding model will invalidate existing embeddings, requiring regeneration.
                  </p>
                </div>

                {simulateModelChange && Object.keys(embeddings).length === 0 && (
                  <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      Model Change Detected
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      The embedding model has changed, invalidating existing embeddings. You need to regenerate all embeddings
                      with the new model to ensure consistency. Different models produce incompatible vector spaces.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="incomplete-embeddings" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Simulate Incomplete Embeddings
                    </Label>
                    <Switch
                      id="incomplete-embeddings"
                      checked={simulateIncompleteEmbeddings}
                      onCheckedChange={setSimulateIncompleteEmbeddings}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, some chunks will be skipped during embedding generation, simulating API failures or errors.
                  </p>
                </div>

                {simulateIncompleteEmbeddings && Object.keys(embeddings).length > 0 && (
                  <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      Incomplete Embeddings Detected
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Some chunks ({chunks.length - Object.keys(embeddings).length} of {chunks.length}) are missing embeddings.
                      This creates blind spots in your search index where content exists but cannot be retrieved.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Implement Change Detection
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Track document changes with timestamps or checksums to identify which embeddings need refreshing.
                      This enables efficient incremental updates rather than full reindexing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
