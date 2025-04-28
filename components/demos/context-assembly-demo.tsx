"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Info } from "lucide-react"

// Sample retrieved chunks with some overlap/redundancy
const retrievedChunks = [
  {
    id: 1,
    text: "Vector databases are specialized database systems designed to store and query high-dimensional vector data efficiently. Unlike traditional databases that excel at exact matches, vector databases are optimized for similarity search using techniques like approximate nearest neighbor (ANN) algorithms.",
    source: "Introduction to Vector Databases",
    score: 0.92,
    tokens: 48,
    metadata: {
      date: "2023-05-15",
      author: "Tech Documentation Team",
      category: "Database Technology",
    },
  },
  {
    id: 2,
    text: "Approximate nearest neighbor (ANN) algorithms are fundamental to vector search. These algorithms trade perfect accuracy for dramatic speed improvements, making them practical for large-scale applications. Popular ANN algorithms include HNSW (Hierarchical Navigable Small World), IVF (Inverted File Index), and PQ (Product Quantization).",
    source: "Vector Search Algorithms",
    score: 0.87,
    tokens: 45,
    metadata: {
      date: "2023-04-22",
      author: "Research Team",
      category: "Algorithms",
    },
  },
  {
    id: 3,
    text: "Vector databases are optimized for similarity search rather than exact matching. They store embeddings - numerical representations of data - and find similar items by calculating distance in vector space. This makes them ideal for semantic search, recommendation systems, and other AI applications.",
    source: "Vector Database Applications",
    score: 0.85,
    tokens: 42,
    metadata: {
      date: "2023-06-10",
      author: "AI Solutions Team",
      category: "Applications",
    },
  },
  {
    id: 4,
    text: "When implementing a vector database, you need to consider several factors: the dimensionality of your vectors, the distance metric (cosine, Euclidean, dot product), the indexing algorithm, and hardware requirements. These choices significantly impact search performance and accuracy.",
    source: "Vector Database Implementation Guide",
    score: 0.81,
    tokens: 39,
    metadata: {
      date: "2023-03-05",
      author: "Engineering Team",
      category: "Implementation",
    },
  },
  {
    id: 5,
    text: "Popular vector database options include Pinecone, Weaviate, Milvus, Qdrant, and pgvector (a PostgreSQL extension). Each has different strengths: some excel at scale, others at ease of use, and some offer unique features like filtering or hybrid search capabilities.",
    source: "Vector Database Comparison",
    score: 0.78,
    tokens: 41,
    metadata: {
      date: "2023-07-01",
      author: "Database Evaluation Team",
      category: "Product Comparison",
    },
  },
  {
    id: 6,
    text: "Vector databases store and query high-dimensional vector data efficiently, making them essential for modern AI applications. They enable similarity search across millions or billions of vectors in milliseconds, powering use cases from semantic search to recommendation engines.",
    source: "AI Infrastructure Basics",
    score: 0.76,
    tokens: 37,
    metadata: {
      date: "2023-02-18",
      author: "AI Infrastructure Team",
      category: "Infrastructure",
    },
  },
]

// Different context assembly strategies
const assemblyStrategies = {
  simple: {
    name: "Simple Concatenation",
    description: "Concatenates chunks in order of relevance score",
    complexity: "Low",
    effectiveness: "Basic",
  },
  deduplicated: {
    name: "Deduplicated",
    description: "Removes redundant information across chunks",
    complexity: "Medium",
    effectiveness: "Good",
  },
  structured: {
    name: "Structured Format",
    description: "Organizes chunks with clear formatting and source attribution",
    complexity: "Medium",
    effectiveness: "Very Good",
  },
  summarized: {
    name: "Summarized Context",
    description: "Condenses chunks to fit more information in the token limit",
    complexity: "High",
    effectiveness: "Excellent",
  },
}

// Prompt templates
const promptTemplates = {
  basic: {
    name: "Basic Template",
    template: "Answer the question based on the context below.\n\nContext:\n{context}\n\nQuestion: {question}",
    description: "Simple template with context and question",
  },
  detailed: {
    name: "Detailed Template",
    template:
      "You are an AI assistant answering questions based on the provided context only.\n\nContext information:\n{context}\n\nAnswer the user's question based solely on the above context. If the context doesn't contain the answer, say 'I don't have enough information to answer this question.'\n\nUser question: {question}",
    description: "Detailed template with explicit instructions",
  },
  sourced: {
    name: "Source Attribution",
    template:
      "Below is context information from multiple sources, followed by a question. Answer the question based only on this information, and cite the sources used.\n\nContext:\n{context}\n\nQuestion: {question}\n\nAnswer with citations:",
    description: "Template that encourages source attribution",
  },
}

// Token estimation function (simplified)
function estimateTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
}

export default function ContextAssemblyDemo() {
  const [selectedChunks, setSelectedChunks] = useState<number[]>([1, 2, 3, 4])
  const [assemblyStrategy, setAssemblyStrategy] = useState("simple")
  const [promptTemplate, setPromptTemplate] = useState("basic")
  const [tokenLimit, setTokenLimit] = useState(1024)
  const [userQuery, setUserQuery] = useState("How do vector databases work and what are they used for?")
  const [showMetadata, setShowMetadata] = useState(false)
  const [orderByRelevance, setOrderByRelevance] = useState(true)
  const [assembledContext, setAssembledContext] = useState("")
  const [finalPrompt, setFinalPrompt] = useState("")
  const [tokenCount, setTokenCount] = useState(0)
  const [tokenWarning, setTokenWarning] = useState(false)

  // Assemble context based on selected strategy and chunks
  useEffect(() => {
    let context = ""
    let usedChunks = retrievedChunks.filter((chunk) => selectedChunks.includes(chunk.id))

    // Order chunks based on user preference
    if (orderByRelevance) {
      usedChunks = [...usedChunks].sort((a, b) => b.score - a.score)
    } else {
      // Order by source/metadata date
      usedChunks = [...usedChunks].sort(
        (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime(),
      )
    }

    // Apply assembly strategy
    switch (assemblyStrategy) {
      case "simple":
        // Simple concatenation
        context = usedChunks.map((chunk) => chunk.text).join("\n\n")
        break

      case "deduplicated":
        // Deduplicated content (simplified implementation)
        const sentences = new Set<string>()
        usedChunks.forEach((chunk) => {
          // Split into sentences and add unique ones
          chunk.text
            .split(".")
            .filter(Boolean)
            .forEach((sentence) => {
              const trimmed = sentence.trim() + "."
              sentences.add(trimmed)
            })
        })
        context = Array.from(sentences).join(" ")
        break

      case "structured":
        // Structured format with source attribution
        context = usedChunks
          .map(
            (chunk, index) =>
              `[${index + 1}] ${chunk.text}\nSource: ${chunk.source}${showMetadata ? ` (${chunk.metadata.date}, ${chunk.metadata.category})` : ""
              }`,
          )
          .join("\n\n")
        break

      case "summarized":
        // Simulate summarized content
        context = usedChunks
          .map((chunk) => {
            // Simplified simulation of summarization
            const sentences = chunk.text.split(".")
            if (sentences.length > 2) {
              return sentences.slice(0, 2).join(".") + "."
            }
            return chunk.text
          })
          .join("\n\n")
        context +=
          "\n\n[Note: The above content has been summarized to fit within token limits while preserving key information.]"
        break
    }

    setAssembledContext(context)

    // Create final prompt
    const template = promptTemplates[promptTemplate as keyof typeof promptTemplates].template
    const prompt = template.replace("{context}", context).replace("{question}", userQuery)
    setFinalPrompt(prompt)

    // Estimate token count
    const estimatedTokens = estimateTokens(prompt)
    setTokenCount(estimatedTokens)
    setTokenWarning(estimatedTokens > tokenLimit)
  }, [selectedChunks, assemblyStrategy, promptTemplate, userQuery, showMetadata, orderByRelevance, tokenLimit])

  // Toggle chunk selection
  const toggleChunk = (id: number) => {
    if (selectedChunks.includes(id)) {
      setSelectedChunks(selectedChunks.filter((chunkId) => chunkId !== id))
    } else {
      setSelectedChunks([...selectedChunks, id])
    }
  }

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg w-full">
      <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-slate-200">Context Assembly Demo</h2>
          <p className="text-slate-400 mt-1">
            Explore how different context assembly strategies affect the final prompt sent to the LLM
          </p>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Row 1: Query, Settings and Retrieved Chunks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Query and Settings */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-2">User Query</h3>
              <Textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Enter your query here..."
                disabled={true}
                className="min-h-[160px] bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-slate-300">Token Limit: {tokenLimit}</Label>
                <Badge className={`ml-2 ${tokenWarning
                  ? "bg-red-900/20 border border-red-500/30 text-red-300"
                  : "bg-slate-800 text-slate-300 border-slate-700"}`}>
                  {tokenCount} / {tokenLimit} tokens
                </Badge>
              </div>
              <Slider
                value={[tokenLimit]}
                min={256}
                max={4096}
                step={256}
                onValueChange={(value) => setTokenLimit(value[0])}
                className="data-[active]:bg-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-metadata"
                checked={showMetadata}
                onCheckedChange={setShowMetadata}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <Label htmlFor="show-metadata" className="text-slate-300">Include metadata in context</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="order-relevance"
                checked={orderByRelevance}
                onCheckedChange={setOrderByRelevance}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <Label htmlFor="order-relevance" className="text-slate-300">
                {orderByRelevance ? "Order by relevance score" : "Order by recency"}
              </Label>
            </div>
          </div>

          {/* Retrieved Chunks */}
          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">Retrieved Chunks</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {retrievedChunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className={`border rounded-md p-3 cursor-pointer transition-all duration-150 hover:shadow-md ${selectedChunks.includes(chunk.id)
                    ? "border-emerald-500/50 bg-emerald-900/20 dark:bg-emerald-900/20 hover:border-emerald-400"
                    : "border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900/70"
                    }`}
                  onClick={() => toggleChunk(chunk.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-slate-200">{chunk.source}</div>
                    <Badge className={
                      selectedChunks.includes(chunk.id)
                        ? "bg-emerald-900/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }>
                      {chunk.score.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-2 line-clamp-2">{chunk.text}</p>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{chunk.tokens} tokens</span>
                    <span>{chunk.metadata.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Assembly Strategy and Assembled Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assembly Strategy */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200 mb-2">Assembly Strategy</h3>
            <Select value={assemblyStrategy} onValueChange={setAssemblyStrategy}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 transition-colors duration-150 hover:border-slate-600">
                <SelectValue placeholder="Select assembly strategy" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(assemblyStrategies).map(([key, strategy]) => (
                  <SelectItem key={key} value={key} className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">
                    {strategy.name} - {strategy.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-md p-4 min-h-[300px] overflow-y-auto">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-300">Assembly Strategy Notes</h4>
                  <p className="text-sm text-amber-300/90 mt-1">
                    {assemblyStrategy === "simple" &&
                      "Simple concatenation preserves all information but may include redundancies and exceed token limits with many chunks."}
                    {assemblyStrategy === "deduplicated" &&
                      "Deduplication removes redundant information, which helps fit more unique content within token limits but may disrupt the flow of text."}
                    {assemblyStrategy === "structured" &&
                      "Structured formatting with clear source attribution helps the LLM understand where information comes from, but uses more tokens for formatting."}
                    {assemblyStrategy === "summarized" &&
                      "Summarization allows fitting more information within token limits but risks losing important details or nuance from the original text."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assembled Context */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-200">Assembled Context</h3>
              <div className="flex items-center space-x-2">
                <Badge className={tokenWarning
                  ? "bg-red-900/20 border border-red-500/30 text-red-300"
                  : "bg-slate-800 text-slate-300 border-slate-700"
                }>
                  {tokenCount} / {tokenLimit} tokens
                </Badge>
                {tokenWarning && (
                  <div className="flex items-center text-red-300 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Token limit exceeded
                  </div>
                )}
              </div>
            </div>

            <div className="border border-slate-700 rounded-md p-4 bg-slate-900/50 min-h-[400px] max-h-[600px] overflow-y-auto whitespace-pre-wrap text-slate-300 transition-all duration-200 hover:border-slate-600 focus-within:border-emerald-500/50">
              {assembledContext}
            </div>
          </div>
        </div>

        {/* Row 3: Prompt Template and Final Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prompt Template */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200 mb-2">Prompt Template</h3>
            <Select value={promptTemplate} onValueChange={setPromptTemplate}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 transition-colors duration-150 hover:border-slate-600">
                <SelectValue placeholder="Select prompt template" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(promptTemplates).map(([key, template]) => (
                  <SelectItem key={key} value={key} className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">
                    {template.name} - {template.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-md p-4 min-h-[300px] overflow-y-auto">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-emerald-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-emerald-300">Prompt Template Notes</h4>
                  <p className="text-sm text-emerald-300/90 mt-1">
                    {promptTemplate === "basic" &&
                      "Basic templates are simple but may not provide enough guidance to the LLM about how to use the context or handle missing information."}
                    {promptTemplate === "detailed" &&
                      "Detailed templates with explicit instructions help guide the LLM's behavior but use more tokens for instructions rather than context."}
                    {promptTemplate === "sourced" &&
                      "Source attribution templates encourage the LLM to cite sources, which improves transparency but requires the context to include source information."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Prompt */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-200">Final Prompt to LLM</h3>
              <div className="flex items-center space-x-2">
                <Badge className={tokenWarning
                  ? "bg-red-900/20 border border-red-500/30 text-red-300"
                  : "bg-slate-800 text-slate-300 border-slate-700"
                }>
                  {tokenCount} / {tokenLimit} tokens
                </Badge>
                {tokenWarning && (
                  <div className="flex items-center text-red-300 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Token limit exceeded
                  </div>
                )}
              </div>
            </div>

            <div className="border border-slate-700 rounded-md p-4 bg-slate-900/50 min-h-[400px] max-h-[600px] overflow-y-auto whitespace-pre-wrap text-slate-300 transition-all duration-200 hover:border-slate-600 focus-within:border-emerald-500/50">
              {finalPrompt}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-8 transition-all duration-200 hover:bg-slate-800/70 hover:border-slate-600">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-emerald-400 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-200">About Context Assembly</h4>
              <p className="text-sm text-slate-400 mt-1">
                Context assembly is a critical step in RAG pipelines. The way context is structured, formatted, and presented to the LLM
                can significantly impact the quality and accuracy of responses. Experiment with different strategies to see what works best for your use case.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
