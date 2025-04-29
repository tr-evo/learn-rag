"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Scissors, Search, AlertCircle, CheckCircle2, SplitSquareHorizontal, Layers } from "lucide-react"

// Sample documents for the demo
const sampleDocuments = [
  {
    id: 1,
    title: "Introduction to Vector Databases",
    content: `Vector databases are specialized database systems designed to store and query high-dimensional vector data efficiently. Unlike traditional databases that excel at exact matches, vector databases are optimized for similarity search.

These databases use various indexing techniques like HNSW (Hierarchical Navigable Small World) or IVF (Inverted File Index) to enable fast approximate nearest neighbor search. This makes them ideal for applications involving embeddings.

The core functionality of a vector database includes:
1. Vector storage: Efficiently storing high-dimensional vectors
2. Similarity search: Finding vectors that are similar to a query vector
3. Metadata filtering: Combining vector search with traditional filtering
4. Scalability: Handling millions or billions of vectors

Popular vector databases include Pinecone, Weaviate, Milvus, and Qdrant. Many traditional databases have also added vector capabilities, such as PostgreSQL with pgvector.

When choosing a vector database, consider factors like:
- Query performance requirements
- Scale of your data
- Need for real-time updates
- Hosting preferences (cloud vs. self-hosted)
- Integration with existing systems`,
  },
  {
    id: 2,
    title: "Understanding Embeddings in NLP",
    content: `Embeddings are dense vector representations of words, sentences, or documents in a continuous vector space. They capture semantic meaning by positioning similar items closer together in the vector space.

Word embeddings like Word2Vec and GloVe revolutionized NLP by representing words as vectors where semantic relationships are preserved. For example, in a good embedding space, "king" - "man" + "woman" would be close to "queen".

Modern language models use contextual embeddings, where a word's representation depends on its context in a sentence. Models like BERT and its variants generate these context-aware embeddings.

Sentence and document embeddings extend this concept to larger text units. Models like Sentence-BERT are specifically designed to create high-quality sentence embeddings that work well for semantic search and clustering.

The dimensionality of embeddings is an important consideration:
- Lower dimensions (100-300): Faster but less expressive
- Higher dimensions (768-1536): More expressive but require more storage and computation

Embeddings enable many NLP applications:
- Semantic search
- Document clustering
- Recommendation systems
- Text classification
- Question answering

The quality of embeddings directly impacts downstream task performance, making the choice of embedding model crucial for RAG systems.`,
  },
  {
    id: 3,
    title: "Legal Contract Analysis",
    content: `AGREEMENT OF SALE

THIS AGREEMENT made this 15th day of June, 2023, between ABC Corporation ("Seller") and XYZ Inc. ("Buyer").

WHEREAS, Seller is the owner of certain intellectual property assets described in Exhibit A; and

WHEREAS, Buyer desires to purchase said assets from Seller;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. SALE OF ASSETS
   1.1 Seller hereby sells, transfers, and assigns to Buyer all right, title, and interest in and to the assets described in Exhibit A.
   1.2 The transfer includes all related documentation, source code, and associated rights.

2. PURCHASE PRICE
   2.1 The purchase price for the assets shall be $500,000 (five hundred thousand dollars).
   2.2 Payment shall be made as follows:
       (a) $100,000 upon execution of this Agreement
       (b) $400,000 within 30 days of the Closing Date

3. REPRESENTATIONS AND WARRANTIES
   3.1 Seller represents and warrants that:
       (a) Seller is the sole owner of the assets
       (b) The assets are free from encumbrances
       (c) Seller has the right to sell the assets

4. INDEMNIFICATION
   4.1 Seller shall indemnify and hold Buyer harmless from any claims arising from breach of Seller's warranties.
   4.2 Buyer shall indemnify Seller against any misuse of the assets following the sale.

5. GOVERNING LAW
   This Agreement shall be governed by the laws of the State of Delaware.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.`,
  },
]

// Function to count tokens (simplified approximation)
const countTokens = (text: string): number => {
  // This is a very rough approximation - in practice, you'd use a tokenizer from the model provider
  return Math.ceil(text.split(/\s+/).length * 1.3) // Rough approximation
}

// Function to split text into chunks based on different strategies
const chunkText = (
  text: string,
  strategy: string,
  chunkSize: number,
  overlapSize: number,
  respectParagraphs: boolean,
): { chunks: string[]; tokenCounts: number[] } => {
  const chunks: string[] = []
  const tokenCounts: number[] = []

  // Helper to add a chunk and its token count
  const addChunk = (chunk: string) => {
    if (chunk.trim()) {
      chunks.push(chunk.trim())
      tokenCounts.push(countTokens(chunk.trim()))
    }
  }

  if (strategy === "fixed-size") {
    // Split by fixed token count (approximated by words)
    const words = text.split(/\s+/)
    const wordsPerChunk = Math.floor(chunkSize / 1.3) // Convert tokens to approximate words
    const overlapWords = Math.floor(overlapSize / 1.3)

    for (let i = 0; i < words.length; i += wordsPerChunk - overlapWords) {
      const chunkWords = words.slice(i, i + wordsPerChunk)
      addChunk(chunkWords.join(" "))
    }
  } else if (strategy === "paragraph") {
    // Split by paragraphs
    const paragraphs = text.split(/\n\n+/)

    if (respectParagraphs) {
      // Keep paragraphs as is, but combine small ones if needed
      let currentChunk = ""
      let currentTokens = 0

      for (const paragraph of paragraphs) {
        const paragraphTokens = countTokens(paragraph)

        if (currentTokens + paragraphTokens <= chunkSize) {
          // Add to current chunk
          currentChunk += (currentChunk ? "\n\n" : "") + paragraph
          currentTokens += paragraphTokens
        } else {
          // Current chunk is full, start a new one
          if (currentChunk) {
            addChunk(currentChunk)
          }
          currentChunk = paragraph
          currentTokens = paragraphTokens
        }
      }

      // Add the last chunk
      if (currentChunk) {
        addChunk(currentChunk)
      }
    } else {
      // Split paragraphs if they're too large
      for (const paragraph of paragraphs) {
        const paragraphTokens = countTokens(paragraph)

        if (paragraphTokens <= chunkSize) {
          // Paragraph fits in a chunk
          addChunk(paragraph)
        } else {
          // Paragraph is too large, split it using fixed-size strategy
          const words = paragraph.split(/\s+/)
          const wordsPerChunk = Math.floor(chunkSize / 1.3)
          const overlapWords = Math.floor(overlapSize / 1.3)

          for (let i = 0; i < words.length; i += wordsPerChunk - overlapWords) {
            const chunkWords = words.slice(i, i + wordsPerChunk)
            addChunk(chunkWords.join(" "))
          }
        }
      }
    }
  } else if (strategy === "sentence") {
    // Split by sentences
    const sentences = text.split(/(?<=[.!?])\s+/)
    let currentChunk = ""
    let currentTokens = 0
    let lastChunkEndIndex = 0; // Track the end index of the last completed chunk

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const sentenceTokens = countTokens(sentence)

      if (currentTokens + sentenceTokens <= chunkSize) {
        // Add to current chunk
        currentChunk += (currentChunk ? " " : "") + sentence
        currentTokens += sentenceTokens
      } else {
        // Current chunk is full, start a new one
        if (currentChunk) {
          addChunk(currentChunk)
          
          // Apply overlap: look back to include some sentences from previous chunk
          if (overlapSize > 0 && i > 0) {
            let overlapChunk = "";
            let overlapTokens = 0;
            let j = i - 1;
            
            // Go backwards until we have enough overlap or hit the start of the last chunk
            while (j >= lastChunkEndIndex && overlapTokens < overlapSize) {
              const prevSentence = sentences[j];
              const prevSentenceTokens = countTokens(prevSentence);
              
              // If adding this sentence would exceed the chunk size, stop
              if (sentenceTokens + overlapTokens + prevSentenceTokens > chunkSize) {
                break;
              }
              
              overlapChunk = prevSentence + (overlapChunk ? " " : "") + overlapChunk;
              overlapTokens += prevSentenceTokens;
              j--;
            }
            
            // Start new chunk with overlap + current sentence
            currentChunk = overlapChunk + (overlapChunk ? " " : "") + sentence;
            currentTokens = overlapTokens + sentenceTokens;
          } else {
            currentChunk = sentence;
            currentTokens = sentenceTokens;
          }
          
          lastChunkEndIndex = i;
        } else {
          // If a single sentence is too large, split it into smaller pieces
          if (sentenceTokens > chunkSize) {
            const words = sentence.split(/\s+/)
            const wordsPerChunk = Math.floor(chunkSize / 1.3)
            const overlapWords = Math.floor(overlapSize / 1.3)

            for (let j = 0; j < words.length; j += wordsPerChunk - overlapWords) {
              const chunkWords = words.slice(j, j + wordsPerChunk)
              addChunk(chunkWords.join(" "))
            }
            
            currentChunk = "";
            currentTokens = 0;
          } else {
            currentChunk = sentence
            currentTokens = sentenceTokens
          }
        }
      }
    }

    // Add the last chunk
    if (currentChunk) {
      addChunk(currentChunk)
    }
  } else if (strategy === "semantic") {
    // Simulate semantic chunking (in a real system, this would use ML to find semantic boundaries)
    // For this demo, we'll use a combination of paragraph and sentence approaches

    // First split by paragraphs
    const paragraphs = text.split(/\n\n+/)
    let currentChunk = ""
    let currentTokens = 0

    for (const paragraph of paragraphs) {
      // For each paragraph, check if it contains distinct sections (e.g., numbered lists)
      const sections = paragraph.split(/(?<=\d\.)\s+/)

      if (sections.length > 1 && sections[0].match(/^\d\./)) {
        // This paragraph has numbered sections, treat each as a potential chunk
        for (const section of sections) {
          const sectionTokens = countTokens(section)

          if (sectionTokens > chunkSize) {
            // Section is too large, split by sentences
            const sentences = section.split(/(?<=[.!?])\s+/)
            let sectionChunk = ""
            let sectionTokenCount = 0

            for (const sentence of sentences) {
              const sentenceTokens = countTokens(sentence)

              if (sectionTokenCount + sentenceTokens <= chunkSize) {
                sectionChunk += (sectionChunk ? " " : "") + sentence
                sectionTokenCount += sentenceTokens
              } else {
                addChunk(sectionChunk)
                sectionChunk = sentence
                sectionTokenCount = sentenceTokens
              }
            }

            if (sectionChunk) {
              addChunk(sectionChunk)
            }
          } else {
            // Section fits in a chunk
            addChunk(section)
          }
        }
      } else {
        // Regular paragraph
        const paragraphTokens = countTokens(paragraph)

        if (currentTokens + paragraphTokens <= chunkSize) {
          // Add to current chunk
          currentChunk += (currentChunk ? "\n\n" : "") + paragraph
          currentTokens += paragraphTokens
        } else {
          // Current chunk is full, start a new one
          if (currentChunk) {
            addChunk(currentChunk)
          }
          
          // If paragraph is too large to fit in a chunk, we should apply the overlapSize
          if (paragraphTokens > chunkSize) {
            // Split paragraph using fixed-size with overlap
            const words = paragraph.split(/\s+/)
            const wordsPerChunk = Math.floor(chunkSize / 1.3)
            const overlapWords = Math.floor(overlapSize / 1.3)

            for (let i = 0; i < words.length; i += wordsPerChunk - overlapWords) {
              const chunkWords = words.slice(i, i + wordsPerChunk)
              addChunk(chunkWords.join(" "))
            }
            
            currentChunk = "";
            currentTokens = 0;
          } else {
            currentChunk = paragraph
            currentTokens = paragraphTokens
          }
        }
      }
    }

    // Add the last chunk
    if (currentChunk) {
      addChunk(currentChunk)
    }
  }

  return { chunks, tokenCounts }
}

export default function ChunkingDesignDemo() {
  // State for document and chunking configuration
  const [selectedDocument, setSelectedDocument] = useState(sampleDocuments[0])
  const [chunkingStrategy, setChunkingStrategy] = useState("paragraph")
  const [chunkSize, setChunkSize] = useState(200)
  const [overlapSize, setOverlapSize] = useState(20)
  const [respectParagraphs, setRespectParagraphs] = useState(true)
  const [chunks, setChunks] = useState<string[]>([])
  const [tokenCounts, setTokenCounts] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOverlapApplicable, setIsOverlapApplicable] = useState(true)

  // Effect to update chunks when configuration changes
  useEffect(() => {
    const { chunks: newChunks, tokenCounts: newTokenCounts } = chunkText(
      selectedDocument.content,
      chunkingStrategy,
      chunkSize,
      overlapSize,
      respectParagraphs,
    )
    setChunks(newChunks)
    setTokenCounts(newTokenCounts)
  }, [selectedDocument, chunkingStrategy, chunkSize, overlapSize, respectParagraphs])

  // Effect to determine if overlap is applicable for the current strategy
  useEffect(() => {
    // Overlap is applicable for fixed-size and when paragraphs need to be split
    const applicable = 
      chunkingStrategy === "fixed-size" || 
      chunkingStrategy === "sentence" ||
      (chunkingStrategy === "paragraph" && !respectParagraphs) ||
      chunkingStrategy === "semantic";
    
    setIsOverlapApplicable(applicable);
    
    // If switching to a strategy where overlap doesn't apply, reset to 0
    if (!applicable && overlapSize > 0) {
      setOverlapSize(0);
    }
  }, [chunkingStrategy, respectParagraphs]);

  // Function to perform a search
  const performSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      // Simple search implementation - in a real system, this would use embeddings and vector search
      const query = searchQuery.toLowerCase()
      const results: number[] = []

      chunks.forEach((chunk, index) => {
        if (chunk.toLowerCase().includes(query)) {
          results.push(index)
        }
      })

      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  // Function to highlight search terms in text
  const highlightSearchTerms = (text: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(`(${searchQuery})`, "gi")
    return text.replace(regex, '<span class="bg-emerald-500/20 text-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300">$1</span>')
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="design" className="data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-400">Chunking Design</TabsTrigger>
          <TabsTrigger value="search" className="data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-400">Search Impact</TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-400">Strategy Comparison</TabsTrigger>
        </TabsList>

        {/* Chunking Design Tab */}
        <TabsContent value="design" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Document Selection */}
            <div className="md:col-span-1 bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                <h3 className="text-slate-200 font-medium">Sample Documents</h3>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-slate-400">Select a document to chunk</p>
                {sampleDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 border rounded-md cursor-pointer transition-all ${
                      selectedDocument.id === doc.id
                        ? "border-emerald-500 bg-emerald-900/20"
                        : "border-slate-700 hover:border-emerald-500/30 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <h3 className="font-medium text-slate-200">{doc.title}</h3>
                    <p className="text-sm text-slate-400 truncate">
                      {doc.content.substring(0, 100)}...
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                      {countTokens(doc.content)} tokens · {doc.content.split(/\s+/).length} words
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chunking Configuration */}
            <div className="md:col-span-2 bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
                <Scissors className="h-5 w-5 text-emerald-400" />
                <h3 className="text-slate-200 font-medium">Chunking Configuration</h3>
              </div>
              <div className="p-5 space-y-6">
                <p className="text-slate-400">Configure how the document is split into chunks</p>
                
                {/* Chunking Strategy */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Chunking Strategy</Label>
                  <Select value={chunkingStrategy} onValueChange={setChunkingStrategy}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="Select chunking strategy" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                      <SelectItem value="fixed-size">Fixed Size (Token Count)</SelectItem>
                      <SelectItem value="paragraph">Paragraph-based</SelectItem>
                      <SelectItem value="sentence">Sentence-based</SelectItem>
                      <SelectItem value="semantic">Semantic Boundaries</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-400">
                    {chunkingStrategy === "fixed-size"
                      ? "Splits text into chunks of a fixed token count, regardless of content boundaries."
                      : chunkingStrategy === "paragraph"
                        ? "Splits text at paragraph boundaries, preserving the natural structure of the document."
                        : chunkingStrategy === "sentence"
                          ? "Splits text at sentence boundaries, grouping sentences up to the chunk size limit."
                          : "Attempts to split text at semantic boundaries, preserving meaning and context."}
                  </p>
                </div>

                {/* Chunk Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Chunk Size (tokens)</Label>
                    <span className="text-sm font-medium text-slate-300">{chunkSize} tokens</span>
                  </div>
                  <Slider
                    value={[chunkSize]}
                    min={50}
                    max={500}
                    step={10}
                    onValueChange={(value) => setChunkSize(value[0])}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Small (50)</span>
                    <span>Medium (200)</span>
                    <span>Large (500)</span>
                  </div>
                </div>

                {/* Overlap Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Overlap Size (tokens)</Label>
                    <span className="text-sm font-medium text-slate-300">{overlapSize} tokens</span>
                  </div>
                  <Slider
                    value={[overlapSize]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setOverlapSize(value[0])}
                    disabled={!isOverlapApplicable}
                    className={!isOverlapApplicable ? "opacity-50" : ""}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>None (0)</span>
                    <span>Medium (50)</span>
                    <span>Large (100)</span>
                  </div>
                  {!isOverlapApplicable && (
                    <div className="mt-2 text-sm text-amber-300 flex items-center gap-1 bg-amber-900/20 border border-amber-500/30 p-2 rounded">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Overlap is not applicable for this configuration. 
                        {chunkingStrategy === "paragraph" && respectParagraphs 
                          ? " Enable 'Split large paragraphs' to use overlap." 
                          : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Respect Paragraphs */}
                {chunkingStrategy === "paragraph" && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="respect-paragraphs"
                        checked={respectParagraphs}
                        onCheckedChange={setRespectParagraphs}
                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <Label htmlFor="respect-paragraphs" className="text-slate-300">Respect paragraph boundaries</Label>
                    </div>
                    <p className="text-sm text-slate-400 ml-6">
                      When enabled, paragraphs are kept intact and combined until they reach the chunk size limit.
                      When disabled, large paragraphs are split into smaller chunks using the overlap setting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chunks Preview */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SplitSquareHorizontal className="h-5 w-5 text-emerald-400" />
                <h3 className="text-slate-200 font-medium">Resulting Chunks</h3>
              </div>
              <div className="text-sm text-slate-400">
                {chunks.length} chunks created with an average of{" "}
                {tokenCounts.length > 0
                  ? Math.round(tokenCounts.reduce((sum, count) => sum + count, 0) / tokenCounts.length)
                  : 0}{" "}
                tokens per chunk
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {chunks.map((chunk, index) => (
                  <div key={index} className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-slate-200">Chunk #{index + 1}</h3>
                      <Badge className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300">{tokenCounts[index]} tokens</Badge>
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-line">{chunk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Search Impact Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Controls */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-400" />
                <h3 className="text-slate-200 font-medium">Search</h3>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-slate-400">See how chunking affects search results</p>
                <div className="space-y-2">
                  <Label className="text-slate-300">Search Query</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter search query..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                    <Button 
                      onClick={performSearch} 
                      disabled={isSearching || !searchQuery.trim()}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Current Chunking Strategy</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-900/50 text-slate-300 border-slate-700">
                      Strategy: {chunkingStrategy}
                    </Badge>
                    <Badge className="bg-slate-900/50 text-slate-300 border-slate-700">
                      Chunk Size: {chunkSize} tokens
                    </Badge>
                    <Badge className="bg-slate-900/50 text-slate-300 border-slate-700">
                      Overlap: {overlapSize} tokens
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-amber-900/20 border border-amber-500/30 text-amber-300 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Simulation Note
                  </h3>
                  <p className="text-sm">
                    This is a simplified search simulation using exact keyword matching. In a real RAG system:
                  </p>
                  <ul className="text-sm mt-2 list-disc pl-5">
                    <li>Text would be converted to vector embeddings</li>
                    <li>Search would use vector similarity (cosine, dot product, etc.) instead of keyword matching</li>
                    <li>Semantic meaning would be captured, not just exact text matches</li>
                    <li>Retrieval would rank chunks by relevance scores</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                  <h3 className="font-medium mb-2 text-slate-200">How Chunking Affects Search</h3>
                  <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-slate-300">Too large chunks:</strong> May dilute relevance by including irrelevant text alongside the
                      answer
                    </li>
                    <li>
                      <strong className="text-slate-300">Too small chunks:</strong> May split answers across multiple chunks, making them harder to
                      retrieve
                    </li>
                    <li>
                      <strong className="text-slate-300">Optimal overlap:</strong> Helps preserve context between chunks but increases storage
                      requirements
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
                <h3 className="text-slate-200 font-medium">Search Results</h3>
                <div className="text-sm text-slate-400">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} chunks matching "${searchQuery}"`
                    : searchQuery
                      ? "No matching chunks found"
                      : "Enter a search query to see results"}
                </div>
              </div>
              <div className="p-5">
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    {searchQuery ? "No matching chunks found" : "Enter a search query to see results"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((index) => (
                      <div key={index} className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-slate-200">Chunk #{index + 1}</h3>
                          <Badge className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300">{tokenCounts[index]} tokens</Badge>
                        </div>
                        <p
                          className="text-sm text-slate-300"
                          dangerouslySetInnerHTML={{ __html: highlightSearchTerms(chunks[index]) }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Analysis */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
              <h3 className="text-slate-200 font-medium">Search Analysis</h3>
              <div className="text-sm text-slate-400">Understanding how chunking affects search quality</div>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {searchResults.length > 0 ? (
                  <>
                    <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300 rounded-lg p-4">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Search Success
                      </h3>
                      <p className="text-sm">
                        Your search for "{searchQuery}" found {searchResults.length} relevant chunks. This indicates
                        that your chunking strategy is working well for this type of query.
                      </p>
                    </div>

                    {/* Chunking analysis based on results */}
                    {searchResults.length > 3 && (
                      <div className="bg-amber-900/20 border border-amber-500/30 text-amber-300 rounded-lg p-4">
                        <h3 className="font-medium flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5" />
                          Potential Improvement
                        </h3>
                        <p className="text-sm">
                          Your search returned many chunks ({searchResults.length}). Consider using larger chunk sizes
                          to consolidate related information, which could improve retrieval precision.
                        </p>
                      </div>
                    )}

                    {chunkSize < 100 && searchResults.length === 1 && (
                      <div className="bg-amber-900/20 border border-amber-500/30 text-amber-300 rounded-lg p-4">
                        <h3 className="font-medium flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5" />
                          Potential Issue
                        </h3>
                        <p className="text-sm">
                          Your chunks may be too small. While you found a match, small chunks might split related
                          information across multiple chunks, potentially missing context.
                        </p>
                      </div>
                    )}
                  </>
                ) : searchQuery ? (
                  <div className="bg-red-900/20 border border-red-500/30 text-red-300 rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      Search Failed
                    </h3>
                    <p className="text-sm">
                      Your search for "{searchQuery}" didn't find any matches. This could indicate that:
                    </p>
                    <ul className="text-sm mt-2 list-disc pl-5">
                      <li>The information isn't in the document</li>
                      <li>Your chunking strategy might be splitting relevant content</li>
                      <li>Try adjusting chunk size or overlap to improve results</li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Strategy Comparison Tab */}
        <TabsContent value="comparison">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
              <h3 className="text-slate-200 font-medium">Chunking Strategy Comparison</h3>
              <div className="text-sm text-slate-400">Compare different approaches to chunking</div>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-300">Strategy</th>
                      <th className="text-left p-3 text-slate-300">Best For</th>
                      <th className="text-left p-3 text-slate-300">Advantages</th>
                      <th className="text-left p-3 text-slate-300">Disadvantages</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700">
                      <td className="p-3 font-medium text-slate-200">Fixed Size</td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Simple text</li>
                          <li>Homogeneous content</li>
                          <li>When consistency matters</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Simple to implement</li>
                          <li>Predictable chunk sizes</li>
                          <li>Works with any text</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>May split mid-sentence or paragraph</li>
                          <li>Can break semantic units</li>
                          <li>Often requires higher overlap</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="p-3 font-medium text-slate-200">Paragraph-based</td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Well-structured documents</li>
                          <li>Articles and blog posts</li>
                          <li>Documentation</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Preserves natural document structure</li>
                          <li>Keeps related content together</li>
                          <li>Often needs less overlap</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Inconsistent chunk sizes</li>
                          <li>Very long paragraphs may exceed limits</li>
                          <li>Depends on good paragraph formatting</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="p-3 font-medium text-slate-200">Sentence-based</td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Q&A content</li>
                          <li>Fact-dense material</li>
                          <li>When precision matters</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Preserves complete sentences</li>
                          <li>Good for precise fact retrieval</li>
                          <li>Works well with complex punctuation</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>May create very small chunks</li>
                          <li>Can lose paragraph-level context</li>
                          <li>Requires good sentence detection</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-200">Semantic</td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Complex documents</li>
                          <li>Legal or technical content</li>
                          <li>When context is critical</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Preserves semantic meaning</li>
                          <li>Adapts to document structure</li>
                          <li>Best for complex retrieval</li>
                        </ul>
                      </td>
                      <td className="p-3 text-sm text-slate-400">
                        <ul className="list-disc pl-5">
                          <li>Most complex to implement</li>
                          <li>May require ML models</li>
                          <li>Computationally expensive</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
                <h3 className="text-slate-200 font-medium">Chunk Size Considerations</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                  <h3 className="font-medium mb-2 text-slate-200">Small Chunks (50-150 tokens)</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    Small chunks improve precision by targeting specific information but may lose context.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div style={{ width: '100%' }} className="h-2 bg-emerald-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Precision</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div style={{ width: '33%' }} className="h-2 bg-red-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Context</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div style={{ width: '40%' }} className="h-2 bg-amber-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Storage Efficiency</span>
                  </div>
                </div>

                <div className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                  <h3 className="font-medium mb-2 text-slate-200">Medium Chunks (150-300 tokens)</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    Medium chunks balance precision and context, suitable for most general use cases.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div style={{ width: '75%' }} className="h-2 bg-emerald-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Precision</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div style={{ width: '67%' }} className="h-2 bg-red-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Context</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div style={{ width: '70%' }} className="h-2 bg-amber-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Storage Efficiency</span>
                  </div>
                </div>

                <div className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                  <h3 className="font-medium mb-2 text-slate-200">Large Chunks (300-500+ tokens)</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    Large chunks preserve more context but may reduce precision and hit embedding model limits.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div style={{ width: '50%' }} className="h-2 bg-emerald-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Precision</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div style={{ width: '100%' }} className="h-2 bg-red-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Context</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div style={{ width: '90%' }} className="h-2 bg-amber-500 rounded"></div>
                    <span className="text-xs w-20 text-slate-300">Storage Efficiency</span>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5">
                  <h3 className="font-medium mb-2 text-slate-200">About Storage Efficiency</h3>
                  <p className="text-sm text-slate-400">
                    Storage efficiency generally increases with chunk size because:
                  </p>
                  <ul className="text-sm text-slate-400 mt-2 list-disc pl-5">
                    <li>Each chunk requires metadata overhead (IDs, timestamps, etc.)</li>
                    <li>More chunks (from smaller chunking) means more total overhead</li>
                    <li>Vector embeddings typically have fixed dimensionality regardless of text length</li>
                    <li>Large chunks may store more content with the same embedding size</li>
                    <li>Very large chunks can hit diminishing returns due to model token limits</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
                <h3 className="text-slate-200 font-medium">Best Practices</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Match Chunking to Content Type
                  </h3>
                  <p className="text-sm text-slate-400">
                    Different content types benefit from different chunking strategies. Technical documentation works
                    well with semantic or paragraph-based chunking, while Q&A content might benefit from
                    sentence-based approaches.
                  </p>
                </div>

                <div className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Consider Embedding Model Limits
                  </h3>
                  <p className="text-sm text-slate-400">
                    Always ensure your chunks don't exceed the token limit of your embedding model. For example, if
                    using OpenAI's text-embedding-ada-002, keep chunks under 8,191 tokens (though much smaller is
                    typically better).
                  </p>
                </div>

                <div className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Test and Iterate
                  </h3>
                  <p className="text-sm text-slate-400">
                    There's no one-size-fits-all chunking strategy. Test different approaches with representative
                    queries and measure retrieval quality. Be prepared to adjust your strategy based on real-world
                    performance.
                  </p>
                </div>

                <div className="p-4 border border-slate-700 hover:border-slate-600 rounded-lg bg-slate-800/50 transition-all">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Use Metadata to Enhance Retrieval
                  </h3>
                  <p className="text-sm text-slate-400">
                    Complement your chunking strategy with rich metadata. Even with imperfect chunks, good metadata
                    can help filter and rank results appropriately.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-8">
            <h3 className="font-medium mb-3 text-slate-200">Key Takeaways</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
              <li>Choose your chunking strategy based on your specific content and search requirements</li>
              <li>Balance chunk size to optimize for both context preservation and retrieval precision</li>
              <li>Use appropriate overlap settings when breaking apart semantically connected content</li>
              <li>Consider storage and computational constraints when designing your chunking pipeline</li>
              <li>Regularly evaluate and refine your chunking approach as your content and use cases evolve</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
