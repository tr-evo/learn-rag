"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation('demos')

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

    // Draw grid
    const gridSize = 20
    const gridColor = "rgba(148, 163, 184, 0.1)" // Light slate color with low opacity
    const axisColor = "rgba(148, 163, 184, 0.2)" // Slightly more visible for axes

    // Draw grid lines
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = axisColor
    ctx.lineWidth = 2

    // X-axis (horizontal middle)
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    // Y-axis (vertical middle)
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()

    // We'll visualize only the first two dimensions of the vectors for simplicity
    const drawVector = (vector: number[], color: string, size = 5) => {
      // Map vector dimensions to canvas coordinates
      const x = (vector[0] + 1) * (canvas.width / 2)
      const y = (vector[1] + 1) * (canvas.height / 2)

      // Draw the point
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
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 p-1">
          <TabsTrigger value="search" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-200">{t('indexing.vectorSearch')}</TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-200">{t('indexing.indexConfiguration')}</TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-200">{t('indexing.commonIssues')}</TabsTrigger>
        </TabsList>

        {/* Vector Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vector Visualization */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-200 font-medium flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-400" />
                    Vector Space Visualization
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    2D projection of vectors (green = indexed chunks, blue = query, orange = results)
                  </p>
                </div>
              </div>
              <div className="p-5">
                <div className="border border-slate-700 rounded-md p-1 bg-slate-900/50">
                  <canvas ref={canvasRef} width={400} height={300} className="w-full h-[300px] rounded"></canvas>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-700 flex justify-between items-center">
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-400">{t('indexing.lastRefreshed')}:</span> {lastRefreshed.toLocaleTimeString()}
                </div>
                <Button
                  onClick={refreshIndex}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('indexing.refreshIndex')}
                </Button>
              </div>
            </div>

            {/* Search Controls */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-200 font-medium flex items-center gap-2">
                    <Search className="h-5 w-5 text-emerald-400" />
                    {t('indexing.vectorSearch')}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{t('indexing.searchVectorIndex')}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">{t('indexing.searchQuery')}</Label>
                  <Select
                    value={selectedQuery === sampleQueries[0] ? "0" : selectedQuery === sampleQueries[1] ? "1" : "2"}
                    onValueChange={(value) => setSelectedQuery(sampleQueries[Number.parseInt(value)])}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder={t('indexing.selectSampleQuery')} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {sampleQueries.map((query, index) => (
                        <SelectItem key={index} value={index.toString()} className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">
                          {query.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800">
                      {t('indexing.indexStatus')} {indexedChunks.length} {t('indexing.chunks')}
                    </Badge>
                    <Badge className="bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800">
                      {t('indexing.distanceMetric')}: {indexConfig.distanceMetric === "cosine" ? "Cosine Similarity" : "Euclidean Distance"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 ${indexConfig.approximateSearch ? "border-emerald-500/30" : ""}`}>
                      {indexConfig.approximateSearch ? t('indexing.approximate') : t('indexing.exact')} {t('indexing.search')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-700">
                <Button
                  onClick={performSearch}
                  disabled={isSearching}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isSearching ? (
                    <>{t('indexing.searching')}</>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      {t('indexing.searchVectorIndex')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  {t('indexing.searchResults')}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {searchResults.length > 0
                    ? t('indexing.foundResults', { count: searchResults.length, time: searchTime.toFixed(1) })
                    : t('indexing.runSearchToSeeResults')}
                </p>
              </div>
            </div>
            <div className="p-5">
              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  {t('indexing.noSearchResults')}
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <div key={result.id} className="p-4 border border-slate-700 rounded-lg bg-slate-900/50 hover:border-slate-600 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-slate-200 font-medium">{t('indexing.result')} #{index + 1}</h3>
                        <Badge className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300">
                          {t('indexing.distanceMetric')}: {indexConfig.distanceMetric === "cosine"
                            ? t('indexing.similarity', { value: result.similarity.toFixed(3) })
                            : t('indexing.distance', { value: (-result.similarity).toFixed(3) })}
                        </Badge>
                      </div>
                      <p className="text-slate-300 mb-2">{result.text}</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(result.metadata).map(([key, value]) => (
                          <Badge key={key} className="text-xs bg-slate-800 text-slate-300 border-slate-700">
                            {key}: {value as string}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Index Configuration Tab */}
        <TabsContent value="config">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-400" />
                  {t('indexing.indexConfiguration')}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{t('indexing.configureVectorIndexParameters')}</p>
              </div>
            </div>
            <div className="p-5 space-y-6">
              {/* Distance Metric */}
              <div className="space-y-2">
                <Label className="text-slate-300">{t('indexing.distanceMetric')}</Label>
                <Select
                  value={indexConfig.distanceMetric}
                  onValueChange={(value) => setIndexConfig({ ...indexConfig, distanceMetric: value })}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                    <SelectValue placeholder={t('indexing.selectDistanceMetric')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="cosine" className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">{t('indexing.cosineSimilarity')}</SelectItem>
                    <SelectItem value="euclidean" className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">{t('indexing.euclideanDistance')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-400">
                  {indexConfig.distanceMetric === "cosine"
                    ? t('indexing.cosineDescription')
                    : t('indexing.euclideanDescription')}
                </p>
              </div>

              {/* Search Type */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="approximate-search" className="text-slate-300">{t('indexing.approximateSearch')}</Label>
                  <Switch
                    id="approximate-search"
                    checked={indexConfig.approximateSearch}
                    onCheckedChange={(checked) => setIndexConfig({ ...indexConfig, approximateSearch: checked })}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                </div>
                <p className="text-sm text-slate-400">
                  {indexConfig.approximateSearch
                    ? t('indexing.approximateSearchDescription')
                    : t('indexing.exactSearchDescription')}
                </p>
              </div>

              {/* Index Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">{t('indexing.indexSize')} ({t('indexing.chunks')})</Label>
                  <span className="text-sm font-medium text-slate-300">{indexConfig.indexSize}</span>
                </div>
                <Slider
                  value={[indexConfig.indexSize]}
                  min={5}
                  max={1000}
                  step={5}
                  onValueChange={(value) => setIndexConfig({ ...indexConfig, indexSize: value[0] })}
                  className="[&>span]:bg-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{t('indexing.small')} (5)</span>
                  <span>{t('indexing.medium')} (100)</span>
                  <span>{t('indexing.large')} (1000)</span>
                </div>
              </div>

              {/* Refresh Interval */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">{t('indexing.refreshInterval')} ({t('indexing.seconds')})</Label>
                  <span className="text-sm font-medium text-slate-300">{indexConfig.refreshInterval}s</span>
                </div>
                <Slider
                  value={[indexConfig.refreshInterval]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={(value) => setIndexConfig({ ...indexConfig, refreshInterval: value[0] })}
                  className="[&>span]:bg-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{t('indexing.frequent')} (5s)</span>
                  <span>{t('indexing.medium')} (60s)</span>
                  <span>{t('indexing.infrequent')} (120s)</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-700 flex justify-between items-center">
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
                className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
              >
                {t('indexing.resetToDefaults')}
              </Button>
              <Button
                onClick={refreshIndex}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('indexing.applyRefreshIndex')}
              </Button>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg mt-6">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">{t('indexing.indexPerformanceCharacteristics')}</h3>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                  <h3 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-emerald-400" />
                    {t('indexing.searchSpeed')}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {indexConfig.approximateSearch
                      ? t('indexing.fastSearchDescription')
                      : t('indexing.slowSearchDescription')}
                    {indexConfig.indexSize > 500 && !indexConfig.approximateSearch && (
                      <span className="block mt-2 text-amber-300">
                        {t('indexing.exactSearchWarning')}
                      </span>
                    )}
                  </p>
                </div>
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                  <h3 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    {t('indexing.resultQuality')}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {indexConfig.approximateSearch
                      ? t('indexing.approximateQualityDescription')
                      : t('indexing.exactQualityDescription')}
                  </p>
                </div>
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                  <h3 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-emerald-400" />
                    {t('indexing.freshness')}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {indexConfig.refreshInterval < 15
                      ? t('indexing.veryFreshDescription')
                      : indexConfig.refreshInterval < 60
                        ? t('indexing.balancedDescription')
                        : t('indexing.lessFreshDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Common Issues Tab */}
        <TabsContent value="issues">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-emerald-400" />
                  {t('indexing.commonIndexingIssues')}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{t('indexing.simulateUnderstandProblems')}</p>
              </div>
            </div>
            <div className="p-5 space-y-6">
              {/* Stale Index */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stale-index" className="flex items-center gap-2 text-slate-300">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    {t('indexing.simulateStaleIndex')}
                  </Label>
                  <Switch
                    id="stale-index"
                    checked={simulateStaleIndex}
                    onCheckedChange={setSimulateStaleIndex}
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                </div>
                <p className="text-sm text-slate-400">
                  {t('indexing.staleIndexDescription')}
                  {simulateStaleIndex && (
                    <span>
                      {t('indexing.staleIndexWarning')}
                    </span>
                  )}
                </p>
              </div>

              {/* Partial Index */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="partial-index" className="flex items-center gap-2 text-slate-300">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    {t('indexing.simulatePartialIndex')}
                  </Label>
                  <Switch
                    id="partial-index"
                    checked={simulatePartialIndex}
                    onCheckedChange={setSimulatePartialIndex}
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                </div>
                <p className="text-sm text-slate-400">
                  {t('indexing.partialIndexDescription')}
                  {simulatePartialIndex && (
                    <span>
                      {t('indexing.partialIndexWarning')}
                    </span>
                  )}
                </p>
              </div>

              {/* Slow Search */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slow-search" className="flex items-center gap-2 text-slate-300">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    {t('indexing.simulateSlowSearch')}
                  </Label>
                  <Switch
                    id="slow-search"
                    checked={simulateSlowSearch}
                    onCheckedChange={setSimulateSlowSearch}
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                </div>
                <p className="text-sm text-slate-400">
                  {t('indexing.slowSearchDescription')}
                  {simulateSlowSearch && (
                    <span>
                      {t('indexing.slowSearchWarning')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg mt-6">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">{t('indexing.bestPracticesVectorIndexing')}</h3>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50 hover:border-slate-600 transition-colors">
                  <h3 className="text-slate-200 font-medium mb-2">{t('indexing.chooseRightIndexType')}</h3>
                  <p className="text-sm text-slate-300">
                    {t('indexing.chooseIndexTypeDescription')}
                  </p>
                </div>
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50 hover:border-slate-600 transition-colors">
                  <h3 className="text-slate-200 font-medium mb-2">{t('indexing.implementRegularRefresh')}</h3>
                  <p className="text-sm text-slate-300">
                    {t('indexing.regularRefreshDescription')}
                  </p>
                </div>
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50 hover:border-slate-600 transition-colors">
                  <h3 className="text-slate-200 font-medium mb-2">{t('indexing.monitorIndexHealth')}</h3>
                  <p className="text-sm text-slate-300">
                    {t('indexing.monitorHealthDescription')}
                  </p>
                </div>
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/50 hover:border-slate-600 transition-colors">
                  <h3 className="text-slate-200 font-medium mb-2">{t('indexing.planForScale')}</h3>
                  <p className="text-sm text-slate-300">
                    {t('indexing.planScaleDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
