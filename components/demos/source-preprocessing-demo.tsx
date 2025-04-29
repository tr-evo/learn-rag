"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, FileJson, FileCode, FileSpreadsheetIcon as FileCsv, ArrowRight, FileType, File as FilePdf, Image, ScanLine } from "lucide-react"

export default function SourcePreprocessingDemo() {
  const [inputType, setInputType] = useState("text")
  const [inputText, setInputText] = useState("")
  const [processedText, setProcessedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const sampleInputs = {
    // Unstructured formats
    text: "This is a sample text document.\nIt has multiple lines.\n\nSome lines are duplicated.\nSome lines are duplicated.\n\nThere might be extra whitespace   and special characters like @#$%.",
    word: "Microsoft Word Document\n\nTitle: Project Proposal\n\nPrepared by: John Smith\nDate: April 15, 2023\n\n1. Executive Summary\nThis proposal outlines our approach to implementing a new customer management system...\n\n1.1 Background\nThe current system has been in place for over 5 years and lacks modern features...\n\n2. Project Scope\n• Database migration\n• User interface redesign\n• API integration\n\nTable 1: Project Timeline\nPhase | Start Date | End Date\nPlanning | May 1, 2023 | May 15, 2023\nDevelopment | May 16, 2023 | July 30, 2023\nTesting | Aug 1, 2023 | Aug 15, 2023\n\n[THIS IS FIGURE: Project organization chart showing team structure]\n\nFooter: CONFIDENTIAL - Internal Use Only",
    pdf: "PDF Document - Annual Report 2023\n\nCompany Overview\nFounded in 2010, our company has grown from a small startup to a market leader...\n\nFinancial Highlights\nRevenue: $24.5M (↑15% YoY)\nEBITDA: $5.2M (↑12% YoY)\nNet Profit: $3.8M (↑18% YoY)\n\n[THIS IS CHART: Bar graph showing quarterly revenue growth]\n\n[THIS IS TABLE: Five-year financial summary with multiple rows and columns]\n\nSection heading appears in the margin, while the main content flows in two columns with various font sizes and embedded images. Page numbers appear at the bottom of each page.\n\nAppendix A: Detailed Breakdown by Department\nAppendix B: Market Analysis\nAppendix C: Risk Factors\n\nPage 24 of 56",
    scanned: "**OCR-PROCESSED TEXT FROM SCANNED DOCUMENT**\n\nMEETING MINUTES\nProject: Alpha Systems Integration\nDate: March 10, 2023\nLocation: Conference Room B\n\nAttendees:\n- Sarah Johnson (Project Lead)\n- David Chen (Technical Lead)\n- Maria Gonzalez (Client Representative)\n- [?] Williams (unclear due to OCR error)\n\nAgenda Items Discussion:\n1. Project Timeline Review\n   Current Status: 73% compl'ete (OCR error: should be \"complete\")\n   Next milestone: API integration testing \n\n2. Budget Considerations\n   Approved: $1,250,00O (OCR error: mistook 0 for O)\n   Current spend: $780,450\n   Projected final: $1,1,95,000 (OCR error: extra comma)\n\n3. Risk Assessment\n   HIGH: Integration with legacy system\n   MEDIUM: Staff turnover\n   LDW: User adoption (OCR error: should be \"LOW\")\n\n[THIS APPEARS TO BE A SIGNATURE: John Smith]\n[THIS APPEARS TO BE A STAMP: CONFIDENTIAL]\n\n[OCR UNCERTAIN REGION: Several words in the footer are illegible due to coffee stain on original document]",
    image: "**OCR-PROCESSED TEXT FROM IMAGE**\n\nPRODUCT LABEL\n\nGREEN TEA EXTRACT\nDietary Supplement\n500mg | 60 Capsules\n\nDIRECTIONS: Take 1 capsule twice daily with meals.\n\nWARNING: Consult physician before use if pregnant or nursing.\n\nIngredients: Green tea leaf extract, Cellulose (vegetable capsule), Rice flour, Magnesium stearate.\n\nManufactured by: NaturaPure Inc.\n123 Wellness Way, Healing Springs, CA 90210\n\nBatch: GT-2023-0528\nExp: 05/2025\n\n[OCR DETECTED BARCODE: 8902957210364]\n\n[OCR CONFIDENCE LOW: Nutrition information table - values may be inaccurate]\n\nStore in a cool, dry place away from direct sunlight.\n\n[OCR FAILED TO DETECT SMALL PRINT AT BOTTOM OF LABEL]",
    
    // Structured formats
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

        case "word":
        case "pdf":
          // For Word and PDF, simulate extraction with layout challenges
          processed = inputText
            .split("\n")
            .filter((line) => line.trim().length > 0) // Remove empty lines
            .filter(line => !line.includes('[THIS IS')) // Remove figure/chart placeholders
            .filter(line => !line.includes('Page ')) // Remove page numbers
            .map(line => {
              // Clean up formatting artifacts
              return line
                .replace(/^[•\-–—]\s+/g, '- ') // Standardize bullet points
                .replace(/Table \d+:/, '') // Remove table references
                .replace(/Section \d+\.\d+:?/, '') // Remove section numbering
            })
            .join("\n")
          
          // Add note about potential extraction issues
          processed += "\n\n[Note: Layout elements like headers, footers, tables, and multi-column text may have affected extraction quality]"
          break

        case "scanned":
        case "image":
          // For OCR-processed content, simulate additional OCR-specific cleaning
          processed = inputText
            .split("\n")
            .filter((line) => line.trim().length > 0) // Remove empty lines
            .filter(line => !line.startsWith('**OCR')) // Remove OCR headers
            .filter(line => !line.includes('[THIS APPEARS TO BE')) // Remove OCR annotations
            .filter(line => !line.includes('[OCR ')) // Remove OCR confidence indicators
            .map(line => {
              // Clean up OCR artifacts and errors
              return line
                .replace(/\[\?\]/g, '') // Remove [?] uncertainty markers
                .replace(/\b(\w+)'(\w+)\b/g, '$1$2') // Fix common OCR errors with apostrophes
                .replace(/(\d),(\d),(\d)/g, '$1$2$3') // Fix comma errors in numbers
                .replace(/O/g, (match, offset, string) => {
                  // Replace O with 0 only in what appears to be numbers
                  const isInNumber = /\d[O]\d/.test(string.substring(Math.max(0, offset - 1), Math.min(string.length, offset + 2)));
                  return isInNumber ? '0' : 'O';
                })
            })
            .join("\n")
          
          // Add note about OCR limitations
          processed += "\n\n[Note: This text was extracted using OCR technology. Some content may be inaccurate or missing due to recognition errors, image quality issues, or complex formatting.]"
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
      case "word":
        return <FileType className="h-5 w-5" />
      case "pdf":
        return <FilePdf className="h-5 w-5" />
      case "scanned":
        return <ScanLine className="h-5 w-5" />
      case "image":
        return <Image className="h-5 w-5" />
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
        
        {/* Unstructured formats */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="h-1 w-2 bg-amber-500 rounded mr-2"></div>
            <h3 className="text-sm font-medium text-amber-500/90">Unstructured Formats</h3>
            <div className="ml-3 text-xs text-amber-500/70 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Complex layouts, harder to process
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
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
              onClick={() => handleInputTypeChange("word")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                inputType === "word"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
              }`}
            >
              <FileType className="h-6 w-6 mb-2" />
              <span>Word Document</span>
            </button>
            
            <button
              onClick={() => handleInputTypeChange("pdf")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                inputType === "pdf"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
              }`}
            >
              <FilePdf className="h-6 w-6 mb-2" />
              <span>PDF Document</span>
            </button>
            
            <button
              onClick={() => handleInputTypeChange("scanned")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                inputType === "scanned"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
              }`}
            >
              <ScanLine className="h-6 w-6 mb-2" />
              <span>Scanned Doc</span>
              <span className="mt-1 text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
                OCR Needed
              </span>
            </button>
            
            <button
              onClick={() => handleInputTypeChange("image")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                inputType === "image"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-600 bg-slate-800/50 text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
              }`}
            >
              <Image className="h-6 w-6 mb-2" />
              <span>Image</span>
              <span className="mt-1 text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
                OCR Needed
              </span>
            </button>
          </div>
        </div>
        
        {/* Structured formats */}
        <div>
          <div className="flex items-center mb-2">
            <div className="h-1 w-2 bg-blue-500 rounded mr-2"></div>
            <h3 className="text-sm font-medium text-blue-500/90">Structured Formats</h3>
            <div className="ml-3 text-xs text-blue-500/70 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              Well-defined structure, easier to process
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              {(inputType === "scanned" || inputType === "image") && 
                <span className="ml-1 text-amber-400">+ OCR</span>
              }
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
                  ? `✓ Successfully processed ${inputType.toUpperCase()}${(inputType === "scanned" || inputType === "image") ? " with OCR" : ""} into clean, deduplicated text`
                  : 'Click the arrow button to process the input'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Information panel about what's happening */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-medium text-emerald-400 mb-2">What's happening?</h3>
        <p className="text-sm text-slate-400 mb-3">
          This demo shows how raw source data is preprocessed for a RAG system. Unstructured formats like Word and PDF are challenging due to their complex layouts. Images and scanned documents are not machine-readable and require Optical Character Recognition (OCR) as a preliminary step, which can introduce errors and uncertainty. The preprocessing removes duplicates, cleans up formatting, and extracts relevant text - making the content ready for chunking and embedding.
        </p>
        
        <h4 className="text-sm font-medium text-amber-400 mb-2">Common Preprocessing Challenges:</h4>
        <ul className="text-sm text-slate-400 space-y-2">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Non-machine readable content:</strong> Images, scanned documents, and handwritten notes require OCR, which can misinterpret characters (confusing "0" with "O"), miss content entirely, or introduce artifacts.</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Complex layouts:</strong> Multi-column text, tables, sidebars, and footnotes in PDFs and Word documents often get scrambled during extraction, losing the logical reading order.</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Embedded non-text elements:</strong> Charts, diagrams, and images with important information may be completely lost or replaced with placeholder text.</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Headers and footers:</strong> Repeated page numbers, document titles, and section headers can create noise in the extracted text if not properly cleaned.</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Formatting artifacts:</strong> Special characters, unusual whitespace, and formatting codes can appear in the extracted text, requiring specialized cleaning.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
