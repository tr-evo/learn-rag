"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, FileJson, FileCode, FileSpreadsheetIcon as FileCsv } from "lucide-react"

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
            .replace(/<head>.*?<\/head>/s, "") // Remove head section
            .replace(/<style>.*?<\/style>/s, "") // Remove style sections
            .replace(/<script>.*?<\/script>/s, "") // Remove script sections
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getInputIcon()}
            Input Source
          </CardTitle>
          <CardDescription>Select a source type and enter or modify the content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={inputType} onValueChange={handleInputTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Plain Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder={`Enter ${inputType} content here...`}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={processText} disabled={!inputText.trim() || isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Process Source"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Processed Output
          </CardTitle>
          <CardDescription>Clean, deduplicated text ready for embedding</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={processedText}
            readOnly
            className="min-h-[300px] font-mono text-sm"
            placeholder="Processed text will appear here..."
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {processedText
              ? `Successfully processed ${inputType.toUpperCase()} content into clean text.`
              : 'Click "Process Source" to convert the input to clean text.'}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
