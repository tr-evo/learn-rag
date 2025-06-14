"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
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
  const { t } = useTranslation('demos')

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
    if (queryId === "default") {
      setSelectedQuery("default")
      setActiveQuery("")
      setCustomQuery("")
      setRewrittenQuery("")
      setSearchResults([])
      return
    }

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
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700 rounded-lg">
          <TabsTrigger value="demo" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t('queryUnderstanding.queryProcessing')}</TabsTrigger>
          <TabsTrigger value="techniques" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t('queryUnderstanding.rewritingTechniques')}</TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t('queryUnderstanding.commonChallenges')}</TabsTrigger>
        </TabsList>

        {/* Query Processing Tab */}
        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Query Input */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-200 font-medium flex items-center gap-2">
                    <Search className="h-5 w-5 text-emerald-400" />
                    {t('queryUnderstanding.queryInput')}
                  </h3>
                  <p className="text-slate-400 text-sm">{t('queryUnderstanding.selectSampleQuery')}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">{t('queryUnderstanding.sampleQueries')}</Label>
                  <Select value={selectedQuery} onValueChange={handleQuerySelect}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder={t('queryUnderstanding.selectSampleQueryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                      <SelectItem value="default">{t('queryUnderstanding.selectQueryDefault')}</SelectItem>
                      {sampleQueries.map(query => (
                        <SelectItem key={query.id} value={query.id.toString()}>
                          {query.text} ({query.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-slate-200 font-medium mb-2">{t('queryUnderstanding.activeQuery')}</h3>
                  <p className="text-sm text-slate-300">
                    {activeQuery || t('queryUnderstanding.noQuerySelected')}
                  </p>

                  {selectedQuery && (
                    <div className="mt-2">
                      <Badge className="mr-2 bg-emerald-500 hover:bg-emerald-600">
                        {sampleQueries.find(q => q.id === Number.parseInt(selectedQuery))?.category}
                      </Badge>
                      <p className="text-xs text-slate-400 mt-1">
                        Issue: {sampleQueries.find(q => q.id === Number.parseInt(selectedQuery))?.issue}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-700">
                <Button
                  onClick={processQuery}
                  disabled={!activeQuery.trim() || isProcessing}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                  {isProcessing ? t('queryUnderstanding.processing') : t('queryUnderstanding.processQuery')}
                </Button>
              </div>
            </div>

            {/* Query Processing Configuration */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-200 font-medium flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-emerald-400" />
                    {t('queryUnderstanding.processingConfiguration')}
                  </h3>
                  <p className="text-slate-400 text-sm">{t('queryUnderstanding.configureProcessing')}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="query-rewriting" className="flex items-center gap-2 text-slate-300">
                      <Lightbulb className="h-4 w-4 text-emerald-400" />
                      {t('queryUnderstanding.enableQueryRewriting')}
                    </Label>
                    <Switch
                      id="query-rewriting"
                      checked={enableQueryRewriting}
                      onCheckedChange={setEnableQueryRewriting}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {t('queryUnderstanding.queryRewritingDescription')}
                  </p>
                </div>

                {enableQueryRewriting && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">{t('queryUnderstanding.rewritingTechnique')}</Label>
                    <Select value={rewriteTechnique} onValueChange={setRewriteTechnique}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                        <SelectValue placeholder={t('queryUnderstanding.selectRewritingTechnique')} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                        <SelectItem value="expand-acronyms">{t('queryUnderstanding.expandAcronyms')}</SelectItem>
                        <SelectItem value="add-context">{t('queryUnderstanding.addContext')}</SelectItem>
                        <SelectItem value="reformulate">{t('queryUnderstanding.reformulateQuery')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400">
                      {rewriteTechnique === "expand-acronyms"
                        ? t('queryUnderstanding.expandAcronymsDescription')
                        : rewriteTechnique === "add-context"
                          ? t('queryUnderstanding.addContextDescription')
                          : t('queryUnderstanding.reformulateDescription')}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="policy-check" className="flex items-center gap-2 text-slate-300">
                      <ShieldAlert className="h-4 w-4 text-emerald-400" />
                      {t('queryUnderstanding.enablePolicyCheck')}
                    </Label>
                    <Switch
                      id="policy-check"
                      checked={enablePolicyCheck}
                      onCheckedChange={setEnablePolicyCheck}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {t('queryUnderstanding.policyCheckDescription')}
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-slate-200 font-medium mb-2">What This Demo Shows</h3>
                  <p className="text-sm text-slate-300">
                    {t('queryUnderstanding.whatThisDemoShows')}
                  </p>
                  <ul className="text-sm text-slate-300 list-disc pl-5 mt-2 space-y-1">
                    <li>{t('queryUnderstanding.demoPoint1')}</li>
                    <li>{t('queryUnderstanding.demoPoint2')}</li>
                    <li>{t('queryUnderstanding.demoPoint3')}</li>
                    <li>{t('queryUnderstanding.demoPoint4')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Query Processing Results */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-400" />
                  {t('queryUnderstanding.processingResults')}
                </h3>
                <p className="text-slate-400 text-sm">
                  {rewrittenQuery
                    ? t('queryUnderstanding.seeProcessingResults')
                    : t('queryUnderstanding.processQueryToSeeResults')}
                </p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {rewrittenQuery && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <h3 className="text-slate-200 font-medium mb-2">{t('queryUnderstanding.originalQuery')}</h3>
                    <p className="text-slate-300">{activeQuery}</p>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-emerald-400" />
                  </div>

                  <div className={`p-4 rounded-lg ${rewrittenQuery.startsWith("[POLICY VIOLATION DETECTED]")
                    ? "bg-red-900/20 border border-red-500/30 text-red-300"
                    : "bg-emerald-900/20 border border-emerald-500/50 text-emerald-300"
                    }`}>
                    <h3 className="text-slate-200 font-medium mb-2">{t('queryUnderstanding.processedQuery')}</h3>
                    <p>
                      {rewrittenQuery}
                    </p>
                  </div>

                  {!rewrittenQuery.startsWith("[POLICY VIOLATION DETECTED]") && (
                    <>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-emerald-400" />
                      </div>

                      <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                        <h3 className="text-slate-200 font-medium mb-2">{t('queryUnderstanding.searchResults')}</h3>
                        {searchResults.length === 0 ? (
                          <p className="text-slate-400">{t('queryUnderstanding.noResultsFound')}</p>
                        ) : (
                          <div className="space-y-3">
                            {searchResults.map(result => (
                              <div key={result.id} className="p-3 bg-slate-800 border border-slate-700 rounded-md transition-all hover:border-emerald-500/30">
                                <h4 className="text-slate-200 font-medium">{result.title}</h4>
                                <p className="text-sm text-slate-300 mt-1">{result.content}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {result.keywords.map(keyword => (
                                    <Badge key={keyword} className="text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
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
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-300 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-300">{t('queryUnderstanding.policyViolationDetected')}</h3>
                      <p className="text-sm text-red-300 mt-1">
                        {t('queryUnderstanding.policyViolationMessage')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!rewrittenQuery && (
                <div className="text-center py-8 text-slate-400">
                  {t('queryUnderstanding.selectQueryInstruction')}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Rewriting Techniques Tab */}
        <TabsContent value="techniques">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">{t('queryUnderstanding.queryRewritingTechniques')}</h3>
                <p className="text-slate-400 text-sm">{t('queryUnderstanding.differentApproaches')}</p>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <h3 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-emerald-400" />
                      {t('queryUnderstanding.acronymExpansion')}
                    </h3>
                    <p className="text-sm text-slate-300 mb-3">
                      {t('queryUnderstanding.acronymExpansionDescription')}
                    </p>
                    <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.original')}:</span>
                        <span className="text-xs text-slate-400">What's the ROI on our ML investments?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.rewritten')}:</span>
                        <span className="text-xs text-emerald-400">
                          What's the Return on Investment (ROI) on our Machine Learning (ML) investments?
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <h3 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-emerald-400" />
                      {t('queryUnderstanding.contextAddition')}
                    </h3>
                    <p className="text-sm text-slate-300 mb-3">
                      {t('queryUnderstanding.contextAdditionDescription')}
                    </p>
                    <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.original')}:</span>
                        <span className="text-xs text-slate-400">What's the revenue for Q2?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.rewritten')}:</span>
                        <span className="text-xs text-emerald-400">
                          What's the revenue for Q2 (referring to Q2 2023 financial results)?
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <h3 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-emerald-400" />
                      {t('queryUnderstanding.queryReformulation')}
                    </h3>
                    <p className="text-sm text-slate-300 mb-3">
                      {t('queryUnderstanding.queryReformulationDescription')}
                    </p>
                    <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.original')}:</span>
                        <span className="text-xs text-slate-400">How do I use the ML model?</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.rewritten')}:</span>
                        <span className="text-xs text-emerald-400">
                          What are the steps to implement and utilize the sentiment analysis machine learning model, including input formats and output interpretation?
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <h3 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-emerald-400" />
                      {t('queryUnderstanding.policyChecking')}
                    </h3>
                    <p className="text-sm text-slate-300 mb-3">
                      {t('queryUnderstanding.policyCheckingDescription')}
                    </p>
                    <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.original')}:</span>
                        <span className="text-xs text-slate-400">{t('queryUnderstanding.policyCheckingExample')}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-300">{t('queryUnderstanding.flagged')}:</span>
                        <span className="text-xs text-red-300">
                          {t('queryUnderstanding.policyCheckingFlagged')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/50 rounded-lg">
                <h3 className="font-medium text-emerald-300 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  {t('queryUnderstanding.implementationApproaches')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <h4 className="text-sm font-medium text-emerald-300 mb-1">{t('queryUnderstanding.ruleBasedSystems')}</h4>
                    <p className="text-sm text-emerald-300">
                      {t('queryUnderstanding.ruleBasedDescription')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-emerald-300 mb-1">{t('queryUnderstanding.llmBasedRewriting')}</h4>
                    <p className="text-sm text-emerald-300">
                      {t('queryUnderstanding.llmBasedDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Common Challenges Tab */}
        <TabsContent value="challenges">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">{t('queryUnderstanding.commonQueryChallenges')}</h3>
                <p className="text-slate-400 text-sm">{t('queryUnderstanding.issuesAffectingRetrieval')}</p>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                  <h3 className="font-medium text-amber-300 flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-300" />
                    {t('queryUnderstanding.ambiguity')}
                  </h3>
                  <p className="text-sm text-amber-300 mb-3">
                    {t('queryUnderstanding.ambiguityDescription')}
                  </p>
                  <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
                    <h4 className="text-sm font-medium text-slate-200 mb-2">{t('queryUnderstanding.javaAmbiguityExample')}</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-slate-300 mt-0.5">{t('queryUnderstanding.query')}:</span>
                        <span className="text-xs text-slate-400">How do I install Java?</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-slate-300 mt-0.5">{t('queryUnderstanding.ambiguityLabel')}:</span>
                        <span className="text-xs text-slate-400">
                          {t('queryUnderstanding.javaAmbiguityText')}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-slate-300 mt-0.5">{t('queryUnderstanding.solution')}:</span>
                        <span className="text-xs text-slate-400">
                          {t('queryUnderstanding.javaAmbiguitySolution')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                  <h3 className="font-medium text-amber-300 flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-300" />
                    {t('queryUnderstanding.vocabularyMismatch')}
                  </h3>
                  <p className="text-sm text-amber-300 mb-3">
                    {t('queryUnderstanding.vocabularyMismatchDescription')}
                  </p>
                  <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
                    <h4 className="text-sm font-medium text-slate-200 mb-2">{t('queryUnderstanding.technicalVsLaymanExample')}</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-slate-300 mt-0.5">{t('queryUnderstanding.document')}:</span>
                        <span className="text-xs text-slate-400">
                          "To authenticate, utilize the OAuth 2.0 protocol with JWT bearer tokens."
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-slate-300 mt-0.5">{t('queryUnderstanding.userQuery')}:</span>
                        <span className="text-xs text-slate-400">
                          "How do I log in to the API?"
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-slate-300 mt-0.5">{t('queryUnderstanding.solution')}:</span>
                        <span className="text-xs text-slate-400">
                          {t('queryUnderstanding.vocabularyMismatchSolution')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
