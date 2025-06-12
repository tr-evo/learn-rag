"use client"

import React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation('demos')
  
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
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700 p-1">
          <TabsTrigger value="demo" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t('filteringPermissions.filteringDemo')}</TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t('filteringPermissions.permissionChecks')}</TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t('filteringPermissions.commonChallenges')}</TabsTrigger>
        </TabsList>

        {/* Filtering Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User and Query Configuration */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-400" />
                  {t('filteringPermissions.userAndQuery')}
                </h3>
                <p className="text-sm text-slate-400">{t('filteringPermissions.configureUserRole')}</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">{t('filteringPermissions.userRole')}</Label>
                  <Select
                    value={selectedUserRole.id}
                    onValueChange={(value) => {
                      const role = userRoles.find(r => r.id === value)
                      if (role) setSelectedUserRole(role)
                    }}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder={t('filteringPermissions.selectUserRole')} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {userRoles.map(role => (
                        <SelectItem key={role.id} value={role.id} className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">{selectedUserRole.description}</p>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md">
                  <h3 className="text-sm font-medium mb-2 text-slate-300">{t('filteringPermissions.accessLevels')}</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedUserRole.accessLevels.map(level => (
                      <Badge key={level} className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t('filteringPermissions.searchQuery')}</Label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('filteringPermissions.enterQuery')}
                    className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                <Button
                  onClick={performSearch}
                  disabled={isSearching || !query.trim()}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                  {isSearching ? t('filteringPermissions.searching') : t('filteringPermissions.searchAndFilter')}
                </Button>
              </div>
            </div>

            {/* Filter Configuration */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <Filter className="h-5 w-5 text-emerald-400" />
                  {t('filteringPermissions.filterConfiguration')}
                </h3>
                <p className="text-sm text-slate-400">{t('filteringPermissions.configureFiltering')}</p>
              </div>
              <div className="p-5 space-y-4">
                {/* Relevance Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="relevance-filter" className="flex items-center gap-2 text-slate-300">
                      <Tag className="h-4 w-4 text-emerald-400" />
                      {t('filteringPermissions.relevanceFilter')}
                    </Label>
                    <Switch
                      id="relevance-filter"
                      checked={enableRelevanceFilter}
                      onCheckedChange={setEnableRelevanceFilter}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  {enableRelevanceFilter && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{t('filteringPermissions.minimumRelevanceScore')}</span>
                        <span className="text-sm font-medium text-emerald-400">{relevanceThreshold.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[relevanceThreshold]}
                        min={0}
                        max={1}
                        step={0.05}
                        onValueChange={(value) => setRelevanceThreshold(value[0])}
                        className="[&_[role=slider]]:bg-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{t('filteringPermissions.low')} (0.0)</span>
                        <span>{t('filteringPermissions.medium')} (0.5)</span>
                        <span>{t('filteringPermissions.high')} (1.0)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="date-filter" className="flex items-center gap-2 text-slate-300">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                      {t('filteringPermissions.dateFilter')}
                    </Label>
                    <Switch
                      id="date-filter"
                      checked={enableDateFilter}
                      onCheckedChange={setEnableDateFilter}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  {enableDateFilter && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{t('filteringPermissions.maximumAge')}</span>
                        <span className="text-sm font-medium text-emerald-400">{dateThreshold} {t('filteringPermissions.months')}</span>
                      </div>
                      <Slider
                        value={[dateThreshold]}
                        min={1}
                        max={24}
                        step={1}
                        onValueChange={(value) => setDateThreshold(value[0])}
                        className="[&_[role=slider]]:bg-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{t('filteringPermissions.recent')} (1)</span>
                        <span>{t('filteringPermissions.medium')} (12)</span>
                        <span>{t('filteringPermissions.old')} (24)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="category-filter" className="flex items-center gap-2 text-slate-300">
                      <FileText className="h-4 w-4 text-emerald-400" />
                      {t('filteringPermissions.categoryFilter')}
                    </Label>
                    <Switch
                      id="category-filter"
                      checked={enableCategoryFilter}
                      onCheckedChange={setEnableCategoryFilter}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  {enableCategoryFilter && (
                    <div className="space-y-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                          <SelectValue placeholder={t('filteringPermissions.selectCategory')} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {getUniqueCategories().map(category => (
                            <SelectItem key={category} value={category} className="text-slate-300 focus:bg-slate-700 focus:text-slate-200">
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
                    <Label htmlFor="permission-checks" className="flex items-center gap-2 text-slate-300">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      {t('filteringPermissions.permissionChecks')}
                    </Label>
                    <Switch
                      id="permission-checks"
                      checked={enablePermissionChecks}
                      onCheckedChange={setEnablePermissionChecks}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {t('filteringPermissions.permissionChecksDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtering Results */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-400" />
                {t('filteringPermissions.searchFilteringResults')}
              </h3>
              <p className="text-sm text-slate-400">
                {hasSearched
                  ? t('filteringPermissions.resultsAfterFiltering', { filtered: filteredResults.length, retrieved: retrievedResults.length })
                  : t('filteringPermissions.runSearchToSeeResults')}
              </p>
            </div>
            <div className="p-5 space-y-4">
              {!hasSearched ? (
                <div className="text-center py-8 text-slate-400">
                  {t('filteringPermissions.configureSearchParameters')}
                </div>
              ) : (
                <>
                  {/* Filtering Statistics */}
                  {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-200">{t('filteringPermissions.retrievedResults')}: {stats.retrievedCount}</div>
                        <div className="text-sm text-slate-400">{t('filteringPermissions.retrievedResultsDescription')}</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-400">{t('filteringPermissions.filteredResults')}: {stats.filteredCount}</div>
                        <div className="text-sm text-slate-400">{t('filteringPermissions.filteredResultsDescription')}</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-400">{t('filteringPermissions.removedResults')}: {stats.removedCount}</div>
                        <div className="text-sm text-slate-400">{t('filteringPermissions.removedResultsDescription')}</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-200">{t('filteringPermissions.removalRate')}: {stats.removalPercentage}%</div>
                        <div className="text-sm text-slate-400">{t('filteringPermissions.removalRateDescription')}</div>
                      </div>
                    </div>
                  )}

                  {/* Filtered Results */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-200">{t('filteringPermissions.filteredResults')}</h3>
                    {filteredResults.length === 0 ? (
                      <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-300 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-amber-300">{t('filteringPermissions.noResultsAfterFiltering')}</h3>
                            <p className="text-sm text-amber-300 mt-1">
                              {t('filteringPermissions.allResultsFiltered')}
                            </p>
                            <ul className="text-sm text-amber-300 mt-1 list-disc pl-5">
                              <li>{t('filteringPermissions.strictRelevanceThreshold')}</li>
                              <li>{t('filteringPermissions.dateFilterExcluding')}</li>
                              <li>{t('filteringPermissions.categoryFilterRemoving')}</li>
                              <li>{t('filteringPermissions.userLackingPermission')}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      filteredResults.map(result => (
                        <div key={result.id} className="p-4 bg-slate-800/50 border border-slate-700 hover:border-emerald-500/30 rounded-lg transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-slate-200">{result.metadata.source}</h4>
                            <Badge className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300">
                              {t('filteringPermissions.score')}: {result.metadata.relevanceScore.toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{result.text}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge className="text-xs bg-slate-700 text-slate-300">
                              {result.metadata.category}
                            </Badge>
                            <Badge className="text-xs bg-slate-700 text-slate-300">
                              {result.metadata.date.toLocaleDateString()}
                            </Badge>
                            <Badge className="text-xs bg-slate-700 text-slate-300">
                              {result.metadata.confidentiality}
                            </Badge>
                            <Badge className="text-xs bg-slate-700 text-slate-300">
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
                      <h3 className="font-medium text-slate-200 flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-slate-400" />
                        {t('filteringPermissions.filteredOutResults')}
                      </h3>
                      {retrievedResults
                        .filter(r => !filteredResults.some(f => f.id === r.id))
                        .map(result => (
                          <div key={result.id} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg opacity-60">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-slate-300">{result.metadata.source}</h4>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-red-900/20 border border-red-500/30 text-red-300">
                                  {t('filteringPermissions.filteredOut')}
                                </Badge>
                                <Badge className="bg-slate-700 text-slate-300">
                                  {t('filteringPermissions.score')}: {result.metadata.relevanceScore.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">{result.text}</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge className="text-xs bg-slate-700 text-slate-300">
                                {result.metadata.category}
                              </Badge>
                              <Badge className="text-xs bg-slate-700 text-slate-300">
                                {result.metadata.date.toLocaleDateString()}
                              </Badge>
                              <Badge className="text-xs bg-slate-700 text-slate-300">
                                {result.metadata.confidentiality}
                              </Badge>
                              <Badge className="text-xs bg-slate-700 text-slate-300">
                                {result.metadata.accessLevel}
                              </Badge>
                            </div>

                            {/* Reason for filtering */}
                            <div className="mt-3 p-2 bg-red-900/10 border border-red-900/20 rounded">
                              <p className="text-xs text-red-400">
                                <span className="font-medium">{t('filteringPermissions.reasonForFiltering')}: </span>
                                {enableRelevanceFilter && result.metadata.relevanceScore < relevanceThreshold &&
                                  t('filteringPermissions.relevanceBelowThreshold')
                                }
                                {enableDateFilter &&
                                  result.metadata.date < new Date(new Date().setMonth(new Date().getMonth() - dateThreshold)) &&
                                  t('filteringPermissions.documentTooOld')
                                }
                                {enableCategoryFilter && selectedCategory !== "All" &&
                                  result.metadata.category !== selectedCategory &&
                                  t('filteringPermissions.categoryDoesntMatch')
                                }
                                {enablePermissionChecks &&
                                  !selectedUserRole.accessLevels.includes(result.metadata.accessLevel) &&
                                  t('filteringPermissions.userNoPermission')
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Permission Checks Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                {t('filteringPermissions.permissionChecks')}
              </h3>
              <p className="text-sm text-slate-400">{t('filteringPermissions.explorePermissionChecks')}</p>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <h3 className="font-medium mb-3 text-slate-200">{t('filteringPermissions.howPermissionChecksWork')}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    {t('filteringPermissions.permissionChecksDescription2')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-200">{t('filteringPermissions.commonImplementationApproaches')}:</h4>
                      <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
                        <li>{t('filteringPermissions.metadataBasedFiltering')}</li>
                        <li>{t('filteringPermissions.identityProviderIntegration')}</li>
                        <li>{t('filteringPermissions.roleBasedAccessControl')}</li>
                        <li>{t('filteringPermissions.attributeBasedAccessControl')}</li>
                        <li>{t('filteringPermissions.documentLevelSecurity')}</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-200">{t('filteringPermissions.whenPermissionChecksHappen')}:</h4>
                      <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
                        <li><strong>{t('filteringPermissions.preRetrieval')}:</strong> {t('filteringPermissions.limitSearchScope')}</li>
                        <li><strong>{t('filteringPermissions.postRetrieval')}:</strong> {t('filteringPermissions.filterUnauthorizedDocuments')}</li>
                        <li><strong>{t('filteringPermissions.hybridApproach')}:</strong> {t('filteringPermissions.combineBothApproaches')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <h3 className="font-medium mb-3 text-slate-200">{t('filteringPermissions.filteringSimulation')}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    {t('filteringPermissions.simulateFilteringIssues')}
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="over-filtering" className="flex items-center gap-2 text-slate-300">
                          <AlertCircle className="h-4 w-4 text-amber-300" />
                          {t('filteringPermissions.simulateOverFiltering')}
                        </Label>
                        <Switch
                          id="over-filtering"
                          checked={simulateOverFiltering}
                          onCheckedChange={(checked) => {
                            setSimulateOverFiltering(checked)
                            if (checked) setSimulateUnderFiltering(false)
                          }}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                      </div>
                      <p className="text-xs text-slate-400">
                        {t('filteringPermissions.overFilteringDescription')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="under-filtering" className="flex items-center gap-2 text-slate-300">
                          <AlertCircle className="h-4 w-4 text-red-300" />
                          {t('filteringPermissions.simulateUnderFiltering')}
                        </Label>
                        <Switch
                          id="under-filtering"
                          checked={simulateUnderFiltering}
                          onCheckedChange={(checked) => {
                            setSimulateUnderFiltering(checked)
                            if (checked) setSimulateOverFiltering(false)
                          }}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                      </div>
                      <p className="text-xs text-slate-400">
                        {t('filteringPermissions.underFilteringDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Common Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-emerald-400" />
                {t('filteringPermissions.commonFilteringChallenges')}
              </h3>
              <p className="text-sm text-slate-400">{t('filteringPermissions.understandBalance')}</p>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <h3 className="font-medium mb-3 text-slate-200">{t('filteringPermissions.overFiltering')}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    {t('filteringPermissions.overFilteringDescription2')}
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">{t('filteringPermissions.commonCauses')}:</h4>
                    <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
                      <li>{t('filteringPermissions.relevanceThresholdTooHigh')}</li>
                      <li>{t('filteringPermissions.overlyRestrictiveDateFilter')}</li>
                      <li>{t('filteringPermissions.tooManyFilters')}</li>
                      <li>{t('filteringPermissions.granularPermissions')}</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <h3 className="font-medium mb-3 text-slate-200">{t('filteringPermissions.underFiltering')}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    {t('filteringPermissions.underFilteringDescription2')}
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">{t('filteringPermissions.commonCauses')}:</h4>
                    <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
                      <li>{t('filteringPermissions.ignoringPermissionChecks')}</li>
                      <li>{t('filteringPermissions.insufficientPermissionsMetadata')}</li>
                      <li>{t('filteringPermissions.bugsInAccessControl')}</li>
                      <li>{t('filteringPermissions.permissionsNotAligned')}</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <h3 className="font-medium mb-3 text-slate-200">{t('filteringPermissions.bestPractices')}</h3>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">{t('filteringPermissions.balancingSecurityAndUtility')}:</h4>
                    <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
                      <li>{t('filteringPermissions.applyPermissionChecks')}</li>
                      <li>{t('filteringPermissions.useAdaptiveThresholds')}</li>
                      <li>{t('filteringPermissions.provideClearExplanations')}</li>
                      <li>{t('filteringPermissions.monitorAndAudit')}</li>
                      <li>{t('filteringPermissions.tieredApproach')}</li>
                    </ul>
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
