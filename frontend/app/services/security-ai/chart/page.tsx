"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BarChart3, Shield, Globe, Gauge, MapPin, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false })

export default function ChartAnalysisPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    if (!startDate || !endDate) {
      alert("請選擇開始時間和結束時間")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("開始時間不能晚於結束時間")
      return
    }

    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzed(true)
      setIsAnalyzing(false)
    }, 1000)
  }

  const handleClearDates = () => {
    setStartDate("")
    setEndDate("")
    setIsAnalyzed(false)
  }

  const attackStatsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#333",
      textStyle: { color: "#fff" },
    },
    legend: {
      data: ["RCE遠程執行碼攻擊", "SQL注入", "XSS攻擊", "機器人攻擊"],
      textStyle: { color: "#888" },
      top: 10,
    },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "15%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["7月", "8月", "9月", "10月"],
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#888" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#888" },
      splitLine: { lineStyle: { color: "#333", type: "dashed" } },
    },
    series: [
      {
        name: "RCE遠程執行碼攻擊",
        type: "bar",
        data: [0, 0, 0, 200],
        itemStyle: { color: "#9333EA" }, // 降低亮度：從 #C084FC 改為 #9333EA
      },
      {
        name: "SQL注入",
        type: "bar",
        data: [0, 0, 0, 150],
        itemStyle: { color: "#7C3AED" }, // 降低亮度：從 #A855F7 改為 #7C3AED
      },
      {
        name: "XSS攻擊",
        type: "bar",
        data: [0, 0, 0, 100],
        itemStyle: { color: "#6D28D9" }, // 降低亮度：從 #8B5CF6 改為 #6D28D9
      },
      {
        name: "機器人攻擊",
        type: "bar",
        data: [0, 0, 0, 5000],
        itemStyle: { color: "#4A9EE4" }, // 從 #09BBE6 改為 #4A9EE4
      },
    ],
  }

  const performanceOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#333",
      textStyle: { color: "#fff" },
    },
    legend: {
      data: ["阻擋率", "響應時間"],
      textStyle: { color: "#888" },
      top: 10,
    },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "15%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["7月", "8月", "9月", "10月"],
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#888" },
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#888", formatter: "{value}%" },
      splitLine: { lineStyle: { color: "#333", type: "dashed" } },
    },
    series: [
      {
        name: "阻擋率",
        type: "line",
        data: [0, 0, 45, 75],
        smooth: true,
        lineStyle: { color: "#0284C7", width: 3 }, // 降低亮度：從 #0EA5E9 改為 #0284C7
        itemStyle: { color: "#0284C7" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(2, 132, 199, 0.3)" }, // 更新漸變顏色
              { offset: 1, color: "rgba(2, 132, 199, 0)" },
            ],
          },
        },
      },
      {
        name: "響應時間",
        type: "line",
        data: [0, 0, 40, 70],
        smooth: true,
        lineStyle: { color: "#4A9EE4", width: 3 }, // 從 #09BBE6 改為 #4A9EE4
        itemStyle: { color: "#4A9EE4" }, // 從 #09BBE6 改為 #4A9EE4
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(74, 158, 228, 0.3)" }, // 更新 RGB 值為 #4A9EE4
              { offset: 1, color: "rgba(74, 158, 228, 0)" }, // 更新 RGB 值為 #4A9EE4
            ],
          },
        },
      },
    ],
  }

  const threatDistributionOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}% ({d}%)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#333",
      textStyle: { color: "#fff" },
    },
    legend: {
      orient: "vertical",
      right: "10%",
      top: "center",
      textStyle: { color: "#888" },
      borderWidth: 0,
    },
    series: [
      {
        name: "威脅類型",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: "#fff",
          borderWidth: 0,
        },
        label: {
          show: true,
          formatter: "{b}: {c}%",
          color: "#fff",
          borderWidth: 0,
        },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: "bold" },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" },
        },
        data: [
          { value: 98, name: "機器人攻擊", itemStyle: { color: "#4A9EE4" } }, // 從 #09BBE6 改為 #4A9EE4
          { value: 1, name: "XSS攻擊", itemStyle: { color: "#6D28D9" } },
          { value: 0.7, name: "SQL注入", itemStyle: { color: "#7C3AED" } },
          { value: 0.3, name: "RCE攻擊", itemStyle: { color: "#9333EA" } },
        ],
      },
    ],
  }

  const trafficOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#333",
      textStyle: { color: "#fff" },
    },
    legend: {
      data: ["惡意流量", "正常流量"],
      textStyle: { color: "#888" },
      top: 10,
    },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "15%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["7月", "8月", "9月", "10月"],
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#888" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#888", formatter: "{value} MB" },
      splitLine: { lineStyle: { color: "#333", type: "dashed" } },
    },
    series: [
      {
        name: "惡意流量",
        type: "line",
        stack: "Total",
        data: [0, 0, 2, 5],
        smooth: true,
        lineStyle: { color: "#7C3AED", width: 0 },
        showSymbol: false,
        areaStyle: { color: "#7C3AED", opacity: 0.7 },
      },
      {
        name: "正常流量",
        type: "line",
        stack: "Total",
        data: [0, 0, 1, 3],
        smooth: true,
        lineStyle: { color: "#4A9EE4", width: 0 }, // 從 #09BBE6 改為 #4A9EE4
        showSymbol: false,
        areaStyle: { color: "#4A9EE4", opacity: 0.7 }, // 從 #09BBE6 改為 #4A9EE4
      },
    ],
  }

  return (
    <div className="flex flex-col space-y-1.5 p-6">
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
            <BreadcrumbPage className="text-foreground font-medium">圖表分析</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter">
            圖表<span className="text-brand-primary">分析</span>
          </h1>
          <p className="mt-2 text-muted-foreground">AI分析識別出的各類攻擊類型分佈和頻率統計</p>
        </div>
        <Link href="/services/security-ai">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回分析選單
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 mr-2" />
            分析時間範圍
          </CardTitle>
          <CardDescription>選擇要分析的時間範圍，然後點擊開始分析按鈕</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="start-date" className="block text-sm font-medium text-foreground mb-2">
                開始時間
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="end-date" className="block text-sm font-medium text-foreground mb-2">
                結束時間
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleClearDates}
                variant="outline"
                className="px-6 py-2 h-auto bg-transparent"
                disabled={!startDate && !endDate}
              >
                清除
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn-primary px-8 py-2 h-auto font-semibold"
              >
                {isAnalyzing ? "分析中..." : "開始分析"}
              </Button>
            </div>
          </div>
          {isAnalyzed && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800/50">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✓ 已完成 {startDate} 至 {endDate} 期間的數據分析
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isAnalyzed ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-normal text-base">攻擊防護執行率</h3>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Shield className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
                <div className="font-bold mb-2 text-4xl text-accent-foreground">0%</div>
                <p className="text-slate-400 text-sm">滿分100%</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-normal text-base">邊緣響應時間</h3>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Gauge className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
                <div className="font-bold mb-2 text-4xl text-accent-foreground">252ms</div>
                <p className="text-slate-400 text-sm">平均邊緣響應時間</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-normal text-base">攻擊次數</h3>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
                <div className="font-bold mb-2 text-4xl text-accent-foreground">5,000</div>
                <p className="text-slate-400 text-sm">總攻擊次數</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-normal text-base">保護網站</h3>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Globe className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
                <div className="font-bold text-white mb-2 text-4xl">1</div>
                <p className="text-slate-400 text-sm">保護正常訪問網址數量</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-foreground">攻擊統計數量</CardTitle>
                <CardDescription>依時間區間統計 SQL注入 / XSS攻擊 / RCE遠程執行碼攻擊 / 機器人攻擊</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts option={attackStatsOption} style={{ height: "320px" }} />
              </CardContent>
            </Card>

            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-foreground">性能優化趨勢</CardTitle>
                <CardDescription>阻擋率 (%) 與響應時間性能分數 (0-100分) 趨勢</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts option={performanceOption} style={{ height: "320px" }} />
              </CardContent>
            </Card>

            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-foreground">威脅類型分布</CardTitle>
                <CardDescription>基於OWASP Top 10的攻擊類型分析</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts option={threatDistributionOption} style={{ height: "320px" }} />
              </CardContent>
            </Card>

            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-foreground">流量處理統計</CardTitle>
                <CardDescription>正常流量與惡意流量趨勢 (MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts option={trafficOption} style={{ height: "320px" }} />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">請選擇分析時間範圍</h3>
              <p className="text-muted-foreground">
                選擇開始時間和結束時間後，點擊「開始分析」按鈕查看詳細的圖表分析結果
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
