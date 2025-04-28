"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, MessageSquare, ThumbsUp, ThumbsDown, Info } from "lucide-react"

// Define keyframes for animations
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`

export default function FeedbackLoopDemo() {
  const [feedbackText, setFeedbackText] = useState("")
  const [selectedRating, setSelectedRating] = useState<"positive" | "negative" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

  const handleSubmit = () => {
    // Add submission animation
    setIsSubmitting(true)

    // Simulate sending feedback to a server
    setTimeout(() => {
      setIsSubmitting(false)
      setShowThanks(true)

      // Reset form after showing thanks message
      setTimeout(() => {
        setShowThanks(false)
        setFeedbackText("")
        setSelectedRating(null)
      }, 2000)
    }, 800)
  }

  const isDisabled = (!feedbackText.trim() && !selectedRating) || isSubmitting

  return (
    <>
      <style jsx>{fadeInAnimation}</style>
      <div className="space-y-6">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-emerald-500/10">
          <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
            <h3 className="text-slate-200 font-medium flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
              Feedback Form
            </h3>
            <p className="text-slate-400 text-sm">Provide feedback to improve the system</p>
          </div>
          <div className="p-5 space-y-4">
            {showThanks ? (
              <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-300 p-4 rounded-lg text-center animate-fade-in">
                <CheckCircle className="h-10 w-10 mx-auto mb-2 text-emerald-400" />
                <p className="font-medium">Thank you for your feedback!</p>
                <p className="text-sm text-emerald-400/80">Your input helps us improve our system.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Your Feedback</Label>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Enter your feedback here..."
                    className="min-h-[100px] bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Rating</Label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedRating("positive")}
                      className={`border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200 transition-all ${selectedRating === "positive" ? "bg-emerald-900/20 border-emerald-500/50 text-emerald-300 ring-2 ring-emerald-500/20" : ""
                        }`}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-2 transition-transform ${selectedRating === "positive" ? "scale-110" : ""}`} />
                      Positive
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedRating("negative")}
                      className={`border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200 transition-all ${selectedRating === "negative" ? "bg-red-900/20 border-red-500/30 text-red-300 ring-2 ring-red-500/20" : ""
                        }`}
                    >
                      <ThumbsDown className={`h-4 w-4 mr-2 transition-transform ${selectedRating === "negative" ? "scale-110" : ""}`} />
                      Negative
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isDisabled}
                  className={`w-full transition-all ${isDisabled
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20"
                    } ${isSubmitting ? "animate-pulse" : ""}`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
            <h3 className="text-slate-200 font-medium">Feedback Loop Best Practices</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 transition-all hover:border-emerald-500/30 hover:shadow-md hover:translate-y-[-2px]">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  Collect Diverse Feedback
                </h3>
                <p className="text-sm text-slate-400">
                  Gather feedback from multiple sources, including user ratings, free-form comments, and system metrics.
                  This provides a comprehensive view of system performance.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 transition-all hover:border-emerald-500/30 hover:shadow-md hover:translate-y-[-2px]">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  Analyze Feedback Regularly
                </h3>
                <p className="text-sm text-slate-400">
                  Establish a process for regularly reviewing and analyzing feedback to identify trends, pain points, and
                  areas for improvement.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 transition-all hover:border-emerald-500/30 hover:shadow-md hover:translate-y-[-2px]">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  Implement Iterative Improvements
                </h3>
                <p className="text-sm text-slate-400">
                  Use feedback insights to drive iterative improvements to the RAG system, including content updates,
                  prompt refinements, and algorithm adjustments.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-8 hover:border-slate-600 transition-all">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-slate-200 font-medium mb-1">Why Feedback Matters</h4>
              <p className="text-sm text-slate-400">
                Continuous feedback collection is critical for RAG systems. User feedback helps identify retrieval errors,
                hallucinations, and relevance issues that might not be captured by automated metrics alone. The feedback loop
                should be designed to be simple, non-intrusive, and provide immediate acknowledgment of the user's input.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
