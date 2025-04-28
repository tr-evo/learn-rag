"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, FileJson, FileCode, FileSpreadsheetIcon as FileCsv, ArrowRight } from "lucide-react"

export default function SourcePreprocessingDemo() {
  const [inputType, setInputType] = useState("text")
  const [inputText, setInputText] = useState("")
  const [processedText, setProcessedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const sampleInputs = {
    text: "This is a sample text document.\nIt has multiple lines.\n\nSome lines are duplicated.\nSome lines are duplicated.\n\nThere might be extra whitespace   and special characters like @#$%.",
    json: '{\n  "title": "Sample Document",\n  "content": "This is the main content.",\n  "metadata": {\n    "author": "John Doe",\n    "date": "2023-04-15",\n    "tags": ["sample", "document", "json"]\n  },\n  "sections": [\n    {\n      "heading": "Introduction",\n      "content": "This is the introduction section."\n    },\n    {\n      "heading": "Conclusion",\n      "content": "This is the conclusion section."\n    }\n  ]\n}',
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Sample HTML Document</title>\n</head>\n<body>\n  <h1>Sample Heading</h1>\n  <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>\n  <ul>\n    <li>List item 1</li>\n    <li>List item 2</li>\n    <li>List item 3</li>\n  </ul>\n  <div class="footer">\n    <p>Footer content</p>\n  </div>\n</body>\n</html>',
    csv: "Name,Age,Email,Country\nJohn Doe,30,john@example.com,USA\nJane Smith,25,jane@example.com,Canada\nMike Johnson,35,mike@example.com,UK\nSarah Williams,28,sarah@example.com,Australia",
  }

  const handleInputTypeChange = (value: string) => {
    setInputType(value)
    setInputText(sampleInputs[value as keyof typeof sampleInputs])
    setProcessedText("")
  }

  const processText = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      let processed = ""

      switch (inputType) {
        case "text":
          // Remove duplicated lines and extra whitespace
          processed = inputText
            .split("\n")
            .filter((line, index, self) => self.indexOf(line) === index) // Remove duplicates
            .map((line) => line.trim()) // Trim whitespace
            .filter((line) => line.length > 0) // Remove empty lines
            .join("\n")
          break

        case "json":
          try {
            // Parse JSON and extract text content
            const jsonData = JSON.parse(inputText)
            processed = JSON.stringify(jsonData, null, 2)

            // Extract text from JSON
            const extractedText = []
            if (jsonData.title) extractedText.push(jsonData.title)
            if (jsonData.content) extractedText.push(jsonData.content)

            // Extract from nested structures
            if (jsonData.metadata) {
              Object.values(jsonData.metadata).forEach((value) => {
                if (typeof value === "string") extractedText.push(value)
              })
            }

            if (jsonData.sections) {
              jsonData.sections.forEach((section: any) => {
                if (section.heading) extractedText.push(section.heading)
                if (section.content) extractedText.push(section.content)
              })
            }

            processed = extractedText.join("\n")
          } catch (e) {
            processed = "Error: Invalid JSON format"
          }
          break

        case "html":
          // Simple HTML to text conversion
          processed = inputText
            .replace(/<head>[\s\S]*?<\/head>/, "") // Remove head section
            .replace(/<style>[\s\S]*?<\/style>/, "") // Remove style sections
            .replace(/<script>[\s\S]*?<\/script>/, "") // Remove script sections
            .replace(/<[^>]*>/g, "\n") // Replace HTML tags with newlines
            .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
            .replace(/&lt;/g, "<") // Replace &lt; with <
            .replace(/&gt;/g, ">") // Replace &gt; with >
            .replace(/&amp;/g, "&") // Replace &amp; with &
            .split("\n")
            .map((line) => line.trim()) // Trim whitespace
            .filter((line) => line.length > 0) // Remove empty lines
            .join("\n")
          break

        case "csv":
          // Convert CSV to structured text
          const lines = inputText.split("\n")
          const headers = lines[0].split(",")
          const rows = lines.slice(1)

          processed = rows
            .map((row) => {
              const values = row.split(",")
              return headers.map((header, i) => `${header}: ${values[i]}`).join("\n")
            })
            .join("\n\n")
          break
      }

      setProcessedText(processed)
      setIsProcessing(false)
    }, 1000)
  }

  const getInputIcon = () => {
    switch (inputType) {
      case "text":
        return <FileText className="h-5 w-5" />
      case "json":
        return <FileJson className="h-5 w-5" />
      case "html":
        return <FileCode className="h-5 w-5" />
      case "csv":
        return <FileCsv className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Type selector with improved styling */}
      <div className="bg-slate-700/30 p-4 rounded-lg mb-4">
        <div className="text-lg font-medium text-slate-200 mb-3">Select Source Format</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleInputTypeChange("text")}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
              inputType === "text"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
            }`}
          >
            <FileText className="h-6 w-6 mb-2" />
            <span>Plain Text</span>
          </button>
          
          <button
            onClick={() => handleInputTypeChange("json")}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
              inputType === "json"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
            }`}
          >
            <FileJson className="h-6 w-6 mb-2" />
            <span>JSON</span>
          </button>
          
          <button
            onClick={() => handleInputTypeChange("html")}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
              inputType === "html"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
            }`}
          >
            <FileCode className="h-6 w-6 mb-2" />
            <span>HTML</span>
          </button>
          
          <button
            onClick={() => handleInputTypeChange("csv")}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
              inputType === "csv"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
            }`}
          >
            <FileCsv className="h-6 w-6 mb-2" />
            <span>CSV</span>
          </button>
        </div>
      </div>
      
      {/* Input and Output panels with processing flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 bg-slate-700/50 flex items-center justify-between">
            <div className="flex items-center">
              {getInputIcon()}
              <span className="ml-2 font-medium text-slate-200">Source Input</span>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-slate-600 text-slate-300">
              {inputType.toUpperCase()}
            </div>
          </div>
          
          <div className="p-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[280px] font-mono text-sm bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
              placeholder={`Enter ${inputType} content here...`}
            />
          </div>
        </div>
        
        <div className="relative flex flex-col">
          {/* Processing button in the middle on mobile, to the left on desktop */}
          <div className="absolute left-1/2 md:left-0 top-1/2 -translate-x-1/2 md:-translate-x-[20px] -translate-y-1/2 z-10">
            <button
              onClick={processText}
              disabled={!inputText.trim() || isProcessing}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110"
            >
              {isProcessing ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden h-full">
            <div className="px-4 py-3 bg-slate-700/50 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-emerald-400" />
                <span className="ml-2 font-medium text-slate-200">Processed Output</span>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                CLEAN TEXT
              </div>
            </div>
            
            <div className="p-4">
              <Textarea
                value={processedText}
                readOnly
                className="min-h-[280px] font-mono text-sm bg-slate-900/50 border-slate-700 text-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                placeholder="Processed text will appear here..."
              />
            </div>
            
            <div className="px-4 py-3 bg-slate-800 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                {processedText
                  ? `✓ Successfully processed ${inputType.toUpperCase()} into clean, deduplicated text`
                  : 'Click the arrow button to process the input'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Information panel about what's happening */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-medium text-emerald-400 mb-2">What's happening?</h3>
        <p className="text-sm text-slate-400">
          This demo shows how raw source data is preprocessed for a RAG system. The process removes duplicates, cleans up formatting, and extracts relevant text from structured formats - making the content ready for chunking and embedding.
        </p>
      </div>
    </div>
  )
}
