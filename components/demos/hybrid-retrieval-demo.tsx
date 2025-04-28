"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, FileTextIcon, BarChart3Icon, Settings2Icon, LoaderIcon } from "lucide-react"

// Define the document type with optional fusionScore
type DocumentType = {
  id: number
  title: string
  content: string
  source: string
  date: string
  scores: {
    vector: number
    bm25: number
    combined: number
  }
  fusionScore?: number
}

// Sample documents for the demo
const sampleDocuments: DocumentType[] = [
  {
    id: 1,
    title: "Vector Embedding Models Explained",
    content: "Vector embeddings transform text into high-dimensional vectors that capture semantic meaning. These models are trained on large text corpora to encode the relationships between words and concepts.",
    source: "AI Documentation",
    date: "2023-05-15",
    // Scores from different retrieval methods
    scores: {
      vector: 0.88,
      bm25: 0.45,
      combined: 0.72,
    },
  },
  {
    id: 2,
    title: "BM25 Algorithm for Information Retrieval",
    content: "BM25 is a keyword-based ranking function used in information retrieval systems. It improves upon the TF-IDF algorithm by accounting for document length and term saturation.",
    source: "Search Engineering Handbook",
    date: "2023-02-10",
    scores: {
      vector: 0.56,
      bm25: 0.91,
      combined: 0.78,
    },
  },
  {
    id: 3,
    title: "Building Hybrid Search Systems",
    content: "Hybrid search systems combine the precision of keyword matching with the semantic understanding of vector search. This approach provides more robust and accurate search results by leveraging the strengths of both methodologies.",
    source: "Tech Blog",
    date: "2023-06-22",
    scores: {
      vector: 0.92,
      bm25: 0.87,
      combined: 0.94,
    },
  },
  {
    id: 4,
    title: "Query Processing Techniques",
    content: "Effective query processing requires analyzing user intent and extracting key terms. Both lexical and semantic analysis can improve retrieval quality by better matching queries to relevant documents.",
    source: "Research Paper",
    date: "2023-04-05",
    scores: {
      vector: 0.72,
      bm25: 0.75,
      combined: 0.81,
    },
  },
  {
    id: 5,
    title: "Vector Databases and Their Applications",
    content: "Vector databases are specialized for storing and retrieving high-dimensional vectors efficiently. They use approximate nearest neighbor algorithms like HNSW to enable fast similarity search.",
    source: "Database Documentation",
    date: "2023-03-18",
    scores: {
      vector: 0.95,
      bm25: 0.37,
      combined: 0.73,
    },
  },
  {
    id: 6,
    title: "Keyword Search Limitations and Solutions",
    content: "Traditional keyword search faces challenges with synonyms, context, and conceptual matching. These limitations can be addressed by incorporating semantic search capabilities and query expansion techniques.",
    source: "Information Retrieval Guide",
    date: "2023-01-30",
    scores: {
      vector: 0.63,
      bm25: 0.89,
      combined: 0.77,
    },
  },
  {
    id: 7,
    title: "RAG Systems and Information Retrieval",
    content: "Retrieval Augmented Generation requires effective document retrieval to provide relevant context to language models. Hybrid retrieval approaches often deliver the most reliable results for RAG applications.",
    source: "AI Engineering Blog",
    date: "2023-07-12",
    scores: {
      vector: 0.81,
      bm25: 0.68,
      combined: 0.84,
    },
  },
  {
    id: 8,
    title: "Search Relevance Optimization",
    content: "Optimizing search relevance requires balancing precision and recall. Hybrid methods that combine multiple retrieval approaches can improve both metrics simultaneously.",
    source: "Search Quality Handbook",
    date: "2023-05-27",
    scores: {
      vector: 0.78,
      bm25: 0.84,
      combined: 0.89,
    },
  },
]

// Fusion methods for combining vector and keyword search
const fusionMethods = [
  {
    id: "weighted",
    name: "Weighted Combination",
    description: "Combines scores using weighted average",
  },
  {
    id: "reciprocal",
    name: "Reciprocal Rank Fusion",
    description: "Combines results based on their rank positions",
  },
  {
    id: "max",
    name: "Maximum Score",
    description: "Takes the maximum score from either method",
  },
  {
    id: "sequential",
    name: "Sequential Filtering",
    description: "Uses one method to filter, then ranks with the other",
  },
]

// Pre-defined example queries
const exampleQueries = [
  "How do vector embeddings work?",
  "What is BM25 algorithm?",
  "Hybrid search systems benefits",
  "Query processing for search",
  "Limitations of keyword search",
]

export default function HybridRetrievalDemo() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [vectorWeight, setVectorWeight] = useState(50)
  const [bm25Weight, setBm25Weight] = useState(50)
  const [fusionMethod, setFusionMethod] = useState("weighted")
  const [isSearching, setIsSearching] = useState(false)
  const [showVectorResults, setShowVectorResults] = useState(true)
  const [showBm25Results, setShowBm25Results] = useState(true)
  const [searchResults, setSearchResults] = useState<DocumentType[]>([])
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)

  // Perform search with the current settings
  const performSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      let results = [...sampleDocuments]

      // Sort based on the selected fusion method
      if (fusionMethod === "weighted") {
        results.sort((a, b) => {
          const aScore = (a.scores.vector * (vectorWeight / 100)) + (a.scores.bm25 * (bm25Weight / 100))
          const bScore = (b.scores.vector * (vectorWeight / 100)) + (b.scores.bm25 * (bm25Weight / 100))
          return bScore - aScore
        })
      } else if (fusionMethod === "reciprocal") {
        // Create maps to store the rank position of each document
        const vectorRanks: Record<number, number> = {}
        const bm25Ranks: Record<number, number> = {}

        // Calculate vector ranks
        const vectorRanked = [...results].sort((a, b) => b.scores.vector - a.scores.vector)
        vectorRanked.forEach((doc, idx) => {
          vectorRanks[doc.id] = idx + 1
        })

        // Calculate BM25 ranks
        const bm25Ranked = [...results].sort((a, b) => b.scores.bm25 - a.scores.bm25)
        bm25Ranked.forEach((doc, idx) => {
          bm25Ranks[doc.id] = idx + 1
        })

        // Calculate reciprocal rank fusion score
        results.forEach(doc => {
          const k = 60 // fusion constant
          doc.fusionScore = 1 / (k + (vectorRanks[doc.id] || 0)) + 1 / (k + (bm25Ranks[doc.id] || 0))
        })

        // Sort by fusion score
        results.sort((a, b) => (b.fusionScore || 0) - (a.fusionScore || 0))
      } else if (fusionMethod === "max") {
        results.sort((a, b) => {
          const aScore = Math.max(a.scores.vector, a.scores.bm25)
          const bScore = Math.max(b.scores.vector, b.scores.bm25)
          return bScore - aScore
        })
      } else if (fusionMethod === "sequential") {
        // First filter using BM25 (keep top 75%)
        results = results
          .sort((a, b) => b.scores.bm25 - a.scores.bm25)
          .slice(0, Math.ceil(results.length * 0.75))

        // Then rank by vector score
        results.sort((a, b) => b.scores.vector - a.scores.vector)
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  // Helper function to render score badges
  const renderScoreBadge = (score: number, label: string) => {
    const colorClass = score >= 0.8
      ? "bg-emerald-900/30 border border-emerald-500/50 text-emerald-300"
      : score >= 0.6
        ? "bg-amber-900/20 border border-amber-500/30 text-amber-300"
        : "bg-red-900/20 border border-red-500/30 text-red-300"

    return (
      <Badge className={`${colorClass} font-medium`}>
        {label}: {score.toFixed(2)}
      </Badge>
    )
  }

  return (

    <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-slate-200 font-medium text-xl">Try Hybrid Retrieval</h2>
          <p className="text-slate-400 text-sm mt-1">
            Search through our sample document collection using different retrieval methods
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Search input and controls */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Enter search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <Button
                onClick={performSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                {isSearching ? <LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((query) => (
                <Badge
                  key={query}
                  className="cursor-pointer bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-colors"
                  onClick={() => setSearchQuery(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search configuration */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <Settings2Icon className="h-4 w-4 text-emerald-400" />
                Search Configuration
              </h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-mode"
                  checked={isAdvancedMode}
                  onCheckedChange={setIsAdvancedMode}
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <Label htmlFor="advanced-mode" className="text-slate-300">Advanced Mode</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fusion-method" className="text-slate-300">Fusion Method</Label>
                  <Select
                    value={fusionMethod}
                    onValueChange={setFusionMethod}
                  >
                    <SelectTrigger id="fusion-method" className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="Select fusion method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {fusionMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id} className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">
                          <div className="flex flex-col">
                            <span>{method.name}</span>
                            <span className="text-xs text-slate-400">{method.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isAdvancedMode && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-vector"
                        checked={showVectorResults}
                        onCheckedChange={setShowVectorResults}
                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <Label htmlFor="show-vector" className="text-slate-300">Show Vector Results</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-bm25"
                        checked={showBm25Results}
                        onCheckedChange={setShowBm25Results}
                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <Label htmlFor="show-bm25" className="text-slate-300">Show BM25 Results</Label>
                    </div>
                  </div>
                )}
              </div>

              {fusionMethod === "weighted" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="vector-weight" className="text-slate-300">Vector Search Weight: {vectorWeight}%</Label>
                    </div>
                    <Slider
                      id="vector-weight"
                      min={0}
                      max={100}
                      step={5}
                      value={[vectorWeight]}
                      onValueChange={(value) => {
                        setVectorWeight(value[0])
                        setBm25Weight(100 - value[0])
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="bm25-weight" className="text-slate-300">Keyword (BM25) Weight: {bm25Weight}%</Label>
                    </div>
                    <Slider
                      id="bm25-weight"
                      min={0}
                      max={100}
                      step={5}
                      value={[bm25Weight]}
                      onValueChange={(value) => {
                        setBm25Weight(value[0])
                        setVectorWeight(100 - value[0])
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <SearchIcon className="h-4 w-4 text-emerald-400" />
                Search Results
              </h3>
              <div className="space-y-4">
                {searchResults.map((doc) => (
                  <div key={doc.id} className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600">
                    <div className="px-5 py-4 bg-slate-700/30 border-b border-slate-700">
                      <div className="flex justify-between">
                        <h4 className="text-slate-200 font-medium">{doc.title}</h4>
                        <Badge className="bg-slate-900/50 text-slate-300 border-slate-700">{doc.source}</Badge>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {showVectorResults && renderScoreBadge(doc.scores.vector, "Vector")}
                        {showBm25Results && renderScoreBadge(doc.scores.bm25, "BM25")}
                        {renderScoreBadge(
                          fusionMethod === "reciprocal" ? (doc.fusionScore || 0) : doc.scores.combined,
                          "Combined"
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-slate-300">{doc.content}</p>
                      <div className="text-sm text-slate-400 mt-2">
                        Document date: {doc.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Panel */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-8">
            <h4 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4" />
              About Hybrid Retrieval
            </h4>
            <p className="text-slate-400">
              This demo showcases how different retrieval methods can be combined for more effective document search.
              Vector search excels at semantic understanding, while BM25 is strong with exact keyword matching.
              Experiment with different fusion methods to see how they balance precision and recall.
            </p>
          </div>
        </div>
      </div>
    </div>

  )
} 