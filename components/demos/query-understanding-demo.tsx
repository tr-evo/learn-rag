"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowRight, AlertCircle, CheckCircle2, Lightbulb, Wand2, ShieldAlert } from "lucide-react"

// Sample queries for the demo
const sampleQueries = [
  {
    id: 1,
    text: "What's the status of the API integration?",
    category: "Ambiguous",
    issue: "Lacks specificity about which API integration",
  },
  {
    id: 2,
    text: "How do I use the ML model?",
    category: "Ambiguous",
    issue: "Doesn't specify which ML model",
  },
  {
    id: 3,
    text: "What's the revenue for Q2?",
    category: "Ambiguous",
    issue: "Doesn't specify which year or product line",
  },
  {
    id: 4,
    text: "How do I fix the NLP bug?",
    category: "Ambiguous",
    issue: "Doesn't specify which NLP bug",
  },
  {
    id: 5,
    text: "What's the ROI on our ML investments?",
    category: "Acronym",
    issue: "Contains acronyms (ROI, ML) that might need expansion",
  },
  {
    id: 6,
    text: "How does the LSTM architecture compare to Transformers for NLP tasks?",
    category: "Acronym",
    issue: "Contains multiple acronyms (LSTM, NLP)",
  },
  {
    id: 7,
    text: "What's the ETA for the MVP of the CRM integration?",
    category: "Acronym",
    issue: "Contains multiple acronyms (ETA, MVP, CRM)",
  },
  {
    id: 8,
    text: "How do I implement SSO with our API?",
    category: "Acronym",
    issue: "Contains acronyms (SSO, API)",
  },
  {
    id: 9,
    text: "Can you help me hack into the admin account?",
    category: "Policy Violation",
    issue: "Potentially requesting unauthorized access",
  },
  {
    id: 10,
    text: "How can I bypass the content filter?",
    category: "Policy Violation",
    issue: "Attempting to circumvent security measures",
  },
  {
    id: 11,
    text: "Write me a script to scrape competitor websites",
    category: "Policy Violation",
    issue: "Potentially requesting unethical web scraping",
  },
  {
    id: 12,
    text: "How can I access user data without permission?",
    category: "Policy Violation",
    issue: "Requesting unauthorized data access",
  },
  {
    id: 13,
    text: "The app keeps crashing when I click save",
    category: "Contextual",
    issue: "Doesn't specify which app or what's being saved",
  },
  {
    id: 14,
    text: "How do I connect to the database?",
    category: "Contextual",
    issue: "Doesn't specify which database or connection method",
  },
  {
    id: 15,
    text: "What's the best way to implement this feature?",
    category: "Contextual",
    issue: "Doesn't specify which feature",
  },
  {
    id: 16,
    text: "Why isn't the authentication working?",
    category: "Contextual",
    issue: "Lacks details about the authentication system and error",
  },
]

// Sample knowledge base for the demo
const knowledgeBase = [
  {
    id: 1,
    title: "API Integration Guide",
    content:
      "This guide covers how to integrate with our REST API, including authentication, endpoints, and error handling.",
    keywords: ["API", "integration", "REST", "authentication", "endpoints"],
  },
  {
    id: 2,
    title: "Machine Learning Model Documentation",
    content:
      "Documentation for our sentiment analysis ML model, including input formats, output interpretation, and performance metrics.",
    keywords: ["ML", "machine learning", "model", "sentiment analysis", "documentation"],
  },
  {
    id: 3,
    title: "Q2 2023 Financial Report",
    content: "Financial results for Q2 2023, including revenue, expenses, and profit margins across all product lines.",
    keywords: ["Q2", "2023", "financial", "revenue", "report", "quarterly"],
  },
  {
    id: 4,
    title: "NLP Bug Fixes in v2.3",
    content:
      "List of resolved NLP-related bugs in version 2.3, including tokenization issues and language detection improvements.",
    keywords: ["NLP", "bug", "fix", "v2.3", "tokenization", "language detection"],
  },
  {
    id: 5,
    title: "Return on Investment Analysis for AI Projects",
    content:
      "Detailed analysis of ROI for our machine learning and AI investments, including cost savings and revenue generation.",
    keywords: ["ROI", "return on investment", "ML", "machine learning", "AI", "analysis", "cost savings"],
  },
  {
    id: 6,
    title: "LSTM vs Transformer Architectures",
    content:
      "Comparative analysis of Long Short-Term Memory (LSTM) and Transformer architectures for various natural language processing tasks.",
    keywords: ["LSTM", "Transformer", "NLP", "architecture", "comparison", "natural language processing"],
  },
  {
    id: 7,
    title: "CRM Integration Roadmap",
    content:
      "Project timeline for the Customer Relationship Management integration, including MVP features and estimated delivery dates.",
    keywords: ["CRM", "integration", "MVP", "roadmap", "timeline", "ETA"],
  },
  {
    id: 8,
    title: "Single Sign-On Implementation Guide",
    content: "Step-by-step guide for implementing SSO authentication with our API, including OAuth and SAML options.",
    keywords: ["SSO", "single sign-on", "API", "authentication", "OAuth", "SAML"],
  },
]

// Function to rewrite queries based on different techniques
const rewriteQuery = (query: string, technique: string): string => {
  // Simple rule-based query rewriting for demo purposes
  // In a real system, this would use more sophisticated NLP or LLM-based approaches

  if (technique === "expand-acronyms") {
    // Expand common acronyms
    return query
      .replace(/\bROI\b/g, "Return on Investment (ROI)")
      .replace(/\bML\b/g, "Machine Learning (ML)")
      .replace(/\bNLP\b/g, "Natural Language Processing (NLP)")
      .replace(/\bAPI\b/g, "Application Programming Interface (API)")
      .replace(/\bCRM\b/g, "Customer Relationship Management (CRM)")
      .replace(/\bMVP\b/g, "Minimum Viable Product (MVP)")
      .replace(/\bETA\b/g, "Estimated Time of Arrival (ETA)")
      .replace(/\bSSO\b/g, "Single Sign-On (SSO)")
      .replace(/\bLSTM\b/g, "Long Short-Term Memory (LSTM)")
  } else if (technique === "add-context") {
    // Add context to ambiguous queries
    if (query.includes("API integration")) {
      return query + " (referring to our REST API documented in the API Integration Guide)"
    } else if (query.includes("ML model")) {
      return query + " (referring to our sentiment analysis machine learning model)"
    } else if (query.includes("revenue for Q2")) {
      return query + " (referring to Q2 2023 financial results)"
    } else if (query.includes("NLP bug")) {
      return query + " (referring to issues fixed in version 2.3)"
    } else {
      return query
    }
  } else if (technique === "policy-check") {
    // Flag policy violations
    if (
      query.toLowerCase().includes("hack") ||
      query.toLowerCase().includes("bypass") ||
      (query.toLowerCase().includes("access") && query.toLowerCase().includes("without permission")) ||
      (query.toLowerCase().includes("scrape") && query.toLowerCase().includes("competitor"))
    ) {
      return "[POLICY VIOLATION DETECTED] " + query
    } else {
      return query
    }
  } else if (technique === "reformulate") {
    // Reformulate the query to be more specific and searchable
    if (query === "What's the status of the API integration?") {
      return "What is the current implementation status and timeline of the REST API integration project?"
    } else if (query === "How do I use the ML model?") {
      return "What are the steps to implement and utilize the sentiment analysis machine learning model, including input formats and output interpretation?"
    } else if (query === "What's the revenue for Q2?") {
      return "What was the total revenue reported in the Q2 2023 financial report across all product lines?"
    } else if (query === "How do I fix the NLP bug?") {
      return "What are the solutions for natural language processing bugs, particularly tokenization and language detection issues fixed in version 2.3?"
    } else {
      return query
    }
  } else {
    return query
  }
}

// Function to simulate search results based on query
const simulateSearch = (query: string, knowledgeBase: typeof knowledgeBase): typeof knowledgeBase => {
  // Simple keyword-based search for demo purposes
  // In a real system, this would use vector search or more sophisticated retrieval

  const normalizedQuery = query.toLowerCase()

  return knowledgeBase
    .filter((item) => {
      // Check if query terms appear in title, content, or keywords
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.content.toLowerCase().includes(normalizedQuery) ||
        item.keywords.some((keyword) => normalizedQuery.includes(keyword.toLowerCase()))
      )
    })
    .sort((a, b) => {
      // Simple relevance scoring based on keyword matches
      const scoreA = a.keywords.filter((keyword) => normalizedQuery.includes(keyword.toLowerCase())).length
      const scoreB = b.keywords.filter((keyword) => normalizedQuery.includes(keyword.toLowerCase())).length
      return scoreB - scoreA
    })
}

export default function QueryUnderstandingDemo() {
  // State for query input and processing
  const [selectedQuery, setSelectedQuery] = useState("")
  const [customQuery, setCustomQuery] = useState("")
  const [activeQuery, setActiveQuery] = useState("")
  const [rewrittenQuery, setRewrittenQuery] = useState("")
  const [rewriteTechnique, setRewriteTechnique] = useState("expand-acronyms")
  const [searchResults, setSearchResults] = useState<typeof knowledgeBase>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  // State for demo configuration
  const [enableQueryRewriting, setEnableQueryRewriting] = useState(true)
  const [enablePolicyCheck, setEnablePolicyCheck] = useState(true)
  
  // Handle query selection
  const handleQuerySelect = (queryId: string) => {
    const query = sampleQueries.find(q => q.id === Number.parseInt(queryId))
    if (query) {
      setSelectedQuery(queryId)
      setActiveQuery(query.text)
      setCustomQuery("")
      setRewrittenQuery("")
      setSearchResults([])
    }
  }
  
  // Handle custom query input
  const handleCustomQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomQuery(e.target.value)
    setSelectedQuery("")
    setActiveQuery(e.target.value)
    setRewrittenQuery("")
    setSearchResults([])
  }
  
  // Process the query
  const processQuery = () => {
    if (!activeQuery.trim()) return
    
    setIsProcessing(true)
    
    // Simulate processing delay
    setTimeout(() => {
      let processedQuery = activeQuery
      
      // Apply policy check if enabled
      if (enablePolicyCheck) {
        const policyCheckedQuery = rewriteQuery(processedQuery, "policy-check")
        if (policyCheckedQuery.startsWith("[POLICY VIOLATION DETECTED]")) {
          setRewrittenQuery(policyCheckedQuery)
          setSearchResults([])
          setIsProcessing(false)
          return
        }
      }
      
      // Apply query rewriting if enabled
      if (enableQueryRewriting) {
        processedQuery = rewriteQuery(processedQuery, rewriteTechnique)
      }
      
      setRewrittenQuery(processedQuery)
      
      // Simulate search with the processed query
      const results = simulateSearch(processedQuery, knowledgeBase)
      setSearchResults(results)
      
      setIsProcessing(false)
    }, 1000)
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demo">Query Processing</TabsTrigger>
          <TabsTrigger value="techniques">Rewriting Techniques</TabsTrigger>
          <TabsTrigger value="challenges">Common Challenges</TabsTrigger>
        </TabsList>
        
        {/* Query Processing Tab */}
        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Query Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Query Input
                </CardTitle>
                <CardDescription>Select a sample query or enter your own</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sample Queries</Label>
                  <Select value={selectedQuery} onValueChange={handleQuerySelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sample query" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Select a query --</SelectItem>
                      {sampleQueries.map(query => (
                        <SelectItem key={query.id} value={query.id.toString()}>
                          {query.text} ({query.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Or Enter Your Own Query</Label>
                  <Input
                    placeholder="Type your query here..."
                    value={customQuery}
                    onChange={handleCustomQueryChange}
                  />
                </div>
                
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <h3 className="font-medium mb-2">Active Query</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {activeQuery || "No query selected"}
                  </p>
                  
                  {selectedQuery && (
                    <div className="mt-2">
                      <Badge className="mr-2">
                        {sampleQueries.find(q => q.id === Number.parseInt(selectedQuery))?.category}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        Issue: {sampleQueries.find(q => q.id === Number.parseInt(selectedQuery))?.issue}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={processQuery} 
                  disabled={!activeQuery.trim() || isProcessing} 
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Process Query"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Query Processing Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Processing Configuration
                </CardTitle>
                <CardDescription>Configure how the query is processed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="query-rewriting" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Enable Query Rewriting
                    </Label>
                    <Switch 
                      id="query-rewriting" 
                      checked={enableQueryRewriting} 
                      onCheckedChange={setEnableQueryRewriting}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, the system will attempt to improve the query by rewriting it.
                  </p>
                </div>
                
                {enableQueryRewriting && (
                  <div className="space-y-2">
                    <Label>Rewriting Technique</Label>
                    <Select value={rewriteTechnique} onValueChange={setRewriteTechnique}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rewriting technique" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expand-acronyms">Expand Acronyms</SelectItem>
                        <SelectItem value="add-context">Add Context</SelectItem>
                        <SelectItem value="reformulate">Reformulate Query</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      {rewriteTechnique === "expand-acronyms"
                        ? "Expands acronyms to their full form (e.g., 'API' → 'Application Programming Interface (API)')"
                        : rewriteTechnique === "add-context"
                          ? "Adds contextual information to ambiguous queries based on available knowledge"
                          : "Reformulates the query to be more specific and comprehensive"}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="policy-check" className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-amber-500" />
                      Enable Policy Check
                    </Label>
                    <Switch 
                      id="policy-check" 
                      checked={enablePolicyCheck} 
                      onCheckedChange={setEnablePolicyCheck}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, the system will check if the query violates any policies.
                  </p>
                </div>
                
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <h3 className="font-medium mb-2">What This Demo Shows</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    This demo illustrates how query understanding techniques can improve retrieval by:
                  </p>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc pl-5 mt-2 space-y-1">
                    <li>Expanding acronyms to match full terms in documents</li>
                    <li>Adding context to ambiguous queries</li>
                    <li>Reformulating queries to be more specific</li>
                    <li>Checking queries against policy guidelines</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Query Processing Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Processing Results
              </CardTitle>
              <CardDescription>
                {rewrittenQuery 
                  ? "See how the query was processed and the resulting search"
                  : "Process a query to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rewrittenQuery && (
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2">Original Query</h3>
                    <p className="text-slate-600 dark:text-slate-300">{activeQuery}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-emerald-500" />
                  </div>
                  
                  <div className={`p-4 border rounded-lg ${
                    rewrittenQuery.startsWith("[POLICY VIOLATION DETECTED]")
                      ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                      : "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                  }`}>
                    <h3 className="font-medium mb-2">Processed Query</h3>
                    <p className={
                      rewrittenQuery.startsWith("[POLICY VIOLATION DETECTED]")
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }>
                      {rewrittenQuery}
                    </p>
                  </div>
                  
                  {!rewrittenQuery.startsWith("[POLICY VIOLATION DETECTED]") && (
                    <>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-emerald-500" />
                      </div>
                      
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-medium mb-2">Search Results</h3>
                        {searchResults.length === 0 ? (
                          <p className="text-slate-500 dark:text-slate-400">No results found</p>
                        ) : (
                          <div className="space-y-3">
                            {searchResults.map(result => (
                              <div key={result.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                                <h4 className="font-medium">{result.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{result.content}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {result.keywords.map(keyword => (
                                    <Badge key={keyword} className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {rewrittenQuery && rewrittenQuery.startsWith("[POLICY VIOLATION DETECTED]") && (
                <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-600 dark:text-red-400">Policy Violation Detected</h3>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        This query appears to violate system policies. In a real system, this might be blocked,
                        logged, or handled according to your security protocols.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!rewrittenQuery && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Select a query and click "Process Query" to see how query understanding works
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rewriting Techniques Tab */}
        <TabsContent value="techniques">
          <Card>
            <CardHeader>
              <CardTitle>Query Rewriting Techniques</CardTitle>
              <CardDescription>Different approaches to improve query understanding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Acronym Expansion
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      Expands acronyms and abbreviations to their full form to improve matching with documents
                      that might use either the acronym or the full term.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium">Original:</span>
                        <span className="text-xs">What's the ROI on our ML investments?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Rewritten:</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                          What's the Return on Investment (ROI) on our Machine Learning (ML) investments?
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Context Addition
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      Adds contextual information to ambiguous queries based on user history, conversation context,
                      or domain knowledge.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium">Original:</span>
                        <span className="text-xs">What's the revenue for Q2?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Rewritten:</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                          What's the revenue for Q2 (referring to Q2 2023 financial results)?
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Query Reformulation
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      Rewrites the query to be more specific, comprehensive, or aligned with the document corpus
                      vocabulary, often using an LLM.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium">Original:</span>
                        <span className="text-xs">How do I use the ML model?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Rewritten:</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                          What are the steps to implement and utilize the sentiment analysis machine learning model, including input formats and output interpretation?
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-amber-500" />
                      Policy Checking
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      Analyzes queries for potential policy violations, security risks, or out-of-scope requests
                      before processing them.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium">Original:</span>
                        <span className="text-xs">How can I bypass the content filter?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Flagged:</span>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          [POLICY VIOLATION DETECTED] How can I bypass the content filter?
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <h3 className="font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Implementation Approaches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Rule-Based Systems</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      Use predefined patterns, dictionaries, and heuristics to identify and transform specific query elements.
                      Fast and predictable, but limited to known patterns.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">LLM-Based Rewriting</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      Use language models to understand and reformulate queries more intelligently.
                      More flexible and powerful, but adds latency and may introduce unexpected changes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Common Challenges Tab */}
        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Common Query Understanding Challenges</CardTitle>
              <CardDescription>Issues that can affect retrieval quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    Ambiguity
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                    Many terms and phrases can have multiple meanings, making it difficult to determine the user's intent.
                  </p>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Example: "Java" Ambiguity</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium mt-0.5">Query:</span>
                        <span className="text-xs">How do I install Java?</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium mt-0.5">Ambiguity:</span>
                        <span className="text-xs">
                          Could refer to the programming language (Java SDK), the runtime environment (JRE),
                          or even a coffee machine brand.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium mt-0.5">Solution:</span>
                        <span className="text-xs">
                          Use context from conversation history, user profile (e.g., developer vs. non-technical user),
                          or ask for clarification.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    Vocabulary Mismatch
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                    Users often use different terminology than what appears in the documents, leading to retrieval failures.
                  </p>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Example: Technical vs. Layman Terms</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium mt-0.5">Document:</span>
                        <span className="text-xs">
                          "To authenticate, utilize the OAuth 2.0 protocol with JWT bearer tokens."
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium mt-0.5">User Query:</span>
                        <span className="text-xs">
                          "How do I log in to the API?"
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium mt-0.5">Solution:</span>
                        <span className="text-xs">
                          Expand queries with synonyms, related terms, or domain-specific vocabulary.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
