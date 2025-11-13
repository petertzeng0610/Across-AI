"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, RefreshCw, AlertTriangle, Shield, Activity } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  source: string
  sourceIcon: string
  level: "info" | "warning" | "critical"
  event: string
  details: string
  ip?: string
  country?: string
}

export default function ELKDashboard() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  const logEntries: LogEntry[] = [
    {
      id: "1",
      timestamp: "2025-01-22 14:32:15",
      source: "Cloudflare",
      sourceIcon: "/logos/Cloudflar.png",
      level: "critical",
      event: "DDoS 攻擊偵測",
      details: "偵測到來自 185.220.101.x 的大量請求",
      ip: "185.220.101.45",
      country: "俄羅斯",
    },
    {
      id: "2",
      timestamp: "2025-01-22 14:28:42",
      source: "Palo Alto",
      sourceIcon: "/logos/palo-alto-networks-1.png",
      level: "warning",
      event: "可疑流量偵測",
      details: "Cortex 偵測到異常連線模式",
      ip: "203.145.67.89",
      country: "中國",
    },
    {
      id: "3",
      timestamp: "2025-01-22 14:25:18",
      source: "F5",
      sourceIcon: "/logos/f5_b.png",
      level: "info",
      event: "負載平衡調整",
      details: "LTM 自動調整流量分配",
    },
    {
      id: "4",
      timestamp: "2025-01-22 14:20:33",
      source: "CATO Networks",
      sourceIcon: "/logos/cato-networks.png",
      level: "warning",
      event: "SASE 異常連線",
      details: "偵測到未授權的 VPN 連線嘗試",
      ip: "45.142.212.67",
      country: "烏克蘭",
    },
    {
      id: "5",
      timestamp: "2025-01-22 14:15:07",
      source: "INTEZER AI",
      sourceIcon: "/logos/INTEZER_logo.png",
      level: "critical",
      event: "惡意軟體偵測",
      details: "發現新型勒索軟體變種",
      ip: "91.203.5.122",
      country: "羅馬尼亞",
    },
    {
      id: "6",
      timestamp: "2025-01-22 14:10:55",
      source: "CyCraftAI",
      sourceIcon: "/logos/craftai.png",
      level: "warning",
      event: "威脅情資更新",
      details: "新增 127 個惡意 IP 至黑名單",
    },
    {
      id: "7",
      timestamp: "2025-01-22 14:05:22",
      source: "Custom SIEM",
      sourceIcon: "",
      level: "info",
      event: "日誌彙整完成",
      details: "成功處理 15,234 筆日誌記錄",
    },
    {
      id: "8",
      timestamp: "2025-01-22 14:00:11",
      source: "Cloudflare",
      sourceIcon: "/logos/Cloudflar.png",
      level: "critical",
      event: "WAF 規則觸發",
      details: "阻擋 SQL Injection 攻擊嘗試",
      ip: "103.75.201.45",
      country: "印度",
    },
  ]

  const filteredLogs = logEntries.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSource = selectedSource === "all" || log.source === selectedSource

    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel

    return matchesSearch && matchesSource && matchesLevel
  })

  const sources = ["all", "Cloudflare", "Palo Alto", "F5", "CATO Networks", "INTEZER AI", "CyCraftAI", "Custom SIEM"]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      case "info":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      case "warning":
        return <Shield className="w-4 h-4" />
      case "info":
        return <Activity className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-white" />
              <span className="text-sm text-white">重新整理</span>
            </button>
            <button className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
              <Download className="w-4 h-4 text-white" />
              <span className="text-sm text-white">匯出</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-red-500/30 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">嚴重事件</div>
            <div className="text-2xl font-bold text-red-400">3</div>
            <div className="text-xs text-slate-500 mt-1">需立即處理</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-yellow-500/30 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">警告事件</div>
            <div className="text-2xl font-bold text-yellow-400">3</div>
            <div className="text-xs text-slate-500 mt-1">需要關注</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-cyan-500/30 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">一般事件</div>
            <div className="text-2xl font-bold text-cyan-400">2</div>
            <div className="text-xs text-slate-500 mt-1">正常運作</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-white/20 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">資料來源</div>
            <div className="text-2xl font-bold text-white">7</div>
            <div className="text-xs text-slate-500 mt-1">全部活動中</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋事件、來源或詳細資訊..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/40 border border-white/20 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-all duration-300"
            />
          </div>

          {/* Source Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-900/40 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400/60 transition-all duration-300 appearance-none cursor-pointer"
            >
              {sources.map((source) => (
                <option key={source} value={source} className="bg-slate-900">
                  {source === "all" ? "所有來源" : source}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 bg-slate-900/40 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400/60 transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">
                所有等級
              </option>
              <option value="critical" className="bg-slate-900">
                嚴重
              </option>
              <option value="warning" className="bg-slate-900">
                警告
              </option>
              <option value="info" className="bg-slate-900">
                一般
              </option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
