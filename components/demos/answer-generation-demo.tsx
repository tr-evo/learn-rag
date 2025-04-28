"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, MessageSquare, AlertTriangle, Info, Sparkles } from "lucide-react"

// Sample contexts for different scenarios
const sampleContexts = {
  complete: {
    title: "Complete Context",
    content: `Refund Policy (Updated June 2023):

1. Standard Returns: Customers may return undamaged products within 30 days of purchase for a full refund.

2. Digital Products: Digital downloads and software licenses are non-refundable once the product key has been provided or the content has been downloaded.

3. Damaged Items: Products damaged during shipping must be reported within 7 days of delivery with photographic evidence to qualify for a replacement or refund.

4. Refund Processing: Refunds are processed within 5-7 business days after the returned item is received and inspected. The refund will be issued to the original payment method.

5. Restocking Fee: A 15% restocking fee may apply to returns of specialized equipment or custom orders.

6. Exceptions: Sale items marked "Final Sale" cannot be returned unless defective.

For questions about our refund policy, please contact customer support at support@example.com.`,
    source: "Company Policy Document, Section 4.2",
  },
  partial: {
    title: "Partial Context",
    content: `Excerpt from Customer FAQ:

Q: How long does it take to process refunds?
A: Refunds are typically processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to your original payment method.

Q: Can I return digital products?
A: Unfortunately, digital downloads and software licenses are non-refundable once the product key has been provided or the content has been downloaded.`,
    source: "Customer FAQ Page",
  },
  outdated: {
    title: "Outdated Context",
    content: `Refund Policy (January 2022):

- All products may be returned within 14 days of purchase for a full refund.
- A 10% restocking fee applies to all returns.
- Digital products cannot be returned.
- Refunds are processed within 10-14 business days.`,
    source: "Archived Policy Document",
  },
  contradictory: {
    title: "Contradictory Context",
    content: `From Policy Document:
"Customers may return undamaged products within 30 days of purchase for a full refund."

From Recent Email to Staff (June 2023):
"Please note that effective immediately, our return window has been extended to 45 days to better compete with other retailers. Update the website accordingly."

From Customer Service Training (May 2023):
"Remember that special order items have a shorter return window of only 14 days."`,
    source: "Multiple Company Documents",
  },
  irrelevant: {
    title: "Irrelevant Context",
    content: `Shipping Information:

Standard shipping takes 3-5 business days within the continental United States.
Express shipping (1-2 business days) is available for an additional fee.
International shipping times vary by destination.
Free shipping is available on orders over $75.

Product Care Instructions:
To maintain product quality, store in a cool, dry place away from direct sunlight.
Clean with a soft, damp cloth. Do not use harsh chemicals.`,
    source: "Website Help Section",
  },
}

// Sample prompting techniques
const promptingTechniques = {
  basic: {
    name: "Basic Prompting",
    description: "Simple instruction to answer based on context",
    template:
      "Answer the following question based on the provided context.\n\nContext: {context}\n\nQuestion: {question}",
  },
  cot: {
    name: "Chain-of-Thought",
    description: "Encourages step-by-step reasoning",
    template:
      "Answer the following question based on the provided context. Think through the answer step by step.\n\nContext: {context}\n\nQuestion: {question}\n\nLet's think through this step by step:",
  },
  rag: {
    name: "RAG-specific",
    description: "Specialized for retrieval-augmented generation",
    template:
      "You are an assistant that answers questions based ONLY on the provided context. If the context doesn't contain the answer, say 'I don't have enough information to answer this question.'\n\nContext: {context}\n\nQuestion: {question}\n\nAnswer:",
  },
  structured: {
    name: "Structured Output",
    description: "Requests answer in a specific format",
    template:
      "Answer the following question based on the provided context. Format your answer as follows:\n- Summary: A brief 1-2 sentence answer\n- Details: More comprehensive information\n- Source: Mention where this information comes from\n\nContext: {context}\n\nQuestion: {question}",
  },
}

// Sample LLM behaviors/settings
const llmBehaviors = {
  ideal: {
    name: "Ideal Behavior",
    description: "Correctly uses context, admits uncertainty when appropriate",
  },
  hallucinating: {
    name: "Hallucinating",
    description: "Makes up information not in the context",
  },
  ignoring: {
    name: "Ignoring Context",
    description: "Relies on prior knowledge instead of context",
  },
  verbose: {
    name: "Overly Verbose",
    description: "Provides unnecessarily detailed responses",
  },
  misinterpreting: {
    name: "Misinterpreting",
    description: "Misunderstands or misrepresents the context",
  },
}

// Pre-generated answers for different combinations
const generateAnswer = (
  context: keyof typeof sampleContexts,
  technique: keyof typeof promptingTechniques,
  behavior: keyof typeof llmBehaviors,
  question: string,
): { text: string; issues: string[] } => {
  // This would normally be an API call to an LLM
  // For demo purposes, we'll use pre-written responses

  // Default response
  let answer = {
    text: "I don't have a pre-generated answer for this specific combination.",
    issues: [],
  }

  // Refund policy question answers
  if (question.toLowerCase().includes("refund") || question.toLowerCase().includes("return")) {
    if (context === "complete") {
      if (behavior === "ideal") {
        if (technique === "basic") {
          answer = {
            text: "According to the company's refund policy, customers may return undamaged products within 30 days of purchase for a full refund. Digital products are non-refundable once the product key has been provided or the content has been downloaded. Refunds are processed within 5-7 business days after the returned item is received and inspected, and the refund will be issued to the original payment method.",
            issues: [],
          }
        } else if (technique === "cot") {
          answer = {
            text: "Let me analyze the refund policy information in the context:\n\n1. First, I see that standard returns allow for undamaged products to be returned within 30 days of purchase for a full refund.\n2. There's a special case for digital products - they cannot be refunded once the product key is provided or content is downloaded.\n3. For processing time, the policy states refunds are processed within 5-7 business days after the item is received and inspected.\n4. The refund goes back to the original payment method.\n5. There are some exceptions like a 15% restocking fee for specialized equipment and no returns on items marked \"Final Sale\".\n\nBased on this analysis, the company's refund policy allows customers to return undamaged products within 30 days for a full refund, with processing taking 5-7 business days. Digital products are non-refundable once accessed, and some special cases have additional restrictions.",
            issues: [],
          }
        } else if (technique === "rag") {
          answer = {
            text: 'Based on the provided context, the company\'s refund policy allows customers to return undamaged products within 30 days of purchase for a full refund. Digital products (downloads and software licenses) are non-refundable once the product key has been provided or content downloaded. Refunds are processed within 5-7 business days after the returned item is received and inspected, with the refund issued to the original payment method. A 15% restocking fee may apply to specialized equipment or custom orders. Items marked "Final Sale" cannot be returned unless defective.',
            issues: [],
          }
        } else if (technique === "structured") {
          answer = {
            text: '- Summary: Customers can return undamaged products within 30 days for a full refund, with processing taking 5-7 business days.\n\n- Details: Standard returns allow for undamaged products to be returned within 30 days. Digital products are non-refundable once accessed. Damaged items during shipping must be reported within 7 days with photo evidence. Refunds go back to the original payment method within 5-7 business days after inspection. A 15% restocking fee may apply to specialized equipment or custom orders. Items marked "Final Sale" cannot be returned unless defective.\n\n- Source: Company Policy Document, Section 4.2 (Updated June 2023)',
            issues: [],
          }
        }
      } else if (behavior === "hallucinating") {
        answer = {
          text: "According to the company's refund policy, customers can return products within 30 days for a full refund. If you're not completely satisfied with your purchase, we also offer a 90-day satisfaction guarantee where you can exchange the product for store credit even without the original packaging. For premium members, we provide instant refunds without requiring the item to be returned first. Our customer service team is available 24/7 to process refund requests over the phone or via our mobile app.",
          issues: [
            "Hallucinated 90-day satisfaction guarantee",
            "Fabricated premium member instant refunds",
            "Made up 24/7 customer service",
          ],
        }
      } else if (behavior === "ignoring") {
        answer = {
          text: "Most companies typically allow returns within 14-30 days of purchase. You should check the receipt or the company's website for their specific policy. Generally, you'll need the original packaging and proof of purchase. Some retailers charge restocking fees, especially for electronics. Online purchases often have different return procedures than in-store purchases. I recommend contacting the company's customer service for their exact policy.",
          issues: [
            "Ignored specific context information",
            "Provided generic information instead of using available context",
          ],
        }
      } else if (behavior === "verbose") {
        answer = {
          text: "I'd be delighted to elaborate on the company's comprehensive refund policy as detailed in the provided documentation. The policy, which was thoughtfully updated in June 2023 to better serve customer needs, establishes a generous framework for product returns and customer satisfaction assurance. According to Section 4.2 of the Company Policy Document, customers are extended the opportunity to return any products that remain in undamaged condition within a 30-day timeframe calculated from the original date of purchase, at which point they become eligible for a complete refund of the purchase amount. It's worth noting that this policy represents an industry-standard approach to consumer protection and satisfaction guarantee mechanisms. However, there are certain nuanced exceptions to be aware of. Digital products, which by their nature involve intellectual property considerations, fall under a different category of the refund policy framework. Specifically, any digital downloads or software licenses that have already been activated through the provision of a product key or have been downloaded to a customer's device are categorically non-refundable, which is a standard practice across the digital retail landscape due to the impossibility of truly 'returning' accessed digital content. In cases where products arrive in a damaged condition due to shipping mishandling, customers must adhere to a more expedited reporting timeline of 7 days from the delivery date, accompanied by photographic documentation that substantiates the damage claim, in order to qualify for either a replacement product or a refund of the purchase price. Regarding the administrative aspects of the refund process, the company has established a processing timeline of approximately 5-7 business days, which commences after the returned merchandise has been received at the company's facilities and has undergone a thorough inspection process to verify its condition. Upon successful processing, the refund amount will be directed back to the original payment method that was utilized during the initial transaction, whether that be a credit card, debit card, or alternative payment platform. For certain specialized product categories, particularly those involving specialized equipment or custom-ordered merchandise that may be difficult to resell, the company reserves the right to apply a 15% restocking fee to the refund amount, which helps offset the costs associated with reintegrating these items into inventory. Finally, it's important to highlight that certain merchandise categorized and explicitly marked as \"Final Sale\" items are exempt from the standard return policy and cannot be returned under normal circumstances, with the sole exception being cases where the item is demonstrably defective in its manufacture or function. For any additional inquiries or clarifications regarding the nuances of the refund policy, customers are encouraged to initiate contact with the customer support department via the dedicated email address: support@example.com.",
          issues: ["Unnecessarily verbose and repetitive", "Added excessive detail not needed to answer the question"],
        }
      } else if (behavior === "misinterpreting") {
        answer = {
          text: "Based on the refund policy, customers have 30 days to request a refund, but they must return the product within 7 days of making the request. All refunds include a mandatory 15% processing fee, regardless of the product type. Digital products can be refunded within 30 days as long as you haven't used the product for more than 24 hours. The company will only issue refunds as store credit, not to the original payment method.",
          issues: [
            "Misinterpreted the 7-day damage reporting period as return window",
            "Incorrectly stated the 15% restocking fee applies to all returns",
            "Misrepresented digital product refund policy",
            "Falsely claimed refunds are only issued as store credit",
          ],
        }
      }
    } else if (context === "partial") {
      if (behavior === "ideal") {
        if (technique === "rag") {
          answer = {
            text: "Based on the provided context, refunds are typically processed within 5-7 business days after the returned item is received and inspected. The refund will be issued to your original payment method. Regarding digital products, digital downloads and software licenses are non-refundable once the product key has been provided or the content has been downloaded. The context doesn't provide complete information about the general return window or other aspects of the refund policy.",
            issues: [],
          }
        } else {
          answer = {
            text: "According to the Customer FAQ, refunds are typically processed within 5-7 business days after they receive and inspect the returned item. The refund will be issued to your original payment method. Digital downloads and software licenses are non-refundable once the product key has been provided or the content has been downloaded. The information provided doesn't mention the standard return window for physical products or other details about the complete refund policy.",
            issues: [],
          }
        }
      } else if (behavior === "hallucinating") {
        answer = {
          text: "Based on the information provided, the company allows returns within 30 days of purchase for a full refund. Refunds are processed within 5-7 business days and issued to your original payment method. Digital products cannot be returned once the product key is provided or content is downloaded. For physical products, you must return them in their original packaging with all accessories. A receipt or proof of purchase is required for all returns. Items on clearance or marked as final sale cannot be returned.",
          issues: [
            "Hallucinated 30-day return window (not in partial context)",
            "Made up requirement about original packaging and accessories",
            "Fabricated policy about clearance/final sale items",
          ],
        }
      }
    } else if (context === "outdated") {
      if (behavior === "ideal" && technique === "rag") {
        answer = {
          text: "Based on the provided context from January 2022, the refund policy states that all products may be returned within 14 days of purchase for a full refund. A 10% restocking fee applies to all returns. Digital products cannot be returned. Refunds are processed within 10-14 business days. However, I should note that this information is from January 2022 and may not reflect the current policy.",
          issues: [],
        }
      } else {
        answer = {
          text: "According to the policy document, all products may be returned within 14 days of purchase for a full refund. A 10% restocking fee applies to all returns. Digital products cannot be returned. Refunds are processed within 10-14 business days. This information is from January 2022, so it's possible that the policy has been updated since then.",
          issues: [],
        }
      }
    } else if (context === "contradictory") {
      if (behavior === "ideal") {
        if (technique === "cot") {
          answer = {
            text: "Let me analyze the information provided:\n\n1. The Policy Document states customers may return undamaged products within 30 days of purchase for a full refund.\n\n2. However, a more recent email to staff (June 2023) indicates the return window has been extended to 45 days.\n\n3. The Customer Service Training from May 2023 mentions that special order items have a shorter return window of only 14 days.\n\nThese sources contain contradictory information. The most recent information (June 2023) suggests the return window is now 45 days, which appears to supersede the 30-day policy. However, special order items seem to have a different policy with only a 14-day return window.\n\nBased on this analysis, the general return policy appears to be 45 days for most items (recently updated), but special order items have a shorter 14-day window. Since there are contradictions in the provided information, it would be advisable to confirm the current policy with customer service.",
            issues: [],
          }
        } else if (technique === "rag") {
          answer = {
            text: "Based on the provided context, there are contradictory statements about the company's refund policy. The Policy Document states that customers may return undamaged products within 30 days of purchase for a full refund. However, a more recent email to staff from June 2023 indicates that the return window has been extended to 45 days. Additionally, the Customer Service Training from May 2023 mentions that special order items have a shorter return window of only 14 days. Due to these contradictions, I cannot provide a definitive answer about the current return window without additional clarification.",
            issues: [],
          }
        } else {
          answer = {
            text: "The company's refund policy allows customers to return undamaged products within 30 days of purchase for a full refund. However, according to a recent email from June 2023, this policy has been extended to 45 days. Special order items have a shorter return window of only 14 days, as mentioned in the Customer Service Training from May 2023. There seems to be some inconsistency in the policy information provided.",
            issues: [],
          }
        }
      } else if (behavior === "misinterpreting") {
        answer = {
          text: "According to the company's policy, customers can return products within 14 days for a full refund. This is the standard return window for all products as confirmed by the most recent training materials. The website needs to be updated to reflect this current policy.",
          issues: [
            "Incorrectly identified 14 days as the standard return policy",
            "Misinterpreted the special order exception as the general rule",
            "Ignored the more recent information about the 45-day extension",
          ],
        }
      }
    } else if (context === "irrelevant") {
      if (behavior === "ideal" && technique === "rag") {
        answer = {
          text: "I don't have enough information to answer this question. The provided context contains information about shipping and product care instructions, but doesn't include details about the company's refund policy.",
          issues: [],
        }
      } else if (behavior === "hallucinating") {
        answer = {
          text: "Based on the company's policy, you can return items within 30 days of purchase for a full refund. To initiate a return, you'll need to fill out the return form on the website and include your order number. Returns are processed within 7-10 business days, and refunds are issued to the original payment method. For items over $75 that qualified for free shipping, the shipping cost may be deducted from your refund if you return the entire order.",
          issues: [
            "Completely fabricated refund policy",
            "Made up return process details",
            "Hallucinated information about shipping cost deductions",
          ],
        }
      } else if (behavior === "ignoring") {
        answer = {
          text: "Most retailers have a return policy of 30 days, though this can vary. You'll typically need the original receipt and packaging. Some stores charge restocking fees, especially for electronics or opened items. I recommend checking the company's website or contacting their customer service for specific details about their refund policy.",
          issues: ["Provided generic information instead of acknowledging lack of relevant context"],
        }
      }
    }
  }

  return answer
}

export default function AnswerGenerationDemo() {
  const [question, setQuestion] = useState("What is your refund policy?")
  const [selectedContext, setSelectedContext] = useState<keyof typeof sampleContexts>("complete")
  const [selectedTechnique, setSelectedTechnique] = useState<keyof typeof promptingTechniques>("basic")
  const [selectedBehavior, setSelectedBehavior] = useState<keyof typeof llmBehaviors>("ideal")
  const [showPrompt, setShowPrompt] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAnswer, setGeneratedAnswer] = useState<{ text: string; issues: string[] } | null>(null)

  // Generate the prompt based on selected template and context
  const generatePrompt = () => {
    const template = promptingTechniques[selectedTechnique].template
    return template.replace("{context}", sampleContexts[selectedContext].content).replace("{question}", question)
  }

  // Handle answer generation
  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      const answer = generateAnswer(selectedContext, selectedTechnique, selectedBehavior, question)
      setGeneratedAnswer(answer)
      setIsGenerating(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="prompt">Prompt & Context</TabsTrigger>
          <TabsTrigger value="answer">Generated Answer</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Query */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  User Query
                </CardTitle>
                <CardDescription>The question the user is asking</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question here..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* LLM Behavior */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  LLM Behavior
                </CardTitle>
                <CardDescription>How the model responds to the prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedBehavior}
                  onValueChange={(value) => setSelectedBehavior(value as keyof typeof llmBehaviors)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LLM behavior" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(llmBehaviors).map(([key, behavior]) => (
                      <SelectItem key={key} value={key}>
                        {behavior.name} - {behavior.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Behavior Description</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {llmBehaviors[selectedBehavior].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Context Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Context Selection
                </CardTitle>
                <CardDescription>The information retrieved for the query</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedContext}
                  onValueChange={(value) => setSelectedContext(value as keyof typeof sampleContexts)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select context type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sampleContexts).map(([key, context]) => (
                      <SelectItem key={key} value={key}>
                        {context.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md max-h-[150px] overflow-y-auto">
                  <h3 className="text-sm font-medium mb-2">Context Preview</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {sampleContexts[selectedContext].content.length > 200
                      ? sampleContexts[selectedContext].content.substring(0, 200) + "..."
                      : sampleContexts[selectedContext].content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Prompting Technique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Prompting Technique
                </CardTitle>
                <CardDescription>How to instruct the model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedTechnique}
                  onValueChange={(value) => setSelectedTechnique(value as keyof typeof promptingTechniques)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select prompting technique" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(promptingTechniques).map(([key, technique]) => (
                      <SelectItem key={key} value={key}>
                        {technique.name} - {technique.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch id="show-prompt" checked={showPrompt} onCheckedChange={setShowPrompt} />
                  <Label htmlFor="show-prompt">Show full prompt</Label>
                </div>

                {showPrompt && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md max-h-[150px] overflow-y-auto">
                    <h3 className="text-sm font-medium mb-2">Prompt Template</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {promptingTechniques[selectedTechnique].template}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generating..." : "Generate Answer"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Prompt & Context Tab */}
        <TabsContent value="prompt">
          <Card>
            <CardHeader>
              <CardTitle>Full Prompt & Context</CardTitle>
              <CardDescription>What will be sent to the LLM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900 min-h-[400px] whitespace-pre-wrap">
                {generatePrompt()}
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <Info className="h-4 w-4" />
                This is the complete prompt that would be sent to the language model, including the context and
                instructions.
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Generated Answer Tab */}
        <TabsContent value="answer">
          <Card>
            <CardHeader>
              <CardTitle>Generated Answer</CardTitle>
              <CardDescription>The LLM's response to the user query</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!generatedAnswer ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Configure your settings and click "Generate Answer" to see a response
                </div>
              ) : (
                <>
                  <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900 whitespace-pre-wrap">
                    {generatedAnswer.text}
                  </div>

                  {generatedAnswer.issues.length > 0 ? (
                    <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-amber-800 dark:text-amber-300">Issues Detected</h3>
                          <ul className="mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc pl-5">
                            {generatedAnswer.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-green-800 dark:text-green-300">Good Response</h3>
                          <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                            This response appropriately uses the provided context and follows the prompting
                            instructions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Context Type:</span>
                  <Badge variant="outline">{sampleContexts[selectedContext].title}</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Prompting Technique:</span>
                  <Badge variant="outline">{promptingTechniques[selectedTechnique].name}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">LLM Behavior:</span>
                  <Badge variant="outline">{llmBehaviors[selectedBehavior].name}</Badge>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Answer Generation Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Clear Instructions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Provide explicit instructions about how to use the context, handle uncertainty, and format the
                    response. Specify whether to admit knowledge gaps or stick strictly to provided information.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Encourage Source Attribution
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Ask the model to cite or reference the sources of information in its response. This improves
                    transparency and helps users verify information accuracy.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Validate Outputs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Implement post-processing to check answers against the context. Flag responses that contain
                    information not present in the retrieved documents to catch potential hallucinations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
