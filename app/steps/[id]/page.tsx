import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react"
import SourcePreprocessingDemo from "@/components/demos/source-preprocessing-demo"
import IntegrationsDemo from "@/components/demos/integrations-demo"
import MetadataTaggingDemo from "@/components/demos/metadata-tagging-demo"
import IndexingDemo from "@/components/demos/indexing-demo"
import ChunkingDesignDemo from "@/components/demos/chunking-design-demo"
import EmbeddingCreationDemo from "@/components/demos/embedding-creation-demo"
import QueryUnderstandingDemo from "@/components/demos/query-understanding-demo"
import HybridRetrievalDemo from "@/components/demos/hybrid-retrieval-demo"
import FilteringPermissionChecksDemo from "@/components/demos/filtering-permission-checks-demo"
import RerankingFusionDemo from "@/components/demos/reranking-fusion-demo"
import ContextAssemblyDemo from "@/components/demos/context-assembly-demo"
import AnswerGenerationDemo from "@/components/demos/answer-generation-demo"
import PostProcessingDemo from "@/components/demos/post-processing-demo"
import MonitoringEvaluationDemo from "@/components/demos/monitoring-evaluation-demo"
import FeedbackLoopDemo from "@/components/demos/feedback-loop-demo"

export const steps = [
  {
    id: "1",
    title: "Source Preprocessing",
    description:
      "The first step in building a RAG system is to preprocess your source documents. This involves cleaning, normalizing, and preparing your text data for further processing.",
    whatItDoes:
      "Source preprocessing transforms raw documents into clean, normalized text that's ready for chunking and embedding. It handles tasks like removing irrelevant content, standardizing formats, and extracting useful metadata.",
    whyItMatters:
      "High-quality preprocessing directly impacts the quality of your RAG system. Clean, well-structured text leads to better chunks, more accurate embeddings, and ultimately more relevant responses.",
    challenges: [
      "Handling diverse document formats (PDF, HTML, Word, etc.)",
      "Preserving document structure and formatting that provides context",
      "Removing boilerplate content while keeping important information",
      "Extracting and preserving metadata for later use",
      "Dealing with tables, images, and other non-text content",
      "Handling OCR artifacts, misrecognition, and layout confusion in scanned documents",
    ],
    demo: <SourcePreprocessingDemo />,
  },
  {
    id: "2",
    title: "Integrations",
    description:
      "Integrations connect your RAG system with external tools, services, and data sources to enhance functionality and extend capabilities.",
    whatItDoes:
      "Integration components allow your RAG system to connect with document stores, vector databases, LLM providers, and other services. They provide standardized interfaces for data exchange and functionality sharing.",
    whyItMatters:
      "Well-designed integrations make your RAG system more powerful, flexible, and easier to maintain. They allow you to leverage specialized tools for different aspects of the RAG pipeline.",
    challenges: [
      "Managing authentication and credentials securely",
      "Handling rate limits and API quotas",
      "Ensuring consistent data formats across different services",
      "Maintaining compatibility with evolving external APIs",
      "Optimizing for cost and performance across integrated services",
      "Inegrating with external tools (e.g. Sharepoint, Drive, etc.)",
    ],
    demo: <IntegrationsDemo />,
  },
  {
    id: "3",
    title: "Metadata Tagging",
    description:
      "Metadata tagging enriches your documents with additional information that helps with retrieval, filtering, and context understanding.",
    whatItDoes:
      "Metadata tagging adds structured information to your documents, such as categories, dates, authors, and other attributes. This metadata can be used for filtering, sorting, and enhancing the context provided to the LLM.",
    whyItMatters:
      "Rich metadata improves retrieval precision, enables advanced filtering, and provides crucial context to the LLM. It helps your RAG system understand not just what a document contains, but what it is.",
    challenges: [
      "Designing a consistent metadata schema across diverse documents",
      "Automatically extracting relevant metadata from unstructured text",
      "Balancing metadata complexity with usability",
      "Handling missing or inconsistent metadata",
      "Storing and indexing metadata efficiently",
    ],
    demo: <MetadataTaggingDemo />,
  },
  {
    id: "4",
    title: "Indexing",
    description:
      "Indexing organizes your document collection for efficient storage and retrieval, making it possible to quickly find relevant information.",
    whatItDoes:
      "Indexing creates optimized data structures that allow for fast searching and retrieval of documents. It maps terms, vectors, or other features to the documents that contain them.",
    whyItMatters:
      "Effective indexing is crucial for the performance and scalability of your RAG system. It enables quick retrieval of relevant documents from potentially massive collections.",
    challenges: [
      "Choosing the right index type for your specific use case",
      "Balancing index size with query performance",
      "Handling index updates as documents change",
      "Scaling indexes to large document collections",
      "Optimizing for different query patterns",
    ],
    demo: <IndexingDemo />,
  },
  {
    id: "5",
    title: "Chunking Design",
    description:
      "Chunking breaks down documents into smaller, manageable pieces that can be individually embedded and retrieved.",
    whatItDoes:
      "Chunking splits documents into smaller segments based on various strategies like size, semantic boundaries, or structural elements. These chunks become the basic units for embedding and retrieval.",
    whyItMatters:
      "The way you chunk documents significantly impacts retrieval quality. Good chunking preserves context, reduces noise, and ensures that relevant information is retrieved together.",
    challenges: [
      "Determining optimal chunk size for your specific use case",
      "Preserving context across chunk boundaries",
      "Handling documents with varying structures",
      "Balancing chunk granularity with retrieval precision",
      "Managing overlapping chunks to preserve context",
    ],
    demo: <ChunkingDesignDemo />,
  },
  {
    id: "6",
    title: "Embedding Creation",
    description:
      "Embedding creation transforms text chunks into numerical vector representations that capture semantic meaning.",
    whatItDoes:
      "Embedding models convert text into high-dimensional vectors where similar texts are positioned closer together in the vector space. These embeddings enable semantic search and similarity matching.",
    whyItMatters:
      "The quality of your embeddings directly affects retrieval accuracy. Better embeddings capture more nuanced semantic relationships and lead to more relevant search results.",
    challenges: [
      "Selecting appropriate embedding models for your domain",
      "Handling multilingual content effectively",
      "Managing embedding dimensionality and computational costs",
      "Dealing with embedding model limitations and biases",
      "Keeping embeddings up-to-date with model advancements",
    ],
    demo: <EmbeddingCreationDemo />,
  },
  {
    id: "7",
    title: "Query Understanding",
    description:
      "Query understanding processes and interprets user queries to improve retrieval accuracy and response relevance.",
    whatItDoes:
      "Query understanding analyzes user queries to identify intent, extract key concepts, expand terms, and transform the query into a form that maximizes retrieval effectiveness. It may involve query classification, expansion, reformulation, or decomposition.",
    whyItMatters:
      "Better query understanding leads to more relevant retrievals. By interpreting what users are really asking for, rather than just matching keywords, RAG systems can provide more accurate and helpful responses.",
    challenges: [
      "Handling ambiguous or underspecified queries",
      "Balancing query expansion with precision",
      "Decomposing complex queries into manageable sub-queries",
      "Maintaining context across multi-turn conversations",
      "Adapting to domain-specific terminology and concepts",
    ],
    demo: <QueryUnderstandingDemo />,
  },
  {
    id: "8",
    title: "Hybrid Retrieval",
    description:
      "Hybrid retrieval combines multiple search methods like vector search and keyword search to improve the quality and relevance of retrieved information.",
    whatItDoes:
      "Hybrid retrieval uses a combination of retrieval methods – typically dense vector search and traditional keyword (sparse) search – to find relevant documents. Instead of relying on just one approach, it runs both methods and then merges the results, leveraging the strengths of each system.",
    whyItMatters:
      "Hybrid retrieval aims to get the best of both worlds. Sparse (term-based) search excels at exact matches – if the user's query uses the same terminology as a document, a keyword search will precisely find that document. Dense search, on the other hand, excels at finding conceptually related info (synonyms, paraphrases) but might also return something contextually similar yet not actually relevant. By combining them, the pipeline can catch relevant documents that one method alone might miss.",
    challenges: [
      "Implementing and maintaining two search systems instead of one",
      "Normalizing scores between different retrieval methods",
      "Balancing the weight given to each retrieval method",
      "Handling increased latency from running multiple searches",
      "Managing duplicated results across retrieval methods",
    ],
    demo: <HybridRetrievalDemo />,
  },
  {
    id: "9",
    title: "Filtering & Permission Checks",
    description:
      "Filtering and permission checks ensure that only relevant and authorized content is retrieved and presented to users.",
    whatItDoes:
      "Filtering narrows down search results based on metadata criteria like date, category, or source. Permission checks verify that users have appropriate access rights to the retrieved information, preventing unauthorized access to sensitive data.",
    whyItMatters:
      "Effective filtering improves retrieval precision by eliminating irrelevant results. Permission checks are crucial for security and compliance, ensuring users only see information they're authorized to access.",
    challenges: [
      "Implementing efficient filtering without sacrificing retrieval performance",
      "Designing flexible permission models that scale with complex organizations",
      "Handling nested or inherited permissions",
      "Balancing security with usability and performance",
      "Maintaining consistent permission enforcement across the entire RAG pipeline",
    ],
    demo: <FilteringPermissionChecksDemo />,
  },
  {
    id: "10",
    title: "Reranking / Fusion",
    description:
      "Reranking and fusion techniques improve retrieval quality by reordering or combining results from different retrieval methods.",
    whatItDoes:
      "Reranking takes initial search results and reorders them using more sophisticated (and often more computationally expensive) models to improve relevance. Fusion combines results from multiple retrieval methods (like keyword search and semantic search) to leverage the strengths of each approach.",
    whyItMatters:
      "These techniques significantly improve retrieval quality by addressing the limitations of individual retrieval methods. They help balance precision and recall, combining the strengths of different approaches to deliver more relevant results.",
    challenges: [
      "Balancing the computational cost of reranking with retrieval speed",
      "Determining optimal weights when combining different retrieval signals",
      "Avoiding over-optimization for specific query types",
      "Handling cases where different retrieval methods produce contradictory rankings",
      "Measuring and optimizing the impact of reranking and fusion on end-to-end RAG performance",
    ],
    demo: <RerankingFusionDemo />,
  },
  {
    id: "11",
    title: "Context Assembly",
    description:
      "Context assembly builds the final prompt by organizing retrieved chunks into a coherent, optimized context for the LLM.",
    whatItDoes:
      "Context assembly takes the highest-ranked passages after retrieval and reranking and prepares them as context for the model. This includes formatting the text, removing redundancies, trimming for length to fit token limits, organizing snippets in a logical order, and structuring the prompt to clearly separate context from the query.",
    whyItMatters:
      "The LLM's answer will only be as good as the context it receives. Even with perfect retrieval, poorly assembled context can confuse the model or cause it to miss critical information. Well-assembled context gives the model a clear, digestible set of facts to work with and helps prevent it from veering off-course.",
    challenges: [
      "Managing token limits while preserving essential information",
      "Avoiding context dilution from loosely related chunks",
      "Handling overlapping or redundant information across chunks",
      "Determining the optimal ordering of context for model comprehension",
      "Creating clear formatting that separates context from instructions and queries",
    ],
    demo: <ContextAssemblyDemo />,
  },
  {
    id: "12",
    title: "Answer Generation",
    description:
      "Answer generation is where the LLM produces a response based on the user's query and the retrieved context, synthesizing information into a coherent answer.",
    whatItDoes:
      "The LLM takes the assembled context and user query to generate a natural language response. It synthesizes relevant information from the context, formats the answer appropriately, and delivers the final output to the user.",
    whyItMatters:
      "This is the culmination of the RAG pipeline where value is delivered to the user. A well-performed answer generation produces responses that are correct (grounded in facts), complete, and clear, significantly reducing hallucinations compared to using the LLM alone.",
    challenges: [
      "Preventing hallucinations even with provided context",
      "Ensuring the model uses the context rather than prior knowledge",
      "Balancing verbosity and relevance in responses",
      "Handling cases where the retrieved context doesn't contain the answer",
      "Preventing information leakage from sensitive context",
    ],
    demo: <AnswerGenerationDemo />,
  },
  {
    id: "13",
    title: "Post-processing",
    description:
      "Post-processing refines and validates the raw LLM output before presenting it to the end-user, ensuring quality, correctness, and appropriate formatting.",
    whatItDoes:
      "Takes the raw output from the LLM and applies various transformations such as formatting (bullet points, markdown, JSON), fact-checking against source documents, adding citations, filtering inappropriate content, and summarizing when needed. It serves as a quality control layer before delivering the final response.",
    whyItMatters:
      "Even with context, LLMs can produce outputs that benefit from an extra check. Post-processing ensures the final answer is not only correct but also presented appropriately. It increases trust and usability by delivering polished, verified responses aligned with application-specific requirements.",
    challenges: [
      "Implementing reliable automated fact-checking against source documents",
      "Modifying outputs without changing their meaning or introducing errors",
      "Adding accurate citations that correctly link statements to sources",
      "Balancing thoroughness with response latency",
      "Creating robust systems that can handle unexpected model outputs",
    ],
    demo: <PostProcessingDemo />,
  },
  {
    id: "14",
    title: "Monitoring & Evaluation",
    description:
      "Monitoring and evaluation track the performance of your RAG system over time, helping you identify issues, measure quality, and drive continuous improvement.",
    whatItDoes:
      "Monitoring collects real-time metrics on system performance, such as latency, usage statistics, error rates, and user feedback. Evaluation systematically assesses answer quality through manual reviews, user ratings, and automated metrics against benchmark datasets. Both rely on comprehensive logging of inputs, retrievals, and outputs.",
    whyItMatters:
      "Without monitoring and evaluation, you're flying blind. These processes help you detect issues, understand where improvements are needed, and measure the impact of changes. They provide the insights necessary to maintain high quality, justify the system's performance, and catch regressions before they affect users.",
    challenges: [
      "Defining meaningful metrics that truly capture RAG system quality",
      "Attributing issues to specific pipeline components for targeted improvements",
      "Balancing comprehensive logging with privacy and storage concerns",
      "Creating effective alerting systems that catch both sudden and gradual degradation",
      "Developing evaluation strategies that evolve with your system and use cases",
    ],
    demo: <MonitoringEvaluationDemo />,
  },
  {
    id: "15",
    title: "Feedback Loop",
    description:
      "The feedback loop closes the cycle by incorporating insights and user feedback back into the RAG pipeline, enabling continuous improvement over time.",
    whatItDoes:
      "This process takes learnings from monitoring, user feedback, and evaluation to make iterative improvements throughout the pipeline. It includes adding missing content, refining chunking strategies, updating embeddings, fine-tuning models, and enhancing prompts based on real-world usage patterns and identified gaps.",
    whyItMatters:
      "No RAG system is perfect from the start. The feedback loop is how your system evolves and adapts to changing needs and expectations. By actively incorporating feedback, you can address content gaps, improve retrieval accuracy, enhance answer quality, and ensure your system remains relevant and effective as requirements change.",
    challenges: [
      "Collecting meaningful feedback from users who may not always provide explicit ratings",
      "Analyzing diverse feedback data to identify actionable improvements",
      "Avoiding regressions when implementing changes to fix specific issues",
      "Balancing qualitative insights with quantitative metrics",
      "Establishing organizational processes for continuous improvement",
    ],
    demo: <FeedbackLoopDemo />,
  },
]

export default function StepPage({ params }: { params: { id: string } }) {
  const stepId = params.id
  const step = steps.find((s) => s.id === stepId)

  if (!step) {
    notFound()
  }

  const currentIndex = steps.findIndex((s) => s.id === stepId)
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-2 py-10">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Link>
        </div>

        <header className="max-w-4xl mx-auto mb-12">
          <div className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
            Step {step.id}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            {step.title}
          </h1>
          <p className="text-xl text-slate-300">{step.description}</p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8">
          {/* Details Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-medium text-emerald-400 mb-3">
                What It Does
              </h2>
              <p className="text-slate-300">{step.whatItDoes}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-medium text-emerald-400 mb-3">
                Why It Matters
              </h2>
              <p className="text-slate-300">{step.whyItMatters}</p>
            </div>
          </section>

          {/* Challenges Section */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-medium text-emerald-400 mb-4">
              Common Challenges
            </h2>
            <ul className="space-y-2">
              {step.challenges.map((challenge, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-300 pl-2"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Demo Section */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-medium text-emerald-400 mb-4">
              Interactive Demo
            </h2>
            {step.demo}
          </section>

          {/* Respeak Call to Action */}
          <section className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-emerald-400 mb-2">
                  Skip the Complexity
                </h2>
                <p className="text-slate-300 mb-4">
                  Building a robust {step.title.toLowerCase()} solution is challenging. 
                  Respeak's Enterprise RAG Platform handles this complexity for you.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="https://meetings-eu1.hubspot.com/tim-rietz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm
                      font-medium transition-all flex items-center gap-2"
                  >
                    Schedule a Demo
                  </a>
                  <a
                    href="https://www.respeak.io/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm
                      font-medium transition-all flex items-center gap-2"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
              <div className="flex-shrink-0 hidden md:block">
                <a 
                  href="https://www.linkedin.com/in/timrietz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs">Follow <span className="font-medium">Dr. Tim Rietz</span></p>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            {prevStep ? (
              <Link
                href={`/steps/${prevStep.id}`}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  <span className="text-slate-400 text-sm block">Previous</span>
                  <span className="font-medium">{prevStep.title}</span>
                </span>
              </Link>
            ) : (
              <div></div>
            )}

            {nextStep ? (
              <Link
                href={`/steps/${nextStep.id}`}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
              >
                <span>
                  <span className="text-slate-400 text-sm block">Next</span>
                  <span className="font-medium">{nextStep.title}</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg transition-colors ml-auto"
              >
                <span className="font-medium">Back to Overview</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-2 py-8 text-center text-slate-400 border-t border-slate-800 mt-16">
        <p>© 2024 <a href="https://www.respeak.io" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Respeak GmbH</a>. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="https://www.respeak.io" className="hover:text-emerald-400 transition-colors">Website</a>
          <a href="https://www.linkedin.com/in/timrietz/" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
          <a href="https://meetings-eu1.hubspot.com/tim-rietz" className="hover:text-emerald-400 transition-colors">Book a Demo</a>
        </div>
      </footer>
    </div>
  )
}
