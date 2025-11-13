"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Shield, Globe, Settings, TrendingUp, CheckCircle, Zap, Activity } from "lucide-react"
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

export default function ApplicationDefenseManagePage() {
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
            <BreadcrumbPage className="text-foreground font-medium">應用層DDoS防禦管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter mb-4">
          應用層<span className="text-brand-primary">DDoS防禦</span>管理
        </h1>
        <p className="text-muted-foreground text-lg">管理您的DDoS防護設定，監控攻擊狀況，確保服務持續可用</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg bg-card border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">服務狀態</p>
                <p className="text-2xl font-bold text-foreground mt-2">正常運行</p>
                <p className="text-sm text-green-500 mt-1">防護已啟用</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">防護域名</p>
                <p className="text-2xl font-bold text-foreground mt-2">5</p>
                <p className="text-sm text-blue-500 mt-1">已配置域名</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">攻擊阻擋率</p>
                <p className="text-2xl font-bold text-foreground mt-2">99.7%</p>
                <p className="text-sm text-purple-500 mt-1">本月統計</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domain List */}
      <Card className="shadow-lg bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">防護域名列表</CardTitle>
          <CardDescription className="text-muted-foreground">當前受DDoS防護的域名清單及敏感度設定</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">example.com</p>
                    <p className="text-sm text-muted-foreground">主域名</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground mr-2">防護敏感度</span>
                    <span className="text-sm font-medium text-muted-foreground">低</span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      defaultValue="3"
                      className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      style={{
                        background: "linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)",
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        let color
                        if (value === 1) color = "#22c55e"
                        else if (value === 2) color = "#eab308"
                        else color = "#ef4444"

                        // Update the track color based on position
                        const percentage = ((value - 1) / 2) * 100
                        e.target.style.background = `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                        if (value === 2) {
                          e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #e5e7eb 50%, #e5e7eb 100%)`
                        } else if (value === 3) {
                          e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                        }
                      }}
                    />
                    <span className="text-sm font-medium text-muted-foreground">高</span>
                  </div>
                  <Button size="sm" variant="outline">
                    管理
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              <div className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">example.com</p>
                      <p className="text-sm text-muted-foreground">主域名</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    管理
                  </Button>
                </div>

                {/* Mobile Sensitivity Control */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">防護敏感度</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground min-w-[24px]">低</span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      defaultValue="3"
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      style={{
                        background: "linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)",
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        let color
                        if (value === 1) color = "#22c55e"
                        else if (value === 2) color = "#eab308"
                        else color = "#ef4444"

                        // Update the track color based on position
                        const percentage = ((value - 1) / 2) * 100
                        e.target.style.background = `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                        if (value === 2) {
                          e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #e5e7eb 50%, #e5e7eb 100%)`
                        } else if (value === 3) {
                          e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                        }
                      }}
                    />
                    <span className="text-xs text-muted-foreground min-w-[24px]">高</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional domains */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">api.example.com</p>
                    <p className="text-sm text-muted-foreground">API 子域名</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground mr-2">防護敏感度</span>
                    <span className="text-sm font-medium text-muted-foreground">低</span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      defaultValue="2"
                      className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      style={{
                        background: "linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)",
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <span className="text-sm font-medium text-muted-foreground">高</span>
                  </div>
                  <Button size="sm" variant="outline">
                    管理
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <div className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">api.example.com</p>
                      <p className="text-sm text-muted-foreground">API 子域名</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    管理
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">防護敏感度</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground min-w-[24px]">低</span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      defaultValue="2"
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      style={{
                        background: "linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)",
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <span className="text-xs text-muted-foreground min-w-[24px]">高</span>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #ffffff;
                border: 3px solid hsl(var(--brand-primary));
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px hsl(var(--brand-primary) / 0.3);
                transition: all 0.2s ease;
              }
              
              input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px hsl(var(--brand-primary) / 0.5);
              }
              
              input[type="range"]::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #ffffff;
                border: 3px solid hsl(var(--brand-primary));
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px hsl(var(--brand-primary) / 0.3);
                transition: all 0.2s ease;
              }
              
              input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px hsl(var(--brand-primary) / 0.5);
              }
              
              input[type="range"]::-webkit-slider-track {
                height: 8px;
                border-radius: 4px;
              }
              
              input[type="range"]::-moz-range-track {
                height: 8px;
                border-radius: 4px;
                border: none;
              }
            `}</style>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
          防護<span className="text-brand-primary">分析</span>
        </h2>
        <DDoSAnalytics />
      </section>

      {/* Quick Actions */}
      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">快速操作</CardTitle>
          <CardDescription className="text-muted-foreground">常用的DDoS防護管理功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" variant="outline">
              <Globe className="h-6 w-6" />
              <span>添加域名</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" variant="outline">
              <Settings className="h-6 w-6" />
              <span>防護設定</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" variant="outline">
              <Activity className="h-6 w-6" />
              <span>攻擊日誌</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" variant="outline">
              <TrendingUp className="h-6 w-6" />
              <span>性能報告</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DDoSAnalytics() {
  // 模擬數據
  const attackData = [
    { name: "1月", 容量攻擊: 25, 協議攻擊: 18, 應用層攻擊: 32, 混合攻擊: 12 },
    { name: "2月", 容量攻擊: 22, 協議攻擊: 15, 應用層攻擊: 28, 混合攻擊: 10 },
    { name: "3月", 容量攻擊: 35, 協議攻擊: 24, 應用層攻擊: 42, 混合攻擊: 18 },
    { name: "4月", 容量攻擊: 18, 協議攻擊: 12, 應用層攻擊: 25, 混合攻擊: 8 },
    { name: "5月", 容量攻擊: 15, 協議攻擊: 10, 應用層攻擊: 22, 混合攻擊: 6 },
    { name: "6月", 容量攻擊: 12, 協議攻擊: 8, 應用層攻擊: 18, 混合攻擊: 4 },
  ]

  const mitigationData = [
    { name: "1月", 檢測時間: 15, 緩解時間: 45 },
    { name: "2月", 檢測時間: 12, 緩解時間: 38 },
    { name: "3月", 檢測時間: 10, 緩解時間: 32 },
    { name: "4月", 檢測時間: 8, 緩解時間: 28 },
    { name: "5月", 檢測時間: 6, 緩解時間: 22 },
    { name: "6月", 檢測時間: 4, 緩解時間: 18 },
  ]

  const attackTypeData = [
    { name: "容量攻擊", value: 35, color: "#ef4444" },
    { name: "協議攻擊", value: 25, color: "#f97316" },
    { name: "應用層攻擊", value: 30, color: "#eab308" },
    { name: "混合攻擊", value: 10, color: "#a3a3a3" },
  ]

  const trafficVolumeData = [
    { name: "1月", 正常流量: 850, 攻擊流量: 87 },
    { name: "2月", 正常流量: 920, 攻擊流量: 75 },
    { name: "3月", 正常流量: 1050, 攻擊流量: 119 },
    { name: "4月", 正常流量: 1180, 攻擊流量: 63 },
    { name: "5月", 正常流量: 1300, 攻擊流量: 53 },
    { name: "6月", 正常流量: 1450, 攻擊流量: 42 },
  ]

  return (
    <div className="space-y-8">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="攻擊阻擋"
          value="42"
          description="本月阻擋攻擊次數"
          trend="-20.8%"
          trendType="positive"
          icon={<Shield className="h-8 w-8 text-brand-primary" />}
        />
        <StatCard
          title="檢測時間"
          value="4ms"
          description="平均攻擊檢測時間"
          trend="-33.3%"
          trendType="positive"
          icon={<Zap className="h-8 w-8 text-brand-primary" />}
        />
        <StatCard
          title="緩解時間"
          value="18s"
          description="平均攻擊緩解時間"
          trend="-18.2%"
          trendType="positive"
          icon={<TrendingUp className="h-8 w-8 text-brand-primary" />}
        />
        <StatCard
          title="防護成功率"
          value="99.7%"
          description="DDoS防護成功率"
          trend="+0.2%"
          trendType="positive"
          icon={<CheckCircle className="h-8 w-8 text-brand-primary" />}
        />
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">攻擊類型統計</CardTitle>
            <CardDescription className="text-muted-foreground">過6個月的DDoS攻擊類型分佈</CardDescription>
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
                  <Bar dataKey="容量攻擊" stackId="a" fill="#ef4444" />
                  <Bar dataKey="協議攻擊" stackId="a" fill="#f97316" />
                  <Bar dataKey="應用層攻擊" stackId="a" fill="#eab308" />
                  <Bar dataKey="混合攻擊" stackId="a" fill="#a3a3a3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">響應時間優化</CardTitle>
            <CardDescription className="text-muted-foreground">檢測和緩解時間改善趨勢</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={mitigationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Line type="monotone" dataKey="檢測時間" stroke="hsl(var(--brand-primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="緩解時間" stroke="#22b866" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">攻擊類型分佈</CardTitle>
            <CardDescription className="text-muted-foreground">DDoS攻擊類型比例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={attackTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {attackTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">流量處理統計</CardTitle>
            <CardDescription className="text-muted-foreground">正常流量與攻擊流量處理情況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficVolumeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }} />
                  <Legend />
                  <Area type="monotone" dataKey="正常流量" stackId="1" stroke="#22b866" fill="#22b866" />
                  <Area type="monotone" dataKey="攻擊流量" stackId="1" stroke="#ef4444" fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, description, trend, trendType, icon }) {
  return (
    <Card className="shadow-lg bg-card border-border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
          <div className="bg-slate-100 dark:bg-gray-700 p-3 rounded-full">{icon}</div>
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
