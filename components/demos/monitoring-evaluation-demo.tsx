"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, ListChecks, UserRoundCog, TrendingUp } from "lucide-react"

export default function MonitoringEvaluationDemo() {
  const [activeTab, setActiveTab] = useState("metrics")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="metrics" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logging">Logging</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key metrics for monitoring RAG system performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">98%</div>
                    <div className="text-sm text-slate-500">Uptime</div>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">250ms</div>
                    <div className="text-sm text-slate-500">Average Latency</div>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">4.5/5</div>
                    <div className="text-sm text-slate-500">User Satisfaction</div>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">2%</div>
                    <div className="text-sm text-slate-500">Error Rate</div>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  These metrics provide a high-level overview of the system's health and performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
                <CardDescription>Historical data for key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center text-slate-400">
                  Simulated Chart
                </div>
                <p className="text-sm text-slate-500">
                  Visualizing trends helps identify potential issues and areas for optimization.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logging Tab */}
        <TabsContent value="logging">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Logging Configuration
              </CardTitle>
              <CardDescription>Configure logging levels and destinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Log Destination</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select log destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="console">Console</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sample Log Entry</Label>
                <Textarea
                  readOnly
                  className="min-h-[100px]"
                  value="[2023-10-27 10:00:00] INFO: Query processed successfully. Latency: 230ms"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRoundCog className="h-5 w-5" />
                Evaluation Metrics
              </CardTitle>
              <CardDescription>Evaluate the quality of generated answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%</div>
                  <div className="text-sm text-slate-500">Relevance</div>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">90%</div>
                  <div className="text-sm text-slate-500">Accuracy</div>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">85%</div>
                  <div className="text-sm text-slate-500">Coherence</div>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">5%</div>
                  <div className="text-sm text-slate-500">Hallucination Rate</div>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                These metrics are based on a sample of 1000 generated answers, evaluated by human reviewers.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
