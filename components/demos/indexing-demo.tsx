"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Search, Clock, AlertCircle, CheckCircle2, Settings, RefreshCw, Zap } from "lucide-react"

// Sample document chunks for the demo
const sampleChunks = [
  {
    id: 1,
    text: "Vector databases are specialized databases designed to store and query high-dimensional vectors efficiently.",
    vector: [0.2, 0.5, -0.3, 0.8, -0.1],
    metadata: { category: "Technology", date: "2023-05-15" },
  },
  {
    id: 2,
    text: "Approximate Nearest Neighbor (ANN) algorithms trade perfect accuracy for significant speed improvements.",
    vector: [0.4, 0.3, 0.2, 0.6, -0.4],
    metadata: { category: "Algorithm", date: "2023-06-22" },
  },
  {
    id: 3,
    text: "Cosine similarity measures the cosine of the angle between two vectors, indicating their directional similarity.",
    vector: [0.1, 0.7, -0.2, 0.3, -0.5],
    metadata: { category: "Mathematics", date: "2023-04-10" },
  },
  {
    id: 4,
    text: "Euclidean distance calculates the straight-line distance between two points in Euclidean space.",
    vector: [0.3, 0.6, -0.1, 0.2, -0.3],
    metadata: { category: "Mathematics", date: "2023-03-05" },
  },
  {
    id: 5,
    text: "Vector embeddings represent words, sentences, or documents as dense numerical vectors.",
    vector: [0.5, 0.2, 0.1, 0.7, -0.2],
    metadata: { category: "NLP", date: "2023-07-18" },
  },
  {
    id: 6,
    text: "HNSW (Hierarchical Navigable Small World) is a graph-based algorithm for approximate nearest neighbor search.",
    vector: [0.6, 0.1, 0.3, 0.5, -0.1],
    metadata: { category: "Algorithm", date: "2023-08-02" },
  },
  {
    id: 7,
    text: "IVF (Inverted File Index) partitions the vector space into clusters to speed up similarity search.",
    vector: [0.4, 0.4, 0.2, 0.4, -0.3],
    metadata: { category: "Algorithm", date: "2023-09-12" },
  },
  {
    id: 8,
    text: "PCA (Principal Component Analysis) can reduce the dimensionality of vectors while preserving most information.",
    vector: [0.2, 0.8, -0.1, 0.1, -0.4],
    metadata: { category: "Mathematics", date: "2023-02-28" },
  },
]

// Generate more chunks for scalability demo
const generateMoreChunks = (count: number) => {
  const moreChunks = []
  for (let i = 0; i < count; i++) {
    const baseChunk = sampleChunks[i % sampleChunks.length]
    moreChunks.push({
      id: sampleChunks.length + i + 1,
      text: baseChunk.text,
      vector: baseChunk.vector.map((v) => v + (Math.random() * 0.2 - 0.1)), // Slightly perturb the vectors
      metadata: { ...baseChunk.metadata },
    })
  }
  return moreChunks
}

// Sample queries for the demo
const sampleQueries = [
  {
    text: "How do vector databases work?",
    vector: [0.25, 0.45, -0.25, 0.75, -0.15],
  },
  {
    text: "What is approximate nearest neighbor search?",
    vector: [0.45, 0.25, 0.25, 0.55, -0.35],
  },
  {
    text: "Explain vector similarity metrics",
    vector: [0.15, 0.65, -0.15, 0.25, -0.45],
  },
]

// Calculate cosine similarity between two vectors
const cosineSimilarity = (a: number[], b: number[]) => {
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

// Calculate Euclidean distance between two vectors
const euclideanDistance = (a: number[], b: number[]) => {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2)
  }
  return Math.sqrt(sum)
}

export default function IndexingDemo() {
  // State for the index configuration
  const [indexConfig, setIndexConfig] = useState({
    distanceMetric: "cosine",
    approximateSearch: true,
    indexSize: sampleChunks.length,
    refreshInterval: 30, // seconds
  })

  // State for the index and search
  const [indexedChunks, setIndexedChunks] = useState([...sampleChunks])
  const [selectedQuery, setSelectedQuery] = useState(sampleQueries[0])
  const [customQuery, setCustomQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [searchTime, setSearchTime] = useState(0)

  // State for simulating issues
  const [simulateStaleIndex, setSimulateStaleIndex] = useState(false)
  const [simulatePartialIndex, setSimulatePartialIndex] = useState(false)
  const [simulateSlowSearch, setSimulateSlowSearch] = useState(false)

  // Ref for the canvas to visualize vectors
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Effect to update the indexed chunks when config changes
  useEffect(() => {
    let chunks = [...sampleChunks]

    // Add more chunks if needed for the scalability demo
    if (indexConfig.indexSize > sampleChunks.length) {
      const additionalChunks = generateMoreChunks(indexConfig.indexSize - sampleChunks.length)
      chunks = [...chunks, ...additionalChunks]
    } else {
      chunks = chunks.slice(0, indexConfig.indexSize)
    }

    // Simulate partial index
    if (simulatePartialIndex) {
      chunks = chunks.filter((_, i) => i % 3 !== 0) // Remove every third chunk
    }

    setIndexedChunks(chunks)
    setLastRefreshed(new Date())
  }, [indexConfig.indexSize, simulatePartialIndex])

  // Effect to draw the vector visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // We'll visualize only the first two dimensions of the vectors for simplicity
    const drawVector = (vector: number[], color: string, size = 5) => {
      // Map vector dimensions to canvas coordinates
      const x = (vector[0] + 1) * (canvas.width / 2)
      const y = (vector[1] + 1) * (canvas.height / 2)

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw indexed chunks
    indexedChunks.forEach((chunk) => {
      drawVector(chunk.vector, "rgba(74, 222, 128, 0.6)") // Green for indexed chunks
    })

    // Draw the query vector
    if (selectedQuery) {
      drawVector(selectedQuery.vector, "rgba(59, 130, 246, 0.8)", 7) // Blue for query
    }

    // Draw search results
    searchResults.forEach((result) => {
      drawVector(result.vector, "rgba(249, 115, 22, 0.8)", 6) // Orange for results
    })
  }, [indexedChunks, selectedQuery, searchResults])

  // Function to perform vector search
  const performSearch = async () => {
    setIsSearching(true)
    const startTime = performance.now()

    // Simulate search delay for large indices or when slow search is enabled
    const searchDelay = simulateSlowSearch
      ? 1500
      : indexConfig.indexSize > 1000
        ? 800
        : indexConfig.indexSize > 100
          ? 300
          : 50

    await new Promise((resolve) => setTimeout(resolve, searchDelay))

    // Calculate similarities between query and all indexed chunks
    const results = indexedChunks.map((chunk) => {
      const similarity =
        indexConfig.distanceMetric === "cosine"
          ? cosineSimilarity(selectedQuery.vector, chunk.vector)
          : -euclideanDistance(selectedQuery.vector, chunk.vector) // Negative because we want higher values to be better

      return {
        ...chunk,
        similarity,
      }
    })

    // Sort by similarity (descending)
    results.sort((a, b) => b.similarity - a.similarity)

    // Take top 3 results
    const topResults = results.slice(0, 3)

    // If using approximate search, introduce some randomness to the order
    if (indexConfig.approximateSearch && indexConfig.indexSize > 20) {
      // Shuffle slightly to simulate approximate results
      for (let i = 0; i < topResults.length - 1; i++) {
        if (Math.random() < 0.3) {
          ;[topResults[i], topResults[i + 1]] = [topResults[i + 1], topResults[i]]
        }
      }
    }

    const endTime = performance.now()
    setSearchTime(endTime - startTime)
    setSearchResults(topResults)
    setIsSearching(false)
  }

  // Function to refresh the index
  const refreshIndex = () => {
    // Simulate index refresh
    setLastRefreshed(new Date())

    // If simulating stale index, don't actually update anything
    if (!simulateStaleIndex) {
      // In a real system, this would re-fetch data and rebuild the index
      setIndexedChunks([...sampleChunks].slice(0, indexConfig.indexSize))
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Vector Search</TabsTrigger>
          <TabsTrigger value="config">Index Configuration</TabsTrigger>
          <TabsTrigger value="issues">Common Issues</TabsTrigger>
        </TabsList>

        {/* Vector Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vector Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Vector Space Visualization
                </CardTitle>
                <CardDescription>
                  2D projection of vectors (green = indexed chunks, blue = query, orange = results)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-1 bg-slate-50 dark:bg-slate-900">
                  <canvas ref={canvasRef} width={400} height={300} className="w-full h-[300px] rounded"></canvas>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last refreshed: {lastRefreshed.toLocaleTimeString()}
                </div>
                <Button size="sm" onClick={refreshIndex} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Index
                </Button>
              </CardFooter>
            </Card>

            {/* Search Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Vector Search
                </CardTitle>
                <CardDescription>Search the vector index for similar content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select a query</Label>
                  <Select
                    value={selectedQuery === sampleQueries[0] ? "0" : selectedQuery === sampleQueries[1] ? "1" : "2"}
                    onValueChange={(value) => setSelectedQuery(sampleQueries[Number.parseInt(value)])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a query" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleQueries.map((query, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {query.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-slate-100 dark:bg-slate-800">
                      Index Size: {indexedChunks.length} chunks
                    </Badge>
                    <Badge className="bg-slate-100 dark:bg-slate-800">
                      Metric: {indexConfig.distanceMetric === "cosine" ? "Cosine Similarity" : "Euclidean Distance"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={indexConfig.approximateSearch ? "" : ""}>
                      {indexConfig.approximateSearch ? "Approximate" : "Exact"} Search
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={performSearch} disabled={isSearching} className="w-full flex items-center gap-2">
                  {isSearching ? (
                    <>Searching...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search Vector Index
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Search Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Search Results</CardTitle>
              <CardDescription>
                {searchResults.length > 0
                  ? `Found ${searchResults.length} similar chunks in ${searchTime.toFixed(1)}ms`
                  : "Run a search to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No search results yet. Click "Search Vector Index" to find similar content.
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <div key={result.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Result #{index + 1}</h3>
                        <Badge>
                          {indexConfig.distanceMetric === "cosine"
                            ? `Similarity: ${result.similarity.toFixed(3)}`
                            : `Distance: ${(-result.similarity).toFixed(3)}`}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">{result.text}</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(result.metadata).map(([key, value]) => (
                          <Badge key={key} className="text-xs">
                            {key}: {value as string}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Index Configuration Tab */}
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Index Configuration
              </CardTitle>
              <CardDescription>Configure your vector index parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Distance Metric */}
              <div className="space-y-2">
                <Label>Distance Metric</Label>
                <Select
                  value={indexConfig.distanceMetric}
                  onValueChange={(value) => setIndexConfig({ ...indexConfig, distanceMetric: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cosine">Cosine Similarity</SelectItem>
                    <SelectItem value="euclidean">Euclidean Distance</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {indexConfig.distanceMetric === "cosine"
                    ? "Cosine similarity measures the angle between vectors, focusing on direction rather than magnitude."
                    : "Euclidean distance measures the straight-line distance between vectors in the embedding space."}
                </p>
              </div>

              {/* Search Type */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="approximate-search">Approximate Search</Label>
                  <Switch
                    id="approximate-search"
                    checked={indexConfig.approximateSearch}
                    onCheckedChange={(checked) => setIndexConfig({ ...indexConfig, approximateSearch: checked })}
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {indexConfig.approximateSearch
                    ? "Approximate search (ANN) trades perfect accuracy for significant speed improvements, essential for large datasets."
                    : "Exact search guarantees finding the true nearest neighbors but can be slower on large datasets."}
                </p>
              </div>

              {/* Index Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Index Size (chunks)</Label>
                  <span className="text-sm font-medium">{indexConfig.indexSize}</span>
                </div>
                <Slider
                  value={[indexConfig.indexSize]}
                  min={5}
                  max={1000}
                  step={5}
                  onValueChange={(value) => setIndexConfig({ ...indexConfig, indexSize: value[0] })}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Small (5)</span>
                  <span>Medium (100)</span>
                  <span>Large (1000)</span>
                </div>
              </div>

              {/* Refresh Interval */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Refresh Interval (seconds)</Label>
                  <span className="text-sm font-medium">{indexConfig.refreshInterval}s</span>
                </div>
                <Slider
                  value={[indexConfig.refreshInterval]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={(value) => setIndexConfig({ ...indexConfig, refreshInterval: value[0] })}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Frequent (5s)</span>
                  <span>Medium (60s)</span>
                  <span>Infrequent (120s)</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setIndexConfig({
                    distanceMetric: "cosine",
                    approximateSearch: true,
                    indexSize: sampleChunks.length,
                    refreshInterval: 30,
                  })
                }}
              >
                Reset to Defaults
              </Button>
              <Button onClick={refreshIndex} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Apply & Refresh Index
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Index Performance Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Search Speed
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {indexConfig.approximateSearch
                      ? "Fast, scales well to large datasets due to approximate search algorithms."
                      : "Slower on large datasets as exact search examines all vectors."}
                    {indexConfig.indexSize > 500 && !indexConfig.approximateSearch && (
                      <span className="block mt-2 text-amber-600 dark:text-amber-400">
                        Warning: Exact search on large indices may cause performance issues.
                      </span>
                    )}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Result Quality
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {indexConfig.approximateSearch
                      ? "Good but not perfect. May occasionally miss the absolute best match."
                      : "Highest quality results, guaranteed to find the true nearest neighbors."}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Freshness
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {indexConfig.refreshInterval < 15
                      ? "Very fresh data with frequent updates, but higher system load."
                      : indexConfig.refreshInterval < 60
                        ? "Balanced approach with regular updates."
                        : "Less frequent updates, may miss recent changes but lower system load."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Common Issues Tab */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Common Indexing Issues
              </CardTitle>
              <CardDescription>Simulate and understand common problems with vector indices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stale Index */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stale-index" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Simulate Stale Index
                  </Label>
                  <Switch id="stale-index" checked={simulateStaleIndex} onCheckedChange={setSimulateStaleIndex} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  When enabled, the index won't update when refreshed, simulating an outdated index that returns stale
                  results.
                </p>
                {simulateStaleIndex && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Stale index detected! The index is not being updated with new or changed documents. This can lead
                      to outdated or incorrect search results.
                    </span>
                  </div>
                )}
              </div>

              {/* Partial Index */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="partial-index" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Simulate Partial Index
                  </Label>
                  <Switch id="partial-index" checked={simulatePartialIndex} onCheckedChange={setSimulatePartialIndex} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  When enabled, some documents will be missing from the index, simulating failed indexing or incomplete
                  data.
                </p>
                {simulatePartialIndex && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Partial index detected! Some documents are missing from the index. This can lead to incomplete
                      search results and missed relevant information.
                    </span>
                  </div>
                )}
              </div>

              {/* Slow Search */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slow-search" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Simulate Slow Search
                  </Label>
                  <Switch id="slow-search" checked={simulateSlowSearch} onCheckedChange={setSimulateSlowSearch} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  When enabled, searches will take longer, simulating performance issues with large or poorly configured
                  indices.
                </p>
                {simulateSlowSearch && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Slow search performance detected! This could be due to a large index size, inefficient index
                      configuration, or insufficient resources.
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Best Practices for Vector Indexing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Choose the Right Index Type</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Different vector databases offer various index types (HNSW, IVF, etc.). Choose based on your dataset
                    size, query patterns, and accuracy requirements. For large datasets, approximate nearest neighbor
                    (ANN) algorithms are usually necessary.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Implement Regular Refresh Cycles</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Set up automated index refresh processes that align with your data update frequency. For rapidly
                    changing data, consider incremental updates rather than full rebuilds to maintain freshness without
                    excessive overhead.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Monitor Index Health</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Implement monitoring for index size, query latency, and indexing errors. Set up alerts for failed
                    indexing jobs or performance degradation to catch issues before they affect users.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Plan for Scale</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Design your indexing strategy with future growth in mind. Consider sharding, partitioning, or
                    clustering strategies that will allow your index to scale horizontally as your data volume
                    increases.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
