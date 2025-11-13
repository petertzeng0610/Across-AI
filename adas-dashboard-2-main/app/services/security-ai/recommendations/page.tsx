"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowLeft,
  Shield,
  Zap,
  Target,
  Lock,
  AlertTriangle,
  Clock,
  TrendingUp,
  Sparkles,
  Loader2,
  ChevronUp,
  FileText,
  Code,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState("security")
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [showingDetails, setShowingDetails] = useState<Record<string, "steps" | "config" | null>>({})

  const tabs = [
    { id: "security", label: "專業設定建議", icon: Shield },
    { id: "performance", label: "專業行動計劃建議", icon: Zap },
  ]

  const recommendations = {
    security: [
      {
        icon: Shield,
        title: "WAF 規則強化",
        description:
          "立即啟用主動防護模式，將當前優質監控的模式切換為熱點偵測模式，優先對封鎖指標進行全域等高風險攻擊進行阻擋，確保核心安全。",
        priority: true,
        steps: [
          "登入 Cloudflare Dashboard",
          "進入 Security > WAF 設定頁面",
          "將防護模式從 'Monitor' 切換為 'Block'",
          "啟用 OWASP Core Ruleset",
          "設定敏感度等級為 'High'",
          "儲存並部署變更",
        ],
        config: `# Cloudflare WAF 配置
security_level = "high"
waf_mode = "block"
owasp_ruleset = "enabled"
sensitivity = "high"`,
      },
      {
        icon: Lock,
        title: "機器人管理",
        description:
          "部署並啟用對自動化機器人的管理規則，對大量低風險的機器人流量採取限制措施或直接封鎖對策，以大幅降低攻擊風險並保護服務器負載。",
        priority: true,
        steps: [
          "進入 Security > Bots 管理頁面",
          "啟用 Bot Fight Mode",
          "設定機器人評分閾值為 30",
          "配置 Challenge 規則",
          "啟用 Super Bot Fight Mode（企業版）",
          "監控並調整規則",
        ],
        config: `# 機器人管理配置
bot_management = "enabled"
bot_fight_mode = "on"
score_threshold = 30
challenge_bad_bots = true`,
      },
      {
        icon: AlertTriangle,
        title: "安全告警機制",
        description: "建立並完善安全告警機制，確保在偵測到高風險攻擊時，能即時通知相關人員進行應對分析。",
        priority: true,
        steps: [
          "進入 Notifications 設定頁面",
          "建立新的告警規則",
          "設定觸發條件（攻擊次數、嚴重程度）",
          "配置通知渠道（Email、Slack、Webhook）",
          "設定通知頻率和去重規則",
          "測試告警機制",
        ],
        config: `# 告警配置
alert_threshold = 100
severity_levels = ["high", "critical"]
notification_channels = ["email", "slack"]
cooldown_period = "5m"`,
      },
    ],
    performance: [
      {
        icon: Target,
        title: "立即執行",
        description: "針對已發現的遠程指令碼攻擊特徵，建立虛擬補丁或自訂攔截規則，並立即上線生效。",
        priority: false,
        steps: [
          "分析攻擊特徵和模式",
          "建立自訂 WAF 規則",
          "設定攔截條件和動作",
          "在測試環境驗證規則",
          "部署到生產環境",
          "監控規則效果",
        ],
        config: `# 自訂規則配置
rule_name = "Block RCE Attempts"
expression = "(http.request.uri contains 'cmd=' or http.request.uri contains 'exec=')"
action = "block"`,
      },
      {
        icon: Clock,
        title: "短期優化",
        description:
          "在數週內，全面審視並啟用針對各類攻擊的預設防護規則集，將防護系統由監控模式調整為攔截模式，並觀察日誌以確保無誤攔正常請求之情況。",
        priority: false,
        steps: [
          "審查當前防護規則集",
          "啟用 OWASP 和 Cloudflare Managed Rulesets",
          "逐步將模式從 Monitor 改為 Block",
          "監控誤報情況",
          "調整規則敏感度",
          "建立白名單機制",
        ],
        config: `# 規則集配置
managed_rulesets = ["owasp", "cloudflare_managed"]
mode_transition = "monitor_to_block"
false_positive_threshold = 0.01`,
      },
      {
        icon: TrendingUp,
        title: "中期策略",
        description: "持續優化防護規則，根據攻擊趨勢調整策略，建立完整的安全監控體系。",
        priority: false,
        steps: [
          "建立定期安全審查機制",
          "分析攻擊趨勢和模式",
          "優化防護規則",
          "整合威脅情報",
          "建立自動化響應流程",
          "定期進行安全演練",
        ],
        config: `# 中期策略配置
review_frequency = "weekly"
threat_intelligence = "enabled"
auto_response = true
security_score_target = 95`,
      },
      {
        icon: Shield,
        title: "長期規劃",
        description: "建立全面的安全防護架構，整合多層次防護機制，確保系統長期穩定運行。",
        priority: false,
        steps: [
          "設計多層次防護架構",
          "整合 WAF、DDoS、Bot Management",
          "建立零信任安全模型",
          "實施持續安全監控",
          "建立災難恢復計劃",
          "定期更新安全策略",
        ],
        config: `# 長期架構配置
defense_layers = ["waf", "ddos", "bot_management", "zero_trust"]
monitoring = "continuous"
disaster_recovery = "enabled"
security_maturity_level = "advanced"`,
      },
    ],
  }

  const handleGenerateRecommendations = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowRecommendations(true)
    }, 3000)
  }

  const toggleCard = (index: number) => {
    const key = `${activeTab}-${index}`
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const showDetails = (index: number, type: "steps" | "config") => {
    const key = `${activeTab}-${index}`
    setShowingDetails((prev) => ({
      ...prev,
      [key]: prev[key] === type ? null : type,
    }))
    if (!expandedCards[key]) {
      setExpandedCards((prev) => ({ ...prev, [key]: true }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">服務管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/security-ai">SecurityAI一鍵分析</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">AI 智能建議</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter">
            AI 智能<span className="text-brand-primary">建議</span>
          </h1>
          <p className="mt-2 text-muted-foreground">專業安全配置建議與優化方案</p>
        </div>
        <Link href="/services/security-ai">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回分析選單
          </Button>
        </Link>
      </div>

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/10 mb-6 relative">
              <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-brand-primary/20 animate-ping" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">AI 正在分析中...</h2>
            <div className="space-y-2 text-muted-foreground max-w-md mx-auto">
              <p className="animate-pulse">正在分析安全數據</p>
              <p className="animate-pulse delay-100">生成專業建議</p>
              <p className="animate-pulse delay-200">優化防護策略</p>
            </div>
          </div>
        </div>
      ) : !showRecommendations ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/10 mb-6">
              <Sparkles className="h-10 w-10 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">準備生成 AI 智能建議</h2>
            <p className="text-muted-foreground max-w-md">
              點擊下方按鈕，AI 將根據您的安全數據分析結果，為您生成專業的配置建議與行動計劃
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleGenerateRecommendations}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            生成 AI 智能建議
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex gap-8 border-b border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-2 pb-4 px-2 transition-colors relative ${
                      activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations[activeTab as keyof typeof recommendations].map((rec, index) => {
              const Icon = rec.icon
              const cardKey = `${activeTab}-${index}`
              const isExpanded = expandedCards[cardKey]
              const detailType = showingDetails[cardKey]

              return (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      {rec.priority && (
                        <Badge
                          variant="outline"
                          className="border-[#EFC457]/50 text-[#EFC457] bg-[#EFC457]/5 flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#EFC457]" />
                          優先等級：中
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{rec.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showDetails(index, "steps")}
                        className="text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        查看詳細步驟
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showDetails(index, "config")}
                        className="text-xs"
                      >
                        <Code className="h-3 w-3 mr-1" />
                        生成配置指令
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        標記為已完成
                      </Button>
                    </div>

                    {isExpanded && detailType === "steps" && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-primary" />
                          詳細執行步驟
                        </h4>
                        <ol className="space-y-2 text-sm text-muted-foreground">
                          {rec.steps?.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex gap-2">
                              <span className="font-medium text-brand-primary">{stepIndex + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {isExpanded && detailType === "config" && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4 text-brand-primary" />
                          配置指令
                        </h4>
                        <pre className="text-xs text-muted-foreground bg-background/50 p-3 rounded overflow-x-auto">
                          <code>{rec.config}</code>
                        </pre>
                      </div>
                    )}

                    {isExpanded && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard(index)}
                        className="w-full mt-2 text-xs"
                      >
                        <ChevronUp className="h-3 w-3 mr-1" />
                        收起
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
