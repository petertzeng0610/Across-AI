"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Eye,
  Target,
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function AIAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // 模擬AI分析數據
  const threatIntelligence = {
    riskScore: 85,
    threatLevel: "高",
    predictedAttacks: 156,
    anomalies: 23,
    confidence: 94,
  }

  const analysisMenuItems = [
    {
      title: "圖表分析",
      description: "AI分析識別出的各類攻擊類型分佈和頻率統計，包含威脅分佈、性能趨勢和流量統計",
      icon: BarChart3,
      href: "/services/hiwaf/manage/ai-analysis/chart",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800/50",
    },
    {
      title: "行為分析",
      description: "AI檢測到的異常行為模式和自動化響應，包含異常登入、可疑API調用等行為分析",
      icon: Activity,
      href: "/services/hiwaf/manage/ai-analysis/behavior",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      borderColor: "border-purple-200 dark:border-purple-800/50",
    },
    {
      title: "智能建議",
      description: "基於威脅分析提供的個性化安全防護建議，包含優先級、預期影響和實施難度評估",
      icon: Zap,
      href: "/services/hiwaf/manage/ai-analysis/recommendations",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      borderColor: "border-orange-200 dark:border-orange-800/50",
    },
    {
      title: "趨勢分析",
      description: "過去30天的威脅變化趨勢、攻擊類型分佈和AI模型性能指標統計",
      icon: TrendingUp,
      href: "/services/hiwaf/manage/ai-analysis/trends",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      borderColor: "border-green-200 dark:border-green-800/50",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">服務總覽</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/hiwaf/manage">WAF防禦管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">AI智能分析</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          AI智能<span className="text-brand-primary">分析</span>
        </h1>
        <p className="mt-2 text-muted-foreground">運用人工智慧技術分析安全威脅，提供智能防護建議和攻擊預測</p>
      </div>

      {/* AI Analysis Control */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-primary" />
            AI分析控制台
          </CardTitle>
          <CardDescription>啟動AI智能分析，獲取即時威脅評估和防護建議</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={startAnalysis} disabled={isAnalyzing} className="flex items-center gap-2">
                {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                {isAnalyzing ? "分析中..." : "開始AI分析"}
              </Button>

              {isAnalyzing && (
                <div className="flex items-center gap-3">
                  <Progress value={analysisProgress} className="w-48" />
                  <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-green-700 dark:text-green-400 border-green-600 dark:border-green-500"
              >
                AI引擎運行中
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                匯出報告
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">威脅風險評分</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{threatIntelligence.riskScore}</div>
            <p className="text-xs text-muted-foreground">滿分100分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">威脅等級</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {threatIntelligence.threatLevel}
            </div>
            <p className="text-xs text-muted-foreground">當前威脅等級</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">預測攻擊</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{threatIntelligence.predictedAttacks}</div>
            <p className="text-xs text-muted-foreground">未來24小時</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">異常行為</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">{threatIntelligence.anomalies}</div>
            <p className="text-xs text-muted-foreground">檢測到異常</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI信心度</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {threatIntelligence.confidence}%
            </div>
            <p className="text-xs text-muted-foreground">分析準確度</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">分析功能選單</h2>
        <p className="text-muted-foreground mb-6">選擇以下分析功能，查看詳細的AI智能分析報告</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysisMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card
                  className={`h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer ${item.borderColor}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${item.bgColor} ${item.borderColor} border`}>
                          <Icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
