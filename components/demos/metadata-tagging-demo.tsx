"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Tag, Search, Filter, Shield, AlertCircle, CheckCircle2, BookOpen, AlertTriangle, FolderSearch } from "lucide-react"

// Rename the original sampleDocuments array to initialSampleDocuments
const initialSampleDocuments = [
  {
    id: 1,
    title: "Employee Handbook",
    content:
      "This handbook outlines the company's policies regarding work hours, vacation time, and benefits. All employees must adhere to these guidelines.",
    metadata: {
      source: "HR Department",
      author: "HR Team",
      date: new Date("2023-01-15"),
      category: "HR Policy",
      department: "Human Resources",
      confidentiality: "Internal",
      version: "2.3",
    },
  },
  {
    id: 2,
    title: "Product Roadmap 2023",
    content:
      "Our product strategy for 2023 includes launching three new features: advanced analytics, mobile integration, and API improvements.",
    metadata: {
      source: "Product Team",
      author: "Jane Smith",
      date: new Date("2023-03-22"),
      category: "Product Strategy",
      department: "Product",
      confidentiality: "Confidential",
      version: "1.0",
    },
  },
  {
    id: 3,
    title: "Customer Support Guidelines",
    content:
      "When handling customer inquiries, always respond within 24 hours and follow the escalation procedures for complex issues.",
    metadata: {
      source: "Support Team",
      author: "Support Manager",
      date: new Date("2022-11-05"),
      category: "Support Protocol",
      department: "Customer Support",
      confidentiality: "Internal",
      version: "3.1",
    },
  },
  {
    id: 4,
    title: "Financial Report Q1 2023",
    content:
      "The company's Q1 financial performance exceeded expectations with a 15% revenue increase compared to the previous quarter.",
    metadata: {
      source: "Finance Department",
      author: "CFO Office",
      date: new Date("2023-04-10"),
      category: "Financial Report",
      department: "Finance",
      confidentiality: "Confidential",
      version: "1.0",
    },
  },
  {
    id: 5,
    title: "Marketing Campaign Results",
    content:
      "The recent social media campaign generated a 25% increase in website traffic and a 10% increase in lead generation.",
    metadata: {
      source: "Marketing Team",
      author: "Marketing Director",
      date: new Date("2023-02-28"),
      category: "Campaign Analysis",
      department: "Marketing",
      confidentiality: "Internal",
      version: "1.2",
    },
  },
]

export default function MetadataTaggingDemo() {
  // Add these state declarations near the top with other state declarations
  const [sampleDocuments, setSampleDocuments] = useState([...initialSampleDocuments])
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  // State for the document being edited
  const [selectedDocument, setSelectedDocument] = useState(sampleDocuments[0])
  const [editedMetadata, setEditedMetadata] = useState({ ...selectedDocument.metadata })
  const [date, setDate] = useState<Date | undefined>(selectedDocument.metadata.date)

  // State for search/filter
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({})
  const [searchResults, setSearchResults] = useState<typeof sampleDocuments>([])
  const [hasSearched, setHasSearched] = useState(false)

  // State for showing the importance of metadata
  const [showMissingMetadata, setShowMissingMetadata] = useState(false)
  const [showInconsistentMetadata, setShowInconsistentMetadata] = useState(false)

  // Handle document selection
  const handleSelectDocument = (doc: (typeof sampleDocuments)[0]) => {
    setSelectedDocument(doc)
    setEditedMetadata({ ...doc.metadata })
    setDate(doc.metadata.date)
  }

  // Handle metadata changes
  const handleMetadataChange = (key: string, value: any) => {
    setEditedMetadata((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      handleMetadataChange("date", newDate)
    }
  }

  // Save metadata changes
  const saveMetadataChanges = () => {
    // Create a new array with the updated document
    const updatedDocs = sampleDocuments.map((doc) =>
      doc.id === selectedDocument.id ? { ...doc, metadata: editedMetadata } : doc,
    )

    // Update the sampleDocuments state
    setSampleDocuments(updatedDocs)

    // Update the selected document
    setSelectedDocument({ ...selectedDocument, metadata: editedMetadata })

    // Show success message
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  // Handle search and filtering
  const handleSearch = () => {
    let results = [...sampleDocuments]

    // Filter by search query (in title, content, or metadata)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter((doc) => {
        // Check title and content
        if (doc.title.toLowerCase().includes(query) || doc.content.toLowerCase().includes(query)) {
          return true
        }

        // Check metadata values
        for (const [key, value] of Object.entries(doc.metadata)) {
          if (value && value.toString().toLowerCase().includes(query)) {
            return true
          }
        }

        return false
      })
    }

    // Apply metadata filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        if (key === "date") {
          // Special handling for date
          results = results.filter((doc) => {
            const docDate = new Date(doc.metadata.date)
            return docDate >= new Date(value)
          })
        } else {
          results = results.filter(
            (doc) => doc.metadata[key as keyof typeof doc.metadata]?.toString().toLowerCase() === value.toLowerCase(),
          )
        }
      }
    })

    // Apply missing metadata simulation
    if (showMissingMetadata) {
      // Simulate missing confidentiality metadata by excluding it from results
      results = results.filter((doc) => doc.metadata.confidentiality !== "Confidential")
    }

    // Apply inconsistent metadata simulation
    if (showInconsistentMetadata) {
      // Simulate inconsistent department metadata by treating "Human Resources" and "HR" as different
      results = results.map((doc) => {
        if (doc.id === 1) {
          return {
            ...doc,
            metadata: {
              ...doc.metadata,
              department: "HR", // Changed from "Human Resources" to "HR"
            },
          }
        }
        return doc
      })
    }

    setSearchResults(results)
    setHasSearched(true)
  }

  // Toggle a filter - fixed to not use a callback
  const toggleFilter = (key: string, value: string | null) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      if (prev[key] === value) {
        delete newFilters[key]
      } else {
        newFilters[key] = value
      }
      return newFilters
    })
  }

  // Reset filters
  const resetFilters = () => {
    setActiveFilters({})
    setSearchQuery("")
    setHasSearched(false)
  }

  // Get unique values for a metadata field
  const getUniqueValues = (field: string) => {
    const values = new Set<string>()
    sampleDocuments.forEach((doc) => {
      const value = doc.metadata[field as keyof typeof doc.metadata]
      if (value) {
        values.add(value.toString())
      }
    })
    return Array.from(values)
  }

  // Effect to trigger search when filters change
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0 || hasSearched) {
      handleSearch()
    }
  }, [activeFilters, showMissingMetadata, showInconsistentMetadata])

  return (
    <div className="space-y-6 text-slate-200">
    <Tabs defaultValue="tagging" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 p-1 mb-4">
          <TabsTrigger 
            value="tagging" 
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Metadata Tagging
          </TabsTrigger>
          <TabsTrigger 
            value="search" 
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Search & Filter
          </TabsTrigger>
      </TabsList>

      {/* Metadata Tagging Tab */}
      <TabsContent value="tagging">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document List */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-medium text-slate-200">Documents</h3>
                </div>
                <span className="text-xs text-slate-400">{sampleDocuments.length} items</span>
              </div>
              
              <div className="p-4 space-y-3">
              {sampleDocuments.map((doc) => (
                <div
                  key={doc.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedDocument.id === doc.id
                        ? "border-emerald-500/50 bg-emerald-900/20"
                        : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                    }`}
                  onClick={() => handleSelectDocument(doc)}
                >
                    <h3 className="font-medium text-slate-200">{doc.title}</h3>
                    <p className="text-sm text-slate-400 truncate mt-1">{doc.content}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(doc.metadata)
                      .slice(0, 3) // Show only first 3 metadata items
                      .map(([key, value]) => (
                          <Badge key={key} className="bg-slate-700 text-slate-300 hover:bg-slate-700 text-xs">
                          {key}: {value instanceof Date ? format(value, "yyyy-MM-dd") : value}
                        </Badge>
                      ))}
                    {Object.keys(doc.metadata).length > 3 && (
                        <Badge className="bg-slate-700 text-slate-300 hover:bg-slate-700 text-xs">
                        +{Object.keys(doc.metadata).length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>

          {/* Metadata Editor */}
            <div className="md:col-span-2 bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-medium text-slate-200">Metadata Editor</h3>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                  {selectedDocument.title}
                </Badge>
              </div>
              
              <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source */}
                <div className="space-y-2">
                    <Label htmlFor="source" className="text-slate-300">Source</Label>
                  <Input
                    id="source"
                    value={editedMetadata.source}
                    onChange={(e) => handleMetadataChange("source", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Author */}
                <div className="space-y-2">
                    <Label htmlFor="author" className="text-slate-300">Author</Label>
                  <Input
                    id="author"
                    value={editedMetadata.author}
                    onChange={(e) => handleMetadataChange("author", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <Label htmlFor="date" className="text-slate-300">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-emerald-400" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          initialFocus
                          className="bg-slate-800 text-slate-200"
                        />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-300">Category</Label>
                  <Input
                    id="category"
                    value={editedMetadata.category}
                    onChange={(e) => handleMetadataChange("category", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                    <Label htmlFor="department" className="text-slate-300">Department</Label>
                  <Input
                    id="department"
                    value={editedMetadata.department}
                    onChange={(e) => handleMetadataChange("department", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Confidentiality */}
                <div className="space-y-2">
                    <Label htmlFor="confidentiality" className="text-slate-300">Confidentiality</Label>
                  <Input
                    id="confidentiality"
                    value={editedMetadata.confidentiality}
                    onChange={(e) => handleMetadataChange("confidentiality", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Version */}
                <div className="space-y-2">
                    <Label htmlFor="version" className="text-slate-300">Version</Label>
                  <Input
                    id="version"
                    value={editedMetadata.version}
                    onChange={(e) => handleMetadataChange("version", e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
                
                <Button 
                  onClick={saveMetadataChanges}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all mt-4"
                >
                  Save Metadata
                </Button>
                
            {showSaveSuccess && (
                  <div className="mt-2 p-3 bg-emerald-900/20 border border-emerald-500/50 rounded-lg text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Metadata saved successfully!</span>
                </div>
                )}
              </div>
            </div>
        </div>
      </TabsContent>

      {/* Search & Filter Tab */}
      <TabsContent value="search">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search and Filter Controls */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-400" />
                <h3 className="font-medium text-slate-200">Search & Filter</h3>
              </div>
              
              <div className="p-5 space-y-5">
              {/* Search input */}
              <div className="space-y-2">
                  <Label htmlFor="search" className="text-slate-300">Search Text</Label>
                  <div className="relative">
                  <Input
                    id="search"
                      placeholder="Search documents and metadata..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      if (e.target.value === "" && hasSearched) {
                        handleSearch()
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch()
                      }
                    }}
                      className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 pl-9"
                  />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {/* Metadata filters */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                    <Filter className="h-4 w-4 text-emerald-400" />
                    <Label className="text-slate-300 font-medium">Metadata Filters</Label>
                  </div>

                {/* Department filter */}
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-400">Department</Label>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueValues("department").map((dept) => (
                      <Badge
                        key={dept}
                          className={`cursor-pointer transition-colors ${
                            activeFilters.department === dept
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                          }`}
                        onClick={() => toggleFilter("department", activeFilters.department === dept ? null : dept)}
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Confidentiality filter */}
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-400">Confidentiality</Label>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueValues("confidentiality").map((level) => (
                      <Badge
                        key={level}
                          className={`cursor-pointer transition-colors ${
                            activeFilters.confidentiality === level
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : level === "Confidential"
                              ? "bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-500/30"
                              : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                          }`}
                        onClick={() =>
                          toggleFilter("confidentiality", activeFilters.confidentiality === level ? null : level)
                        }
                      >
                        {level === "Confidential" && <Shield className="h-3 w-3 mr-1" />}
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                  {/* Date filter */}
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-400">Date (After)</Label>
                  <div className="flex flex-wrap gap-2">
                    {["2023-01-01", "2023-03-01"].map((dateStr) => (
                      <Badge
                        key={dateStr}
                          className={`cursor-pointer transition-colors ${
                            activeFilters.date === dateStr
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                          }`}
                        onClick={() => toggleFilter("date", activeFilters.date === dateStr ? null : dateStr)}
                      >
                        {dateStr}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation Controls */}
                <div className="space-y-3 pt-4 mt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <Label className="text-sm font-medium text-slate-300">Simulate Metadata Issues</Label>
                  </div>
                  
                  <div className="space-y-3 pl-2">
                    <div className="flex items-start space-x-2">
                    <Checkbox
                      id="missing-metadata"
                      checked={showMissingMetadata}
                      onCheckedChange={(checked) => setShowMissingMetadata(checked === true)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-1"
                    />
                      <Label htmlFor="missing-metadata" className="text-sm text-slate-300 cursor-pointer">
                      Missing confidentiality tags (security risk)
                    </Label>
                  </div>
                    
                    <div className="flex items-start space-x-2">
                    <Checkbox
                      id="inconsistent-metadata"
                      checked={showInconsistentMetadata}
                      onCheckedChange={(checked) => setShowInconsistentMetadata(checked === true)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-1"
                    />
                      <Label htmlFor="inconsistent-metadata" className="text-sm text-slate-300 cursor-pointer">
                      Inconsistent department naming
                    </Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-3">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
                  >
                    Reset Filters
                  </Button>
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

          {/* Search Results */}
            <div className="md:col-span-2 bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderSearch className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-medium text-slate-200">Search Results</h3>
                </div>
                {hasSearched && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                  </Badge>
                )}
              </div>
              
              <div className="p-5">
              {!hasSearched ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="bg-slate-700/30 rounded-full p-4 mb-4">
                      <Search className="h-10 w-10 text-slate-500" />
                    </div>
                    <h3 className="text-slate-300 font-medium mb-2">Ready to Search</h3>
                    <p className="text-slate-400 max-w-md">
                      Use the search and metadata filters to find relevant documents in your collection
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="bg-slate-700/30 rounded-full p-4 mb-4">
                      <AlertCircle className="h-10 w-10 text-slate-500" />
                    </div>
                    <h3 className="text-slate-300 font-medium mb-2">No Results Found</h3>
                    <p className="text-slate-400 max-w-md">
                      Try adjusting your search terms or filters to find matching documents
                    </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((doc) => (
                      <div key={doc.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                        <h3 className="font-medium text-slate-200 mb-1">{doc.title}</h3>
                        <p className="text-sm text-slate-400 mb-3">{doc.content}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(doc.metadata).map(([key, value]) => (
                            <Badge key={key} className="bg-slate-700 text-slate-300 hover:bg-slate-700 text-xs">
                            {key}: {value instanceof Date ? format(value, "yyyy-MM-dd") : value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Metadata Issues Warning */}
              {hasSearched && (showMissingMetadata || showInconsistentMetadata) && (
                  <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-300 mb-2">Metadata Issues Detected</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                        {showMissingMetadata && (
                            <li className="flex gap-2">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>
                                <strong className="text-amber-300">Missing confidentiality tags:</strong> Some confidential documents may not be
                            properly tagged, creating potential security risks.
                              </span>
                          </li>
                        )}
                        {showInconsistentMetadata && (
                            <li className="flex gap-2">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>
                                <strong className="text-amber-300">Inconsistent naming:</strong> The department "Human Resources" is sometimes tagged
                            as "HR", causing filtering inconsistencies.
                              </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
        </div>
      </TabsContent>
      </Tabs>

      {/* Best Practices */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-8">
        <h3 className="text-sm font-medium text-emerald-400 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Metadata Tagging Best Practices
        </h3>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg transition-all hover:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <h4 className="font-medium text-slate-200">Consistency is Key</h4>
            </div>
            <p className="text-sm text-slate-400">
                Use consistent naming conventions and controlled vocabularies for metadata fields. Standardize date
                formats, department names, and other common fields.
              </p>
            </div>
          
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg transition-all hover:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <h4 className="font-medium text-slate-200">Automate When Possible</h4>
            </div>
            <p className="text-sm text-slate-400">
                Use automated extraction for metadata when possible. Extract dates, authors, and categories from
                document properties or content to reduce manual tagging errors.
              </p>
            </div>
          
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg transition-all hover:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h4 className="font-medium text-slate-200">Prioritize Security Metadata</h4>
            </div>
            <p className="text-sm text-slate-400">
                Always include access control and confidentiality metadata. This is critical for preventing unauthorized
                access to sensitive information in RAG systems.
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}
