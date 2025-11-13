"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Globe, Settings, CheckCircle, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function CDNSettingsPage() {
  const [cacheSettings, setCacheSettings] = useState("enable")
  const [ttlRule, setTtlRule] = useState("use-default")
  const [customTtl, setCustomTtl] = useState("1h")
  const [browserTtlRule, setBrowserTtlRule] = useState("respect-origin")
  const [browserCustomTtl, setBrowserCustomTtl] = useState("1h")

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/cloudflare">Cloudflare Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">CDN 設定</BreadcrumbPage>
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
            <div className="text-2xl font-bold text-white">正常運行</div>
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
            <p className="text-xs text-muted-foreground">已配置域名數量</p>
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
              CDN 設定
            </CardTitle>
            <CardDescription>配置您的內容傳遞網路設定，包括域名管理和快取策略</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 主域名 */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
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
                          使用Cache-Control標頭(如果存在)；如果不存在，則使用快取要求和Cloudflare 的預設 TTL
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
                      指定用戶端瀏覽器應快取回應的時間長度。Cloudflare 無法清除用戶端瀏覽器上快取的內容，因此高瀏覽器
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
      </div>
    </div>
  )
}
