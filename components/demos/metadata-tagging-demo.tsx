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
import { CalendarIcon, Tag, Search, Filter, Shield, AlertCircle, CheckCircle2 } from "lucide-react"

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
    <Tabs defaultValue="tagging" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tagging">Metadata Tagging</TabsTrigger>
        <TabsTrigger value="search">Search & Filter</TabsTrigger>
      </TabsList>

      {/* Metadata Tagging Tab */}
      <TabsContent value="tagging">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Select a document to edit its metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 border rounded-md cursor-pointer ${selectedDocument.id === doc.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                    }`}
                  onClick={() => handleSelectDocument(doc)}
                >
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{doc.content}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(doc.metadata)
                      .slice(0, 3) // Show only first 3 metadata items
                      .map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value instanceof Date ? format(value, "yyyy-MM-dd") : value}
                        </Badge>
                      ))}
                    {Object.keys(doc.metadata).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{Object.keys(doc.metadata).length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Metadata Editor */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Edit Metadata
              </CardTitle>
              <CardDescription>Add or modify metadata for {selectedDocument.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source */}
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={editedMetadata.source}
                    onChange={(e) => handleMetadataChange("source", e.target.value)}
                  />
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={editedMetadata.author}
                    onChange={(e) => handleMetadataChange("author", e.target.value)}
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editedMetadata.category}
                    onChange={(e) => handleMetadataChange("category", e.target.value)}
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editedMetadata.department}
                    onChange={(e) => handleMetadataChange("department", e.target.value)}
                  />
                </div>

                {/* Confidentiality */}
                <div className="space-y-2">
                  <Label htmlFor="confidentiality">Confidentiality</Label>
                  <Input
                    id="confidentiality"
                    value={editedMetadata.confidentiality}
                    onChange={(e) => handleMetadataChange("confidentiality", e.target.value)}
                  />
                </div>

                {/* Version */}
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={editedMetadata.version}
                    onChange={(e) => handleMetadataChange("version", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveMetadataChanges}>Save Metadata</Button>
            </CardFooter>
            {/* Add this right after the CardFooter in the Metadata Editor card */}
            {showSaveSuccess && (
              <div className="px-6 pb-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-2 rounded-md text-sm flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Metadata saved successfully!
                </div>
              </div>
            )}
          </Card>
        </div>
      </TabsContent>

      {/* Search & Filter Tab */}
      <TabsContent value="search">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search and Filter Controls */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
              <CardDescription>Use metadata to narrow down results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search input */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Text</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Search in documents and metadata..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      if (e.target.value === "" && hasSearched) {
                        // If search is cleared, update results immediately
                        handleSearch()
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch()
                      }
                    }}
                  />
                </div>
              </div>

              {/* Metadata filters */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Metadata Filters
                </Label>

                {/* Department filter */}
                <div className="space-y-1">
                  <Label className="text-sm font-normal">Department</Label>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueValues("department").map((dept) => (
                      <Badge
                        key={dept}
                        variant={activeFilters.department === dept ? "default" : "outline"}
                        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => toggleFilter("department", activeFilters.department === dept ? null : dept)}
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Confidentiality filter */}
                <div className="space-y-1">
                  <Label className="text-sm font-normal">Confidentiality</Label>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueValues("confidentiality").map((level) => (
                      <Badge
                        key={level}
                        variant={activeFilters.confidentiality === level ? "default" : "outline"}
                        className={`cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${level === "Confidential" ? "border-red-300 text-red-600 dark:text-red-400" : ""
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

                {/* Date filter (simplified) */}
                <div className="space-y-1">
                  <Label className="text-sm font-normal">Date (After)</Label>
                  <div className="flex flex-wrap gap-2">
                    {["2023-01-01", "2023-03-01"].map((dateStr) => (
                      <Badge
                        key={dateStr}
                        variant={activeFilters.date === dateStr ? "default" : "outline"}
                        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => toggleFilter("date", activeFilters.date === dateStr ? null : dateStr)}
                      >
                        {dateStr}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="space-y-2 border-t pt-4 mt-4">
                <Label className="text-sm font-medium">Simulate Metadata Issues</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="missing-metadata"
                      checked={showMissingMetadata}
                      onCheckedChange={(checked) => setShowMissingMetadata(checked === true)}
                    />
                    <Label htmlFor="missing-metadata" className="text-sm font-normal cursor-pointer">
                      Missing confidentiality tags (security risk)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inconsistent-metadata"
                      checked={showInconsistentMetadata}
                      onCheckedChange={(checked) => setShowInconsistentMetadata(checked === true)}
                    />
                    <Label htmlFor="inconsistent-metadata" className="text-sm font-normal cursor-pointer">
                      Inconsistent department naming
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={handleSearch}>Search</Button>
            </CardFooter>
          </Card>

          {/* Search Results */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {hasSearched
                  ? `Found ${searchResults.length} document${searchResults.length !== 1 ? "s" : ""}`
                  : "Use the search and filters to find documents"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasSearched ? (
                <div className="flex flex-col items-center justify-center text-center p-6 h-64">
                  <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Use the search and metadata filters to find relevant documents
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-6 h-64">
                  <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-300">No documents match your search criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((doc) => (
                    <div key={doc.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-1">{doc.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{doc.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(doc.metadata).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
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
                <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Metadata Issues Detected</h4>
                      <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-200 space-y-1 list-disc pl-5">
                        {showMissingMetadata && (
                          <li>
                            <strong>Missing confidentiality tags:</strong> Some confidential documents may not be
                            properly tagged, creating potential security risks.
                          </li>
                        )}
                        {showInconsistentMetadata && (
                          <li>
                            <strong>Inconsistent naming:</strong> The department "Human Resources" is sometimes tagged
                            as "HR", causing filtering inconsistencies.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Best Practices Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Metadata Tagging Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Consistency is Key
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Use consistent naming conventions and controlled vocabularies for metadata fields. Standardize date
                formats, department names, and other common fields.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Automate When Possible
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Use automated extraction for metadata when possible. Extract dates, authors, and categories from
                document properties or content to reduce manual tagging errors.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Prioritize Security Metadata
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Always include access control and confidentiality metadata. This is critical for preventing unauthorized
                access to sensitive information in RAG systems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Tabs>
  )
}
