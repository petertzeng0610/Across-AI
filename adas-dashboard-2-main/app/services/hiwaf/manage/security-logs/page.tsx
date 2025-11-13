"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Shield,
  Search,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  Eye,
  Ban,
  CheckCircle,
  Clock,
  Globe,
  Server,
} from "lucide-react"
import { useState } from "react"

export default function SecurityLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dateRange, setDateRange] = useState("7days")

  // 模擬安全日誌數據
  const securityLogs = [
    {
      id: "LOG001",
      timestamp: "2024-01-15 14:30:25",
      type: "SQL注入",
      severity: "高",
      sourceIP: "192.168.1.100",
      targetURL: "/api/users",
      action: "已阻擋",
      country: "中國",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      details: "檢測到惡意SQL查詢嘗試",
    },
    {
      id: "LOG002",
      timestamp: "2024-01-15 14:28:12",
      type: "XSS攻擊",
      severity: "中",
      sourceIP: "203.0.113.45",
      targetURL: "/search",
      action: "已阻擋",
      country: "俄羅斯",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      details: "檢測到跨站腳本攻擊嘗試",
    },
    {
      id: "LOG003",
      timestamp: "2024-01-15 14:25:08",
      type: "暴力破解",
      severity: "高",
      sourceIP: "198.51.100.23",
      targetURL: "/login",
      action: "已阻擋",
      country: "美國",
      userAgent: "curl/7.68.0",
      details: "檢測到登入暴力破解嘗試",
    },
    {
      id: "LOG004",
      timestamp: "2024-01-15 14:22:45",
      type: "CSRF",
      severity: "中",
      sourceIP: "172.16.0.15",
      targetURL: "/api/transfer",
      action: "已阻擋",
      country: "台灣",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
      details: "檢測到跨站請求偽造攻擊",
    },
    {
      id: "LOG005",
      timestamp: "2024-01-15 14:20:33",
      type: "目錄遍歷",
      severity: "高",
      sourceIP: "10.0.0.88",
      targetURL: "/files/../../../etc/passwd",
      action: "已阻擋",
      country: "德國",
      userAgent: "Python-urllib/3.9",
      details: "檢測到目錄遍歷攻擊嘗試",
    },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "高":
        return "text-red-600 bg-red-100 border-red-200"
      case "中":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "低":
        return "text-green-600 bg-green-100 border-green-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case "已阻擋":
        return <Ban className="h-4 w-4 text-red-500" />
      case "已允許":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "監控中":
        return <Eye className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredLogs = securityLogs.filter((log) => {
    const matchesSearch =
      log.sourceIP.includes(searchTerm) || log.targetURL.includes(searchTerm) || log.type.includes(searchTerm)
    const matchesFilter = filterType === "all" || log.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">服務總覽</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/hiwaf/manage">WAF防禦管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">安全日誌</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          安全<span style={{ color: "#0D99FF" }}>日誌</span>
        </h1>
        <p className="mt-2 text-muted-foreground">查看和分析WAF防護系統的安全事件記錄</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日攔截</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1,247</div>
            <p className="text-xs text-muted-foreground">+12% 比昨日</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高風險事件</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <p className="text-xs text-muted-foreground">-5% 比昨日</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">攻擊來源</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">不同國家/地區</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">防護成功率</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <p className="text-xs text-muted-foreground">本月平均</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" style={{ color: "#0D99FF" }} />
            篩選和搜尋
          </CardTitle>
          <CardDescription>使用篩選條件快速找到特定的安全事件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">搜尋</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="IP地址、URL或攻擊類型"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-type">攻擊類型</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇攻擊類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部類型</SelectItem>
                  <SelectItem value="SQL注入">SQL注入</SelectItem>
                  <SelectItem value="XSS攻擊">XSS攻擊</SelectItem>
                  <SelectItem value="暴力破解">暴力破解</SelectItem>
                  <SelectItem value="CSRF">CSRF</SelectItem>
                  <SelectItem value="目錄遍歷">目錄遍歷</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">時間範圍</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇時間範圍" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">過去1小時</SelectItem>
                  <SelectItem value="24hours">過去24小時</SelectItem>
                  <SelectItem value="7days">過去7天</SelectItem>
                  <SelectItem value="30days">過去30天</SelectItem>
                  <SelectItem value="custom">自訂範圍</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  重置
                </Button>
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  匯出
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="h-5 w-5" style={{ color: "#0D99FF" }} />
              安全事件日誌
            </span>
            <Badge variant="outline">{filteredLogs.length} 筆記錄</Badge>
          </CardTitle>
          <CardDescription>詳細的安全事件記錄和攻擊分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>時間</TableHead>
                  <TableHead>攻擊類型</TableHead>
                  <TableHead>嚴重程度</TableHead>
                  <TableHead>來源IP</TableHead>
                  <TableHead>目標URL</TableHead>
                  <TableHead>處理動作</TableHead>
                  <TableHead>來源地區</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {log.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.sourceIP}</TableCell>
                    <TableCell className="font-mono text-sm max-w-xs truncate">{log.targetURL}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.country}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">沒有找到符合條件的安全事件記錄</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attack Analysis */}
      <div className="mt-8">
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">攻擊時間軸</TabsTrigger>
            <TabsTrigger value="geography">地理分佈</TabsTrigger>
            <TabsTrigger value="patterns">攻擊模式</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>24小時攻擊趨勢</CardTitle>
                <CardDescription>過去24小時內的攻擊事件分佈</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                    <p className="text-xl font-medium text-blue-700 dark:text-blue-300">攻擊時間軸圖表</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">顯示24小時內的攻擊分佈趨勢</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>攻擊來源地理分佈</CardTitle>
                <CardDescription>全球攻擊來源的地理位置分佈</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border-2 border-dashed border-green-200 dark:border-green-800 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <p className="text-xl font-medium text-green-700 dark:text-green-300">世界地圖</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">顯示攻擊來源的地理分佈</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>攻擊模式分析</CardTitle>
                <CardDescription>攻擊類型和頻率的統計分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-800 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-purple-500" />
                    <p className="text-xl font-medium text-purple-700 dark:text-purple-300">攻擊模式圖表</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">分析不同攻擊類型的模式和趨勢</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
