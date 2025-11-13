"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, BarChart3, TrendingUp, Lightbulb, ArrowRight, Activity } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function SecurityAIPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">服務管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">SecurityAI一鍵分析</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          SecurityAI<span className="text-brand-primary">一鍵分析</span>
        </h1>
        <p className="mt-2 text-muted-foreground">運用AI技術快速分析安全事件，提供智能化威脅偵測與防護建議</p>
      </div>

      {/* AI Analysis Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/services/security-ai/chart" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 text-sky-500" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </div>
              <CardTitle className="text-lg">圖表分析</CardTitle>
              <CardDescription>視覺化呈現安全數據與攻擊趨勢</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">透過多維度圖表分析攻擊類型、威脅分佈、性能趨勢和流量統計</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/services/security-ai/behavior" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-sky-500" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </div>
              <CardTitle className="text-lg">行為分析</CardTitle>
              <CardDescription>AI驅動的異常行為偵測</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">識別並分析異常訪問模式、可疑行為和潛在威脅</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/services/security-ai/recommendations" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Lightbulb className="w-8 h-8 text-sky-500" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </div>
              <CardTitle className="text-lg">AI 智能建議</CardTitle>
              <CardDescription>AI生成的安全優化建議</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">根據分析結果提供個性化的安全配置和防護策略建議</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/services/security-ai/trends" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-sky-500" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </div>
              <CardTitle className="text-lg">AI 趨勢對比</CardTitle>
              <CardDescription>長期安全態勢追蹤</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">分析歷史數據，預測未來威脅趨勢和安全風險</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Features Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>SecurityAI 核心功能</CardTitle>
          <CardDescription>AI驅動的智能安全分析平台</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">即時威脅偵測</h3>
                <p className="text-sm text-muted-foreground">
                  運用機器學習算法即時識別和分類安全威脅，提供毫秒級的響應速度
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">智能行為分析</h3>
                <p className="text-sm text-muted-foreground">
                  深度學習模型分析用戶行為模式，自動識別異常活動和潛在攻擊
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">自動化建議</h3>
                <p className="text-sm text-muted-foreground">AI分析安全態勢後自動生成優化建議，協助快速提升防護能力</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">預測性防護</h3>
                <p className="text-sm text-muted-foreground">
                  基於歷史數據和趨勢分析，預測未來可能的攻擊向量並提前部署防護
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
