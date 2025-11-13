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
import { Shield, Globe, Settings, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Copy, Check } from "lucide-react"
import React from "react"

export default function DDoSSettingsPage() {
  const [domainInput, setDomainInput] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubdomainDialogOpen, setIsSubdomainDialogOpen] = useState(false)
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false)
  const [selectedMainDomain, setSelectedMainDomain] = useState("")
  const [subdomainInput, setSubdomainInput] = useState("")
  const [copiedField, setCopiedField] = useState("")
  const [expandedTxtRecords, setExpandedTxtRecords] = useState({})
  const [expandedEditForms, setExpandedEditForms] = useState({})
  const [editingDomain, setEditingDomain] = useState(null)
  const [recordType, setRecordType] = useState("A")
  const [ipv4Address, setIpv4Address] = useState("")
  const [proxyStatus, setProxyStatus] = useState(true)
  const [configuredDomains, setConfiguredDomains] = useState([
    {
      name: "example.com",
      type: "主域名",
      status: "防護中",
      protocol: "HTTPS",
      txtRecord: {
        type: "TXT",
        name: "_ddos-verification.example.com",
        content: "ddos-verify-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
      },
    },
  ])

  const generateTxtRecord = (domain) => {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    return {
      type: "TXT",
      name: `_ddos-verification.${domain}`,
      content: `ddos-verify-${randomString}`,
    }
  }

  const handleDomainSubmit = () => {
    if (domainInput.trim()) {
      const newDomain = {
        name: domainInput.trim(),
        type: "主域名",
        status: "防護中",
        protocol: "HTTPS",
        txtRecord: generateTxtRecord(domainInput.trim()),
      }
      setConfiguredDomains((prev) => [...prev, newDomain])
      setDomainInput("")
      setIsDialogOpen(false)
    }
  }

  const handleSubdomainSubmit = () => {
    if (subdomainInput.trim() && selectedMainDomain && ipv4Address.trim()) {
      const newSubdomain = {
        name: `${subdomainInput.trim()}.${selectedMainDomain}`,
        type: "子域名",
        status: "防護中",
        protocol: "HTTPS",
        recordType: recordType,
        ipAddress: ipv4Address.trim(),
        proxy: proxyStatus,
      }
      setConfiguredDomains((prev) => [...prev, newSubdomain])
      setSubdomainInput("")
      setSelectedMainDomain("")
      setRecordType("A")
      setIpv4Address("")
      setProxyStatus(true)
      setIsSubdomainDialogOpen(false)
    }
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(""), 2000)
    })
  }

  const toggleTxtRecord = (domainName) => {
    setExpandedTxtRecords((prev) => ({
      ...prev,
      [domainName]: !prev[domainName],
    }))
  }

  const toggleEditForm = (domainName) => {
    setExpandedEditForms((prev) => ({
      ...prev,
      [domainName]: !prev[domainName],
    }))

    if (!expandedEditForms[domainName]) {
      const domain = subdomains.find((d) => d.name === domainName)
      if (domain) {
        setEditingDomain({
          originalName: domain.name,
          name: domain.name.split(".")[0],
          recordType: domain.recordType || "A",
          ipAddress: domain.ipAddress || "",
          proxy: domain.proxy !== undefined ? domain.proxy : true,
          ttl: domain.ttl || "auto",
        })
      }
    }
  }

  const handleEditSubmit = (originalName) => {
    if (editingDomain) {
      setConfiguredDomains((prev) =>
        prev.map((domain) =>
          domain.name === originalName
            ? {
                ...domain,
                recordType: editingDomain.recordType,
                ipAddress: editingDomain.ipAddress,
                proxy: editingDomain.proxy,
                ttl: editingDomain.ttl,
              }
            : domain,
        ),
      )

      setExpandedEditForms((prev) => ({
        ...prev,
        [originalName]: false,
      }))
      setEditingDomain(null)
    }
  }

  const handleDeleteDomain = (domainName) => {
    setConfiguredDomains((prev) => prev.filter((domain) => domain.name !== domainName))
  }

  const mainDomains = configuredDomains.filter((domain) => domain.type === "主域名")
  const subdomains = configuredDomains.filter((domain) => domain.type === "子域名")

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/cloudflare">Cloudflare Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">DDoS 設定</BreadcrumbPage>
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
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">防護域名</p>
                <p className="text-2xl font-bold text-foreground mt-2">{configuredDomains.length}</p>
                <p className="text-sm text-blue-500 mt-1">已配置域名</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <Settings className="h-5 w-5 text-brand-primary" />
            DDoS 網域設定
          </CardTitle>
          <CardDescription className="text-muted-foreground">當前受DDoS防護的域名清單及敏感度設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 主域名設定 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">主域名設定</h3>
                <p className="text-sm text-muted-foreground">配置主要域名的WAF防護設定</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600 text-xs sm:text-sm whitespace-nowrap px-2 py-1"
              >
                {mainDomains.length}個已配置
              </Badge>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    設定
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>主域名設定</DialogTitle>
                    <DialogDescription>請輸入您要配置DDoS防護的主域名</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="domain" className="text-right">
                        域名
                      </Label>
                      <Input
                        id="domain"
                        placeholder="例如: example.com"
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleDomainSubmit} disabled={!domainInput.trim()}>
                      送出
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 主域名列表 */}
          {mainDomains.length > 0 && (
            <div className="ml-8 space-y-4">
              {mainDomains.map((domain, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{domain.name}</p>
                        <p className="text-sm text-muted-foreground">{domain.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {domain.txtRecord && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTxtRecord(domain.name)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedTxtRecords[domain.name] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {domain.txtRecord && expandedTxtRecords[domain.name] && (
                    <div className="ml-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 animate-in slide-in-from-top-2 duration-200">
                      <h4 className="font-medium text-sm mb-3 text-blue-700 dark:text-blue-300">DNS TXT 記錄設定</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 items-center gap-2">
                          <Label className="text-sm font-medium">記錄類型:</Label>
                          <div className="col-span-2 flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {domain.txtRecord.type}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(domain.txtRecord.type, `type-${index}`)}
                            >
                              {copiedField === `type-${index}` ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-2">
                          <Label className="text-sm font-medium">名稱:</Label>
                          <div className="col-span-2 flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono break-all">
                              {domain.txtRecord.name}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(domain.txtRecord.name, `name-${index}`)}
                            >
                              {copiedField === `name-${index}` ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-start gap-2">
                          <Label className="text-sm font-medium">內容:</Label>
                          <div className="col-span-2 flex items-start gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono break-all leading-relaxed">
                              {domain.txtRecord.content}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 mt-1"
                              onClick={() => copyToClipboard(domain.txtRecord.content, `content-${index}`)}
                            >
                              {copiedField === `content-${index}` ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        請將以上 TXT 記錄添加到您的 DNS 設定中以完成域名驗證
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 子域名設定 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-purple-500" />
              <div className="flex items-center gap-2">
                <h3 className="font-medium">子域名設定</h3>
                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">i</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">管理子域名的WAF防護配置</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600 text-xs sm:text-sm whitespace-nowrap px-2 py-1"
              >
                {subdomains.length}個已配置
              </Badge>
              <Dialog open={isSubdomainDialogOpen} onOpenChange={setIsSubdomainDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    設定
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>子域名設定</DialogTitle>
                    <DialogDescription>請選擇主域名並輸入子域名前綴</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="main-domain" className="text-right">
                        主域名
                      </Label>
                      <Select value={selectedMainDomain} onValueChange={setSelectedMainDomain}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="選擇主域名" />
                        </SelectTrigger>
                        <SelectContent>
                          {mainDomains.map((domain, index) => (
                            <SelectItem key={index} value={domain.name}>
                              {domain.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subdomain" className="text-right">
                        子域名
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Input
                          id="subdomain"
                          placeholder="例如: api、admin、www"
                          value={subdomainInput}
                          onChange={(e) => setSubdomainInput(e.target.value)}
                          className="flex-1"
                        />
                        <span className="ml-2 text-muted-foreground">.{selectedMainDomain || "選擇主域名"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="record-type" className="text-right">
                        類型
                      </Label>
                      <Select value={recordType} onValueChange={setRecordType}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="選擇類型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="AAAA">AAAA</SelectItem>
                          <SelectItem value="CNAME">CNAME</SelectItem>
                          <SelectItem value="MX">MX</SelectItem>
                          <SelectItem value="TXT">TXT</SelectItem>
                          <SelectItem value="SRV">SRV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ipv4-address" className="text-right">
                        IPv4 位址
                      </Label>
                      <Input
                        id="ipv4-address"
                        placeholder="192.168.1.1"
                        value={ipv4Address}
                        onChange={(e) => setIpv4Address(e.target.value)}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Proxy 狀態</Label>
                      <div className="col-span-3 flex items-center gap-3">
                        <Switch checked={proxyStatus} onCheckedChange={setProxyStatus} />
                        <span className="text-sm text-muted-foreground">{proxyStatus ? "通過Proxy���理" : "僅DNS"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">TTL</Label>
                      <div className="col-span-3">
                        <span className="text-sm text-muted-foreground">自動</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleSubdomainSubmit}
                      disabled={!subdomainInput.trim() || !selectedMainDomain}
                    >
                      送出
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 邊緣憑證 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">邊緣憑證</h3>
                <p className="text-sm text-muted-foreground">配置子域名的邊緣憑證設定</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600 text-xs sm:text-sm whitespace-nowrap px-2 py-1"
              >
                0個已配置
              </Badge>
              <Dialog open={isCertificateDialogOpen} onOpenChange={setIsCertificateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    上傳憑證
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>上傳邊緣憑證</DialogTitle>
                    <DialogDescription>上傳 SSL/TLS 憑證以保護您的子域名</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="certificate">憑證檔案 (.crt, .pem)</Label>
                      <Input id="certificate" type="file" accept=".crt,.pem" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="private-key">私鑰檔案 (.key)</Label>
                      <Input id="private-key" type="file" accept=".key" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cert-domain">適用域名</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇域名" />
                        </SelectTrigger>
                        <SelectContent>
                          {subdomains.map((domain, index) => (
                            <SelectItem key={index} value={domain.name}>
                              {domain.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={() => setIsCertificateDialogOpen(false)}>
                      上傳
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain List - DDoS 敏感度設定 */}
      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">DDoS 敏感度設定</CardTitle>
          <CardDescription className="text-muted-foreground">調整各域名的 DDoS 防護敏感度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {configuredDomains.map((domain, index) => (
              <React.Fragment key={index}>
                {/* Desktop View */}
                <div className="hidden md:block">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-foreground">{domain.name}</p>
                        <p className="text-sm text-muted-foreground">{domain.type}</p>
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
                          <p className="font-medium text-foreground">{domain.name}</p>
                          <p className="text-sm text-muted-foreground">{domain.type}</p>
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
                          defaultValue="3"
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
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
