"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, TrendingUp, Eye, Server, Zap } from "lucide-react"
import Link from "next/link"
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

export default function DDoSProtectionPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl">
          應用層<span style={{ color: "#0D99FF" }}>DDoS防禦</span>
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-normal max-w-2xl mx-auto">
          防範任何規模或類型的 DDoS 攻擊
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400 font-normal max-w-3xl mx-auto">
          提供強大的DDoS防護能力，確保您的服務持續可用，無論面對何種規模的攻擊都能有效防禦
        </p>
      </div>

      {/* Service Features List */}
      <section className="py-12 bg-card rounded-lg shadow-lg border-border mb-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            服務<span style={{ color: "#0D99FF" }}>特色</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-6">
              <ServiceFeatureItem
                icon={<Shield className="h-8 w-8" style={{ color: "#0D99FF" }} />}
                title="多層防護"
                description="提供L3/L4/L7多層次DDoS防護，全面抵禦各種攻擊類型"
              />
              <ServiceFeatureItem
                icon={<Zap className="h-8 w-8" style={{ color: "#0D99FF" }} />}
                title="即時檢測"
                description="毫秒級攻擊檢測和響應，確保服務不中斷"
              />
              <ServiceFeatureItem
                icon={<Server className="h-8 w-8" style={{ color: "#0D99FF" }} />}
                title="無限防護容量"
                description="提供無上限��DDoS防護容量，應對任何規模的攻擊"
              />
              <ServiceFeatureItem
                icon={<Eye className="h-8 w-8" style={{ color: "#0D99FF" }} />}
                title="智能分析"
                description="AI驅動的攻擊模式識別，持續學習新的攻擊手法"
              />
              <ServiceFeatureItem
                icon={<TrendingUp className="h-8 w-8" style={{ color: "#0D99FF" }} />}
                title="自動擴展"
                description="根據攻擊強度自動調整防護策略和資源配置"
              />
              <ServiceFeatureItem
                icon={<CheckCircle className="h-8 w-8" style={{ color: "#0D99FF" }} />}
                title="零誤判"
                description="精確識別正常流量和攻擊流量，確保業務不受影響"
              />
            </ul>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
          防護<span style={{ color: "#0D99FF" }}>分析</span>
        </h2>
        <DDoSAnalytics />
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-card rounded-lg shadow-lg border-border">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            應用層DDoS防禦<span style={{ color: "#0D99FF" }}>方案</span>
          </h2>

          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-foreground">應用層DDoS防禦方案</CardTitle>
                <CardDescription className="font-normal text-muted-foreground">
                  全面的DDoS攻擊防護解決方案
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-medium text-foreground">$2萬</span>
                  <span className="text-muted-foreground font-normal text-lg">/月起</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">多層DDoS防護</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">即時攻擊檢測</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">無限防護容量</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">AI智能分析</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">自動資源擴展</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">零誤判保證</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">24/7專業支持</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: "#0D99FF" }} />
                    <span className="text-muted-foreground font-normal">詳細攻擊報告</span>
                  </li>
                </ul>

                <div className="pt-6">
                  <Link href="/contact">
                    <Button
                      className="w-full text-white font-normal py-3 text-lg"
                      style={{ backgroundColor: "#0D99FF", borderColor: "#0D99FF" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0A85E9")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0D99FF")}
                    >
                      立即購買
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-medium text-foreground mb-4">需要客製化方案？</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 font-normal">
              我們的專家團隊將協助您評估DDoS威脅風險，制定最適合的防護策略
            </p>
            <Button
              variant="outline"
              className="text-foreground font-normal px-8 py-3 text-lg border-2 bg-transparent"
              style={{ borderColor: "#0D99FF", color: "#0D99FF" }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(13, 153, 255, 0.1)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              免費諮詢
            </Button>
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
          icon={<Shield className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="檢測時間"
          value="4ms"
          description="平均攻擊檢測時間"
          trend="-33.3%"
          trendType="positive"
          icon={<Zap className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="緩解時間"
          value="18s"
          description="平均攻擊緩解時間"
          trend="-18.2%"
          trendType="positive"
          icon={<TrendingUp className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
        <StatCard
          title="防護成功率"
          value="99.7%"
          description="DDoS防護成功率"
          trend="+0.2%"
          trendType="positive"
          icon={<CheckCircle className="h-8 w-8" style={{ color: "#0D99FF" }} />}
        />
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">攻擊類型統計</CardTitle>
            <CardDescription className="text-muted-foreground">過去6個月的DDoS攻擊類型分佈</CardDescription>
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
                  <Line type="monotone" dataKey="檢測時間" stroke="#0D99FF" strokeWidth={2} />
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
