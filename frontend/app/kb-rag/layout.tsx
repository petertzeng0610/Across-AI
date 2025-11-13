import type React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function KBRAGLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08131D] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-slate-900/40 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-200 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">KB/RAG</h1>
              <p className="text-sm text-slate-400">Knowledge Base & Retrieval-Augmented Generation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
