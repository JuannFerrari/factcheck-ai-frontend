import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-xl mx-auto mt-20 p-4">
      <div className="bg-white/80 border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6 text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight">About FactCheck AI</h1>
        </div>
        <p className="text-lg text-gray-800 mb-4">
          <strong>FactCheck AI</strong> is an experimental project designed to help users quickly verify the accuracy of claims using AI and real-time web search.
        </p>
        <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-700 bg-blue-50/50 rounded mb-4 p-4">
          FactCheck AI was created to give users a fast, accessible way to verify claims using large language models and real-time web search. The tool combines OpenAI&apos;s GPT models with retrieval-augmented generation (RAG), powered by LangChain (via LangServe) and vector search using pgvector on Neon.
          <br /><br />
          On the frontend, it&apos;s built with Next.js and Tailwind CSS for a clean, responsive experience. This project has been a hands-on opportunity to learn more about AI, vector databases, and building full-stack applications that bridge NLP and real-world utility.
        </blockquote>
        <p className="text-gray-600">
          <span className="font-medium">Note:</span> This project is fully open source. You can find the code on GitHub via the link in the footer.
        </p>
      </div>
    </main>
  );
}
