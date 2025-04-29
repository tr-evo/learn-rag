"use client"

import React from "react"
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
  const [showQueryBubble, setShowQueryBubble] = useState(false)

  // State for simulating issues (only keeping what's needed for model comparison)
  const [simulateModelChange, setSimulateModelChange] = useState(false)
  const [simulateIncompleteEmbeddings, setSimulateIncompleteEmbeddings] = useState(false)

  // Ref for the canvas to visualize embeddings
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate embeddings for all chunks
  const generateAllEmbeddings = () => {
    setIsGenerating(true)
    
    // Clear any existing search results when regenerating embeddings
    clearSearch()

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

  // Perform search using embeddings
  const performSearch = (queryText?: string) => {
    const queryToUse = queryText ?? searchQuery;
    
    if (!queryToUse.trim() || Object.keys(embeddings).length === 0) return

    setIsSearching(true)
    setShowQueryBubble(true)
    setSearchQuery(queryToUse) // Update input field if queryText is provided

    // Generate embedding for the search query
    const queryEmbedding = generateEmbedding(queryToUse, selectedModel.id)

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

  // Clear search results and query bubble
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowQueryBubble(false)
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
    const projectTo2D = (vector: number[], index: number = 0) => {
      // Use a more varied projection to avoid overlap
      // Add some jitter based on the index to prevent points from stacking
      const jitterX = index * 0.05
      const jitterY = index * 0.03
      
      const x = (Math.sin(vector[0] * 10 + jitterX) * 0.5 + 0.5) * canvas.width * 0.7 + canvas.width * 0.15
      const y = (Math.sin(vector[1] * 10 + jitterY) * 0.5 + 0.5) * canvas.height * 0.7 + canvas.height * 0.15
      return { x, y }
    }

    // Create a map to track occupied positions
    const occupiedPositions: Array<{x: number, y: number}> = []
    
    // Find a non-overlapping position
    const findNonOverlappingPosition = (baseX: number, baseY: number, radius: number = 20) => {
      // Check if position overlaps with any existing point
      const isOverlapping = () => {
        return occupiedPositions.some(pos => {
          const distance = Math.sqrt(Math.pow(pos.x - baseX, 2) + Math.pow(pos.y - baseY, 2))
          return distance < radius
        })
      }
      
      // If no overlap, use original position
      if (!isOverlapping()) {
        occupiedPositions.push({x: baseX, y: baseY})
        return {x: baseX, y: baseY}
      }
      
      // Try adjusting the position outward in a spiral
      let angle = 0
      let distance = radius
      let attempts = 0
      const maxAttempts = 10
      
      while (attempts < maxAttempts) {
        const newX = baseX + Math.cos(angle) * distance
        const newY = baseY + Math.sin(angle) * distance
        
        // Check if this new position is within canvas and doesn't overlap
        if (newX > 20 && newX < canvas.width - 20 && 
            newY > 20 && newY < canvas.height - 20) {
          baseX = newX
          baseY = newY
          
          if (!isOverlapping()) {
            occupiedPositions.push({x: baseX, y: baseY})
            return {x: baseX, y: baseY}
          }
        }
        
        angle += Math.PI / 4
        if (angle >= Math.PI * 2) {
          angle = 0
          distance += radius / 2
        }
        attempts++
      }
      
      // If we can't find a non-overlapping position, just return the original
      occupiedPositions.push({x: baseX, y: baseY})
      return {x: baseX, y: baseY}
    }

    // Draw embeddings
    Object.entries(embeddings).forEach(([idStr, embedding], index) => {
      const id = Number.parseInt(idStr)
      const chunk = chunks.find(c => c.id === id)
      let { x, y } = projectTo2D(embedding, index)
      
      // Adjust position to avoid overlap
      const position = findNonOverlappingPosition(x, y)
      x = position.x
      y = position.y

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
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px Arial"
      ctx.fillText(`#${id}`, x + 10, y)
    })

    // Draw search query if available
    if (searchQuery && showQueryBubble) {
      const queryEmbedding = generateEmbedding(searchQuery, selectedModel.id)
      let { x, y } = projectTo2D(queryEmbedding)
      
      // Adjust position to avoid overlap
      const position = findNonOverlappingPosition(x, y)
      x = position.x
      y = position.y

      ctx.fillStyle = "rgba(220, 38, 38, 0.8)"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "10px Arial"
      ctx.fillText("Query", x + 10, y)
    }
  }, [embeddings, chunks, searchQuery, isSearching, showQueryBubble, selectedModel.id])

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
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
          <TabsTrigger value="creation" className="data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-400">Embedding Creation</TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-400">Model Comparison</TabsTrigger>
        </TabsList>

        {/* Embedding Creation Tab */}
        <TabsContent value="creation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Embedding Configuration */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-emerald-400" />
                  Embedding Configuration
                </h3>
                <p className="text-slate-400 text-sm">Configure embedding model and settings</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Embedding Model</Label>
                  <Select
                    value={selectedModel.id}
                    onValueChange={(value) => {
                      const model = embeddingModels.find(m => m.id === value)
                      if (model) setSelectedModel(model)
                    }}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="Select embedding model" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {embeddingModels.map(model => (
                        <SelectItem key={model.id} value={model.id} className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">
                          {model.name} ({model.dimensions}d)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="p-2 bg-slate-900/50 border border-slate-700 rounded text-center">
                      <div className="text-xs text-slate-400 mb-1">Quality</div>
                      <div className="text-slate-300 font-medium">{selectedModel.quality}</div>
                    </div>
                    <div className="p-2 bg-slate-900/50 border border-slate-700 rounded text-center">
                      <div className="text-xs text-slate-400 mb-1">Speed</div>
                      <div className="text-slate-300 font-medium">{selectedModel.speed}</div>
                    </div>
                    <div className="p-2 bg-slate-900/50 border border-slate-700 rounded text-center">
                      <div className="text-xs text-slate-400 mb-1">Cost</div>
                      <div className="text-slate-300 font-medium">{selectedModel.cost}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Text Chunks</Label>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {chunks.map(chunk => (
                      <div key={chunk.id} className="p-2 bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all rounded-md">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm text-slate-300">Chunk #{chunk.id}</span>
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">{chunk.category}</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{chunk.text}</p>
                        <div className="text-xs text-slate-500 mt-1">
                          Last updated: {chunk.lastUpdated.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Embedding Status</Label>
                  <div className="p-3 bg-slate-900/50 border border-slate-700 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Embeddings Generated:</span>
                      <span className="font-medium text-slate-300">{Object.keys(embeddings).length} / {chunks.length}</span>
                    </div>
                    {lastRefreshed && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-slate-400">Last Refreshed:</span>
                        <span className="font-medium text-slate-300">{lastRefreshed.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-700">
                <Button
                  onClick={generateAllEmbeddings}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                  {isGenerating ? "Generating..." : "Generate Embeddings"}
                </Button>
              </div>
            </div>

            {/* Embedding Visualization */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  Embedding Visualization
                </h3>
                <p className="text-slate-400 text-sm">2D projection of high-dimensional embeddings</p>
              </div>
              <div className="p-5">
                <div className="border border-slate-700 rounded-md p-1 bg-slate-900/50">
                  <canvas ref={canvasRef} width={400} height={300} className="w-full h-[300px] rounded" />
                </div>
                <div className="flex justify-center mt-4 gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-slate-400">Technical</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-slate-400">Best Practice</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-slate-400">Financial</span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-700 text-xs text-slate-500 text-center">
                Note: This is a simplified 2D projection. Real embeddings have {selectedModel.dimensions} dimensions.
              </div>
            </div>
          </div>

          {/* Search with Embeddings */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-400" />
                Search with Embeddings
              </h3>
              <p className="text-slate-400 text-sm">See how embeddings enable semantic search</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-md mb-4">
                <h3 className="font-medium mb-2 text-slate-300">How Search Works in This Demo</h3>
                <p className="text-sm text-slate-400">
                  This demo uses a simplified simulation of vector search. Instead of a real embedding model, we use a 
                  deterministic algorithm that converts text to vectors based on character codes and text patterns.
                  When you search, we:
                </p>
                <ol className="list-decimal ml-5 mt-2 text-sm text-slate-400 space-y-1">
                  <li>Generate a simulated vector for your query using our simplified algorithm</li>
                  <li>Compare it to the simulated vectors of each text chunk using cosine similarity</li>
                  <li>Return the chunks with the highest similarity scores</li>
                </ol>
                <p className="text-sm text-slate-400 mt-2">
                  This demonstrates the core concept of semantic search while being fast enough to run entirely in your browser.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-emerald-500 bg-slate-900/50 rounded-r-md mb-4">
                <h3 className="font-medium mb-2 text-emerald-400">Try These Example Queries</h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {["semantic understanding", "vector dimensions", "performance improvement", "revenue report", "RAG system"].map((query) => (
                    <Button 
                      key={query} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start text-xs border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
                      onClick={() => performSearch(query)}
                      disabled={Object.keys(embeddings).length === 0}
                    >
                      <Search className="mr-2 h-3 w-3 text-emerald-400" />
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Enter search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      performSearch();
                    }
                  }}
                  className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                <Button
                  onClick={() => performSearch()}
                  disabled={isSearching || !searchQuery.trim() || Object.keys(embeddings).length === 0}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
                {searchResults.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={clearSearch}
                    className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {Object.keys(embeddings).length === 0 && (
                <div className="p-4 bg-amber-900/20 border border-amber-500/30 text-amber-300 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>No embeddings generated yet. Click "Generate Embeddings" to create embeddings for the text chunks.</span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-300">Search Results</h3>
                  {searchResults.map(result => {
                    const chunk = chunks.find(c => c.id === result.id)
                    return chunk ? (
                      <div key={result.id} className="p-3 bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all rounded-md">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-slate-300">Chunk #{chunk.id}</span>
                          <Badge className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300">
                            {(result.similarity * 100).toFixed(1)}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{chunk.text}</p>
                      </div>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Model Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-slate-200 font-medium">Embedding Model Comparison</h3>
              <p className="text-slate-400 text-sm">Compare different embedding models and their characteristics</p>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-300">Model Type</th>
                      <th className="text-left p-3 text-slate-300">Dimensions</th>
                      <th className="text-left p-3 text-slate-300">Best For</th>
                      <th className="text-left p-3 text-slate-300">Advantages</th>
                      <th className="text-left p-3 text-slate-300">Disadvantages</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700">
                      <td className="p-3 font-medium text-slate-300">Small Models<br />(128-384d)</td>
                      <td className="p-3 text-slate-400">128-384</td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Simple applications</li>
                          <li>Large document sets</li>
                          <li>Cost-sensitive deployments</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Fast generation</li>
                          <li>Lower storage requirements</li>
                          <li>Lower API costs</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Less semantic precision</li>
                          <li>Poorer handling of nuance</li>
                          <li>May miss subtle relationships</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="p-3 font-medium text-slate-300">Medium Models<br />(512-768d)</td>
                      <td className="p-3 text-slate-400">512-768</td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>General purpose RAG</li>
                          <li>Balanced applications</li>
                          <li>Most documentation</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Good balance of quality/cost</li>
                          <li>Reasonable generation speed</li>
                          <li>Good semantic understanding</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>May struggle with specialized domains</li>
                          <li>Moderate storage requirements</li>
                          <li>Medium API costs</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-300">Large Models<br />(1024-1536d+)</td>
                      <td className="p-3 text-slate-400">1024-1536+</td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Complex semantic tasks</li>
                          <li>Specialized domains</li>
                          <li>High-precision requirements</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Highest semantic precision</li>
                          <li>Better cross-lingual capabilities</li>
                          <li>Better for complex queries</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium">Model Change Simulation</h3>
                <p className="text-slate-400 text-sm">See what happens when you change embedding models</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="model-change" className="flex items-center gap-2 text-slate-300">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Simulate Model Change
                    </Label>
                    <Switch
                      id="model-change"
                      checked={simulateModelChange}
                      onCheckedChange={setSimulateModelChange}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, changing the embedding model will invalidate existing embeddings, requiring regeneration.
                  </p>
                </div>

                {simulateModelChange && Object.keys(embeddings).length === 0 && (
                  <div className="p-4 bg-amber-900/20 border border-amber-500/30 text-amber-300 rounded-lg">
                    <h3 className="font-medium text-amber-300 flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      Model Change Detected
                    </h3>
                    <p className="text-sm text-amber-300">
                      The embedding model has changed, invalidating existing embeddings. You need to regenerate all embeddings
                      with the new model to ensure consistency. Different models produce incompatible vector spaces.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="incomplete-embeddings" className="flex items-center gap-2 text-slate-300">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Simulate Incomplete Embeddings
                    </Label>
                    <Switch
                      id="incomplete-embeddings"
                      checked={simulateIncompleteEmbeddings}
                      onCheckedChange={setSimulateIncompleteEmbeddings}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, some chunks will be skipped during embedding generation, simulating API failures or errors.
                  </p>
                </div>

                {simulateIncompleteEmbeddings && Object.keys(embeddings).length > 0 && (
                  <div className="p-4 bg-amber-900/20 border border-amber-500/30 text-amber-300 rounded-lg">
                    <h3 className="font-medium text-amber-300 flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      Incomplete Embeddings Detected
                    </h3>
                    <p className="text-sm text-amber-300">
                      Some chunks ({chunks.length - Object.keys(embeddings).length} of {chunks.length}) are missing embeddings.
                      This creates blind spots in your search index where content exists but cannot be retrieved.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium">Best Practices</h3>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      Implement Change Detection
                    </h3>
                    <p className="text-sm text-slate-400">
                      Track document changes with timestamps or checksums to identify which embeddings need refreshing.
                      This enables efficient incremental updates rather than full reindexing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-8">
            <h3 className="text-slate-200 font-medium mb-3 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              Embedding Strategy Recap
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Choose the right embedding model based on your specific needs. Higher dimensions generally provide better semantic 
              understanding but come with increased costs and storage requirements. Refresh embeddings when source content changes 
              to maintain retrieval quality.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
