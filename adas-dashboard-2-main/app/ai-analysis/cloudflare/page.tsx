"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle, Globe, Clock, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWAFData } from "@/app/dashboard/waf-data-context"

export default function CloudflareAIAnalysisPage() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("high")

  const { wafRisks, setWafRisks } = useWAFData()

  useEffect(() => {
    // 如果 context 中沒有數據，則使用本地模擬數據
    if (wafRisks.length === 0) {
      setWafRisks([
        {
          id: "sql-injection-surge",
          title: "SQL 注入攻擊激增",
          severity: "critical",
          openIssues: 3120,
          resolvedIssues: 245,
          affectedAssets: 45,
          tags: ["Exploit In Wild", "Internet Exposed", "Confirmed Exploitable"],
          description:
            "檢測到針對資料庫查詢端點的 SQL 注入攻擊大幅增加。攻擊者嘗試通過惡意構造的 SQL 語句繞過身份驗證並獲取敏感數據。此類攻擊已被確認在野外活躍利用，且多個端點暴露於公網。",
          createdDate: "Apr 6, 2025",
          updatedDate: "Apr 9, 2025",
          exploitInWild: true,
          internetExposed: true,
          confirmedExploitable: true,
          cveId: "CVE-2025-1234",
          recommendations: [
            {
              title: "啟用 WAF SQL 注入防護規則",
              description: "立即啟用 Cloudflare WAF 的 SQL 注入防護規則集，阻擋惡意請求",
              priority: "high",
            },
            {
              title: "更新參數化查詢",
              description: "檢查並更新所有資料庫查詢，使用參數化查詢防止注入攻擊",
              priority: "high",
            },
          ],
        },
        {
          id: "xss-attack-detection",
          title: "跨站腳本 (XSS) 攻擊檢測",
          severity: "high",
          openIssues: 1890,
          resolvedIssues: 156,
          affectedAssets: 23,
          tags: ["Internet Exposed", "Confirmed Exploitable"],
          description:
            "發現多個端點存在 XSS 漏洞，攻擊者可能通過注入惡意腳本竊取用戶 Cookie 或會話令牌。已確認部分端點可被利用，建議立即採取防護措施。",
          createdDate: "Apr 5, 2025",
          updatedDate: "Apr 9, 2025",
          exploitInWild: false,
          internetExposed: true,
          confirmedExploitable: true,
          cveId: "CVE-2025-5678",
          recommendations: [
            {
              title: "啟用 XSS 防護規則",
              description: "配置 Cloudflare WAF 的 XSS 防護規則，過濾惡意腳本",
              priority: "high",
            },
            {
              title: "實施內容安全策略 (CSP)",
              description: "在應用程式中實施嚴格的 CSP 標頭，限制腳本執行來源",
              priority: "medium",
            },
          ],
        },
        {
          id: "malicious-bot-traffic",
          title: "惡意機器人流量",
          severity: "medium",
          openIssues: 2541,
          resolvedIssues: 892,
          affectedAssets: 67,
          tags: ["Internet Exposed"],
          description:
            "檢測到大量來自已知惡意 IP 地址的機器人流量，這些機器人嘗試進行內容抓取、暴力破解和 DDoS 攻擊。建議啟用機器人管理功能以減輕影響。",
          createdDate: "Apr 3, 2025",
          updatedDate: "Apr 9, 2025",
          exploitInWild: false,
          internetExposed: true,
          confirmedExploitable: false,
          recommendations: [
            {
              title: "啟用 Bot Management",
              description: "配置 Cloudflare Bot Management 以識別和阻擋惡意機器人",
              priority: "medium",
            },
            {
              title: "實施速率限制",
              description: "對可疑 IP 地址實施速率限制，防止暴力破解攻擊",
              priority: "medium",
            },
          ],
        },
        {
          id: "path-traversal-attempts",
          title: "路徑遍歷攻擊嘗試",
          severity: "medium",
          openIssues: 1456,
          resolvedIssues: 234,
          affectedAssets: 18,
          tags: ["Internet Exposed"],
          description:
            "發現多次嘗試通過路徑遍歷技術訪問系統文件的攻擊行為。攻擊者試圖使用 '../' 等特殊字符繞過訪問控制，獲取敏感配置文件。",
          createdDate: "Apr 4, 2025",
          updatedDate: "Apr 8, 2025",
          exploitInWild: false,
          internetExposed: true,
          confirmedExploitable: false,
          cveId: "CVE-2025-9012",
          recommendations: [
            {
              title: "啟用路徑遍歷防護",
              description: "配置 WAF 規則以阻擋包含路徑遍歷模式的請求",
              priority: "medium",
            },
            {
              title: "檢查文件訪問權限",
              description: "審查並限制應用程式的文件系統訪問權限",
              priority: "medium",
            },
          ],
        },
        {
          id: "abnormal-user-agent",
          title: "異常 User-Agent 檢測",
          severity: "low",
          openIssues: 982,
          resolvedIssues: 445,
          affectedAssets: 12,
          tags: [],
          description:
            "檢測到使用異常或偽造 User-Agent 標頭的請求。這些請求可能來自自動化工具或惡意爬蟲，建議進行監控和分析。",
          createdDate: "Apr 2, 2025",
          updatedDate: "Apr 7, 2025",
          exploitInWild: false,
          internetExposed: false,
          confirmedExploitable: false,
          recommendations: [
            {
              title: "配置 User-Agent 過濾",
              description: "設置規則以識別和阻擋可疑的 User-Agent",
              priority: "low",
            },
            {
              title: "監控異常流量模式",
              description: "持續監控並分析異常 User-Agent 的流量模式",
              priority: "low",
            },
          ],
        },
        {
          id: "http-method-abuse",
          title: "HTTP 方法濫用",
          severity: "low",
          openIssues: 745,
          resolvedIssues: 312,
          affectedAssets: 8,
          tags: [],
          description:
            "發現使用非標準 HTTP 方法（如 TRACE、TRACK）的請求。這些方法可能被用於探測服務器配置或進行跨站追蹤攻擊。",
          createdDate: "Apr 1, 2025",
          updatedDate: "Apr 6, 2025",
          exploitInWild: false,
          internetExposed: false,
          confirmedExploitable: false,
          recommendations: [
            {
              title: "限制允許的 HTTP 方法",
              description: "配置服務器僅允許必要的 HTTP 方法（GET、POST、PUT、DELETE）",
              priority: "low",
            },
            {
              title: "記錄異常方法請求",
              description: "記錄所有使用非標準 HTTP 方法的請求以供分析",
              priority: "low",
            },
          ],
        },
      ])
    }
  }, [wafRisks.length, setWafRisks])

  const risksByCategory = {
    high: wafRisks.filter((r) => r.severity === "critical" || r.severity === "high"),
    medium: wafRisks.filter((r) => r.severity === "medium"),
    low: wafRisks.filter((r) => r.severity === "low"),
  }

  const categoryStats = {
    high: {
      count: risksByCategory.high.length,
      openIssues: risksByCategory.high.reduce((sum, r) => sum + r.openIssues, 0),
      affectedAssets: risksByCategory.high.reduce((sum, r) => sum + r.affectedAssets, 0),
    },
    medium: {
      count: risksByCategory.medium.length,
      openIssues: risksByCategory.medium.reduce((sum, r) => sum + r.openIssues, 0),
      affectedAssets: risksByCategory.medium.reduce((sum, r) => sum + r.affectedAssets, 0),
    },
    low: {
      count: risksByCategory.low.length,
      openIssues: risksByCategory.low.reduce((sum, r) => sum + r.openIssues, 0),
      affectedAssets: risksByCategory.low.reduce((sum, r) => sum + r.affectedAssets, 0),
    },
  }

  useEffect(() => {
    if (risksByCategory[selectedCategory as keyof typeof risksByCategory].length > 0 && !selectedIssue) {
      setSelectedIssue(risksByCategory[selectedCategory as keyof typeof risksByCategory][0].id)
    }
  }, [selectedCategory, selectedIssue])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/50 border-red-500/50"
      case "high":
        return "bg-orange-900/50 border-orange-500/50"
      case "medium":
        return "bg-yellow-900/50 border-yellow-500/50"
      case "low":
        return "bg-blue-900/50 border-blue-500/50"
      default:
        return "bg-slate-900/50 border-slate-500/50"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "嚴重"
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return severity
    }
  }

  const totalOpenIssues = wafRisks.reduce((sum, risk) => sum + risk.openIssues, 0)
  const totalAffectedAssets = wafRisks.reduce((sum, risk) => sum + risk.affectedAssets, 0)

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
          <h1 className="text-3xl font-bold text-white">AI Cyber Security Analysis - Cloudflare</h1>
        </div>
        <p className="text-slate-400">
          基於 Cloudflare 安全數據的智能分析與建議 | 總計 {totalOpenIssues} 個開放問題，影響 {totalAffectedAssets}{" "}
          個資產
        </p>
      </motion.div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: 風險評估 (Risk Assessment) - Category Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                風險評估
              </CardTitle>
              <CardDescription className="text-slate-400">依嚴重程度分類</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={() => {
                  setSelectedCategory("high")
                  if (risksByCategory.high.length > 0) {
                    setSelectedIssue(risksByCategory.high[0].id)
                  }
                }}
                className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCategory === "high"
                    ? "border-red-400/60 bg-red-900/20 shadow-lg shadow-red-500/20"
                    : "border-red-500/30 bg-red-900/10 hover:border-red-400/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50" variant="outline">
                      高風險
                    </Badge>
                    <div className="text-3xl font-bold text-red-400">{categoryStats.high.count}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-red-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">開放問題</span>
                      <span className="text-white font-semibold">{categoryStats.high.openIssues}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">受影響資產</span>
                      <span className="text-white font-semibold">{categoryStats.high.affectedAssets}</span>
                    </div>
                  </div>
                  <div className="text-xs text-red-400/80 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    需要立即處理
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={() => {
                  setSelectedCategory("medium")
                  if (risksByCategory.medium.length > 0) {
                    setSelectedIssue(risksByCategory.medium[0].id)
                  }
                }}
                className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCategory === "medium"
                    ? "border-yellow-400/60 bg-yellow-900/20 shadow-lg shadow-yellow-500/20"
                    : "border-yellow-500/30 bg-yellow-900/10 hover:border-yellow-400/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50" variant="outline">
                      中風險
                    </Badge>
                    <div className="text-3xl font-bold text-yellow-400">{categoryStats.medium.count}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-yellow-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">開放問題</span>
                      <span className="text-white font-semibold">{categoryStats.medium.openIssues}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">受影響資產</span>
                      <span className="text-white font-semibold">{categoryStats.medium.affectedAssets}</span>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    建議盡快處理
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                onClick={() => {
                  setSelectedCategory("low")
                  if (risksByCategory.low.length > 0) {
                    setSelectedIssue(risksByCategory.low[0].id)
                  }
                }}
                className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCategory === "low"
                    ? "border-blue-400/60 bg-blue-900/20 shadow-lg shadow-blue-500/20"
                    : "border-blue-500/30 bg-blue-900/10 hover:border-blue-400/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50" variant="outline">
                      低風險
                    </Badge>
                    <div className="text-3xl font-bold text-blue-400">{categoryStats.low.count}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-blue-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">開放問題</span>
                      <span className="text-white font-semibold">{categoryStats.low.openIssues}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">受影響資產</span>
                      <span className="text-white font-semibold">{categoryStats.low.affectedAssets}</span>
                    </div>
                  </div>
                  <div className="text-xs text-blue-400/80 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    可排程處理
                  </div>
                </div>
              </motion.div>

              {risksByCategory[selectedCategory as keyof typeof risksByCategory].length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-slate-400 mb-3">
                    {selectedCategory === "high" && "高風險項目"}
                    {selectedCategory === "medium" && "中風險項目"}
                    {selectedCategory === "low" && "低風險項目"}
                  </div>
                  <div className="space-y-2">
                    {risksByCategory[selectedCategory as keyof typeof risksByCategory].map((risk) => (
                      <div
                        key={risk.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedIssue(risk.id)
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          selectedIssue === risk.id
                            ? "border-cyan-400/60 bg-cyan-900/20"
                            : "border-white/10 bg-slate-800/30 hover:border-white/20"
                        }`}
                      >
                        <div className="text-white font-medium mb-1 line-clamp-2">{risk.title}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{risk.openIssues} 問題</span>
                          <span>•</span>
                          <span>{risk.affectedAssets} 資產</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 2: 趨勢分析 (Trend Analysis) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-6"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                趨勢分析
              </CardTitle>
              <CardDescription className="text-slate-400">詳細漏洞資訊與威脅情報</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIssue && wafRisks.length > 0 ? (
                <motion.div
                  key={selectedIssue}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {wafRisks
                    .filter((a) => a.id === selectedIssue)
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className={`p-6 rounded-lg border ${getSeverityColor(assessment.severity)}`}
                      >
                        {/* Header */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <Clock className="w-3 h-3" />
                            <span>Updated on: {assessment.updatedDate}</span>
                            <span>|</span>
                            <span>Created on: {assessment.createdDate}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-3">{assessment.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            {assessment.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-red-500/20 text-red-400 border-red-500/50"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-300 leading-relaxed text-sm">{assessment.description}</p>
                        </div>

                        {assessment.cveId && (
                          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-400 mb-1">CVE 編號</div>
                            <div className="text-sm font-mono text-cyan-400">{assessment.cveId}</div>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Open Issues</div>
                            <div className="text-2xl font-bold text-white">{assessment.openIssues}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Resolved</div>
                            <div className="text-2xl font-bold text-green-400">{assessment.resolvedIssues}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Affected Assets</div>
                            <div className="text-2xl font-bold text-orange-400">{assessment.affectedAssets}</div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            <h4 className="text-white font-semibold">AI 深度分析</h4>
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm">
                            根據威脅情報分析，此類攻擊在過去 24 小時內呈現上升趨勢。
                            攻擊者主要針對身份驗證端點，建議立即採取防護措施並監控相關日誌。 系統已自動標記{" "}
                            {assessment.affectedAssets} 個受影響資產，建議優先處理。
                          </p>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Globe className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">請從左側選擇一個風險項目查看詳細分析</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 3: 執行建議按鈕 (Action Recommendations) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                執行建議按鈕
              </CardTitle>
              <CardDescription className="text-slate-400">AI 推薦的修復措施</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIssue && wafRisks.length > 0 ? (
                <motion.div
                  key={`action-${selectedIssue}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {wafRisks
                    .filter((a) => a.id === selectedIssue)
                    .map((assessment) => (
                      <div key={assessment.id} className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-amber-400 mb-3">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-semibold">RECOMMENDED ACTIONS</span>
                        </div>

                        {assessment.recommendations.map((rec, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/30">
                            <div className="flex items-start gap-3 mb-4">
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-medium">{rec.title}</h4>
                                  <Badge
                                    className={
                                      rec.priority === "high"
                                        ? "bg-red-500/20 text-red-400 border-red-500/50"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                    }
                                    variant="outline"
                                  >
                                    {rec.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400">{rec.description}</p>
                              </div>
                            </div>

                            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              執行此操作
                            </Button>
                          </div>
                        ))}

                        <div className="space-y-2 mt-6">
                          <div className="text-xs text-slate-400 mb-2">其他可用操作</div>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            生成詳細報告
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            創建工單
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            通知相關人員
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            查看歷史趨勢
                          </Button>
                        </div>

                        <div className="mt-6 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400">風險等級</span>
                            <Badge className={getSeverityBadgeColor(assessment.severity)} variant="outline">
                              {getSeverityLabel(assessment.severity)}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-300">
                            {assessment.exploitInWild && "⚠️ 此漏洞已被確認在野外利用，"}
                            {assessment.internetExposed && "暴露於互聯網，"}
                            建議立即採取行動
                          </div>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <XCircle className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-center">請先選擇一個風險項目以查看執行建議</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
