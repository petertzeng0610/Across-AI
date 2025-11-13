"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const brands = [
  { name: "Cloudflare", logo: "/logos/Cloudflar.png", href: "/prompt-library/cloudflare", disabled: false },
  { name: "Palo Alto", logo: "/logos/palo-alto-networks-1.png", href: "#", disabled: true },
  { name: "F5", logo: "/logos/f5_b.png", href: "#", disabled: true },
  { name: "CATO", logo: "/logos/cato-networks.png", href: "#", disabled: true },
  { name: "Intezer", logo: "/logos/INTEZER_logo.png", href: "#", disabled: true },
  { name: "CyCraft", logo: "/logos/craftai.png", href: "#", disabled: true },
]

export default function PromptLibraryLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#08131D]">
      {/* Brand Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "240px" }}
        transition={{ duration: 0.3 }}
        className="relative bg-slate-900/40 border-r border-white/10 backdrop-blur-sm flex flex-col"
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          {!isCollapsed ? (
            <div>
              <h2 className="text-white text-lg font-medium">Prompt Library</h2>
              <p className="text-slate-400 text-xs mt-1">選擇品牌查看提示詞庫</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 text-xs font-bold">PL</span>
              </div>
            </div>
          )}
        </div>

        {/* Brand List */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {brands.map((brand, index) => {
            const isActive = pathname?.includes(brand.href) && brand.href !== "#"

            return (
              <Link
                key={index}
                href={brand.disabled ? "#" : brand.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  brand.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/5 hover:border-cyan-400/30 cursor-pointer"
                } ${isCollapsed ? "justify-center" : ""}`}
                onClick={(e) => brand.disabled && e.preventDefault()}
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={brand.logo || "/placeholder.svg"} alt={brand.name} className="w-6 h-6 object-contain" />
                </div>
                {!isCollapsed && <span className="text-white text-sm font-medium">{brand.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Back to Dashboard */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent">
                返回 Dashboard
              </Button>
            </Link>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
