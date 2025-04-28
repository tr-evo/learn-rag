"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Shield, AlertCircle, Calendar, Tag, User, FileText, EyeOff } from "lucide-react"

// Sample retrieved chunks for the demo
const retrievedChunks = [
  {
    id: 1,
    text: "Our Q1 2023 financial results showed a 15% increase in revenue compared to the previous quarter. The board has approved a special dividend for shareholders.",
    metadata: {
      source: "Financial Report Q1 2023",
      date: new Date("2023-04-10"),
      category: "Financial",
      confidentiality: "Public",
      department: "Finance",
      accessLevel: "All Employees",
      relevanceScore: 0.92,
    },
  },
  {
    id: 2,
    text: "The new HR policy regarding remote work will take effect on July 1, 2023. Employees will be required to work from the office at least 2 days per week, with exceptions requiring manager approval.",
    metadata: {
      source: "HR Policy Update",
      date: new Date("2023-06-15"),
      category: "HR",
      confidentiality: "Internal",
      department: "Human Resources",
      accessLevel: "All Employees",
      relevanceScore: 0.85,
    },
  },
  {
    id: 3,
    text: "The upcoming product launch for our new AI-powered analytics platform is scheduled for September 2023. Early access will be provided to select customers in August.",
    metadata: {
      source: "Product Roadmap 2023",
      date: new Date("2023-05-22"),
      category: "Product",
      confidentiality: "Internal",
      department: "Product",
      accessLevel: "All Employees",
      relevanceScore: 0.78,
    },
  },
  {
    id: 4,
    text: "Employee salary adjustments for 2023 will be processed in the July payroll. The average increase is 4.5%, with individual adjustments based on performance reviews and market benchmarks.",
    metadata: {
      source: "Compensation Update 2023",
      date: new Date("2023-06-20"),
      category: "HR",
      confidentiality: "Confidential",
      department: "Human Resources",
      accessLevel: "HR and Management",
      relevanceScore: 0.88,
    },
  },
  {
    id: 5,
    text: "The security audit revealed several vulnerabilities in our authentication system. Critical issues include weak password policies and insufficient rate limiting. These must be addressed by the end of Q2.",
    metadata: {
      source: "Security Audit Report",
      date: new Date("2023-04-05"),
      category: "Security",
      confidentiality: "Restricted",
      department: "IT",
      accessLevel: "Security Team Only",
      relevanceScore: 0.75,
    },
  },
  {
    id: 6,
    text: "Our customer satisfaction score improved to 4.7/5 in Q1 2023, up from 4.3/5 in Q4 2022. Key factors include the improved response time from customer support and the new self-service portal.",
    metadata: {
      source: "Customer Experience Report Q1 2023",
      date: new Date("2023-04-12"),
      category: "Customer",
      confidentiality: "Internal",
      department: "Customer Success",
      accessLevel: "All Employees",
      relevanceScore: 0.82,
    },
  },
  {
    id: 7,
    text: "The acquisition of XYZ Technologies is in the final stages of due diligence. The deal is expected to close by the end of Q3 2023, pending regulatory approval.",
    metadata: {
      source: "Strategic Initiatives Update",
      date: new Date("2023-06-05"),
      category: "Corporate",
      confidentiality: "Restricted",
      department: "Executive",
      accessLevel: "Executive Team Only",
      relevanceScore: 0.95,
    },
  },
  {
    id: 8,
    text: "The new marketing campaign for our enterprise solution will launch in August 2023. The budget has been increased by 20% compared to previous campaigns due to the expanded target market.",
    metadata: {
      source: "Marketing Plan 2023",
      date: new Date("2023-05-18"),
      category: "Marketing",
      confidentiality: "Internal",
      department: "Marketing",
      accessLevel: "All Employees",
      relevanceScore: 0.79,
    },
  },
  {
    id: 9,
    text: "The company's carbon footprint reduction initiative achieved a 15% decrease in emissions in 2022. The goal for 2023 is to reduce emissions by an additional 10% through expanded remote work and reduced business travel.",
    metadata: {
      source: "Sustainability Report 2022",
      date: new Date("2023-02-10"),
      category: "Corporate",
      confidentiality: "Public",
      department: "Operations",
      accessLevel: "All Employees",
      relevanceScore: 0.72,
    },
  },
  {
    id: 10,
    text: "The source code for our core authentication service contains hardcoded API keys and passwords. This is a critical security issue that must be addressed immediately. Temporary credentials have been issued while a permanent solution is implemented.",
    metadata: {
      source: "Security Vulnerability Report",
      date: new Date("2023-06-25"),
      category: "Security",
      confidentiality: "Restricted",
      department: "IT",
      accessLevel: "Security Team Only",
      relevanceScore: 0.91,
    },
  },
]

// User roles for the demo
const userRoles = [
  {
    id: "employee",
    name: "Regular Employee",
    description: "Access to public and internal documents",
    accessLevels: ["All Employees"],
    departments: ["General"],
  },
  {
    id: "hr",
    name: "HR Team Member",
    description: "Access to HR documents and confidential HR information",
    accessLevels: ["All Employees", "HR and Management"],
    departments: ["Human Resources", "General"],
  },
  {
    id: "security",
    name: "Security Team Member",
    description: "Access to security-related documents and vulnerabilities",
    accessLevels: ["All Employees", "Security Team Only"],
    departments: ["IT", "General"],
  },
  {
    id: "executive",
    name: "Executive Team Member",
    description: "Access to all company information including restricted documents",
    accessLevels: ["All Employees", "HR and Management", "Security Team Only", "Executive Team Only"],
    departments: ["Executive", "General"],
  },
]

export default function FilteringPermissionChecksDemo() {
  // State for user and filtering configuration
  const [selectedUserRole, setSelectedUserRole] = useState(userRoles[0])
  const [query, setQuery] = useState("What are the latest company updates?")
  const [retrievedResults, setRetrievedResults] = useState<typeof retrievedChunks>([])
  const [filteredResults, setFilteredResults] = useState<typeof retrievedChunks>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Filter configuration
  const [enableRelevanceFilter, setEnableRelevanceFilter] = useState(true)
  const [relevanceThreshold, setRelevanceThreshold] = useState(0.7)
  const [enableDateFilter, setEnableDateFilter] = useState(false)
  const [dateThreshold, setDateThreshold] = useState(6) // months
  const [enableCategoryFilter, setEnableCategoryFilter] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [enablePermissionChecks, setEnablePermissionChecks] = useState(true)

  // Simulation settings
  const [simulateOverFiltering, setSimulateOverFiltering] = useState(false)
  const [simulateUnderFiltering, setSimulateUnderFiltering] = useState(false)

  // Get unique categories from chunks
  const getUniqueCategories = () => {
    const categories = new Set<string>()
    retrievedChunks.forEach(chunk => {
      categories.add(chunk.metadata.category)
    })
    return ["All", ...Array.from(categories)]
  }

  // Perform search and filtering
  const performSearch = () => {
    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      // First, get all retrieved chunks (simulating the output from vector search)
      let results = [...retrievedChunks]

      // Sort by relevance score (descending)
      results.sort((a, b) => b.metadata.relevanceScore - a.metadata.relevanceScore)

      // Take top results
      results = results.slice(0, 7)

      setRetrievedResults(results)

      // Apply filters
      let filtered = [...results]

      // Apply relevance filter
      if (enableRelevanceFilter && !simulateOverFiltering) {
        filtered = filtered.filter(chunk => chunk.metadata.relevanceScore >= relevanceThreshold)
      }

      // Apply date filter
      if (enableDateFilter && !simulateOverFiltering) {
        const cutoffDate = new Date()
        cutoffDate.setMonth(cutoffDate.getMonth() - dateThreshold)
        filtered = filtered.filter(chunk => chunk.metadata.date >= cutoffDate)
      }

      // Apply category filter
      if (enableCategoryFilter && selectedCategory !== "All" && !simulateOverFiltering) {
        filtered = filtered.filter(chunk => chunk.metadata.category === selectedCategory)
      }

      // Apply permission checks
      if (enablePermissionChecks && !simulateUnderFiltering) {
        filtered = filtered.filter(chunk => {
          // Check if user has access to this document based on accessLevel
          return selectedUserRole.accessLevels.includes(chunk.metadata.accessLevel)
        })
      }

      // Simulate over-filtering
      if (simulateOverFiltering) {
        // Apply extremely strict filters that remove almost everything
        filtered = filtered.filter(chunk =>
          chunk.metadata.relevanceScore > 0.9 &&
          chunk.metadata.date >= new Date("2023-06-01") &&
          chunk.metadata.category === "Financial"
        )
      }

      // Simulate under-filtering
      if (simulateUnderFiltering) {
        // Skip permission checks entirely
        filtered = [...results]
      }

      setFilteredResults(filtered)
      setIsSearching(false)
      setHasSearched(true)
    }, 1000)
  }

  // Calculate statistics
  const getFilteringStats = () => {
    if (!hasSearched) return null

    return {
      retrievedCount: retrievedResults.length,
      filteredCount: filteredResults.length,
      removedCount: retrievedResults.length - filteredResults.length,
      removalPercentage: Math.round(((retrievedResults.length - filteredResults.length) / retrievedResults.length) * 100),
    }
  }

  const stats = getFilteringStats()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demo">Filtering Demo</TabsTrigger>
          <TabsTrigger value="permissions">Permission Checks</TabsTrigger>
          <TabsTrigger value="challenges">Common Challenges</TabsTrigger>
        </TabsList>

        {/* Filtering Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User and Query Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User & Query
                </CardTitle>
                <CardDescription>Configure the user role and search query</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>User Role</Label>
                  <Select
                    value={selectedUserRole.id}
                    onValueChange={(value) => {
                      const role = userRoles.find(r => r.id === value)
                      if (role) setSelectedUserRole(role)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">{selectedUserRole.description}</p>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Access Levels</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedUserRole.accessLevels.map(level => (
                      <Badge key={level} className="bg-emerald-100 dark:bg-emerald-900/20">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Search Query</Label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={performSearch}
                  disabled={isSearching || !query.trim()}
                  className="w-full"
                >
                  {isSearching ? "Searching..." : "Search & Filter"}
                </Button>
              </CardFooter>
            </Card>

            {/* Filter Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Configuration
                </CardTitle>
                <CardDescription>Configure how results are filtered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Relevance Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="relevance-filter" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Relevance Filter
                    </Label>
                    <Switch
                      id="relevance-filter"
                      checked={enableRelevanceFilter}
                      onCheckedChange={setEnableRelevanceFilter}
                    />
                  </div>
                  {enableRelevanceFilter && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Minimum Relevance Score</span>
                        <span className="text-sm font-medium">{relevanceThreshold.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[relevanceThreshold]}
                        min={0}
                        max={1}
                        step={0.05}
                        onValueChange={(value) => setRelevanceThreshold(value[0])}
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Low (0.0)</span>
                        <span>Medium (0.5)</span>
                        <span>High (1.0)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="date-filter" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date Filter
                    </Label>
                    <Switch
                      id="date-filter"
                      checked={enableDateFilter}
                      onCheckedChange={setEnableDateFilter}
                    />
                  </div>
                  {enableDateFilter && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maximum Age (months)</span>
                        <span className="text-sm font-medium">{dateThreshold} months</span>
                      </div>
                      <Slider
                        value={[dateThreshold]}
                        min={1}
                        max={24}
                        step={1}
                        onValueChange={(value) => setDateThreshold(value[0])}
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Recent (1)</span>
                        <span>Medium (12)</span>
                        <span>Old (24)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="category-filter" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Category Filter
                    </Label>
                    <Switch
                      id="category-filter"
                      checked={enableCategoryFilter}
                      onCheckedChange={setEnableCategoryFilter}
                    />
                  </div>
                  {enableCategoryFilter && (
                    <div className="space-y-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {getUniqueCategories().map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Permission Checks */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="permission-checks" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Permission Checks
                    </Label>
                    <Switch
                      id="permission-checks"
                      checked={enablePermissionChecks}
                      onCheckedChange={setEnablePermissionChecks}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    When enabled, only documents the user has permission to access will be included.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtering Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filtering Results
              </CardTitle>
              <CardDescription>
                {hasSearched
                  ? `${filteredResults.length} results after filtering (${retrievedResults.length} before filtering)`
                  : "Run a search to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasSearched ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Configure your search parameters and click "Search & Filter" to see results
                </div>
              ) : (
                <>
                  {/* Filtering Statistics */}
                  {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{stats.retrievedCount}</div>
                        <div className="text-sm text-slate-500">Retrieved Results</div>
                      </div>
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.filteredCount}</div>
                        <div className="text-sm text-slate-500">Filtered Results</div>
                      </div>
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.removedCount}</div>
                        <div className="text-sm text-slate-500">Removed Results</div>
                      </div>
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{stats.removalPercentage}%</div>
                        <div className="text-sm text-slate-500">Removal Rate</div>
                      </div>
                    </div>
                  )}

                  {/* Filtered Results */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Filtered Results</h3>
                    {filteredResults.length === 0 ? (
                      <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-amber-800 dark:text-amber-300">No Results After Filtering</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                              All retrieved results were filtered out. This could be due to:
                            </p>
                            <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 list-disc pl-5">
                              <li>Overly strict relevance threshold</li>
                              <li>Date filter excluding relevant content</li>
                              <li>Category filter removing matching documents</li>
                              <li>User lacking permission to access retrieved documents</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      filteredResults.map(result => (
                        <div key={result.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{result.metadata.source}</h4>
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                              Score: {result.metadata.relevanceScore.toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{result.text}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge className="text-xs">
                              {result.metadata.category}
                            </Badge>
                            <Badge className="text-xs">
                              {result.metadata.date.toLocaleDateString()}
                            </Badge>
                            <Badge className="text-xs">
                              {result.metadata.confidentiality}
                            </Badge>
                            <Badge className="text-xs">
                              {result.metadata.accessLevel}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Removed Results */}
                  {retrievedResults.length > filteredResults.length && (
                    <div className="space-y-4 mt-8">
                      <h3 className="font-medium flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-slate-400" />
                        Filtered Out Results
                      </h3>
                      {retrievedResults
                        .filter(r => !filteredResults.some(f => f.id === r.id))
                        .map(result => (
                          <div key={result.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 opacity-60">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{result.metadata.source}</h4>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                  Filtered Out
                                </Badge>
                                <Badge>
                                  Score: {result.metadata.relevanceScore.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{result.text}</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge className="text-xs">
                                {result.metadata.category}
                              </Badge>
                              <Badge className="text-xs">
                                {result.metadata.date.toLocaleDateString()}
                              </Badge>
                              <Badge className="text-xs">
                                {result.metadata.confidentiality}
                              </Badge>
                              <Badge className="text-xs">
                                {result.metadata.accessLevel}
                              </Badge>
                            </div>

                            {/* Reason for filtering */}
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/20">
                              <p className="text-xs text-red-600 dark:text-red-400">
                                <span className="font-medium">Reason for filtering: </span>
                                {enableRelevanceFilter && result.metadata.relevanceScore < relevanceThreshold &&
                                  "Relevance score below threshold. "
                                }
                                {enableDateFilter &&
                                  result.metadata.date < new Date(new Date().setMonth(new Date().getMonth() - dateThreshold)) &&
                                  "Document too old. "
                                }
                                {enableCategoryFilter && selectedCategory !== "All" &&
                                  result.metadata.category !== selectedCategory &&
                                  "Category doesn't match filter. "
                                }
                                {enablePermissionChecks &&
                                  !selectedUserRole.accessLevels.includes(result.metadata.accessLevel) &&
                                  "User doesn't have permission to access this document."
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permission Checks Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permission Checks
              </CardTitle>
              <CardDescription>Explore how permission checks work in RAG systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-3">How Permission Checks Work</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Permission checks ensure that users only see information they're authorized to access. This is crucial for maintaining security and compliance in enterprise RAG systems.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Common Implementation Approaches:</h4>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc pl-5 space-y-1">
                        <li>Metadata-based filtering using access control lists</li>
                        <li>Integration with identity providers (e.g., OAuth, SAML)</li>
                        <li>Role-based access control (RBAC)</li>
                        <li>Attribute-based access control (ABAC)</li>
                        <li>Document-level or field-level security</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">When Permission Checks Happen:</h4>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc pl-5 space-y-1">
                        <li><strong>Pre-retrieval:</strong> Limit search scope to authorized documents only</li>
                        <li><strong>Post-retrieval:</strong> Filter out unauthorized documents from results</li>
                        <li><strong>Hybrid approach:</strong> Combine both for efficiency and security</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-3">Filtering Simulation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Simulate common filtering issues to see their impact on search results.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="over-filtering" className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Simulate Over-Filtering
                        </Label>
                        <Switch
                          id="over-filtering"
                          checked={simulateOverFiltering}
                          onCheckedChange={(checked) => {
                            setSimulateOverFiltering(checked)
                            if (checked) setSimulateUnderFiltering(false)
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        When enabled, applies extremely strict filters that remove most results, even relevant ones.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="under-filtering" className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          Simulate Under-Filtering
                        </Label>
                        <Switch
                          id="under-filtering"
                          checked={simulateUnderFiltering}
                          onCheckedChange={(checked) => {
                            setSimulateUnderFiltering(checked)
                            if (checked) setSimulateOverFiltering(false)
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        When enabled, skips permission checks entirely, potentially exposing sensitive information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Common Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Common Filtering Challenges
              </CardTitle>
              <CardDescription>Understanding the balance between security and usability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-3">Over-Filtering</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Over-filtering occurs when filters are too strict, removing too many potentially relevant documents.
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Common Causes:</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc pl-5 space-y-1">
                      <li>Relevance threshold set too high</li>
                      <li>Overly restrictive date filters</li>
                      <li>Too many filters applied simultaneously</li>
                      <li>Permissions systems that are too granular</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-3">Under-Filtering</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Under-filtering occurs when not enough filtering is applied, potentially exposing sensitive information.
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Common Causes:</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc pl-5 space-y-1">
                      <li>Ignoring permission checks for performance reasons</li>
                      <li>Insufficient permissions metadata</li>
                      <li>Bugs in access control implementation</li>
                      <li>Permissions that don't align with actual needs</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-3">Best Practices</h3>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Balancing Security and Utility:</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc pl-5 space-y-1">
                      <li>Apply permission checks before relevance filtering</li>
                      <li>Use adaptive thresholds based on the number of results</li>
                      <li>Provide clear explanations when results are filtered out</li>
                      <li>Monitor and audit filtered results to adjust settings</li>
                      <li>Consider a tiered approach to permissions based on content sensitivity</li>
                    </ul>
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
