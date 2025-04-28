"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Database, FileText, Cpu, BrainCircuit, ArrowRight, Settings, AlertTriangle } from "lucide-react"

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
      const errors: { componentId: string; message: string }[] = []
      let previousComponent: typeof components[0] | null = null

      // Simulate data flow through the pipeline
      for (const component of components) {
        // Skip disabled components
        if (!componentConfigs[component.id].enabled) {
          continue
        }

        // Check if this component expects input from a previous component
        if (component.expectedInput && previousComponent) {
          const previousOutput: string = componentConfigs[previousComponent.id].outputFormat

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
    <div className="space-y-8">
      {/* Pipeline Visualization */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 16l-4-4 4-4" />
            <path d="M20 16l-4-4 4-4" />
          </svg>
          RAG Pipeline Flow
        </h2>
        
        <div className="relative">
          {/* Pipeline status indicator */}
          <div className="absolute -top-2 right-0">
            {pipelineStatus.success && (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Integration Successful
              </Badge>
            )}
            {pipelineStatus.errors.length > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                <AlertCircle className="h-3 w-3 mr-1" /> Integration Issues
              </Badge>
            )}
          </div>
          
          {/* Pipeline visualization */}
          <div className="flex flex-wrap justify-center items-center gap-2 py-6">
            {components
              .filter((c) => componentConfigs[c.id].enabled)
              .map((component, index, array) => (
                <div key={component.id} className="flex items-center">
                  <div
                    className={`relative flex flex-col items-center justify-center p-4 rounded-lg 
                    ${pipelineStatus.errors.some((e) => e.componentId === component.id)
                        ? "bg-red-900/20 border border-red-500/50"
                        : "bg-slate-700/50 border border-slate-600 hover:border-emerald-500/30 transition-colors"
                    }`}
                  >
                    {pipelineStatus.errors.some((e) => e.componentId === component.id) && (
                      <div className="absolute -top-2 -right-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          !
                        </span>
                      </div>
                    )}
                    <component.icon className="h-10 w-10 mb-2 text-emerald-400" />
                    <span className="text-sm text-slate-200 font-medium">{component.name}</span>
                    <span className="text-xs text-slate-400 mt-1">{componentConfigs[component.id].outputFormat}</span>
                  </div>
                  {index < array.length - 1 && (
                    <div className="px-2">
                      <ArrowRight className={`h-6 w-6 ${
                        pipelineStatus.errors.some((e) => e.componentId === array[index + 1]?.id)
                          ? "text-red-400"
                          : "text-emerald-500"
                      }`} />
                    </div>
                  )}
                </div>
              ))}
          </div>
          
          {/* Run button */}
          <div className="flex justify-center mt-4">
            <Button 
              onClick={runPipeline} 
              disabled={pipelineStatus.running}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              {pipelineStatus.running ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Pipeline...
                </>
              ) : "Test Pipeline Integration"}
            </Button>
          </div>
        </div>
        
        {/* Error messages */}
        {pipelineStatus.errors.length > 0 && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <h3 className="text-red-400 font-medium flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Integration Issues Detected
            </h3>
            <ul className="space-y-2 text-sm">
              {pipelineStatus.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-red-400 flex-shrink-0" />
                  <span>{error.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Success message */}
        {pipelineStatus.success && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
            <h3 className="text-green-400 font-medium flex items-center mb-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Pipeline Integration Successful
            </h3>
            <p className="text-sm text-slate-300">
              All components are properly connected. Data flows smoothly through the entire pipeline.
            </p>
          </div>
        )}
      </div>

      {/* Component Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {components.map((component) => (
              <div
                key={component.id}
            className={`bg-slate-800/80 border rounded-xl overflow-hidden shadow-lg transition-colors
              ${pipelineStatus.errors.some((e) => e.componentId === component.id)
                ? "border-red-500/50"
                : "border-slate-700 hover:border-slate-600"
                }`}
              >
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <component.icon className="h-5 w-5 text-emerald-400" />
                <h3 className="font-medium text-slate-200">{component.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`${component.id}-switch`}
                      checked={componentConfigs[component.id].enabled}
                      onCheckedChange={() => toggleComponent(component.id)}
                  className="data-[state=checked]:bg-emerald-500"
                    />
                <Label htmlFor={`${component.id}-switch`} className="text-sm text-slate-300">
                      {componentConfigs[component.id].enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
            
            <div className="p-5">
              <p className="text-sm text-slate-300 mb-4">{component.description}</p>
              
              <div className="space-y-3">
                  {component.expectedInput && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Expected Input:</span>
                    <Badge className="bg-slate-700 text-slate-300 hover:bg-slate-700">
                      {component.expectedInput}
                    </Badge>
                  </div>
                  )}
                
                  <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Output Format:</span>
                    <Badge
                      className={
                        componentConfigs[component.id].outputFormat !== component.outputFormat
                        ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      }
                    >
                    {componentConfigs[component.id].outputFormat}
                    </Badge>
                  
                    {componentConfigs[component.id].outputFormat !== component.outputFormat && (
                      <Button
                      variant="outline"
                        size="sm"
                        onClick={() => changeOutputFormat(component.id, component.outputFormat)}
                      className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              
                {pipelineStatus.errors.some((e) => e.componentId === component.id) && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{pipelineStatus.errors.find((e) => e.componentId === component.id)?.message}</span>
                </div>
              )}
            </div>
                    </div>
                  ))}
              </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={introduceIssue}
          className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
        >
          <Settings className="h-4 w-4 mr-2" />
          Introduce Issue
        </Button>
        
        <Button
          variant="outline"
          onClick={resetPipeline}
          className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset All
            </Button>
      </div>

      {/* Best Practices */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5">
        <h3 className="text-sm font-medium text-emerald-400 mb-4">Integration Best Practices</h3>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg transition-all hover:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              </svg>
              <h4 className="font-medium text-slate-200">Standardized Interfaces</h4>
            </div>
            <p className="text-sm text-slate-400">
              Ensure components use compatible data formats and APIs. Consider frameworks like LangChain or LlamaIndex that provide standardized interfaces.
            </p>
          </div>
          
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg transition-all hover:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <h4 className="font-medium text-slate-200">Error Handling</h4>
            </div>
            <p className="text-sm text-slate-400">
              Add robust error handling at each integration point. Gracefully handle failures and provide clear error messages for troubleshooting.
            </p>
          </div>
          
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg transition-all hover:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m3 15 5-5 5 5 8-8" />
              </svg>
              <h4 className="font-medium text-slate-200">Unified Monitoring</h4>
            </div>
            <p className="text-sm text-slate-400">
              Implement centralized logging and monitoring across all components to quickly identify and resolve integration issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
