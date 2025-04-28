"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Database, FileText, Cpu, BrainCircuit, ArrowRight } from "lucide-react"

export default function IntegrationsDemo() {
  // Define the components of our RAG pipeline
  const components = [
    {
      id: "document-loader",
      name: "Document Loader",
      description: "Loads documents from various sources",
      icon: FileText,
      outputFormat: "raw-text",
      expectedInput: null,
      status: "operational",
    },
    {
      id: "embedding-model",
      name: "Embedding Model",
      description: "Converts text into vector embeddings",
      icon: Cpu,
      outputFormat: "vector-embedding",
      expectedInput: "raw-text",
      status: "operational",
    },
    {
      id: "vector-database",
      name: "Vector Database",
      description: "Stores and retrieves vector embeddings",
      icon: Database,
      outputFormat: "search-results",
      expectedInput: "vector-embedding",
      status: "operational",
    },
    {
      id: "llm",
      name: "Large Language Model",
      description: "Generates responses based on context",
      icon: BrainCircuit,
      outputFormat: "response",
      expectedInput: "search-results",
      status: "operational",
    },
  ]

  // State for component configurations
  const [componentConfigs, setComponentConfigs] = useState(
    components.reduce(
      (acc, component) => {
        acc[component.id] = {
          enabled: true,
          outputFormat: component.outputFormat,
        }
        return acc
      },
      {} as Record<string, { enabled: boolean; outputFormat: string }>,
    ),
  )

  // State for pipeline status
  const [pipelineStatus, setPipelineStatus] = useState({
    running: false,
    errors: [] as { componentId: string; message: string }[],
    success: false,
  })

  // Check for integration issues
  useEffect(() => {
    if (pipelineStatus.running) {
      const errors = []
      let previousComponent = null

      // Simulate data flow through the pipeline
      for (const component of components) {
        // Skip disabled components
        if (!componentConfigs[component.id].enabled) {
          continue
        }

        // Check if this component expects input from a previous component
        if (component.expectedInput && previousComponent) {
          const previousOutput = componentConfigs[previousComponent.id].outputFormat

          // Check if the output format matches what this component expects
          if (previousOutput !== component.expectedInput) {
            errors.push({
              componentId: component.id,
              message: `Expected ${component.expectedInput} but received ${previousOutput} from ${previousComponent.name}`,
            })
          }
        }

        previousComponent = component
      }

      // Update pipeline status
      setTimeout(() => {
        setPipelineStatus({
          running: false,
          errors,
          success: errors.length === 0,
        })
      }, 1500)
    }
  }, [pipelineStatus.running, componentConfigs])

  // Toggle component enabled state
  const toggleComponent = (componentId: string) => {
    setComponentConfigs((prev) => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        enabled: !prev[componentId].enabled,
      },
    }))
  }

  // Change component output format
  const changeOutputFormat = (componentId: string, newFormat: string) => {
    setComponentConfigs((prev) => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        outputFormat: newFormat,
      },
    }))
  }

  // Run the pipeline
  const runPipeline = () => {
    setPipelineStatus({
      running: true,
      errors: [],
      success: false,
    })
  }

  // Reset the pipeline
  const resetPipeline = () => {
    setComponentConfigs(
      components.reduce(
        (acc, component) => {
          acc[component.id] = {
            enabled: true,
            outputFormat: component.outputFormat,
          }
          return acc
        },
        {} as Record<string, { enabled: boolean; outputFormat: string }>,
      ),
    )
    setPipelineStatus({
      running: false,
      errors: [],
      success: false,
    })
  }

  // Introduce a common integration issue
  const introduceIssue = () => {
    // Change the embedding model output format to create a mismatch
    setComponentConfigs((prev) => ({
      ...prev,
      "embedding-model": {
        ...prev["embedding-model"],
        outputFormat: "incompatible-format",
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>RAG Pipeline Components</CardTitle>
            <CardDescription>Configure and connect your RAG pipeline components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {components.map((component) => (
              <div
                key={component.id}
                className={`p-4 border rounded-lg ${
                  pipelineStatus.errors.some((e) => e.componentId === component.id)
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <component.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium">{component.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`${component.id}-switch`}
                      checked={componentConfigs[component.id].enabled}
                      onCheckedChange={() => toggleComponent(component.id)}
                    />
                    <Label htmlFor={`${component.id}-switch`}>
                      {componentConfigs[component.id].enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{component.description}</p>
                <div className="flex flex-wrap gap-2">
                  {component.expectedInput && (
                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                      Input: {component.expectedInput}
                    </Badge>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        componentConfigs[component.id].outputFormat !== component.outputFormat
                          ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                          : "bg-slate-100 dark:bg-slate-800"
                      }
                    >
                      Output: {componentConfigs[component.id].outputFormat}
                    </Badge>
                    {componentConfigs[component.id].outputFormat !== component.outputFormat && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeOutputFormat(component.id, component.outputFormat)}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
                {pipelineStatus.errors.some((e) => e.componentId === component.id) && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{pipelineStatus.errors.find((e) => e.componentId === component.id)?.message}</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={introduceIssue}>
              Introduce Issue
            </Button>
            <Button variant="outline" onClick={resetPipeline}>
              Reset All
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Status</CardTitle>
            <CardDescription>Test the integration between components</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col">
            <div className="flex-1 mb-4">
              {!pipelineStatus.running && !pipelineStatus.success && pipelineStatus.errors.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to Test</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Click "Run Pipeline" to test the integration between components. Try enabling/disabling components
                    or introducing issues to see how they affect the pipeline.
                  </p>
                </div>
              )}

              {pipelineStatus.running && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="mb-4">
                    <svg
                      className="animate-spin h-12 w-12 text-emerald-600 dark:text-emerald-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Running Pipeline</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Testing the integration between components...
                  </p>
                </div>
              )}

              {!pipelineStatus.running && pipelineStatus.success && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="mb-4 text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Pipeline Successful</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    All components are properly integrated and the data flows correctly through the pipeline.
                  </p>
                </div>
              )}

              {!pipelineStatus.running && pipelineStatus.errors.length > 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="mb-4 text-red-500">
                    <AlertCircle size={48} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Integration Issues Detected</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                    There are issues with the integration between components. Check the highlighted components for
                    details.
                  </p>
                  <div className="w-full max-w-md bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <ul className="text-left text-sm text-red-800 dark:text-red-300 space-y-2">
                      {pipelineStatus.errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{error.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-center space-x-2">
                {components
                  .filter((c) => componentConfigs[c.id].enabled)
                  .map((component, index, array) => (
                    <div key={component.id} className="flex items-center">
                      <div
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                          pipelineStatus.errors.some((e) => e.componentId === component.id)
                            ? "bg-red-100 dark:bg-red-900/20"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        <component.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs mt-1">{component.name}</span>
                      </div>
                      {index < array.length - 1 && <ArrowRight className="h-5 w-5 mx-1 text-slate-400" />}
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={runPipeline} disabled={pipelineStatus.running} className="w-full">
              {pipelineStatus.running ? "Running..." : "Run Pipeline"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Best Practices</CardTitle>
          <CardDescription>Tips for successful RAG pipeline integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Use Standardized Interfaces</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Ensure components use compatible data formats and APIs. Consider using frameworks like LangChain or
                LlamaIndex that provide standardized interfaces.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Implement Error Handling</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Add robust error handling at each integration point. Gracefully handle failures and provide clear error
                messages for troubleshooting.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Unified Monitoring</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Implement centralized logging and monitoring across all components to quickly identify and resolve
                integration issues.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
