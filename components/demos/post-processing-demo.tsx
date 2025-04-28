"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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

  const handleOptionChange = (option: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [option]: !selectedOptions[option as keyof typeof selectedOptions],
    })
  }

  const processOutput = () => {
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
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="formatting" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="formatting">Formatting</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="enhancement">Enhancement</TabsTrigger>
        </TabsList>

        <TabsContent value="formatting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Formatting Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bulletPoints"
                      checked={selectedOptions.bulletPoints}
                      onCheckedChange={() => handleOptionChange("bulletPoints")}
                    />
                    <Label htmlFor="bulletPoints">Convert to bullet points</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="markdown"
                      checked={selectedOptions.markdown}
                      onCheckedChange={() => handleOptionChange("markdown")}
                    />
                    <Label htmlFor="markdown">Add markdown formatting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="jsonFormat"
                      checked={selectedOptions.jsonFormat}
                      onCheckedChange={() => handleOptionChange("jsonFormat")}
                    />
                    <Label htmlFor="jsonFormat">Convert to JSON structure</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Verification Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="factCheck"
                      checked={selectedOptions.factCheck}
                      onCheckedChange={() => handleOptionChange("factCheck")}
                    />
                    <Label htmlFor="factCheck">Fact-check against source</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addCitations"
                      checked={selectedOptions.addCitations}
                      onCheckedChange={() => handleOptionChange("addCitations")}
                    />
                    <Label htmlFor="addCitations">Add citations to source</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Source Document</h3>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-[200px]">{sourceDocument}</pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enhancement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Enhancement Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="contentFilter"
                      checked={selectedOptions.contentFilter}
                      onCheckedChange={() => handleOptionChange("contentFilter")}
                    />
                    <Label htmlFor="contentFilter">Apply content filtering</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="summarize"
                      checked={selectedOptions.summarize}
                      onCheckedChange={() => handleOptionChange("summarize")}
                    />
                    <Label htmlFor="summarize">Summarize content</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Raw LLM Output</h3>
            <div className="bg-gray-100 p-4 rounded min-h-[200px]">{rawOutput}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Processed Output</h3>
            <div className="bg-gray-100 p-4 rounded min-h-[200px] overflow-auto">
              {processedOutput ? (
                <pre className="whitespace-pre-wrap">{processedOutput}</pre>
              ) : (
                <p className="text-gray-500 italic">Select options and click "Process" to see the result</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Button onClick={processOutput} className="w-full">
          Process Output
        </Button>

        {processingNotes && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Processing Notes</h3>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="whitespace-pre-wrap text-sm">{processingNotes}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
