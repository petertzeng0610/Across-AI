"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft, Shield, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function BehaviorAnalysisPage() {
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
            <BreadcrumbPage className="text-foreground font-medium">行為分析</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter flex items-center gap-3">
            <Shield className="h-8 w-8 text-brand-primary" />
            AI 防護分析報告
          </h1>
          <p className="mt-2 text-muted-foreground">基於系統分析的智能安全建議與行動計劃</p>
        </div>
        <Link href="/services/security-ai">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回分析選單
          </Button>
        </Link>
      </div>

      {/* 防護效能概要 */}
      <Card className="mb-8 border-l-4 border-l-brand-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">防護效能概要</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-sm">
            此份報告顯示，安全系統目前處於警戒，未攔截的威脅較高。等效所有偵測到的攻擊皆未被阻擋，儘管系統成功辨識出這些威脅，但百分之零的阻擋率是當前最嚴峻的問題。原因主要來自於大規模的自動化機器人攻擊，並伴隨著少量但極度危險的遠端執行碼攻擊指令及防護的缺點，並需調整策略以提升防護的效能。
          </p>
        </CardContent>
      </Card>

      {/* 圖表分析解讀 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">圖表分析解讀</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 左欄 */}
            <div className="space-y-6 md:pr-8 border-muted-foreground md:border-r-[0.75px]">
              {/* 攻擊類型統計 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-brand-primary rounded-full" />
                  攻擊類型統計
                </h3>
                <p className="text-muted-foreground pl-4 text-sm">
                  攻擊類型：絕大多數的攻擊為自動化機器人行為，台機器的風險性比例、此外、系統也偵測到少次高危險的遠端執行碼攻擊，以及零星的跨站腳本攻擊。
                </p>
              </div>

              {/* 威脅分佈分析 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-brand-primary rounded-full" />
                  威脅分佈分析
                </h3>
                <p className="text-muted-foreground pl-4 text-sm">
                  威脅分佈：自動化攻擊佔所有威脅事件的百分之九十八，是主要的攻擊手段。僅極指數據顯示較高威脅，是第二值得關注的威脅。
                </p>
              </div>
            </div>

            {/* 右欄 */}
            <div className="space-y-6 md:pl-8">
              {/* 性能趨勢分析 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-brand-primary rounded-full" />
                  性能趨勢分析
                </h3>
                <p className="text-muted-foreground pl-4 text-sm">
                  性能趨勢：系統平均響應時間維持在低百毫秒十毫秒，此數據反映了當前優化分析結果而未執行攔截動作的效能基線，表現理想。
                </p>
              </div>

              {/* 流量統計分析 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-brand-primary rounded-full" />
                  流量統計分析
                </h3>
                <p className="text-muted-foreground pl-4 text-sm">
                  流量統計：數據顯示，所有進入網站的流量都被分類為惡意流量，這意味著此統計可能正確支援性的攻擊，且目前尚有任何正常用戶的訪問流量。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 下一步行動計劃 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">下一步行動計劃</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 立即執行 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg">立即執行</h3>
            </div>
            <div className="pl-11 space-y-2 text-sm text-muted-foreground">
              <p>無需等待，應立即採取的關鍵行動</p>
            </div>
          </div>

          {/* 短期計劃 (1-7天) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-lg">短期計劃 (1-7天)</h3>
            </div>
            <div className="pl-11 space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  立即：針對已經發現的攻擊特徵進行攔截，建立並應用攔截規則，並立即上線生效。
                </p>
                <p className="text-sm text-muted-foreground">
                  短期：在數週內，全面審視現有的防護規則並優化或新增針對攻擊的防護規則，如防範遠端執行碼攻擊或跨站腳本攻擊等。
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  中期：在未來一至三個月內，根據攻擊趨勢的變化，持續優化與調整防護策略，並加強對新型攻擊的防禦能力。
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  長期：建立定期的安全性檢視與測試機制，並逐��引入更進階的測試，以確保能夠應對未來演進的威脅與有效性。
                </p>
              </div>
            </div>
          </div>

          {/* 中期計劃 (1-4週) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg">中期計劃 (1-4週)</h3>
            </div>
            <div className="pl-11 space-y-2 text-sm text-muted-foreground">
              <p>持續優化與調整防護策略</p>
            </div>
          </div>

          {/* 長期規劃 (1-3個月) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg">長期規劃 (1-3個月)</h3>
            </div>
            <div className="pl-11 space-y-2 text-sm text-muted-foreground">
              <p>建立定期安全檢視機制，引入進階測試</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
