"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react"

export default function FeedbackLoopDemo() {
  const [feedbackText, setFeedbackText] = useState("")
  const [selectedRating, setSelectedRating] = useState<"positive" | "negative" | null>(null)

  const handleSubmit = () => {
    // Simulate sending feedback to a server
    alert(`Feedback submitted:\nRating: ${selectedRating}\nComment: ${feedbackText}`)
    setFeedbackText("")
    setSelectedRating(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Form
          </CardTitle>
          <CardDescription>Provide feedback to improve the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Feedback</Label>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback here..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedRating("positive")}
                className={selectedRating === "positive" ? "bg-green-100 text-green-800" : ""}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Positive
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedRating("negative")}
                className={selectedRating === "negative" ? "bg-red-100 text-red-800" : ""}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Negative
              </Button>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={!feedbackText.trim() && !selectedRating} className="w-full">
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Loop Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Collect Diverse Feedback
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Gather feedback from multiple sources, including user ratings, free-form comments, and system metrics.
                This provides a comprehensive view of system performance.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Analyze Feedback Regularly
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Establish a process for regularly reviewing and analyzing feedback to identify trends, pain points, and
                areas for improvement.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Implement Iterative Improvements
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Use feedback insights to drive iterative improvements to the RAG system, including content updates,
                prompt refinements, and algorithm adjustments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
