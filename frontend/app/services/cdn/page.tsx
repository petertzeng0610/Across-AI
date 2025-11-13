"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Zap, Users, CheckCircle, TrendingUp, Eye, Server } from "lucide-react"
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

export default function CDNPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl tracking-tighter sm:text-4xl font-medium md:text-4xl">
          全球企業級內容傳遞網路<span className="text-brand-primary"> (CDN)</span>
        </h1>
        <p className="mt-4 text-muted-foreground text-lg font-normal max-w-2xl mx-auto">
          憑藉世界各地 330 個位置的支援，我們的 CDN 可最佳化靜態和動態內容，來滿足裝置、瀏覽器和頻寬需求。
        </p>
      </div>

      {/* Service Features List */}
      <section className="py-12 bg-card rounded-lg shadow-lg border-border mb-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            服務<span className="text-brand-primary">特色</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-6">
              <ServiceFeatureItem
                icon={<Globe className="h-8 w-8 text-brand-primary" />}
                title="全球節點覆蓋"
                description="在全球330個位置部署CDN節點，確保用戶就近訪問"
              />
              <ServiceFeatureItem
                icon={<Zap className="h-8 w-8 text-brand-primary" />}
                title="極速內容傳遞"
                description="智能路由算法，自動選擇最佳傳輸路徑，大幅提升加載速度"
              />
              <ServiceFeatureItem
                icon={<Server className="h-8 w-8 text-brand-primary" />}
                title="智能緩存"
                description="動態內容緩存策略，減少源站負載，提高響應效率"
              />
              <ServiceFeatureItem
                icon={<Eye className="h-8 w-8 text-brand-primary" />}
                title="實時監控"
                description="24/7監控節點狀態和性能，確保服務穩定可靠"
              />
              <ServiceFeatureItem
                icon={<Users className="h-8 w-8 text-brand-primary" />}
                title="流量分析"
                description="詳細的流量統計和用戶行為分析，優化內容分發策略"
              />
              <ServiceFeatureItem
                icon={<TrendingUp className="h-8 w-8 text-brand-primary" />}
                title="自動擴展"
                description="根據流量需求自動調整資源配置，應對突發流量"
              />
            </ul>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
          性能<span className="text-brand-primary">分析</span>
        </h2>
        <CDNAnalytics />
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-card rounded-lg shadow-lg border-border">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            CDN加速<span className="text-brand-primary">方案</span>
          </h2>

          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-foreground">全球CDN加速方案</CardTitle>
                <CardDescription className="font-normal text-muted-foreground">
                  全面的內容分發網絡解決方案
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-medium text-foreground">$4萬</span>
                  <span className="text-muted-foreground font-normal text-lg">/月</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">全球330個位置覆蓋</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">極速內容傳遞</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">智能緩存策略</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">24/7實時監控</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">詳細流量分析</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">自動資源擴展</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">專業技術支持</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span className="text-muted-foreground font-normal">性能優化報告</span>
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

function InteractiveWorldMap() {
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  // CDN節點數據
  const cdnNodes = [
    {
      id: "na",
      name: "北美地區",
      x: 22, // Adjusted from 20 to 22 for better North America positioning
      y: 32, // Adjusted from 35 to 32 for better latitude alignment
      nodes: 85,
      traffic: "15.2TB",
      requests: "8.5M",
      color: "hsl(var(--brand-primary))",
    },
    {
      id: "eu",
      name: "歐洲地區",
      x: 48, // Adjusted from 50 to 48 for better Europe positioning
      y: 28, // Adjusted from 25 to 28 for better latitude alignment
      nodes: 72,
      traffic: "12.8TB",
      requests: "6.8M",
      color: "hsl(var(--brand-primary))",
    },
    {
      id: "ap",
      name: "亞太地區",
      x: 72, // Adjusted from 75 to 72 for better Asia-Pacific positioning
      y: 38, // Adjusted from 45 to 38 for better latitude alignment
      nodes: 95,
      traffic: "18.6TB",
      requests: "12.3M",
      color: "hsl(var(--brand-primary))",
    },
    {
      id: "sa",
      name: "南美地區",
      x: 32, // Adjusted from 30 to 32 for better South America positioning
      y: 62, // Adjusted from 70 to 62 for better latitude alignment
      nodes: 28,
      traffic: "4.2TB",
      requests: "2.1M",
      color: "hsl(var(--brand-primary))",
    },
    {
      id: "af",
      name: "非洲地區",
      x: 50, // Kept at 50 for Africa central positioning
      y: 52, // Adjusted from 60 to 52 for better latitude alignment
      nodes: 18,
      traffic: "2.8TB",
      requests: "1.5M",
      color: "hsl(var(--brand-primary))",
    },
    {
      id: "oc",
      name: "大洋洲",
      x: 80, // Adjusted from 85 to 80 for better Oceania positioning
      y: 68, // Adjusted from 75 to 68 for better latitude alignment
      nodes: 12,
      traffic: "1.9TB",
      requests: "0.9M",
      color: "hsl(var(--brand-primary))",
    },
  ]

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
      {/* 世界地圖背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url('/images/world-map-blue.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 地圖控制按鈕 */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-brand-primary hover:bg-muted transition-colors">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-brand-primary hover:bg-muted transition-colors">
          <span className="text-lg font-bold">-</span>
        </button>
        <button className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-brand-primary hover:bg-muted transition-colors">
          <Globe className="w-5 h-5" />
        </button>
      </div>

      {/* CDN節點標記 */}
      {cdnNodes.map((node) => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onMouseEnter={() => setHoveredRegion(node)}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => setSelectedRegion(selectedRegion?.id === node.id ? null : node)}
        >
          {/* 外圈光暈 */}
          <div className="absolute inset-0 w-8 h-8 bg-blue-400/30 rounded-full animate-ping" />

          {/* 中圈 */}
          <div className="absolute inset-0 w-6 h-6 bg-blue-500/50 rounded-full top-1 left-1" />

          {/* 內圈標記點 */}
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-lg top-2 left-2 relative"
            style={{ backgroundColor: node.color }}
          >
            {/* 內部光點 */}
            <div className="absolute inset-1 bg-white rounded-full opacity-80" />
          </div>

          {/* 懸停提示 */}
          {hoveredRegion?.id === node.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white/90 backdrop-blur-sm text-blue-900 text-sm rounded-lg shadow-lg border border-border whitespace-nowrap z-30">
              <div className="font-semibold">{node.name}</div>
              <div className="text-xs text-blue-700">
                節點: {node.nodes} | 流量: {node.traffic}
              </div>
              {/* 小箭頭 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90" />
            </div>
          )}
        </div>
      ))}

      {/* 圖例 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border z-20">
        <div className="text-sm font-semibold text-blue-900 mb-2">CDN節點分佈</div>
        <div className="flex items-center gap-2 text-xs text-blue-700">
          <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm" />
          <span>活躍節點</span>
        </div>
        <div className="mt-2 text-xs text-blue-600">總節點: 330 | 總流量: 55.5TB</div>
      </div>

      {/* 詳細信息彈窗 */}
      {selectedRegion && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-border z-30 min-w-80">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-blue-900">{selectedRegion.name}</h3>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-blue-600 hover:text-blue-800 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">CDN節點量</span>
              <span className="text-blue-900 font-bold">{selectedRegion.nodes}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">總流量</span>
              <span className="text-green-900 font-bold">{selectedRegion.traffic}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium">請求次數</span>
              <span className="text-purple-900 font-bold">{selectedRegion.requests}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-700 font-medium">平均延遲</span>
              <span className="text-orange-900 font-bold">{Math.floor(Math.random() * 50 + 20)}ms</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-blue-600">最後更新: {new Date().toLocaleString("zh-TW")}</div>
          </div>
        </div>
      )}

      {/* 連接線動畫 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        {cdnNodes.map((node, index) => (
          <g key={`connection-${node.id}`}>
            {/* 從中心點到各個節點的連接線 */}
            <line
              x1="50%"
              y1="50%"
              x2={`${node.x}%`}
              y2={`${node.y}%`}
              stroke="hsl(var(--brand-primary))"
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="5,5"
            >
              <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
            </line>
          </g>
        ))}
      </svg>
    </div>
  )
}

function CDNAnalytics() {
  // 總請求統計數據 (單位: MB) - 2025年8月
  const requestData = [
    { time: "08-01", requests: 180 },
    { time: "08-02", requests: 165 },
    { time: "08-03", requests: 155 },
    { time: "08-04", requests: 170 },
    { time: "08-05", requests: 195 },
    { time: "08-06", requests: 220 },
    { time: "08-07", requests: 240 },
    { time: "08-08", requests: 235 },
    { time: "08-09", requests: 250 },
    { time: "08-10", requests: 265 },
    { time: "08-11", requests: 245 },
    { time: "08-12", requests: 210 },
    { time: "08-13", requests: 225 },
    { time: "08-14", requests: 255 },
    { time: "08-15", requests: 270 },
    { time: "08-16", requests: 285 },
    { time: "08-17", requests: 275 },
    { time: "08-18", requests: 260 },
    { time: "08-19", requests: 245 },
    { time: "08-20", requests: 230 },
    { time: "08-21", requests: 215 },
    { time: "08-22", requests: 200 },
    { time: "08-23", requests: 185 },
    { time: "08-24", requests: 195 },
    { time: "08-25", requests: 210 },
    { time: "08-26", requests: 225 },
    { time: "08-27", requests: 240 },
    { time: "08-28", requests: 255 },
    { time: "08-29", requests: 270 },
    { time: "08-30", requests: 280 },
    { time: "08-31", requests: 290 },
  ]

  // 流量回源統計數據 (單位: MB) - 2025年8月
  const originTrafficData = [
    { time: "08-01", cached: 145, origin: 35 },
    { time: "08-02", cached: 135, origin: 30 },
    { time: "08-03", cached: 128, origin: 27 },
    { time: "08-04", cached: 142, origin: 28 },
    { time: "08-05", cached: 165, origin: 30 },
    { time: "08-06", cached: 188, origin: 32 },
    { time: "08-07", cached: 208, origin: 32 },
    { time: "08-08", cached: 203, origin: 32 },
    { time: "08-09", cached: 218, origin: 32 },
    { time: "08-10", cached: 233, origin: 32 },
    { time: "08-11", cached: 213, origin: 32 },
    { time: "08-12", cached: 178, origin: 32 },
    { time: "08-13", cached: 195, origin: 30 },
    { time: "08-14", cached: 225, origin: 30 },
    { time: "08-15", cached: 240, origin: 30 },
    { time: "08-16", cached: 255, origin: 30 },
    { time: "08-17", cached: 245, origin: 30 },
    { time: "08-18", cached: 230, origin: 30 },
    { time: "08-19", cached: 215, origin: 30 },
    { time: "08-20", cached: 200, origin: 30 },
    { time: "08-21", cached: 185, origin: 30 },
    { time: "08-22", cached: 170, origin: 30 },
    { time: "08-23", cached: 155, origin: 30 },
    { time: "08-24", cached: 165, origin: 30 },
    { time: "08-25", cached: 180, origin: 30 },
    { time: "08-26", cached: 195, origin: 30 },
    { time: "08-27", cached: 210, origin: 30 },
    { time: "08-28", cached: 225, origin: 30 },
    { time: "08-29", cached: 240, origin: 30 },
    { time: "08-30", cached: 250, origin: 30 },
    { time: "08-31", cached: 260, origin: 30 },
  ]

  // 訪問統計數據 (單位: MB) - 2025年8月
  const visitData = [
    { time: "08-01", visits: 12 },
    { time: "08-02", visits: 10.5 },
    { time: "08-03", visits: 9.8 },
    { time: "08-04", visits: 11.2 },
    { time: "08-05", visits: 14.5 },
    { time: "08-06", visits: 16.8 },
    { time: "08-07", visits: 18.2 },
    { time: "08-08", visits: 17.9 },
    { time: "08-09", visits: 19.1 },
    { time: "08-10", visits: 20.3 },
    { time: "08-11", visits: 18.7 },
    { time: "08-12", visits: 15.6 },
    { time: "08-13", visits: 17.2 },
    { time: "08-14", visits: 19.5 },
    { time: "08-15", visits: 21.8 },
    { time: "08-16", visits: 23.1 },
    { time: "08-17", visits: 22.4 },
    { time: "08-18", visits: 20.7 },
    { time: "08-19", visits: 19.3 },
    { time: "08-20", visits: 18.1 },
    { time: "08-21", visits: 16.9 },
    { time: "08-22", visits: 15.7 },
    { time: "08-23", visits: 14.5 },
    { time: "08-24", visits: 15.8 },
    { time: "08-25", visits: 17.1 },
    { time: "08-26", visits: 18.4 },
    { time: "08-27", visits: 19.7 },
    { time: "08-28", visits: 21.0 },
    { time: "08-29", visits: 22.3 },
    { time: "08-30", visits: 23.6 },
    { time: "08-31", visits: 24.9 },
  ]

  // CDN回源統計數據
  const cdnOriginStats = [
    { status: "dynamic", count: 36851, percentage: 82.4 },
    { status: "miss", count: 2263239, percentage: 5.1 },
    { status: "unknown", count: 1817631, percentage: 4.1 },
    { status: "expired", count: 1199289, percentage: 2.7 },
    { status: "hit", count: 132512, percentage: 3.0 },
    { status: "revalidated", count: 39744, percentage: 0.9 },
  ]

  // 訪問統計數據
  const domainStats = [
    { domain: "nginx.adasone.site", requests: 14043626 },
    { domain: "www.adasone.site", requests: 8747799 },
    { domain: "www.adasone.site:8443", requests: 1539785 },
    { domain: "nginx.adasone.site:8443", requests: 256297 },
    { domain: "api.adasone.site:8443", requests: 255998 },
    { domain: "www.adasone.site:2083", requests: 42336 },
    { domain: "www.adasone.site:2096", requests: 39100 },
    { domain: "www.adasone.site:2087", requests: 38999 },
    { domain: "www.adasone.site:2053", requests: 33290 },
  ]

  // CDN回源統計數據
  const cdnResponseStats = [
    { code: "404", count: 36444565 },
    { code: "200", count: 4544409 },
    { code: "499", count: 515658 },
    { code: "204", count: 447514 },
    { code: "504", count: 261535 },
    { code: "304", count: 67307 },
    { code: "403", count: 13320 },
    { code: "405", count: 13316 },
    { code: "502", count: 6658 },
  ]

  // 來源ASN統計
  const asnStats = [
    { asn: "271500", traffic: 51348210, ip: "185.177.72.210", requests: 8961839 },
    { asn: "14061", traffic: 3090469, ip: "185.177.72.107", requests: 2973117 },
    { asn: "62610", traffic: 1431470, ip: "185.177.72.35", requests: 2238604 },
    { asn: "396982", traffic: 524098, ip: "185.177.72.204", requests: 2050948 },
    { asn: "31898", traffic: 506312, ip: "185.177.72.104", requests: 1968125 },
    { asn: "6075", traffic: 489428, ip: "185.177.72.164", requests: 1754703 },
    { asn: "3462", traffic: 441396, ip: "185.177.72.205", requests: 1718744 },
    { asn: "9009", traffic: 425658, ip: "128.131.134", requests: 1251704 },
    { asn: "132203", traffic: 352047, ip: "185.177.72.10", requests: 1132540 },
  ]

  // 自定義Y軸格式化函數
  const formatYAxisValue = (value) => `${value}MB`

  return (
    <div className="space-y-8">
      {/* 主要統計數據 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左側統計卡片 */}
        <div className="space-y-4">
          <Card className="bg-gray-100 dark:bg-gray-800 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">請求總數</div>
              <div className="text-3xl font-bold text-foreground">42,314,382</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 dark:bg-gray-800 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">請求總量</div>
              <div className="text-3xl font-bold text-foreground">51.2GB</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 dark:bg-gray-800 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">總流出量</div>
              <div className="text-3xl font-bold text-foreground">44.7GB</div>
            </CardContent>
          </Card>
        </div>

        {/* 右側圖表區域 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 總請求數統計 */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">總請求數統計 (2025年8月)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={requestData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatYAxisValue} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value, name) => [`${value}MB`, name]}
                    />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="hsl(var(--brand-primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 流量趨勢統計 */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">流量趨勢統計 (2025年8月)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={originTrafficData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatYAxisValue} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value, name) => [`${value}MB`, name]}
                    />
                    <Line type="monotone" dataKey="cached" stroke="#22c55e" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="origin" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 流量趨勢統計 */}
          <Card className="shadow-lg bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">流量趨勢統計 (2025年8月)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={visitData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatYAxisValue} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value, name) => [`${value}MB`, name]}
                    />
                    <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 詳細統計表格 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CDN快取狀態統計 */}
        <Card className="shadow-lg bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">CDN快取狀態統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground border-b bg-lightblue-50 mt-0 mb-0 pt-3 pb-3">
                <div className="mx-2 my-0">快取狀態</div>
                <div className="mx-2 my-0">次數</div>
              </div>
              {cdnOriginStats.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 text-sm py-3 px-2 ${index < cdnOriginStats.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="text-brand-primary">{item.status}</div>
                  <div className="text-foreground">{item.count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 訪問網址統計 */}
        <Card className="shadow-lg bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">訪問網址統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground border-b bg-lightblue-50 mb-0 pl-2 pt-3 pb-3">
                <div className="my-0">主機</div>
                <div className="my-0">次數</div>
              </div>
              {domainStats.slice(0, 8).map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 text-sm py-3 px-2 ${index < 7 ? "border-b border-border" : ""}`}
                >
                  <div className="text-brand-primary truncate">{item.domain}</div>
                  <div className="text-foreground">{item.requests.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CDN回源狀態統計 */}
        <Card className="shadow-lg bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">CDN回源狀態統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground border-b pb-3 bg-lightblue-50 mb-0 pb-0">
                <div className="py-3 px-2">回源狀態</div>
                <div className="py-3">次數</div>
              </div>
              {cdnResponseStats.slice(0, 8).map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 text-sm py-3 px-2 ${index < 7 ? "border-b border-border" : ""}`}
                >
                  <div className="text-foreground">{item.code}</div>
                  <div className="text-foreground">{item.count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ASN和IP統計 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 來源ASN統計 */}
        <Card className="shadow-lg bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">來源ASN統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground border-b pb-3 bg-lightblue-50 mb-0 pt-3">
                <div className="px-2">來源ASN</div>
                <div>次數</div>
              </div>
              {asnStats.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 text-sm py-3 px-2 ${index < asnStats.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="text-foreground">{item.asn}</div>
                  <div className="text-foreground">{item.requests.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* IP統計 */}
        <Card className="shadow-lg bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">IP統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground border-b pb-3 bg-lightblue-50 mb-0 pt-3 pl-2">
                <div>來源IP</div>
                <div>次數</div>
              </div>
              {asnStats.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 text-sm py-3 px-2 ${index < asnStats.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="text-brand-primary">{item.ip}</div>
                  <div className="text-foreground">{item.requests.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 交互式世界地圖 */}
      <Card className="shadow-lg bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">全球流量分佈</CardTitle>
          <CardDescription className="text-muted-foreground">點擊地圖上的節點查看詳細信息</CardDescription>
        </CardHeader>
        <CardContent>
          <InteractiveWorldMap />
        </CardContent>
      </Card>
    </div>
  )
}
