"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Check,
  Code,
  FileText,
  FolderUp,
  Filter,
  ListChecks,
  Sparkles,
  RefreshCw,
  Info
} from "lucide-react"

// Sample raw LLM output
const rawOutput = `Our company's refund policy allows customers to request a refund within 30 days of purchase. The product must be in its original condition and packaging. Refunds are processed within 5-7 business days after we receive the returned item. Digital products cannot be refunded once the download link has been accessed. For subscription services, you can cancel anytime but we don't provide prorated refunds for the remaining period.`

// Sample source document for fact-checking
const sourceDocument = `
# Refund Policy

## Physical Products
- Customers can request a refund within 30 days of purchase
- Product must be in original condition and packaging
- Refunds are processed within 5-7 business days after return receipt

## Digital Products
- No refunds once download link has been accessed
- Technical support available for 90 days

## Subscriptions
- Cancel anytime
- No prorated refunds for remaining period
- Annual subscribers receive priority support
`

export default function PostProcessingDemo() {
  const [activeTab, setActiveTab] = useState("formatting")
  const [selectedOptions, setSelectedOptions] = useState({
    bulletPoints: false,
    markdown: false,
    jsonFormat: false,
    factCheck: false,
    addCitations: false,
    contentFilter: false,
    summarize: false,
  })

  const [processedOutput, setProcessedOutput] = useState("")
  const [processingNotes, setProcessingNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [totalSelectedOptions, setTotalSelectedOptions] = useState(0)

  useEffect(() => {
    // Count selected options
    const count = Object.values(selectedOptions).filter(Boolean).length
    setTotalSelectedOptions(count)
  }, [selectedOptions])

  const handleOptionChange = (option: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [option]: !selectedOptions[option as keyof typeof selectedOptions],
    })
  }

  const processOutput = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      let output = rawOutput
      const notes = []

      // Apply formatting
      if (selectedOptions.bulletPoints) {
        const sentences = output.split(". ").filter((s) => s.trim())
        output = sentences.map((s) => `• ${s.trim()}${!s.endsWith(".") ? "." : ""}`).join("\n\n")
        notes.push("Converted to bullet points")
      }

      if (selectedOptions.markdown) {
        // Add markdown formatting
        output = output.replace(/refund policy/gi, "**refund policy**")
        output = output.replace(/30 days/gi, "**30 days**")
        output = output.replace(/5-7 business days/gi, "**5-7 business days**")
        notes.push("Added markdown emphasis to key terms")
      }

      if (selectedOptions.jsonFormat) {
        // Convert to JSON format
        const jsonOutput = {
          policy: {
            physical_products: {
              refund_window: "30 days",
              conditions: ["original condition", "original packaging"],
              processing_time: "5-7 business days",
            },
            digital_products: {
              refundable: false,
              condition: "download link accessed",
            },
            subscriptions: {
              cancellation: "anytime",
              prorated_refunds: false,
            },
          },
        }
        output = JSON.stringify(jsonOutput, null, 2)
        notes.push("Converted to structured JSON format")
      }

      // Apply fact-checking
      if (selectedOptions.factCheck) {
        // Simulate fact-checking against source document
        const facts = [
          { statement: "refund within 30 days", inSource: true },
          { statement: "original condition and packaging", inSource: true },
          { statement: "5-7 business days", inSource: true },
          { statement: "Digital products cannot be refunded", inSource: true },
          { statement: "No prorated refunds", inSource: true },
          // Missing fact from source
          { statement: "Annual subscribers receive priority support", inSource: false, missing: true },
        ]

        const factCheckResults = facts
          .map((fact) => {
            if (fact.missing) {
              return `❌ Missing information: "${fact.statement}"`
            }
            return fact.inSource ? `✅ Verified: "${fact.statement}"` : `❌ Not verified: "${fact.statement}"`
          })
          .join("\n")

        notes.push("Fact-checking results:\n" + factCheckResults)

        // Add missing information
        if (!output.includes("priority support")) {
          output += "\n\nAdditional information: Annual subscribers receive priority support."
        }
      }

      // Add citations
      if (selectedOptions.addCitations) {
        output = output.replace(/30 days of purchase/g, "30 days of purchase [Refund Policy, Section: Physical Products]")
        output = output.replace(/5-7 business days/g, "5-7 business days [Refund Policy, Section: Physical Products]")
        output = output.replace(
          /Digital products cannot be refunded/g,
          "Digital products cannot be refunded [Refund Policy, Section: Digital Products]",
        )
        output = output.replace(/cancel anytime/g, "cancel anytime [Refund Policy, Section: Subscriptions]")
        output = output.replace(
          /don't provide prorated refunds/g,
          "don't provide prorated refunds [Refund Policy, Section: Subscriptions]",
        )

        notes.push("Added citations to source document sections")
      }

      // Apply content filtering
      if (selectedOptions.contentFilter) {
        // Simulate content filtering (e.g., removing negative language, ensuring compliance)
        if (output.includes("don't provide")) {
          output = output.replace("don't provide", "do not provide")
          notes.push("Modified negative language for clarity")
        }

        // Add compliance disclaimer
        output +=
          "\n\nNote: This refund policy complies with consumer protection regulations in most jurisdictions. For specific regional policies, please contact customer support."
        notes.push("Added compliance disclaimer")
      }

      // Apply summarization
      if (selectedOptions.summarize) {
        output =
          "Summary: Physical products can be refunded within 30 days if in original condition. Digital products are non-refundable once downloaded. Subscriptions can be canceled anytime without prorated refunds. Annual subscribers get priority support."
        notes.push("Summarized the full policy into a concise overview")
      }

      setProcessedOutput(output)
      setProcessingNotes(notes.join("\n\n"))
      setIsProcessing(false)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="formatting" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 bg-slate-900/50 p-1 rounded-lg">
          <TabsTrigger value="formatting" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 transition-all">
            <Code className="w-4 h-4 mr-2" />
            Formatting
          </TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 transition-all">
            <Check className="w-4 h-4 mr-2" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="enhancement" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            Enhancement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formatting" className="space-y-4 animate-in fade-in-50 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600 hover:shadow-emerald-500/10">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-white" />
                  Formatting Options
                </h3>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bulletPoints"
                    checked={selectedOptions.bulletPoints}
                    onCheckedChange={() => handleOptionChange("bulletPoints")}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors border-white"
                  />
                  <Label htmlFor="bulletPoints" className="text-slate-300">Convert to bullet points</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="markdown"
                    checked={selectedOptions.markdown}
                    onCheckedChange={() => handleOptionChange("markdown")}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors border-white"
                  />
                  <Label htmlFor="markdown" className="text-slate-300">Add markdown formatting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="jsonFormat"
                    checked={selectedOptions.jsonFormat}
                    onCheckedChange={() => handleOptionChange("jsonFormat")}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors border-white"
                  />
                  <Label htmlFor="jsonFormat" className="text-slate-300">Convert to JSON structure</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4 animate-in fade-in-50 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600 hover:shadow-emerald-500/10">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  Verification Options
                </h3>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factCheck"
                    checked={selectedOptions.factCheck}
                    onCheckedChange={() => handleOptionChange("factCheck")}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                  />
                  <Label htmlFor="factCheck" className="text-slate-300">Fact-check against source</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="addCitations"
                    checked={selectedOptions.addCitations}
                    onCheckedChange={() => handleOptionChange("addCitations")}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                  />
                  <Label htmlFor="addCitations" className="text-slate-300">Add citations to source</Label>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600 hover:shadow-emerald-500/10">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Source Document
                </h3>
              </div>
              <div className="p-6">
                <pre className="text-xs bg-slate-900/50 p-3 rounded overflow-auto max-h-[200px] text-slate-300 border border-slate-700">{sourceDocument}</pre>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="enhancement" className="space-y-4 animate-in fade-in-50 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600 hover:shadow-emerald-500/10">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Enhancement Options
                </h3>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contentFilter"
                    checked={selectedOptions.contentFilter}
                    onCheckedChange={() => handleOptionChange("contentFilter")}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                  />
                  <Label htmlFor="contentFilter" className="text-slate-300">Apply content filtering</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="summarize"
                    checked={selectedOptions.summarize}
                    onCheckedChange={() => handleOptionChange("summarize")}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                  />
                  <Label htmlFor="summarize" className="text-slate-300">Summarize content</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600 hover:shadow-emerald-500/10">
          <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
              <FolderUp className="w-5 h-5 text-emerald-400" />
              Raw LLM Output
            </h3>
          </div>
          <div className="p-6">
            <div className="bg-slate-900/50 p-4 rounded min-h-[200px] text-slate-300 border border-slate-700">{rawOutput}</div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600 hover:shadow-emerald-500/10">
          <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              Processed Output
            </h3>
            {processedOutput && (
              <span className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300 text-xs px-2 py-1 rounded-full">
                Processed
              </span>
            )}
          </div>
          <div className="p-6">
            <div className="bg-slate-900/50 p-4 rounded min-h-[200px] overflow-auto border border-slate-700 transition-all">
              {isProcessing ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                  <span className="ml-2 text-slate-300">Processing...</span>
                </div>
              ) : processedOutput ? (
                <pre className="whitespace-pre-wrap text-slate-300">{processedOutput}</pre>
              ) : (
                <p className="text-slate-400 italic">Select options and click "Process" to see the result</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={processOutput}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          disabled={isProcessing || totalSelectedOptions === 0}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Process Output {totalSelectedOptions > 0 && `(${totalSelectedOptions} options)`}
            </>
          )}
        </Button>

        {!processedOutput && !isProcessing && totalSelectedOptions === 0 && (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-2 flex items-start gap-3 animate-in fade-in-50 duration-300">
            <Info className="text-emerald-400 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-slate-400 text-sm">Select options from the tabs above and click "Process" to transform the raw LLM output according to your specifications.</p>
          </div>
        )}

        {processingNotes && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600 hover:shadow-emerald-500/10 animate-in fade-in-50 duration-300">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-400" />
                Processing Notes
              </h3>
              <span className="bg-amber-900/20 border border-amber-500/30 text-amber-300 text-xs px-2 py-1 rounded-full">
                {processingNotes.split('\n\n').length} changes
              </span>
            </div>
            <div className="p-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                <pre className="whitespace-pre-wrap text-sm text-slate-300">{processingNotes}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
