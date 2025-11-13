"use client"

import { useState, useEffect } from "react"
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
import { TrendingUp, ArrowLeft, TrendingDown, Database, Globe, FileText, Zap } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false })

export default function TrendsComparisonPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("本週 vs 上週")
  const [chartData, setChartData] = useState<any>(null)
  const [stats, setStats] = useState<any[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const generateChartData = (period: string) => {
    const dataConfigs: Record<string, any> = {
      "1小時 vs 上1小時": {
        xAxisData: ["0分", "10分", "20分", "30分", "40分", "50分", "60分"],
        currentData: [2.5, 3.2, 2.8, 4.1, 3.5, 2.9, 3.8],
        previousData: [2.1, 2.8, 3.0, 3.5, 3.2, 2.7, 3.3],
        unit: "MB",
        currentLabel: "當前1小時",
        previousLabel: "上1小時",
      },
      "6小時 vs 上6小時": {
        xAxisData: ["第1小時", "第2小時", "第3小時", "第4小時", "第5小時", "第6小時"],
        currentData: [8.5, 12.3, 15.7, 13.2, 10.8, 9.4],
        previousData: [7.2, 10.5, 13.8, 12.1, 9.7, 8.5],
        unit: "MB",
        currentLabel: "當前6小時",
        previousLabel: "上6小時",
      },
      "今天 vs 昨天": {
        xAxisData: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        currentData: [5.2, 3.8, 8.5, 15.3, 18.7, 12.4, 6.8],
        previousData: [4.8, 3.5, 7.9, 14.2, 17.5, 11.8, 6.2],
        unit: "MB",
        currentLabel: "今天",
        previousLabel: "昨天",
      },
      "近3天 vs 上3天": {
        xAxisData: ["第1天", "第2天", "第3天"],
        currentData: [45.5, 52.3, 48.7],
        previousData: [38.2, 42.5, 40.8],
        unit: "MB",
        currentLabel: "近3天",
        previousLabel: "上3天",
      },
      "本週 vs 上週": {
        xAxisData: ["第1週", "第2週", "第3週", "第4週", "第5週", "第6週"],
        currentData: [17.17, 8.58, 4.29, 2.14, 1.07, 0.53],
        previousData: [0, 4.29, 8.58, 12.87, 8.58, 4.29],
        unit: "MB",
        currentLabel: "本週",
        previousLabel: "上週",
      },
      "本月 vs 上月": {
        xAxisData: ["第1週", "第2週", "第3週", "第4週"],
        currentData: [125.5, 142.3, 138.7, 152.4],
        previousData: [108.2, 125.5, 132.8, 145.2],
        unit: "MB",
        currentLabel: "本月",
        previousLabel: "上月",
      },
    }

    return dataConfigs[period] || dataConfigs["本週 vs 上週"]
  }

  const generateStats = (period: string) => {
    const statsConfigs: Record<string, any> = {
      "1小時 vs 上1小時": {
        totalTraffic: { current: "3.25 MB", previous: "2.85 MB", change: 14.04 },
        sourceIPs: { current: "245", previous: "238", change: 2.94 },
        attackIPs: { current: "18", previous: "15", change: 20.0 },
        avgSize: { current: "1.52 KB", previous: "1.45 KB", change: 4.83 },
      },
      "6小時 vs 上6小時": {
        totalTraffic: { current: "18.75 MB", previous: "16.20 MB", change: 15.74 },
        sourceIPs: { current: "1,420", previous: "1,350", change: 5.19 },
        attackIPs: { current: "95", previous: "82", change: 15.85 },
        avgSize: { current: "1.48 KB", previous: "1.42 KB", change: 4.23 },
      },
      "今天 vs 昨天": {
        totalTraffic: { current: "52.30 MB", previous: "48.90 MB", change: 6.95 },
        sourceIPs: { current: "3,850", previous: "3,620", change: 6.35 },
        attackIPs: { current: "287", previous: "245", change: 17.14 },
        avgSize: { current: "1.51 KB", previous: "1.44 KB", change: 4.86 },
      },
      "近3天 vs 上3天": {
        totalTraffic: { current: "146.50 MB", previous: "121.50 MB", change: 20.58 },
        sourceIPs: { current: "9,850", previous: "8,420", change: 16.98 },
        attackIPs: { current: "685", previous: "512", change: 33.79 },
        avgSize: { current: "1.49 KB", previous: "1.41 KB", change: 5.67 },
      },
      "本週 vs 上週": {
        totalTraffic: { current: "25.25 MB", previous: "23.50 MB", change: 7.45 },
        sourceIPs: { current: "17,500", previous: "17,500", change: 0.0 },
        attackIPs: { current: "1,007", previous: "437", change: 130.43 },
        avgSize: { current: "1.48 KB", previous: "1.38 KB", change: 7.42 },
      },
      "本月 vs 上月": {
        totalTraffic: { current: "558.90 MB", previous: "511.70 MB", change: 9.23 },
        sourceIPs: { current: "42,350", previous: "38,920", change: 8.81 },
        attackIPs: { current: "3,245", previous: "2,187", change: 48.38 },
        avgSize: { current: "1.52 KB", previous: "1.43 KB", change: 6.29 },
      },
    }

    const config = statsConfigs[period] || statsConfigs["本週 vs 上週"]

    return [
      {
        icon: Database,
        label: "總請求流量",
        value: config.totalTraffic.current,
        previousValue: config.totalTraffic.previous,
        change: config.totalTraffic.change,
        trend: config.totalTraffic.change === 0 ? "stable" : config.totalTraffic.change > 0 ? "up" : "down",
        description: "總請求量比上",
      },
      {
        icon: Globe,
        label: "攻擊來源 IP 數",
        value: config.sourceIPs.current,
        previousValue: config.sourceIPs.previous,
        change: config.sourceIPs.change,
        trend: config.sourceIPs.change === 0 ? "stable" : config.sourceIPs.change > 0 ? "up" : "down",
        description: "攻擊請求來源數比",
      },
      {
        icon: Zap,
        label: "攻擊IP數量",
        value: config.attackIPs.current,
        previousValue: config.attackIPs.previous,
        change: config.attackIPs.change,
        trend: config.attackIPs.change === 0 ? "stable" : config.attackIPs.change > 0 ? "up" : "down",
        description: "總共檢測到可疑的IP地址數量",
      },
      {
        icon: FileText,
        label: "平均請求大小",
        value: config.avgSize.current,
        previousValue: config.avgSize.previous,
        change: config.avgSize.change,
        trend: config.avgSize.change === 0 ? "stable" : config.avgSize.change > 0 ? "up" : "down",
        description: "每個請求的平均數據大小",
      },
    ]
  }

  useEffect(() => {
    if (isComplete) {
      setChartData(generateChartData(selectedPeriod))
      setStats(generateStats(selectedPeriod))
    }
  }, [selectedPeriod, isComplete])

  const handleAnalysis = () => {
    setIsAnalyzing(true)
    setProgress(0)
    setIsComplete(false)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 7) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setIsComplete(true)
          setChartData(generateChartData(selectedPeriod))
          setStats(generateStats(selectedPeriod))
          return 7
        }
        return prev + 1
      })
    }, 500)
  }

  const chartOption = chartData
    ? {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#64748b",
              width: 1,
              type: "dashed",
            },
            lineStyle: {
              color: "#64748b",
              width: 1,
              type: "dashed",
            },
          },
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          borderColor: "#334155",
          borderWidth: 1,
          textStyle: {
            color: "#e2e8f0",
          },
          formatter: (params: any) => {
            if (!params || params.length === 0) return ""

            let result = `<div style="padding: 12px; min-width: 280px;">`
            result += `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px; color: #f1f5f9;">${params[0].name}</div>`

            const currentValue = params[0]?.value || 0
            const previousValue = params[1]?.value || 0
            const difference = currentValue - previousValue
            const percentChange = previousValue !== 0 ? ((difference / previousValue) * 100).toFixed(2) : "N/A"

            params.forEach((param: any, index: number) => {
              result += `<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 6px; background: rgba(51, 65, 85, 0.3); border-radius: 4px;">
            <div style="display: flex; align-items: center; flex: 1;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${param.color}; margin-right: 10px; box-shadow: 0 0 8px ${param.color};"></span>
              <span style="font-size: 12px; color: #cbd5e1;">${index === 0 ? chartData.currentLabel : chartData.previousLabel}</span>
            </div>
            <span style="font-weight: bold; font-size: 14px; color: #f1f5f9;">${param.value} ${chartData.unit}</span>
          </div>`
            })

            if (params.length === 2) {
              const changeColor = difference > 0 ? "#ef4444" : difference < 0 ? "#22c55e" : "#3b82f6"
              const changeIcon = difference > 0 ? "▲" : difference < 0 ? "▼" : "●"

              result += `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #334155;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #94a3b8;">變化量</span>
              <span style="font-weight: bold; color: ${changeColor}; font-size: 13px;">
                ${changeIcon} ${Math.abs(difference).toFixed(2)} ${chartData.unit}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
              <span style="font-size: 12px; color: #94a3b8;">變化率</span>
              <span style="font-weight: bold; color: ${changeColor}; font-size: 13px;">
                ${difference > 0 ? "+" : ""}${percentChange}%
              </span>
            </div>
          </div>`
            }

            result += `</div>`
            return result
          },
        },
        legend: {
          data: [chartData.currentLabel, chartData.previousLabel],
          bottom: 20,
          textStyle: {
            color: "#94a3b8",
            fontSize: 12,
          },
          itemWidth: 30,
          itemHeight: 2,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          top: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: chartData.xAxisData,
          axisLine: {
            lineStyle: {
              color: "#334155",
            },
          },
          axisLabel: {
            color: "#94a3b8",
          },
        },
        yAxis: {
          type: "value",
          name: chartData.unit,
          nameTextStyle: {
            color: "#94a3b8",
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#94a3b8",
            formatter: `{value} ${chartData.unit}`,
          },
          splitLine: {
            lineStyle: {
              color: "#1e293b",
              type: "dashed",
            },
          },
        },
        series: [
          {
            name: chartData.currentLabel,
            type: "line",
            smooth: false,
            data: chartData.currentData,
            lineStyle: {
              color: "#DC2626",
              width: 2,
            },
            itemStyle: {
              color: "#DC2626",
            },
            symbol: "circle",
            symbolSize: 8,
            emphasis: {
              focus: "series",
              itemStyle: {
                color: "#DC2626",
                borderColor: "#fff",
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: "#DC2626",
              },
              lineStyle: {
                width: 3,
              },
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(220, 38, 38, 0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(220, 38, 38, 0.05)",
                  },
                ],
              },
            },
          },
          {
            name: chartData.previousLabel,
            type: "line",
            smooth: true,
            data: chartData.previousData,
            lineStyle: {
              color: "#2563EB",
              width: 2,
              type: "dashed",
            },
            itemStyle: {
              color: "#2563EB",
            },
            symbol: "circle",
            symbolSize: 6,
            emphasis: {
              focus: "series",
              itemStyle: {
                color: "#2563EB",
                borderColor: "#fff",
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: "#2563EB",
              },
              lineStyle: {
                width: 3,
              },
            },
          },
        ],
      }
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services" className="text-slate-400 hover:text-slate-200">
                服務管理
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-600" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/security-ai" className="text-slate-400 hover:text-slate-200">
                SecurityAI一鍵分析
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-600" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-200 font-medium">攻擊趨勢對比分析</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
              攻擊趨勢對比分析
            </h1>
            <p className="text-slate-400">攻擊流量趨勢深度對比</p>
          </div>
          <Link href="/services/security-ai">
            <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回分析選單
            </Button>
          </Link>
        </div>

        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-gradient-to-r from-slate-700 via-slate-800/50 to-transparent border border-slate-700 text-slate-200 px-6 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer min-w-[280px]"
            >
              <option>1小時 vs 上1小時</option>
              <option>6小時 vs 上6小時</option>
              <option>今天 vs 昨天</option>
              <option>近3天 vs 上3天</option>
              <option>本週 vs 上週</option>
              <option>本月 vs 上月</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
          </div>
          <Button
            onClick={handleAnalysis}
            disabled={isAnalyzing}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 font-semibold"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            載入趨勢圖表
          </Button>
        </div>

        {(isAnalyzing || isComplete) && (
          <Card className="mb-8 bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">查詢進度 (分批查詢)</h3>
                <span className="text-slate-400 text-sm">{progress}/7</span>
              </div>
              <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-500 ease-out"
                  style={{ width: `${(progress / 7) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                {isComplete ? (
                  <>
                    <span className="text-green-400">已完成</span>
                    <span className="text-slate-400">總記錄: 30000</span>
                  </>
                ) : (
                  <span className="text-brand-primary">查詢中...</span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isComplete && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">趨勢對比統計</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  const isNegative = stat.change < 0
                  const isStable = stat.change === 0
                  const changeColor = isStable ? "text-blue-400" : isNegative ? "text-red-400" : "text-red-400"

                  return (
                    <div key={index} className="relative">
                      <Card className="bg-slate-900 border-0 rounded-none hover:bg-slate-800/90 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-brand-primary" />
                              <h3 className="text-sm font-medium text-slate-300">{stat.label}</h3>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-slate-500">上一��期: {stat.previousValue}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}>
                              {!isStable &&
                                (isNegative ? (
                                  <TrendingDown className="h-4 w-4" />
                                ) : (
                                  <TrendingUp className="h-4 w-4" />
                                ))}
                              {isStable ? "0.00%" : `${isNegative ? "" : "+"}${stat.change.toFixed(2)}%`}
                            </div>
                            <Badge
                              variant="outline"
                              className={isStable ? "border-blue-500 text-blue-400" : "border-red-500 text-red-400"}
                            >
                              {isStable ? "穩定" : isNegative ? "下降" : "上升"}
                            </Badge>
                          </div>
                          <div className="mt-3 text-xs text-slate-500">{stat.description}</div>
                        </CardContent>
                      </Card>
                      {index < stats.length - 1 && (
                        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-3/4">
                          <div
                            className="h-full w-[1px]"
                            style={{
                              background:
                                "linear-gradient(to bottom, transparent 0%, rgba(148, 163, 184, 0.3) 20%, rgba(148, 163, 184, 0.8) 50%, rgba(148, 163, 184, 0.3) 80%, transparent 100%)",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  攻擊請求流量趨勢對比圖
                </h2>
                {isMounted && chartOption && (
                  <div className="h-[500px]">
                    <ReactECharts option={chartOption} style={{ height: "100%", width: "100%" }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
