"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Globe, Settings, AlertTriangle, CheckCircle, TrendingUp, Server, Zap } from "lucide-react"
import { useState } from "react"
// 由於 Next.js 對具名匯入大型套件的支援有限，改用星號匯入避免載入失敗
import * as Recharts from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function CDNManagePage() {
  const [cacheSettings, setCacheSettings] = useState("enable")
  const [ttlRule, setTtlRule] = useState("use-default")
  const [customTtl, setCustomTtl] = useState("1h")
  const [browserTtlRule, setBrowserTtlRule] = useState("respect-origin")
  const [browserCustomTtl, setBrowserCustomTtl] = useState("1h")

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
            <BreadcrumbPage className="text-foreground font-medium">CDN加速管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          CDN加速<span className="text-brand-primary">管理</span>
        </h1>
        <p className="mt-2 text-muted-foreground">管理您的全球內容傳遞網路設定，優化網站加載速度和用戶體驗</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">服務狀態</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">正常運行</div>
            <p className="text-xs text-muted-foreground">99.9% 可用性</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">加速域名</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">已配置名數量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">緩存命中率</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97%</div>
            <p className="text-xs text-muted-foreground">本月平均命中率</p>
          </CardContent>
        </Card>
      </div>

      {/* CDN Settings */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-primary" />
              快取設定
            </CardTitle>
            <CardDescription>配置您的內容傳遞網路設定，包括域名管理和快取策略</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 主域名 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">example.com</p>
                  <p className="text-sm text-muted-foreground">主域名</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">HTTPS</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  加速中
                </Badge>
              </div>
            </div>

            {/* 快取設定 */}
            <div className="p-4 border rounded-lg">
              <div className="mb-4">
                <h3 className="font-medium text-lg">快取設定</h3>
                <p className="text-sm text-muted-foreground">選擇CDN快取策略</p>
              </div>
              <RadioGroup value={cacheSettings} onValueChange={setCacheSettings} className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enable" id="enable" />
                  <Label htmlFor="enable" className="font-medium">
                    開啟快取
                  </Label>
                  <span className="text-sm text-muted-foreground ml-2">(預設) 啟用CDN快取以提升網站載入速度</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skip" id="skip" />
                  <Label htmlFor="skip" className="font-medium">
                    略過快取
                  </Label>
                  <span className="text-sm text-muted-foreground ml-2">直接從源站獲取內容，不使用CDN快取</span>
                </div>
              </RadioGroup>

              {/* 邊緣TTL規則 */}
              {cacheSettings === "enable" && (
                <div className="border-t pt-4">
                  <div className="mb-4">
                    <h4 className="font-medium">邊緣TTL規則 （選用）</h4>
                    <p className="text-sm text-muted-foreground">
                      指定 Cloudflare 是否應快取回應以及快取的時間長度，這取決於原始伺服器回應中是否存在快取控制標頭。
                    </p>
                  </div>
                  <RadioGroup value={ttlRule} onValueChange={setTtlRule} className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="respect-headers" id="respect-headers" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="respect-headers" className="font-medium">
                          如果快取控制標頭存在請予以使用；如果沒有，請略過快取
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          優先使用源站的Cache-Control標頭，沒有標頭時不進行快取
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="use-default" id="use-default" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="use-default" className="font-medium">
                          使用Cache-Control標頭(如果存在)；如果���存在，則使用快取要求和Cloudflare 的預設 TTL
                          作為回應狀態
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">使用源站標頭或系統預設TTL設定</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="ignore-headers" id="ignore-headers" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="ignore-headers" className="font-medium">
                          忽略快取控制標頭並使用此 TTL
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">忽略所有快取標頭，使用自定義TTL設定</p>
                        {ttlRule === "ignore-headers" && (
                          <div className="mt-3">
                            <Label htmlFor="ttl-select" className="text-sm font-medium">
                              輸入存留時間(TTL)
                            </Label>
                            <Select value={customTtl} onValueChange={setCustomTtl}>
                              <SelectTrigger className="w-48 mt-1">
                                <SelectValue placeholder="選擇TTL時間" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30s">30秒</SelectItem>
                                <SelectItem value="1m">1分鐘</SelectItem>
                                <SelectItem value="5m">5分鐘</SelectItem>
                                <SelectItem value="10m">10分鐘</SelectItem>
                                <SelectItem value="30m">30分鐘</SelectItem>
                                <SelectItem value="1h">1小時</SelectItem>
                                <SelectItem value="2h">2小時</SelectItem>
                                <SelectItem value="4h">4小時</SelectItem>
                                <SelectItem value="8h">8小時</SelectItem>
                                <SelectItem value="12h">12小時</SelectItem>
                                <SelectItem value="1d">1天</SelectItem>
                                <SelectItem value="2d">2天</SelectItem>
                                <SelectItem value="3d">3天</SelectItem>
                                <SelectItem value="7d">7天</SelectItem>
                                <SelectItem value="14d">14天</SelectItem>
                                <SelectItem value="30d">30天</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* 瀏覽器TTL規則 */}
              {cacheSettings === "enable" && (
                <div className="border-t pt-4 mt-4">
                  <div className="mb-4">
                    <h4 className="font-medium">瀏覽器TTL規則 （選用）</h4>
                    <p className="text-sm text-muted-foreground">
                      指定用戶端瀏覽器應快取回應的時間長度。Cloudflare 快取清除用戶端瀏覽器上快取的內容，因此高瀏覽器
                      TTL 可能會導致顯示逾期內容。
                    </p>
                  </div>
                  <RadioGroup value={browserTtlRule} onValueChange={setBrowserTtlRule} className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="skip-cache" id="skip-cache" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="skip-cache" className="font-medium">
                          略過快取
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">不在瀏覽器中快取內容</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="respect-origin" id="respect-origin" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="respect-origin" className="font-medium">
                          採用原點 TTL
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">使用源站設定的快取時間</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="override-origin" id="override-origin" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="override-origin" className="font-medium">
                          覆寫原點並使用此 TTL
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">忽略源站設定，使用自定義瀏覽器快取時間</p>
                        {browserTtlRule === "override-origin" && (
                          <div className="mt-3">
                            <Label htmlFor="browser-ttl-select" className="text-sm font-medium">
                              輸入存留時間(TTL)
                            </Label>
                            <Select value={browserCustomTtl} onValueChange={setBrowserCustomTtl}>
                              <SelectTrigger className="w-48 mt-1">
                                <SelectValue placeholder="選擇TTL時間" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30s">30秒</SelectItem>
                                <SelectItem value="1m">1分鐘</SelectItem>
                                <SelectItem value="5m">5分鐘</SelectItem>
                                <SelectItem value="10m">10分鐘</SelectItem>
                                <SelectItem value="30m">30分鐘</SelectItem>
                                <SelectItem value="1h">1小時</SelectItem>
                                <SelectItem value="2h">2小時</SelectItem>
                                <SelectItem value="4h">4小時</SelectItem>
                                <SelectItem value="8h">8小時</SelectItem>
                                <SelectItem value="12h">12小時</SelectItem>
                                <SelectItem value="1d">1天</SelectItem>
                                <SelectItem value="2d">2天</SelectItem>
                                <SelectItem value="3d">3天</SelectItem>
                                <SelectItem value="7d">7天</SelectItem>
                                <SelectItem value="14d">14天</SelectItem>
                                <SelectItem value="30d">30天</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium text-foreground">當前設定</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {cacheSettings === "enable" ? "開啟快取" : "略過快取"}
                      </span>
                      {cacheSettings === "enable" && (
                        <>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {ttlRule === "respect-headers" && "使用快取控制標頭"}
                            {ttlRule === "use-default" && "使用預設TTL"}
                            {ttlRule === "ignore-headers" && `自定義TTL: ${customTtl}`}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {browserTtlRule === "skip-cache" && "瀏覽器略過快取"}
                            {browserTtlRule === "respect-origin" && "瀏覽器採用原點TTL"}
                            {browserTtlRule === "override-origin" && `瀏覽器自定義TTL: ${browserCustomTtl}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      取消
                    </Button>
                    <Button size="sm" className="btn-primary">
                      套用設定
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 域名列表 */}
        <Card>
          <CardHeader>
            <CardTitle>已配置域名</CardTitle>
            <CardDescription>查看和管理所有受CDN加速的域名</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">api.example.com</p>
                    <p className="text-sm text-muted-foreground">子域名</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">HTTPS</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    加速中
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">cdn.example.com</p>
                    <p className="text-sm text-muted-foreground">子域名</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">HTTPS</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    加速中
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">static.example.com</p>
                    <p className="text-sm text-muted-foreground">子域名</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">HTTPS</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    加速中
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">img.example.com</p>
                    <p className="text-sm text-muted-foreground">子域名</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">HTTPS</Badge>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    設定中
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard - Complete CDNAnalytics */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            性能<span className="text-brand-primary">分析</span>
          </h2>
          <CDNAnalytics />
        </div>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用的CDN管理操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div className="text-left">
                    <p className="font-medium">清除快取</p>
                    <p className="text-sm text-muted-foreground">清除指定URL或全站快取</p>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">快取規則</p>
                    <p className="text-sm text-muted-foreground">自定義快取策略和規則</p>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">添加域名</p>
                    <p className="text-sm text-muted-foreground">新增需要加速的域名</p>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <p className="font-medium">性能報告</p>
                    <p className="text-sm text-muted-foreground">生成詳細的性能分析報告</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CDNAnalytics() {
  const {
    LineChart,
    BarChart,
    AreaChart,
    PieChart,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    Legend,
    XAxis,
    YAxis,
    Bar,
    Line,
    Area,
    Pie,
    Cell,
  } = Recharts
  // 模擬數據
  const performanceData = [
    { name: "1月", 加載時間: 2.8, 緩存命中率: 85, 帶寬節省: 65 },
    { name: "2月", 加載時間: 2.5, 緩存命中率: 88, 帶寬節省: 68 },
    { name: "3月", 加載時間: 2.2, 緩存命中率: 91, 帶寬節省: 72 },
    { name: "4月", 加載時間: 1.9, 緩存命中率: 93, 帶寬節省: 75 },
    { name: "5月", 加載時間: 1.6, 緩存命中率: 95, 帶寬節省: 78 },
    { name: "6月", 加載時間: 1.3, 緩存命中率: 97, 帶寬節省: 82 },
  ]

  const trafficData = [
    { name: "1月", 總流量: 1200, 緩存流量: 1020, 源站流量: 180 },
    { name: "2月", 總流量: 1350, 緩存流量: 1188, 源站流量: 162 },
    { name: "3月", 總流量: 1480, 緩存流量: 1347, 源站流量: 133 },
    { name: "4月", 總流量: 1620, 緩存流量: 1507, 源站流量: 113 },
    { name: "5月", 總流量: 1800, 緩存流量: 1710, 源站流量: 90 },
    { name: "6月", 總流量: 2000, 緩存流量: 1940, 源站流量: 60 },
  ]

  const regionData = [
    { name: "亞太地區", value: 45, color: "hsl(var(--brand-primary))" },
    { name: "北美地區", value: 25, color: "hsl(var(--brand-secondary))" },
    { name: "歐洲地區", value: 20, color: "hsl(var(--muted))" },
    { name: "其他地區", value: 10, color: "hsl(var(--muted-foreground))" },
  ]

  const responseTimeData = [
    { name: "1月", 響應時間: 120 },
    { name: "2月", 響應時間: 105 },
    { name: "3月", 響應時間: 95 },
    { name: "4月", 響應時間: 85 },
    { name: "5月", 響應時間: 75 },
    { name: "6月", 響應時間: 65 },
  ]

  return (
    <div className="space-y-8">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="加載時間"
          value="1.3s"
          description="平均頁面加載時間"
          trend="-18.8%"
          trendType="positive"
          icon={<Zap className="h-8 w-8 text-brand-primary" />}
        />
        <StatCard
          title="緩存命中率"
          value="97%"
          description="本月緩存命中率"
          trend="+2.1%"
          trendType="positive"
          icon={<Server className="h-8 w-8 text-brand-primary" />}
        />
        <StatCard
          title="帶寬節省"
          value="82%"
          description="相比直連源站節省"
          trend="+5.1%"
          trendType="positive"
          icon={<TrendingUp className="h-8 w-8 text-brand-primary" />}
        />
        <StatCard
          title="全球節點"
          value="330"
          description="活躍CDN節點數"
          trend="+8.1%"
          trendType="positive"
          icon={<Globe className="h-8 w-8 text-brand-primary" />}
        />
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">性能優化趨勢</CardTitle>
            <CardDescription className="text-muted-foreground">過去6個月的性能指標改善</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="加載時間" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  <Line type="monotone" dataKey="緩存命中率" stroke="hsl(var(--brand-primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="帶寬節省" stroke="hsl(var(--success))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">流量分佈</CardTitle>
            <CardDescription className="text-muted-foreground">過去6個月的流量處理情況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="緩存流量"
                    stackId="1"
                    stroke="hsl(var(--brand-primary))"
                    fill="hsl(var(--brand-primary))"
                  />
                  <Area
                    type="monotone"
                    dataKey="源站流量"
                    stackId="1"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">地區流量分佈</CardTitle>
            <CardDescription className="text-muted-foreground">全球用戶訪問地區分佈</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">響應時間優化</CardTitle>
            <CardDescription className="text-muted-foreground">CDN節點響應時間改善趨勢</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="響應時間" fill="hsl(var(--brand-primary))" />
                </BarChart>
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
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-muted p-3 rounded-full">{icon}</div>
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
