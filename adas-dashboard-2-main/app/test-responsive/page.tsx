"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Globe, Zap, Settings, AlertTriangle, CheckCircle } from "lucide-react"

export default function TestResponsivePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 螢幕尺寸指示器 */}
      <Card>
        <CardHeader>
          <CardTitle>當前螢幕尺寸</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="block sm:hidden">
              手機版 (&lt; 640px)
            </Badge>
            <Badge variant="outline" className="hidden sm:block md:hidden">
              平板版 (640px - 768px)
            </Badge>
            <Badge variant="outline" className="hidden md:block lg:hidden">
              小桌面 (768px - 1024px)
            </Badge>
            <Badge variant="outline" className="hidden lg:block xl:hidden">
              桌面版 (1024px - 1280px)
            </Badge>
            <Badge variant="outline" className="hidden xl:block">
              大桌面 (&gt; 1280px)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Badge 尺寸測試 */}
      <Card>
        <CardHeader>
          <CardTitle>Badge 尺寸測試</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">小尺寸 (sm)</h3>
            <div className="flex flex-wrap gap-2">
              <Badge size="sm" variant="default">
                預設
              </Badge>
              <Badge size="sm" variant="secondary">
                次要
              </Badge>
              <Badge size="sm" variant="destructive">
                危險
              </Badge>
              <Badge size="sm" variant="outline">
                外框
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">標準尺寸 (default) - 響應式</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">預設</Badge>
              <Badge variant="secondary">次要</Badge>
              <Badge variant="destructive">危險</Badge>
              <Badge variant="outline">外框</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">大尺寸 (lg)</h3>
            <div className="flex flex-wrap gap-2">
              <Badge size="lg" variant="default">
                預設
              </Badge>
              <Badge size="lg" variant="secondary">
                次要
              </Badge>
              <Badge size="lg" variant="destructive">
                危險
              </Badge>
              <Badge size="lg" variant="outline">
                外框
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 長文字測試 */}
      <Card>
        <CardHeader>
          <CardTitle>長文字處理測試</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Badge className="max-w-full truncate">這是一個非常長的標籤文字，用來測試在小螢幕上的顯示效果</Badge>
            <Badge size="sm" className="max-w-full truncate">
              小���寸長文字測試標籤
            </Badge>
            <div className="flex flex-wrap gap-1">
              <Badge>短</Badge>
              <Badge>中等長度</Badge>
              <Badge className="max-w-[120px] truncate">超級長的標籤文字內容</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WAF 管理頁面���景模擬 */}
      <Card>
        <CardHeader>
          <CardTitle>WAF 管理場景模擬</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 域名配置區塊 */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  主域名配置
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    3個已配置
                  </Badge>
                  <Badge variant="outline">中等安全</Badge>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  設定
                </Button>
                <Button size="sm">
                  <Shield className="h-4 w-4 mr-1" />
                  防護
                </Button>
              </div>
            </div>
          </div>

          {/* 子域名列表 */}
          <div className="space-y-3">
            <h4 className="font-medium">子域名列表</h4>
            <div className="space-y-2">
              {[
                { domain: "api.example.com", type: "A", status: "正常" },
                { domain: "cdn.example.com", type: "AAAA", status: "警告" },
                { domain: "admin.example.com", type: "CNAME", status: "正常" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.domain}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <Badge size="sm" variant="outline">
                      {item.type}
                    </Badge>
                    <Badge size="sm" variant={item.status === "正常" ? "secondary" : "destructive"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 安全統計 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "今日攻擊", value: "1,234", icon: AlertTriangle, variant: "destructive" as const },
              { label: "已阻擋", value: "1,200", icon: Shield, variant: "secondary" as const },
              { label: "通過請求", value: "98.5%", icon: CheckCircle, variant: "default" as const },
              { label: "響應時間", value: "45ms", icon: Zap, variant: "outline" as const },
            ].map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <Badge size="sm" variant={stat.variant}>
                    {stat.variant === "destructive"
                      ? "高"
                      : stat.variant === "secondary"
                        ? "良好"
                        : stat.variant === "default"
                          ? "優秀"
                          : "正常"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 極端情況測試 */}
      <Card>
        <CardHeader>
          <CardTitle>極端情況測試</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">極小容器</h4>
            <div className="w-32 p-2 border rounded">
              <Badge size="sm" className="w-full justify-center truncate">
                超長標籤
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">大量標籤</h4>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 20 }, (_, i) => (
                <Badge
                  key={i}
                  size="sm"
                  variant={
                    i % 4 === 0 ? "default" : i % 4 === 1 ? "secondary" : i % 4 === 2 ? "outline" : "destructive"
                  }
                >
                  標籤{i + 1}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 測試滾動效果的長內容 */}
      <div className="space-y-4">
        {Array.from({ length: 10 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>測試卡片 {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                這是用來測試滾動效果的內容。當您滾動到頁面下方時， 右下角會出現一個回到頂部的懸浮按鈕。
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge>測試標籤</Badge>
                <Badge variant="secondary">響應式設計</Badge>
                <Badge variant="outline">用戶體驗</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
