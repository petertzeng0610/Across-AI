"use client"

import type React from "react"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ELKLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08131D]">
      {/* Top Navigation Bar */}
      <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-md">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">日誌分析系統</h1>
              <p className="text-sm text-slate-400">ELK Stack Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>{children}</div>
    </div>
  )
}
