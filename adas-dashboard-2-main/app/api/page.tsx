"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  FileJson,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export default function ApiPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl">
          API <span style={{ color: "#0D99FF" }}>(BDE)</span>
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          使用我們的API保護您的應用程式和數據免受各種網路威脅
        </p>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-4 bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="security"
            className="data-[state=active]:text-white"
            style={
              {
                "--tw-bg-opacity": "1",
                backgroundColor: "var(--state-active, transparent)",
                "--state-active": "var(--state, transparent)",
              } as React.CSSProperties
            }
            onMouseOver={(e) => {
              if ((e.target as HTMLElement).getAttribute("data-state") !== "active") {
                ;(e.target as HTMLElement).style.setProperty("--state", "rgba(13, 153, 255, 0.1)")
              }
            }}
            onMouseOut={(e) => {
              ;(e.target as HTMLElement).style.setProperty("--state", "transparent")
            }}
          >
            API 安全防護
          </TabsTrigger>
          <TabsTrigger
            value="monitoring"
            className="data-[state=active]:text-white"
            style={
              {
                "--tw-bg-opacity": "1",
                backgroundColor: "var(--state-active, transparent)",
                "--state-active": "var(--state, transparent)",
              } as React.CSSProperties
            }
            onMouseOver={(e) => {
              if ((e.target as HTMLElement).getAttribute("data-state") !== "active") {
                ;(e.target as HTMLElement).style.setProperty("--state", "rgba(13, 153, 255, 0.1)")
              }
            }}
            onMouseOut={(e) => {
              ;(e.target as HTMLElement).style.setProperty("--state", "transparent")
            }}
          >
            API 盤點監控
          </TabsTrigger>
          <TabsTrigger
            value="authorization"
            className="data-[state=active]:text-white"
            style={
              {
                "--tw-bg-opacity": "1",
                backgroundColor: "var(--state-active, transparent)",
                "--state-active": "var(--state, transparent)",
              } as React.CSSProperties
            }
            onMouseOver={(e) => {
              if ((e.target as HTMLElement).getAttribute("data-state") !== "active") {
                ;(e.target as HTMLElement).style.setProperty("--state", "rgba(13, 153, 255, 0.1)")
              }
            }}
            onMouseOut={(e) => {
              ;(e.target as HTMLElement).style.setProperty("--state", "transparent")
            }}
          >
            API 授權驗證
          </TabsTrigger>
          <TabsTrigger
            value="intelligence"
            className="data-[state=active]:text-white"
            style={
              {
                "--tw-bg-opacity": "1",
                backgroundColor: "var(--state-active, transparent)",
                "--state-active": "var(--state, transparent)",
              } as React.CSSProperties
            }
            onMouseOver={(e) => {
              if ((e.target as HTMLElement).getAttribute("data-state") !== "active") {
                ;(e.target as HTMLElement).style.setProperty("--state", "rgba(13, 153, 255, 0.1)")
              }
            }}
            onMouseOut={(e) => {
              ;(e.target as HTMLElement).style.setProperty("--state", "transparent")
            }}
          >
            智慧報告
          </TabsTrigger>
        </TabsList>

        {/* API 安全防護 */}
        <TabsContent value="security" className="mt-6">
          <ApiSecurityReport />
        </TabsContent>

        {/* API 盤點監控 */}
        <TabsContent value="monitoring" className="mt-6">
          <ApiMonitoringReport />
        </TabsContent>

        {/* API 授權驗證 */}
        <TabsContent value="authorization" className="mt-6">
          <ApiAuthorizationReport />
        </TabsContent>

        {/* 智慧報告 */}
        <TabsContent value="intelligence" className="mt-6">
          <IntelligenceReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// API 安全防護報表
function ApiSecurityReport() {
  // 模擬數據
  const attackData = [
    { name: "1月", SQL注入: 65, XSS攻擊: 42, CSRF: 28, 其他: 15 },
    { name: "2月", SQL注入: 59, XSS攻擊: 38, CSRF: 24, 其他: 19 },
    { name: "3月", SQL注入: 80, XSS攻擊: 52, CSRF: 35, 其他: 22 },
    { name: "4月", SQL注入: 55, XSS攻擊: 45, CSRF: 30, 其他: 18 },
    { name: "5月", SQL注入: 48, XSS攻擊: 37, CSRF: 25, 其他: 14 },
  ]

  const securityScoreData = [
    { name: "1月", 分數: 78 },
    { name: "2月", 分數: 82 },
    { name: "3月", 分數: 75 },
    { name: "4月", 分數: 85 },
    { name: "5月", 分數: 92 },
  ]

  const vulnerabilityData = [
    { name: "高風險", value: 12, color: "#ef4444" },
    { name: "中風險", value: 28, color: "#f97316" },
    { name: "低風險", value: 45, color: "#22b866" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="已阻擋攻擊"
          value="1,284"
          description="過去30天"
          trend="+12.5%"
          trendType="positive"
          icon={<Shield className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="安全評分"
          value="92/100"
          description="上個月: 85/100"
          trend="+8.2%"
          trendType="positive"
          icon={<BarChart3 className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="漏洞數量"
          value="85"
          description="已修復: 73"
          trend="-15.3%"
          trendType="positive"
          icon={<AlertTriangle className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">攻擊類型分佈</CardTitle>
            <CardDescription className="text-gray-300">過去5個月的攻擊類型統計</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Bar dataKey="SQL注入" stackId="a" fill="#0D99FF" />
                  <Bar dataKey="XSS攻擊" stackId="a" fill="#5591BD" />
                  <Bar dataKey="CSRF" stackId="a" fill="#7dd3fc" />
                  <Bar dataKey="其他" stackId="a" fill="#a3a3a3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">安全評分趨勢</CardTitle>
            <CardDescription className="text-gray-300">過去5個月的安全評分變化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={securityScoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Area type="monotone" dataKey="分數" stroke="#0D99FF" fill="#0D99FF" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">漏洞風險分佈</CardTitle>
            <CardDescription className="text-gray-300">按風險等級分類的漏洞數量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={vulnerabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {vulnerabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">最近安全事件</CardTitle>
            <CardDescription className="text-gray-300">過去7天的重要安全事件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SecurityEvent
                type="高風險"
                title="SQL注入嘗試"
                time="今天 09:45"
                description="偵測到來自 IP 192.168.1.45 的SQL注入嘗試"
                status="已阻擋"
              />
              <SecurityEvent
                type="中風險"
                title="異常API請求頻率"
                time="昨天 15:23"
                description="用戶ID 45892 在短時間內發送了超過 500 個請求"
                status="已限流"
              />
              <SecurityEvent
                type="高風險"
                title="未授權訪問嘗試"
                time="2天前 22:17"
                description="偵測到使用過期令牌訪問敏感API的嘗試"
                status="已阻擋"
              />
              <SecurityEvent
                type="低風險"
                title="API參數異常"
                time="3天前 11:05"
                description="請求中包含非預期的參數格式"
                status="已記錄"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// API 盤點監控報表
function ApiMonitoringReport() {
  // 模擬數據
  // 修復第342行的字元編碼錯誤
  const apiUsageData = [
    { name: "1月", 用戶API: 1200, 管理API: 850, 數據API: 1800, 交易API: 950 },
    { name: "2月", 用戶API: 1350, 管理API: 940, 數據API: 1950, 交易API: 1050 },
    { name: "3月", 用戶API: 1480, 管理API: 1100, 數據API: 2100, 交易API: 1200 },
    { name: "4月", 用戶API: 1620, 管理API: 1250, 數據API: 2300, 交易API: 1350 },
    { name: "5月", 用戶API: 1800, 管理API: 1400, 數據API: 2500, 交易API: 1500 },
  ]

  const responseTimeData = [
    { name: "1月", 平均響應時間: 120 },
    { name: "2月", 平均響應時間: 135 },
    { name: "3月", 平均響應時間: 110 },
    { name: "4月", 平均響應時間: 95 },
    { name: "5月", 平均響應時間: 85 },
  ]

  const apiStatusData = [
    { name: "正常運行", value: 85, color: "#22b866" },
    { name: "效能降低", value: 10, color: "#f97316" },
    { name: "服務中斷", value: 5, color: "#ef4444" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="活躍API總數"
          value="124"
          description="上個月: 118"
          trend="+5.1%"
          trendType="positive"
          icon={<FileJson className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="API調用量"
          value="2.8M"
          description="過去30天"
          trend="+12.3%"
          trendType="positive"
          icon={<BarChart3 className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="平均響應時間"
          value="85ms"
          description="上個月: 95ms"
          trend="-10.5%"
          trendType="positive"
          icon={<LineChart className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">API調用趨勢</CardTitle>
            <CardDescription className="text-gray-300">過去5個月API調用量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Bar dataKey="用戶API" fill="#0D99FF" />
                  <Bar dataKey="管理API" fill="#5591BD" />
                  <Bar dataKey="數據API" fill="#7dd3fc" />
                  <Bar dataKey="交易API" fill="#a3a3a3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">響應時間趨勢</CardTitle>
            <CardDescription className="text-gray-300">過去5個月的平均響應時間(毫秒)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={responseTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Line type="monotone" dataKey="平均響應時間" stroke="#0D99FF" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">API狀態分佈</CardTitle>
            <CardDescription className="text-gray-300">當前API服務狀態分佈</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={apiStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {apiStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">API盤點清單</CardTitle>
            <CardDescription className="text-gray-300">最近新增和更新的API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ApiListItem name="/api/v1/users" method="GET" category="用戶API" lastUpdated="2天前" status="正常" />
              <ApiListItem
                name="/api/v1/transactions"
                method="POST"
                category="交易API"
                lastUpdated="3天前"
                status="正常"
              />
              <ApiListItem
                name="/api/v1/products"
                method="GET"
                category="數據API"
                lastUpdated="5天前"
                status="效能降低"
              />
              <ApiListItem
                name="/api/v1/admin/settings"
                method="PUT"
                category="管理API"
                lastUpdated="1週前"
                status="正常"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// API 授權驗證報表
function ApiAuthorizationReport() {
  // 模擬數據
  const authRequestsData = [
    { name: "1月", 成功: 8500, 失敗: 1200 },
    { name: "2月", 成功: 9200, 失敗: 980 },
    { name: "3月", 成功: 10500, 失敗: 1150 },
    { name: "4月", 成功: 11800, 失敗: 850 },
    { name: "5月", 成功: 12500, 失敗: 720 },
  ]

  const tokenUsageData = [
    { name: "1月", JWT: 5200, OAuth: 3300, API密鑰: 1200 },
    { name: "2月", JWT: 5800, OAuth: 3400, API密鑰: 980 },
    { name: "3月", JWT: 6500, OAuth: 4000, API密鑰: 1150 },
    { name: "4月", JWT: 7200, OAuth: 4600, API密鑰: 850 },
    { name: "5月", JWT: 7800, OAuth: 4700, API密鑰: 720 },
  ]

  const permissionData = [
    { name: "讀取權限", value: 45, color: "#0D99FF" },
    { name: "寫入權限", value: 30, color: "#5591BD" },
    { name: "管理權限", value: 15, color: "#7dd3fc" },
    { name: "系統權限", value: 10, color: "#a3a3a3" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="授權請求總數"
          value="13.2M"
          description="過去30天"
          trend="+8.7%"
          trendType="positive"
          icon={<Lock className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="授權成功率"
          value="94.6%"
          description="上個月: 92.8%"
          trend="+1.8%"
          trendType="positive"
          icon={<CheckCircle className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="活躍令牌數"
          value="8,542"
          description="過去7天"
          trend="+5.3%"
          trendType="positive"
          icon={<Users className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">授權請求趨勢</CardTitle>
            <CardDescription className="text-gray-300">過去5個月的授權請求成功與失敗數量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={authRequestsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Bar dataKey="成功" fill="#22b866" />
                  <Bar dataKey="失敗" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">認證方式使用趨勢</CardTitle>
            <CardDescription className="text-gray-300">過去5個月的不同認證方式使用量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Area type="monotone" dataKey="JWT" stackId="1" stroke="#0D99FF" fill="#0D99FF" />
                  <Area type="monotone" dataKey="OAuth" stackId="1" stroke="#5591BD" fill="#5591BD" />
                  <Area type="monotone" dataKey="API密鑰" stackId="1" stroke="#7dd3fc" fill="#7dd3fc" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">權限分佈</CardTitle>
            <CardDescription className="text-gray-300">API訪問權限類型分佈</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={permissionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {permissionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">最近授權事件</CardTitle>
            <CardDescription className="text-gray-300">過去7天的重要授權事件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AuthEvent
                type="成功"
                title="用戶登入"
                time="今天 10:23"
                description="用戶ID 45892 成功登入並獲取訪問令牌"
                method="OAuth 2.0"
              />
              <AuthEvent
                type="失敗"
                title="無效令牌"
                time="昨天 15:45"
                description="偵測到使用過期JWT令牌的訪問嘗試"
                method="JWT"
              />
              <AuthEvent
                type="成功"
                title="權限更新"
                time="2天前 09:17"
                description="管理員更新了用戶組 'developers' 的API訪問權限"
                method="系統操作"
              />
              <AuthEvent
                type="失敗"
                title="未授權訪問"
                time="3天前 22:05"
                description="用戶嘗試訪問無權限的管理API"
                method="API密鑰"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 統計卡片組件
function StatCard({ title, value, description, trend, trendType, icon }) {
  return (
    <Card className="shadow-lg bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-300">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-full">{icon}</div>
        </div>
        <div
          className={`mt-4 flex items-center text-sm ${trendType === "positive" ? "text-green-500" : "text-red-500"}`}
        >
          {trendType === "positive" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {trend}
        </div>
      </CardContent>
    </Card>
  )
}

// 安全事件組件
function SecurityEvent({ type, title, time, description, status }) {
  let typeColor = "bg-blue-100 text-blue-800"
  let statusColor = "bg-blue-100 text-blue-800"

  if (type === "高風險") {
    typeColor = "bg-red-100 text-red-800"
  } else if (type === "中風險") {
    typeColor = "bg-orange-100 text-orange-800"
  }

  if (status === "已記錄") {
    statusColor = "bg-gray-100 text-gray-800"
  } else if (status === "已限流") {
    statusColor = "bg-orange-100 text-orange-800"
  }

  return (
    <div className="flex items-start p-4 border border-gray-700 rounded-md shadow-sm bg-gray-700">
      <div className="flex-shrink-0 mr-4">
        <AlertTriangle className="h-6 w-6" style={{ color: "#0D99FF" }} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${typeColor} mr-2`}>{type}</span>
            <h4 className="text-sm font-medium text-white">{title}</h4>
          </div>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-300 mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>{status}</span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
          >
            查看詳情
          </Button>
        </div>
      </div>
    </div>
  )
}

// API列表項組件
function ApiListItem({ name, method, category, lastUpdated, status }) {
  let methodColor = "bg-blue-100 text-blue-800"
  let statusColor = "text-green-500"
  let statusIcon = <CheckCircle className="h-4 w-4" />

  if (method === "POST") {
    methodColor = "bg-blue-100 text-blue-800"
  } else if (method === "PUT") {
    methodColor = "bg-orange-100 text-orange-800"
  } else if (method === "DELETE") {
    methodColor = "bg-red-100 text-red-800"
  }

  if (status === "效能降低") {
    statusColor = "text-orange-500"
    statusIcon = <AlertTriangle className="h-4 w-4" />
  } else if (status === "服務中斷") {
    statusColor = "text-red-500"
    statusIcon = <XCircle className="h-4 w-4" />
  }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-700 rounded-md shadow-sm bg-gray-700">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          <FileJson className="h-6 w-6" style={{ color: "#0D99FF" }} />
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className={`text-xs px-2 py-1 rounded-full ${methodColor} mr-2`}>{method}</span>
            <h4 className="text-sm font-medium text-white">{name}</h4>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <span className="mr-3">{category}</span>
            <span>更新於: {lastUpdated}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className={`flex items-center mr-4 ${statusColor}`}>
          {statusIcon}
          <span className="ml-1 text-sm">{status}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
        >
          查看詳情
        </Button>
      </div>
    </div>
  )
}

// 授權事件組件
function AuthEvent({ type, title, time, description, method }) {
  let typeColor = "bg-green-100 text-green-800"
  let typeIcon = <CheckCircle className="h-6 w-6 text-green-500" />

  if (type === "失敗") {
    typeColor = "bg-red-100 text-red-800"
    typeIcon = <XCircle className="h-6 w-6 text-red-500" />
  }

  return (
    <div className="flex items-start p-4 border border-gray-700 rounded-md shadow-sm bg-gray-700">
      <div className="flex-shrink-0 mr-4">{typeIcon}</div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${typeColor} mr-2`}>{type}</span>
            <h4 className="text-sm font-medium text-white">{title}</h4>
          </div>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-300 mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">{method}</span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
          >
            查看詳情
          </Button>
        </div>
      </div>
    </div>
  )
}

// 智慧報告組件
function IntelligenceReport() {
  // 前一天的資安分析數據
  const yesterdayAnalysis = {
    totalThreats: 156,
    blockedAttacks: 142,
    suspiciousActivities: 23,
    vulnerabilities: 8,
    riskScore: 78,
  }

  // 今日預測數據
  const todayPrediction = {
    expectedThreats: 180,
    riskLevel: "中等",
    criticalHours: ["09:00-11:00", "14:00-16:00", "20:00-22:00"],
    recommendedActions: ["加強上午時段的監控", "檢查API訪問頻率限制", "更新安全規則配置", "準備應急響應團隊"],
  }

  // 威脅趨勢數據
  const threatTrendData = [
    { time: "00:00", 昨日: 12, 預測: 15 },
    { time: "03:00", 昨日: 8, 預測: 10 },
    { time: "06:00", 昨日: 15, 預測: 18 },
    { time: "09:00", 昨日: 28, 預測: 35 },
    { time: "12:00", 昨日: 22, 預測: 25 },
    { time: "15:00", 昨日: 31, 預測: 38 },
    { time: "18:00", 昨日: 25, 預測: 28 },
    { time: "21:00", 昨日: 15, 預測: 20 },
  ]

  // 風險分佈數據
  const riskDistributionData = [
    { name: "低風險", 昨日: 45, 預測: 42, color: "#22b866" },
    { name: "中風險", 昨日: 35, 預測: 38, color: "#f97316" },
    { name: "高風險", 昨日: 20, 預測: 20, color: "#ef4444" },
  ]

  return (
    <div className="space-y-8">
      {/* 概覽統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 昨日分析 */}
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <BarChart3 className="h-6 w-6 mr-2" style={{ color: "#0D99FF" }} />
              昨日資安分析
            </CardTitle>
            <CardDescription className="text-gray-300">
              {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("zh-TW")} 安全狀況總結
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">總威脅數</p>
                <p className="text-2xl font-bold text-white">{yesterdayAnalysis.totalThreats}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">成功阻擋</p>
                <p className="text-2xl font-bold text-green-500">{yesterdayAnalysis.blockedAttacks}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">可疑活動</p>
                <p className="text-2xl font-bold text-orange-500">{yesterdayAnalysis.suspiciousActivities}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">風險評分</p>
                <p className="text-2xl font-bold" style={{ color: "#0D99FF" }}>
                  {yesterdayAnalysis.riskScore}/100
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <p className="text-green-400 font-medium">✓ 昨日整體安全狀況良好</p>
              <p className="text-sm text-gray-300 mt-1">
                阻擋率達到 {Math.round((yesterdayAnalysis.blockedAttacks / yesterdayAnalysis.totalThreats) * 100)}%，
                系統運行穩定
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 今日預測 */}
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" style={{ color: "#0D99FF" }} />
              今日安全預測
            </CardTitle>
            <CardDescription className="text-gray-300">
              {new Date().toLocaleDateString("zh-TW")} AI智能預測分析
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">預期威脅</p>
                <p className="text-2xl font-bold text-white">{todayPrediction.expectedThreats}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">風險等級</p>
                <p className="text-2xl font-bold text-orange-500">{todayPrediction.riskLevel}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-medium">高風險時段</h4>
              <div className="flex flex-wrap gap-2">
                {todayPrediction.criticalHours.map((hour, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-900/30 border border-red-700 rounded-full text-red-400 text-sm"
                  >
                    {hour}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-medium">建議措施</h4>
              <ul className="space-y-2">
                {todayPrediction.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-300">
                    <span className="text-blue-400 mr-2">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 威脅趨勢圖表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">24小時威脅趨勢</CardTitle>
            <CardDescription className="text-gray-300">昨日實際 vs 今日預測威脅數量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={threatTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Line type="monotone" dataKey="昨日" stroke="#0D99FF" strokeWidth={2} />
                  <Line type="monotone" dataKey="預測" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">風險等級分佈</CardTitle>
            <CardDescription className="text-gray-300">昨日 vs 今日預測風險分佈比較</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Bar dataKey="昨日" fill="#0D99FF" />
                  <Bar dataKey="預測" fill="#5591BD" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI 分析洞察 */}
      <Card className="shadow-lg bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Eye className="h-6 w-6 mr-2" style={{ color: "#0D99FF" }} />
            AI 智能分析洞察
          </CardTitle>
          <CardDescription className="text-gray-300">基於機器學習的深度安全分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">關鍵發現</h4>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm">攻擊模式變化</p>
                    <p className="text-gray-300 text-sm">檢測到新的SQL注入攻擊模式，建議更新防護規則</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium text-sm">防護效果提升</p>
                    <p className="text-gray-300 text-sm">機器學習模型準確率提升至96.8%，誤報率大幅下降15%</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-orange-400 font-medium text-sm">異常流量來源</p>
                    <p className="text-gray-300 text-sm">發現來自特定地區的異常API調用，建議加強監控</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">優化建議</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-white font-medium text-sm mb-1">1. 規則優化</p>
                  <p className="text-gray-300 text-sm">建議在09:00前更新WAF規則，應對預期的攻擊模式</p>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-white font-medium text-sm mb-1">2. 監控加強</p>
                  <p className="text-gray-300 text-sm">在高風險時段增加人工監控，確保及時響應</p>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-white font-medium text-sm mb-1">3. 預防措施</p>
                  <p className="text-gray-300 text-sm">啟用高級威脅檢測模式，提高敏感API的保護等級</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
