import { Info, AlertTriangle, Search, Brain, Shield, FileText } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Info className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            About FactCheck AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            An experimental AI-powered fact-checking tool designed for educational and research purposes.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Project Overview */}
          <div className="space-y-6">
            {/* Project Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                FactCheck AI was created as a learning project to explore AI-powered fact-checking using large language models and real-time web search.
                The tool combines Hugging Face&apos;s Llama 3.1 8B model with retrieval-augmented generation (RAG), powered by LangChain and web search APIs.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This project is fully open source and experimental.
                  You can find the code on GitHub via the link in the footer.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">AI Content Moderation</h3>
                    <p className="text-sm text-gray-600">Claims are first screened by AI for inappropriate or unsafe content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Web Search</h3>
                    <p className="text-sm text-gray-600">Relevant sources are searched using Serper.dev API</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">AI Fact-Checking</h3>
                    <p className="text-sm text-gray-600">The Llama 3.1 8B model analyzes claims against found sources</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Result Generation</h3>
                    <p className="text-sm text-gray-600">Verdict, confidence score, and reasoning are provided</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Technical Details & Disclaimer */}
          <div className="space-y-6">
            {/* Technical Stack */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Stack</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">AI Model</span>
                  <span className="font-medium text-gray-900">Llama 3.1 8B Instruct</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Framework</span>
                  <span className="font-medium text-gray-900">Next.js 14</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Styling</span>
                  <span className="font-medium text-gray-900">Tailwind CSS</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Backend</span>
                  <span className="font-medium text-gray-900">FastAPI</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Search API</span>
                  <span className="font-medium text-gray-900">Serper.dev</span>
                </div>
              </div>
            </div>

            {/* Important Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Important Disclaimer</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    This tool is for <strong>educational and research purposes only</strong>. Results are provided &quot;as is&quot; without any warranties.
                    Users should independently verify all information through authoritative sources and consult qualified professionals
                    for important decisions. This tool is not intended to replace professional fact-checking, legal advice, medical advice,
                    or other expert consultation. <strong>Use at your own risk.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Goals</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  AI-powered fact-checking systems
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Large language model integration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Web API integration and RAG
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Full-stack AI applications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
