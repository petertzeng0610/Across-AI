"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, BookOpen, Copy, Star, Filter, Tag, Shield, Zap, Globe, Network, Lock, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function CloudflarePromptLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())

  const toggleCard = (id: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const categories = [
    { id: "all", name: "全部", icon: BookOpen, count: 20 },
    { id: "waf", name: "WAF", icon: Shield, count: 5 },
    { id: "ddos", name: "DDoS", icon: Zap, count: 4 },
    { id: "cdn", name: "CDN", icon: Globe, count: 4 },
    { id: "dns", name: "DNS", icon: Network, count: 4 },
    { id: "ztna", name: "ZTNA", icon: Lock, count: 3 },
  ]

  const prompts = [
    // WAF Category
    {
      id: 1,
      title: "Cloudflare WAF 規則優化",
      description: "分析 WAF 日誌，識別誤報和漏報，優化防火牆規則配置",
      category: "waf",
      tags: ["WAF", "規則優化", "Cloudflare"],
      usage: 256,
      rating: 4.9,
      prompt:
        "分析以下 Cloudflare WAF 日誌數據，識別誤報（false positive）和漏報（false negative）案例，評估當前規則的有效性，並提供具體的規則優化建議，包括自定義規則配置和 OWASP 規則集調整...",
    },
    {
      id: 2,
      title: "WAF 攻擊模式分析",
      description: "分析 WAF 攔截的攻擊模式，識別攻擊類型和來源",
      category: "waf",
      tags: ["WAF", "攻擊分析", "威脅情報"],
      usage: 198,
      rating: 4.8,
      prompt:
        "根據 Cloudflare WAF 攔截日誌，分析攻擊模式和類型（SQL 注入、XSS、RCE 等），識別攻擊來源 IP 和地理位置，評估攻擊嚴重程度，並提供針對性的防護策略和規則調整建議...",
    },
    {
      id: 3,
      title: "WAF 自定義規則設計",
      description: "設計針對特定應用的 WAF 自定義規則",
      category: "waf",
      tags: ["WAF", "自定義規則", "應用安全"],
      usage: 187,
      rating: 4.7,
      prompt:
        "根據應用程式的特性和已知漏洞，設計 Cloudflare WAF 自定義規則，包括請求路徑匹配、參數驗證、Header 檢查和 Body 內容過濾，防止針對性攻擊並減少誤報...",
    },
    {
      id: 4,
      title: "WAF 性能優化",
      description: "優化 WAF 規則以提升性能並降低延遲",
      category: "waf",
      tags: ["WAF", "性能優化", "延遲"],
      usage: 165,
      rating: 4.6,
      prompt:
        "分析 Cloudflare WAF 規則的執行性能，識別高延遲規則和重複檢查，優化規則順序和匹配邏輯，並提供規則合併和簡化建議，在保持安全性的同時降低 WAF 處理延遲...",
    },
    {
      id: 5,
      title: "WAF 合規性檢查",
      description: "檢查 WAF 配置是否符合安全合規要求",
      category: "waf",
      tags: ["WAF", "合規", "PCI DSS"],
      usage: 154,
      rating: 4.8,
      prompt:
        "審查 Cloudflare WAF 配置，檢查是否符合 PCI DSS、GDPR、HIPAA 等合規標準要求，識別配置缺陷和安全風險，並提供符合合規要求的 WAF 規則和配置建議...",
    },

    // DDoS Category
    {
      id: 6,
      title: "DDoS 攻擊模式分析",
      description: "分析 DDoS 攻擊流量特徵，識別攻擊類型，制定緩解策略",
      category: "ddos",
      tags: ["DDoS", "流量分析", "Cloudflare"],
      usage: 242,
      rating: 4.9,
      prompt:
        "根據 Cloudflare Analytics 數據，分析 DDoS 攻擊的流量特徵，識別攻擊類型（HTTP Flood、SYN Flood、UDP Amplification 等），計算攻擊規模和持續時間，並提供 Cloudflare DDoS Protection 的最佳配置建議...",
    },
    {
      id: 7,
      title: "DDoS 防護策略設計",
      description: "設計多層次 DDoS 防護策略，保護關鍵業務",
      category: "ddos",
      tags: ["DDoS", "防護策略", "業務連續性"],
      usage: 215,
      rating: 4.8,
      prompt:
        "根據業務特性和歷史攻擊數據，設計 Cloudflare DDoS 防護策略，包括 L3/L4 和 L7 防護配置、Rate Limiting 規則、Challenge 策略和流量清洗設定，確保關鍵業務在攻擊期間的可用性...",
    },
    {
      id: 8,
      title: "DDoS 攻擊響應計劃",
      description: "制定 DDoS 攻擊事件響應計劃和流程",
      category: "ddos",
      tags: ["DDoS", "事件響應", "應急計劃"],
      usage: 189,
      rating: 4.7,
      prompt:
        "制定 DDoS 攻擊事件響應計劃，包括攻擊檢測和告警機制、響應團隊職責分工、緩解措施執行流程、業務切換策略和事後分析流程，並提供 Cloudflare DDoS Protection 的最佳實踐配置...",
    },
    {
      id: 9,
      title: "DDoS 流量基線分析",
      description: "建立正常流量基線，快速識別異常流量",
      category: "ddos",
      tags: ["DDoS", "基線分析", "異常檢測"],
      usage: 176,
      rating: 4.6,
      prompt:
        "分析 Cloudflare Analytics 歷史數據，建立正常流量基線模型，包括請求量、帶寬使用、地理分布和請求模式，設定異常檢測閾值，並提供基於基線的 DDoS 攻擊早期預警機制...",
    },

    // CDN Category
    {
      id: 10,
      title: "CDN 快取策略優化",
      description: "優化 CDN 快取配置，提升性能並降低源站負載",
      category: "cdn",
      tags: ["CDN", "快取", "性能優化"],
      usage: 228,
      rating: 4.8,
      prompt:
        "分析 Cloudflare CDN 快取命中率和性能指標，識別未快取或快取效率低的資源，評估 Cache Rules、Page Rules 和 Browser Cache TTL 配置，並提供優化建議以提升快取命中率、減少源站負載和改善用戶體驗...",
    },
    {
      id: 11,
      title: "CDN 內容分發優化",
      description: "優化內容分發策略，提升全球用戶訪問速度",
      category: "cdn",
      tags: ["CDN", "內容分發", "全球加速"],
      usage: 203,
      rating: 4.7,
      prompt:
        "分析 Cloudflare CDN 的全球流量分布和節點性能，識別高延遲地區和瓶頸節點，優化 Argo Smart Routing 配置，並提供內容預加載、動態內容加速和邊緣計算策略，提升全球用戶訪問速度...",
    },
    {
      id: 12,
      title: "CDN 快取清除策略",
      description: "設計智能快取清除策略，確保內容即時更新",
      category: "cdn",
      tags: ["CDN", "快取清除", "內容更新"],
      usage: 187,
      rating: 4.6,
      prompt:
        "設計 Cloudflare CDN 快取清除策略，包括全站清除、URL 清除、Tag 清除和 Prefix 清除的使用場景，制定自動化清除觸發機制，並提供快取版本控制和漸進式更新方案，確保內容即時更新且不影響性能...",
    },
    {
      id: 13,
      title: "CDN 成本優化分析",
      description: "分析 CDN 使用成本，優化帶寬和請求費用",
      category: "cdn",
      tags: ["CDN", "成本優化", "帶寬管理"],
      usage: 165,
      rating: 4.5,
      prompt:
        "分析 Cloudflare CDN 的帶寬使用和請求量數據，識別高成本資源和流量來源，評估快取策略和壓縮配置的成本效益，並提供帶寬優化、圖片優化和智能壓縮建議，降低 CDN 使用成本...",
    },

    // DNS Category
    {
      id: 14,
      title: "DNS 安全配置審查",
      description: "審查 DNS 配置，識別安全風險和最佳實踐",
      category: "dns",
      tags: ["DNS", "安全配置", "DNSSEC"],
      usage: 195,
      rating: 4.8,
      prompt:
        "審查 Cloudflare DNS 配置，檢查 DNSSEC 啟用狀態、DNS 記錄安全性、CAA 記錄配置和 DNS Firewall 設定，識別潛在的 DNS 劫持、緩存投毒和 DDoS 風險，並提供安全加固建議...",
    },
    {
      id: 15,
      title: "DNS 性能優化",
      description: "優化 DNS 解析性能，降低查詢延遲",
      category: "dns",
      tags: ["DNS", "性能優化", "延遲"],
      usage: 178,
      rating: 4.7,
      prompt:
        "分析 Cloudflare DNS 查詢性能數據，識別高延遲地區和慢速記錄，優化 DNS 記錄結構和 TTL 設定，並提供 DNS 預解析、CNAME Flattening 和 Anycast 路由優化建議，降低 DNS 查詢延遲...",
    },
    {
      id: 16,
      title: "DNS 流量分析",
      description: "分析 DNS 查詢流量，識別異常模式和潛在威脅",
      category: "dns",
      tags: ["DNS", "流量分析", "威脅檢測"],
      usage: 162,
      rating: 4.6,
      prompt:
        "分析 Cloudflare DNS Analytics 數據，識別異常查詢模式、DGA 域名、DNS 隧道和 DNS Amplification 攻擊，評估查詢來源和頻率，並提供基於威脅情報的 DNS Firewall 規則和防護策略...",
    },
    {
      id: 17,
      title: "DNS 負載均衡配置",
      description: "配置 DNS 負載均衡，實現高可用性和故障轉移",
      category: "dns",
      tags: ["DNS", "負載均衡", "高可用"],
      usage: 149,
      rating: 4.7,
      prompt:
        "設計 Cloudflare Load Balancing 配置，包括健康檢查設定、流量分配策略（Round Robin、Weighted、Geo Steering）、故障轉移規則和會話親和性，實現多源站負載均衡和高可用性架構...",
    },

    // ZTNA Category
    {
      id: 18,
      title: "Zero Trust 存取策略設計",
      description: "設計 Zero Trust 存取控制策略，保護內部應用程式",
      category: "ztna",
      tags: ["Zero Trust", "存取控制", "Cloudflare Access"],
      usage: 212,
      rating: 4.9,
      prompt:
        "設計 Cloudflare Zero Trust（Access）存取控制策略，包括身份驗證方法（SSO、OTP、硬體金鑰）、存取政策規則（基於用戶、群組、地理位置、裝置狀態）和應用程式保護配置，確保只有授權用戶可以存取內部資源...",
    },
    {
      id: 19,
      title: "ZTNA 裝置態勢檢查",
      description: "配置裝置態勢檢查，確保只有安全裝置可以存取",
      category: "ztna",
      tags: ["ZTNA", "裝置態勢", "端點安全"],
      usage: 186,
      rating: 4.8,
      prompt:
        "配置 Cloudflare WARP 裝置態勢檢查，包括作業系統版本驗證、防毒軟體狀態檢查、磁碟加密驗證和應用程式白名單，設定不符合安全要求的裝置處理策略，並提供端點安全加固建議...",
    },
    {
      id: 20,
      title: "ZTNA 存取日誌分析",
      description: "分析 Zero Trust 存取日誌，識別異常存取行為",
      category: "ztna",
      tags: ["ZTNA", "日誌分析", "異常檢測"],
      usage: 167,
      rating: 4.7,
      prompt:
        "分析 Cloudflare Access 存取日誌，識別異常登入嘗試、權限濫用、異常存取時間和地理位置異常，評估存取政策的有效性，並提供基於行為分析的存取控制優化建議和安全告警規則...",
    },
  ]

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
  }

  return (
    <div className="min-h-screen bg-[#08131D] p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-white text-2xl font-medium">Cloudflare Prompt Library</h1>
        </div>
        <p className="text-slate-400">Cloudflare 安全分析專用提示詞庫 | 共 {prompts.length} 個提示詞模板</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="搜尋提示詞、標籤或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {category.name} ({category.count})
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt, index) => {
          const isExpanded = expandedCards.has(prompt.id)

          return (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:border transition-all duration-300 h-full">
                <CardHeader className="cursor-pointer select-none" onClick={() => toggleCard(prompt.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg flex-1">{prompt.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="text-sm">{prompt.rating}</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardDescription>{prompt.description}</CardDescription>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {prompt.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="p-4 rounded-lg bg-card">
                            <div className="text-xs mb-2 opacity-70">提示詞預覽</div>
                            <p className="text-sm line-clamp-3">{prompt.prompt}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-xs opacity-70">使用次數: {prompt.usage}</div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyPrompt(prompt.prompt)
                              }}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              複製提示詞
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredPrompts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 opacity-70"
        >
          <BookOpen className="w-16 h-16 mb-4" />
          <p className="text-lg">找不到符合條件的提示詞</p>
          <p className="text-sm">請嘗試其他搜尋關鍵字或篩選條件</p>
        </motion.div>
      )}
    </div>
  )
}
