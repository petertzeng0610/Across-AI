"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, TrendingUp, Eye, Server, Zap, Globe } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

export default function ApplicationDefensePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl">
          應用層<span className="text-brand-primary">防禦</span>
        </h1>
        <p className="mt-4 text-muted-foreground text-lg font-normal max-w-2xl mx-auto">
          防範任何規模或類型的 DDoS 攻擊，確保您的服務持續可用
        </p>
        <p className="mt-2 text-muted-foreground font-normal max-w-3xl mx-auto">
          DDoS 攻擊可能會減緩或關閉服務，但我們會阻止所有攻擊。憑藉 388 Tbps
          的網路容量，成功緩解了一些有記錄以來最大規模的 DDoS 攻擊，且並未降低客戶的效能。
        </p>
      </div>

      {/* Service Features List */}
      <section className="py-12 bg-card rounded-lg shadow-lg border border-border mb-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            服務<span className="text-brand-primary">特色</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-6">
              <ServiceFeatureItem
                icon={<Shield className="h-8 w-8 text-brand-primary" />}
                title="全方位DDoS防護"
                description="防範L3/L4/L7層的各種DDoS攻擊，包括容量攻擊、協議攻擊和應用層攻擊"
              />
              <ServiceFeatureItem
                icon={<Globe className="h-8 w-8 text-brand-primary" />}
                title="388 Tbps網路容量"
                description="擁有業界領先的網路容量，能夠應對任何規模的DDoS攻擊"
              />
              <ServiceFeatureItem
                icon={<Zap className="h-8 w-8 text-brand-primary" />}
                title="零延遲防護"
                description="即時檢測和緩解攻擊，確保正常流量不受影響，維持最佳性能"
              />
              <ServiceFeatureItem
                icon={<Eye className="h-8 w-8 text-brand-primary" />}
                title="智能威脅檢測"
                description="使用機器學習和AI技術，自動識別新型攻擊模式"
              />
              <ServiceFeatureItem
                icon={<Server className="h-8 w-8 text-brand-primary" />}
                title="全球分散式防護"
                description="利用全球分佈的防護節點，就近攔截攻擊流量"
              />
              <ServiceFeatureItem
                icon={<TrendingUp className="h-8 w-8 text-brand-primary" />}
                title="自適應防護"
                description="根據攻擊強度和類型自動調整防護策略，確保最佳防護效果"
              />
            </ul>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
          即時<span className="text-brand-primary">監控</span>
        </h2>
        <ApplicationDefenseAnalytics />
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-card rounded-lg shadow-lg border border-border">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            應用層防禦<span className="text-brand-primary">方案</span>
          </h2>

          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-foreground">應用層防禦方案</CardTitle>
                <CardDescription className="font-normal text-muted-foreground">
                  全面的應用層DDoS攻擊防護解決方案
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-medium text-foreground">$3.5萬</span>
                  <span className="text-muted-foreground font-normal text-lg">/月起</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">全方位DDoS防護</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">388 Tbps網路容量</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">零延遲防護技術</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">智能威脅檢測</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">全球分散式防護</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">自適應防護策略</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">24/7專業技術支持</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">詳細攻擊分析報告</span>
                  </li>
                </ul>

                <div className="pt-6">
                  <Link href="/contact">
                    <Button className="btn-primary w-full font-normal py-3 text-lg">立即啟用</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceFeatureItem({ icon, title, description }) {
  return (
    <li className="flex items-start space-x-4 p-4 rounded-lg bg-muted border border-border">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground font-normal">{description}</p>
      </div>
    </li>
  )
}

function ApplicationDefenseAnalytics() {
  // 點閱率趨勢數據
  const clickRateTrendData = [
    { time: "13:00", 點閱率: 1000 },
    { time: "14:00", 點閱率: 11500 },
    { time: "15:00", 點閱率: 11800 },
    { time: "16:00", 點閱率: 10500 },
    { time: "17:00", 點閱率: 9200 },
    { time: "18:00", 點閱率: 7500 },
    { time: "19:00", 點閱率: 10200 },
    { time: "20:00", 點閱率: 9800 },
    { time: "21:00", 點閱率: 7800 },
    { time: "22:00", 點閱率: 9500 },
    { time: "23:00", 點閱率: 11800 },
    { time: "00:00", 點閱率: 12000 },
    { time: "01:00", 點閱率: 12200 },
    { time: "02:00", 點閱率: 12500 },
    { time: "03:00", 點閱率: 12300 },
    { time: "04:00", 點閱率: 12100 },
    { time: "05:00", 點閱率: 11900 },
    { time: "06:00", 點閱率: 11700 },
    { time: "07:00", 點閱率: 11500 },
    { time: "08:00", 點閱率: 11300 },
    { time: "09:00", 點閱率: 11600 },
    { time: "10:00", 點閱率: 10800 },
    { time: "11:00", 點閱率: 10600 },
    { time: "12:00", 點閱率: 10400 },
    { time: "13:00", 點閱率: 9800 },
  ]

  // 來源裝置類型統計數據
  const deviceTypeData = [
    { type: "desktop", count: "2,830,730" },
    { type: "mobile", count: "147,063" },
    { type: "tablet", count: "967" },
  ]

  // 來源點閱網址統計數據
  const referrerData = [
    { url: "api.adasone.site", count: "1,258,618" },
    { url: "nginx.adasone.site", count: "1,039,965" },
    { url: "www.adasone.site", count: "680,177" },
  ]

  // 來源訪問路徑統計數據
  const pathData = [
    { path: "/", count: "287,647" },
    { path: "/favicon.ico", count: "44,115" },
    { path: "/cdn-cgi/rum", count: "33,239" },
    { path: "/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js", count: "31,296" },
    { path: "/.env", count: "25,085" },
    { path: "/robots.txt", count: "21,498" },
    { path: "/.git/config", count: "20,982" },
    { path: "/cdn-cgi/speculation", count: "20,045" },
    { path: "/config.json", count: "16,171" },
    { path: "/map.png", count: "15,570" },
  ]

  // 來源國家與城市統計數據
  const locationData = [
    { location: "台灣 台北", count: "1,245,892", color: "#ef4444" },
    { location: "美國 紐約", count: "892,456", color: "#f97316" },
    { location: "日本 東京", count: "678,234", color: "#eab308" },
    { location: "新加坡", count: "456,789", color: "#22c55e" },
    { location: "香港", count: "345,678", color: "#3b82f6" },
    { location: "韓國 首爾", count: "234,567", color: "#8b5cf6" },
    { location: "德國 柏林", count: "198,765", color: "#ec4899" },
    { location: "英國 倫敦", count: "156,432", color: "#06b6d4" },
    { location: "澳洲 雪梨", count: "123,456", color: "#84cc16" },
    { location: "加拿大 多倫多", count: "98,765", color: "#f59e0b" },
  ]

  return (
    <div className="space-y-8">
      {/* 安全監控總覽 */}
      <div className="bg-card rounded-lg shadow-lg border border-border p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-foreground mb-2">安全監控總覽</h3>
          <p className="text-muted-foreground">主要安全事件監控和威脅檢測</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SecurityStatCard
            title="總造訪次數"
            value="2,978,760"
            icon={<Globe className="h-6 w-6 text-brand-primary" />}
          />
          <SecurityStatCard
            title="總點閱數"
            value="258,669"
            icon={<Globe className="h-6 w-6 text-brand-primary" />}
            hasActions={true}
          />
          <SecurityStatCard title="點閱率" value="0.00%" icon={<Globe className="h-6 w-6 text-brand-primary" />} />
        </div>

        {/* 點閱率趨勢分析 */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-foreground mb-4">點閱率趨勢分析</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={clickRateTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} domain={[0, 14000]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                  labelFormatter={(value) => `時間: ${value}`}
                />
                <Line
                  type="monotone"
                  dataKey="點閱率"
                  stroke="hsl(var(--brand-primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--brand-primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--brand-primary))", strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">時間 per 1小時</div>
        </div>

        {/* 來源統計卡片 - 前三張 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 來源裝置類型統計 */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground">來源裝置類型統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-border text-sm font-medium text-muted-foreground bg-muted/50 mx-[0] px-2">
                  <div>裝置類型</div>
                  <div className="text-right">次數</div>
                </div>
                {deviceTypeData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 py-3 text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors px-2"
                  >
                    <div className="text-brand-primary hover:underline cursor-pointer">{item.type}</div>
                    <div className="text-right text-foreground font-medium">{item.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 來源點閱網址統計 */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground">來源點閱網址統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-border text-sm font-medium text-muted-foreground bg-muted/50 px-2">
                  <div>參照位置</div>
                  <div className="text-right">次數</div>
                </div>
                {referrerData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 py-3 text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors px-2"
                  >
                    <div className="text-brand-primary hover:underline cursor-pointer truncate" title={item.url}>
                      {item.url}
                    </div>
                    <div className="text-right text-foreground font-medium">{item.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 來源訪問路徑統計 */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground">來源訪問路徑統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-border text-sm font-medium text-muted-foreground bg-muted/50 px-2">
                  <div>路徑</div>
                  <div className="text-right">次數</div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {pathData.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-4 py-3 text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors px-2"
                    >
                      <div className="text-brand-primary hover:underline cursor-pointer truncate" title={item.path}>
                        {item.path}
                      </div>
                      <div className="text-right text-foreground font-medium">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 世界地圖與來源國家統計 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 世界地圖 */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-foreground">全球流量來源分佈</CardTitle>
                <CardDescription className="text-muted-foreground">點擊地圖標記查看詳細信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <InteractiveWorldMap locationData={locationData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 來源國家與城市統計 */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg bg-card border-border h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-foreground">來源國家與城市統計</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-border text-sm font-medium text-muted-foreground bg-muted/50 px-2">
                    <div>國家/城市</div>
                    <div className="text-right">次數</div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {locationData.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-4 py-3 text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors px-2"
                      >
                        <div
                          className="text-brand-primary hover:underline cursor-pointer truncate"
                          title={item.location}
                        >
                          {item.location}
                        </div>
                        <div className="text-right text-foreground font-medium">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecurityStatCard({ title, value, icon, hasActions = false }) {
  return (
    <Card className="shadow-lg bg-card border-border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          {hasActions && (
            <div className="flex items-center space-x-1">
              <button className="p-1 hover:bg-muted rounded">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
              <button className="p-1 hover:bg-muted rounded">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button className="p-1 hover:bg-muted rounded">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

function InteractiveWorldMap({ locationData }) {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(2)
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 })
  const [hoveredMarker, setHoveredMarker] = useState(null)

  // 地圖數據點位置 (基於真實世界地圖的精確坐標)
  const mapMarkers = [
    { id: "taiwan", location: "台灣 台北", count: "1,245,892", x: 78.5, y: 35, color: "#ef4444" },
    { id: "usa", location: "美國 紐約", count: "892,456", x: 26, y: 28, color: "#f97316" },
    { id: "japan", location: "日本 東京", count: "678,234", x: 81, y: 30, color: "#eab308" },
    { id: "singapore", location: "新加坡", count: "456,789", x: 72, y: 52, color: "#22c55e" },
    { id: "hongkong", location: "香港", count: "345,678", x: 77, y: 38, color: "#3b82f6" },
    { id: "korea", location: "韓國 首爾", count: "234,567", x: 79, y: 27, color: "#8b5cf6" },
    { id: "germany", location: "德國 柏林", count: "198,765", x: 52, y: 22, color: "#ec4899" },
    { id: "uk", location: "英國 倫敦", count: "156,432", x: 49, y: 21, color: "#06b6d4" },
    { id: "australia", location: "澳洲 雪梨", count: "123,456", x: 83, y: 68, color: "#84cc16" },
    { id: "canada", location: "加拿大 多倫多", count: "98,765", x: 23, y: 18, color: "#f59e0b" },
  ]

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }

  const handleReset = () => {
    setZoomLevel(2)
    setMapCenter({ x: 50, y: 50 })
    setSelectedLocation(null)
  }

  const handleMarkerClick = (marker) => {
    setSelectedLocation(marker)
  }

  const getMarkerSize = (count) => {
    const numCount = Number.parseInt(count.replace(/,/g, ""))
    if (numCount > 1000000) return 16
    if (numCount > 500000) return 14
    if (numCount > 200000) return 12
    return 10
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden border border-blue-200">
      {/* 真實世界地圖背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/world-map-blue.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 地圖覆蓋層 - 調整為藍白主題 */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(rgba(13, 153, 255, 0.05), rgba(59, 130, 246, 0.1))",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* 地圖標記點 */}
      {mapMarkers.map((marker) => (
        <div
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            zIndex: hoveredMarker === marker.id ? 20 : 10,
          }}
          onClick={() => handleMarkerClick(marker)}
          onMouseEnter={() => setHoveredMarker(marker.id)}
          onMouseLeave={() => setHoveredMarker(null)}
        >
          {/* 標記點外圈動�� */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              backgroundColor: marker.color,
              opacity: 0.6,
              width: `${getMarkerSize(marker.count) + 8}px`,
              height: `${getMarkerSize(marker.count) + 8}px`,
              left: "-4px",
              top: "-4px",
            }}
          />

          {/* 標記點 */}
          <div
            className="relative rounded-full border-3 border-white shadow-xl z-10"
            style={{
              backgroundColor: marker.color,
              width: `${getMarkerSize(marker.count)}px`,
              height: `${getMarkerSize(marker.count)}px`,
              boxShadow: `0 0 0 3px ${marker.color}30, 0 6px 12px rgba(0,0,0,0.15), 0 0 20px ${marker.color}20`,
            }}
          >
            {/* 內部光點 */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{
                width: `${Math.max(getMarkerSize(marker.count) / 3, 4)}px`,
                height: `${Math.max(getMarkerSize(marker.count) / 3, 4)}px`,
                opacity: 0.9,
                boxShadow: "0 0 4px rgba(255,255,255,0.8)",
              }}
            />
          </div>

          {/* 懸停提示 */}
          {hoveredMarker === marker.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-white/95 backdrop-blur-sm text-gray-800 text-sm rounded-xl whitespace-nowrap shadow-2xl border border-blue-200">
              <div className="font-semibold text-blue-600">{marker.location}</div>
              <div className="text-gray-600">{marker.count} 次訪問</div>
              <div className="text-xs text-gray-500 mt-1">點擊查看詳情</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-white/95"></div>
            </div>
          )}
        </div>
      ))}

      {/* 地圖控制按鈕 */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2 z-30">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-brand-primary hover:bg-muted hover:border-brand-primary shadow-lg transition-all duration-200"
          title="放大"
        >
          <span className="text-lg font-semibold">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-brand-primary hover:bg-muted hover:border-brand-primary shadow-lg transition-all duration-200"
          title="縮小"
        >
          <span className="text-lg font-semibold">−</span>
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-brand-primary hover:bg-muted hover:border-brand-primary shadow-lg transition-all duration-200"
          title="重置視圖"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
        <button className="w-10 h-10 bg-brand-primary border border-brand-primary rounded-lg flex items-center justify-center text-white hover:bg-brand-primary/90 shadow-lg transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      </div>

      {/* 縮放級別顯示 */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-brand-primary font-medium border border-border shadow-lg z-30">
        zoom: {zoomLevel}
      </div>

      {/* 圖例 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-border z-30">
        <div className="text-sm font-semibold text-foreground mb-3">流量強度</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
            <span className="text-sm text-muted-foreground">高</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
            <span className="text-sm text-muted-foreground">中</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
            <span className="text-sm text-muted-foreground">低</span>
          </div>
        </div>
      </div>

      {/* 選中位置詳���彈窗 */}
      {selectedLocation && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-border">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-foreground">{selectedLocation.location}</h3>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-muted-foreground hover:text-brand-primary transition-colors p-1 rounded-lg hover:bg-muted"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-foreground font-medium">總訪問次數:</span>
                <span className="font-bold text-foreground">{selectedLocation.count}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-foreground font-medium">流量等級:</span>
                <span className="font-bold" style={{ color: selectedLocation.color }}>
                  {Number.parseInt(selectedLocation.count.replace(/,/g, "")) > 1000000
                    ? "高"
                    : Number.parseInt(selectedLocation.count.replace(/,/g, "")) > 500000
                      ? "中"
                      : "低"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-foreground font-medium">威脅等級:</span>
                <span className="font-bold text-green-600">低風險</span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <p className="leading-relaxed">該地區流量正常，未檢測到異常活動。所有請求均通過 WAF 安全檢查。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
