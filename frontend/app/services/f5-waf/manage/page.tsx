"use client"

import { TableCell } from "@/components/ui/table"
import { Table, TableBody, TableHead, TableRow } from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Globe, Settings, CheckCircle, Trash2, Mail, X, Ban, CheckCircle2, Flag, Plus } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"

type RuleType = "blacklist" | "whitelist" | "country"

interface Rule {
  id: string
  type: RuleType
  value: string
  enabled: boolean
}

const initialRules: Rule[] = [
  { id: "1", type: "blacklist", value: "192.0.2.1", enabled: true },
  { id: "2", type: "whitelist", value: "203.0.113.10", enabled: true },
  { id: "3", type: "country", value: "CN", enabled: true },
]

export default function F5WAFManagePage() {
  const [domainInput, setDomainInput] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubdomainDialogOpen, setIsSubdomainDialogOpen] = useState(false)
  const [isWafPolicyDialogOpen, setIsWafPolicyDialogOpen] = useState(false)
  const [selectedMainDomain, setSelectedMainDomain] = useState("")
  const [subdomainInput, setSubdomainInput] = useState("")
  const [copiedField, setCopiedField] = useState("")
  const [expandedTxtRecords, setExpandedTxtRecords] = useState({})
  const [expandedEditForms, setExpandedEditForms] = useState({})
  const [editingDomain, setEditingDomain] = useState(null)
  const [countryAccessMode, setCountryAccessMode] = useState("block")
  const [isEmailReportDialogOpen, setIsEmailReportDialogOpen] = useState(false)
  const [emailReportData, setEmailReportData] = useState({
    scheduleType: "daily",
    subject: "",
    recipients: "",
    cc: "",
    bcc: "",
    content: "",
  })
  const [emailErrors, setEmailErrors] = useState({})

  const [blacklistInput, setBlacklistInput] = useState("")
  const [whitelistInput, setWhitelistInput] = useState("")
  const [selectedCountries, setSelectedCountries] = useState([])
  const [selectedSubdomains, setSelectedSubdomains] = useState([])
  const [blacklist, setBlacklist] = useState([
    { id: 1, value: "192.168.1.100", type: "IP" },
    { id: 2, value: "malicious-site.com", type: "域名" },
  ])
  const [whitelist, setWhitelist] = useState([
    { id: 1, value: "203.0.113.0/24", type: "IP段" },
    { id: 2, value: "trusted-partner.com", type: "域名" },
  ])
  const [blockedCountries, setBlockedCountries] = useState([
    { code: "CN", name: "中國" },
    { code: "RU", name: "俄羅斯" },
  ])

  const [configuredDomains, setConfiguredDomains] = useState([
    {
      name: "example.com",
      type: "主域名",
      status: "防護中",
      protocol: "HTTPS",
      txtRecord: {
        type: "TXT",
        name: "_waf-verification.example.com",
        content: "waf-verify-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
      },
    },
    { name: "api.example.com", type: "子域名", status: "防護中", protocol: "HTTPS" },
    { name: "admin.example.com", type: "子域名", status: "設定中", protocol: "HTTPS" },
  ])

  const countries = [
    { code: "CN", name: "中國" },
    { code: "RU", name: "俄羅斯" },
    { code: "KP", name: "北韓" },
    { code: "IR", name: "伊朗" },
    { code: "US", name: "美國" },
    { code: "JP", name: "日本" },
    { code: "KR", name: "韓國" },
    { code: "GB", name: "英國" },
    { code: "DE", name: "德國" },
    { code: "FR", name: "法國" },
  ]

  const [recordType, setRecordType] = useState("A")
  const [ipv4Address, setIpv4Address] = useState("")
  const [proxyStatus, setProxyStatus] = useState(true)
  const [rules, setRules] = useState<Rule[]>(initialRules)

  const toggleRule = (id: string) =>
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))

  const renderTable = (type: RuleType, title: string) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="w-8" />
              <TableCell>{"規則值"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules
              .filter((rule) => rule.type === type)
              .map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="w-8">
                    <Checkbox
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                      aria-label={`${rule.value} enabled`}
                    />
                  </TableCell>
                  <TableCell>{rule.value}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button size="sm">{`新增${title}規則`}</Button>
        </div>
      </CardContent>
    </Card>
  )

  const generateTxtRecord = (domain) => {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    return {
      type: "TXT",
      name: `_waf-verification.${domain}`,
      content: `waf-verify-${randomString}`,
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

  const addToBlacklist = () => {
    if (blacklistInput.trim()) {
      const newItem = {
        id: Date.now(),
        value: blacklistInput.trim(),
        type: blacklistInput.includes(".") && !blacklistInput.includes("/") ? "域名" : "IP",
      }
      setBlacklist((prev) => [...prev, newItem])
      setBlacklistInput("")
    }
  }

  const addToWhitelist = () => {
    if (whitelistInput.trim()) {
      const newItem = {
        id: Date.now(),
        value: whitelistInput.trim(),
        type: whitelistInput.includes("/")
          ? "IP段"
          : whitelistInput.includes(".") && !whitelistInput.includes("/")
            ? "域名"
            : "IP",
      }
      setWhitelist((prev) => [...prev, newItem])
      setWhitelistInput("")
    }
  }

  const removeFromBlacklist = (id) => {
    setBlacklist((prev) => prev.filter((item) => item.id !== id))
  }

  const removeFromWhitelist = (id) => {
    setWhitelist((prev) => prev.filter((item) => item.id !== id))
  }

  const addBlockedCountry = (countryCode) => {
    const country = countries.find((c) => c.code === countryCode)
    if (country && !blockedCountries.find((c) => c.code === countryCode)) {
      const newCountry = {
        ...country,
      }
      setBlockedCountries((prev) => [...prev, newCountry])
    }
  }

  const removeBlockedCountry = (countryCode) => {
    setBlockedCountries((prev) => prev.filter((country) => country.code !== countryCode))
  }

  const toggleEditForm = (domainName) => {
    setExpandedEditForms((prev) => ({
      ...prev,
      [domainName]: !prev[domainName],
    }))

    if (!expandedEditForms[domainName]) {
      const domain = configuredDomains.find((d) => d.name === domainName)
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateEmailList = (emailList) => {
    if (!emailList.trim()) return true
    const emails = emailList.split(",").map((email) => email.trim())
    return emails.every((email) => validateEmail(email))
  }

  const handleEmailReportSubmit = () => {
    const errors = {}

    if (!emailReportData.subject.trim()) {
      errors.subject = "主旨��必填欄位"
    }

    if (!emailReportData.recipients.trim()) {
      errors.recipients = "收件人為必填欄位"
    } else if (!validateEmailList(emailReportData.recipients)) {
      errors.recipients = "請輸入有效的電子郵件地址"
    }

    if (emailReportData.cc && !validateEmailList(emailReportData.cc)) {
      errors.cc = "請輸入有效的電子郵件地址"
    }

    if (emailReportData.bcc && !validateEmailList(emailReportData.bcc)) {
      errors.bcc = "請輸入有效的電子郵件地址"
    }

    setEmailErrors(errors)

    if (Object.keys(errors).length === 0) {
      console.log("Email report scheduled:", emailReportData)
      setIsEmailReportDialogOpen(false)
      setEmailReportData({
        scheduleType: "daily",
        subject: "",
        recipients: "",
        cc: "",
        bcc: "",
        content: "",
      })
      setEmailErrors({})
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">服務管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">F5 WAF 防禦管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          F5 WAF<span className="text-brand-primary">防禦管理</span>
        </h1>
        <p className="mt-2 text-muted-foreground">管理您的 F5 網站應用防火牆設定，保護您的網站免受各種網路攻擊威脅</p>
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
            <CardTitle className="text-sm font-medium">防護域名</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configuredDomains.length}</div>
            <p className="text-xs text-muted-foreground">已配置域名數量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日攔截</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">攻擊請求已攔截</p>
          </CardContent>
        </Card>
      </div>

      {/* WAF Settings */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-primary" />
              F5 WAF 設定
            </CardTitle>
            <CardDescription>配置您的網站應用防火牆設定，包括域名管理和安全政策</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 主域名設定 */}
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-base">主域名設定</h3>
                    <p className="text-sm text-muted-foreground mt-1">配置主要域名的WAF防護設定</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    1個已配置
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(true)}>
                    設定
                  </Button>
                </div>
              </div>

              {/* 主域名展開項 */}
              <div className="ml-8 p-4 border border-border rounded-lg overflow-hidden">
                {/* 表���標題 */}
                <div className="grid grid-cols-[2fr,1fr,2fr,1.5fr,1fr,1fr] gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                  <div>名稱</div>
                  <div>類型</div>
                  <div>內容</div>
                  <div>Proxy狀態</div>
                  <div>TTL</div>
                  <div>操作</div>
                </div>

                {/* 表格內容 */}
                <div className="divide-y divide-border">
                  {mainDomains.map((domain) => (
                    <div
                      key={domain.name}
                      className="grid grid-cols-[2fr,1fr,2fr,1.5fr,1fr,1fr] gap-4 p-4 items-center bg-card/30"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-medium">{domain.name}</span>
                      </div>
                      <div className="text-sm">{domain.type}</div>
                      <div className="text-sm font-mono">{domain.txtRecord.content}</div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-500" />
                        <span className="text-sm text-muted-foreground">僅DNS</span>
                      </div>
                      <div className="text-sm text-muted-foreground">自動</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleTxtRecord(domain.name)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteDomain(domain.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 子域名設定 */}
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-base">子域名設定</h3>
                    <p className="text-sm text-muted-foreground mt-1">管理子域名的WAF防護配置</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    2個已配置
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setIsSubdomainDialogOpen(true)}>
                    設定
                  </Button>
                </div>
              </div>

              {/* 子域名表格 */}
              <div className="ml-8 border border-border rounded-lg overflow-hidden">
                {/* 表格標題 */}
                <div className="grid grid-cols-[2fr,1fr,2fr,1.5fr,1fr,1fr] gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                  <div>名稱</div>
                  <div>類型</div>
                  <div>內容</div>
                  <div>Proxy狀態</div>
                  <div>TTL</div>
                  <div>操作</div>
                </div>

                {/* 表格內容 */}
                <div className="divide-y divide-border">
                  {subdomains.map((domain) => (
                    <React.Fragment key={domain.name}>
                      <div className="grid grid-cols-[2fr,1fr,2fr,1.5fr,1fr,1fr] gap-4 p-4 items-center bg-card/30">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          <span className="font-medium">{domain.name}</span>
                        </div>
                        <div className="text-sm">{domain.recordType}</div>
                        <div className="text-sm font-mono">{domain.ipAddress}</div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-gray-500" />
                          <span className="text-sm text-muted-foreground">{domain.proxy ? "代理" : "僅DNS"}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">自動</div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleEditForm(domain.name)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteDomain(domain.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {expandedEditForms[domain.name] && editingDomain && (
                        <div className="p-6 bg-blue-50 dark:bg-blue-950/30 border-t border-border animate-in slide-in-from-top-2 duration-200">
                          <h4 className="font-medium text-sm mb-4 text-blue-700 dark:text-blue-300">編輯子域名設定</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 名稱欄位 */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">子域名名稱</Label>
                              <Input
                                value={editingDomain.name}
                                onChange={(e) => setEditingDomain((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="例如: api、admin、www"
                              />
                            </div>

                            {/* 記錄類型 */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">記錄類型</Label>
                              <Select
                                value={editingDomain.recordType}
                                onValueChange={(value) => setEditingDomain((prev) => ({ ...prev, recordType: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
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

                            {/* IP 位址 */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">IPv4 位址</Label>
                              <Input
                                value={editingDomain.ipAddress}
                                onChange={(e) => setEditingDomain((prev) => ({ ...prev, ipAddress: e.target.value }))}
                                placeholder="192.168.1.1"
                              />
                            </div>

                            {/* Proxy 狀態 */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Proxy 狀態</Label>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant={editingDomain.proxy ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setEditingDomain((prev) => ({ ...prev, proxy: true }))}
                                  className={editingDomain.proxy ? "bg-blue-600 hover:bg-blue-700" : ""}
                                >
                                  代理
                                </Button>
                                <Button
                                  type="button"
                                  variant={!editingDomain.proxy ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setEditingDomain((prev) => ({ ...prev, proxy: false }))}
                                  className={!editingDomain.proxy ? "bg-blue-600 hover:bg-blue-700" : ""}
                                >
                                  僅DNS
                                </Button>
                              </div>
                            </div>

                            {/* TTL */}
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-sm font-medium">TTL</Label>
                              <Select
                                value={editingDomain.ttl}
                                onValueChange={(value) => setEditingDomain((prev) => ({ ...prev, ttl: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="auto">自動</SelectItem>
                                  <SelectItem value="300">5分鐘</SelectItem>
                                  <SelectItem value="1800">30分鐘</SelectItem>
                                  <SelectItem value="3600">1小時</SelectItem>
                                  <SelectItem value="86400">1天</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* 操作按鈕 */}
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => toggleEditForm(domain.name)}>
                              取消
                            </Button>
                            <Button size="sm" onClick={() => handleEditSubmit(domain.name)}>
                              儲存變更
                            </Button>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* WAF 政策 */}
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-base">WAF 政策</h3>
                    <p className="text-sm text-muted-foreground mt-1">配置安全規則和防護政策</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                    中等安全
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setIsWafPolicyDialogOpen(true)}>
                    設定
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            防護<span className="text-brand-primary">分析</span>
          </h2>
          <WAFAnalytics />
        </div>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用的WAF管理操作</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isEmailReportDialogOpen} onOpenChange={setIsEmailReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-500" />
                    <div className="text-left">
                      <p className="font-medium">寄送報表</p>
                      <p className="text-sm text-muted-foreground">寄送安全分析報告</p>
                    </div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-500" />
                      <DialogTitle>設定報表寄送</DialogTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setIsEmailReportDialogOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogDescription className="text-base">設定安全分析報表的寄送排程和收件人資訊</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* 排程類別 */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">排程類別</Label>
                    <RadioGroup
                      value={emailReportData.scheduleType}
                      onValueChange={(value) => setEmailReportData((prev) => ({ ...prev, scheduleType: value }))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily" className="cursor-pointer">
                          日報
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly" className="cursor-pointer">
                          週報
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="cursor-pointer">
                          月報
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="cursor-pointer">
                          自訂排程
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 主旨 */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      主旨 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      placeholder="例如: WAF 安全分析報告"
                      value={emailReportData.subject}
                      onChange={(e) => setEmailReportData((prev) => ({ ...prev, subject: e.target.value }))}
                      className={emailErrors.subject ? "border-red-500" : ""}
                    />
                    {emailErrors.subject && <p className="text-sm text-red-500">{emailErrors.subject}</p>}
                  </div>

                  {/* 收件人 */}
                  <div className="space-y-2">
                    <Label htmlFor="recipients">
                      收件人 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="recipients"
                      placeholder="例如: admin@example.com, security@example.com"
                      value={emailReportData.recipients}
                      onChange={(e) => setEmailReportData((prev) => ({ ...prev, recipients: e.target.value }))}
                      className={emailErrors.recipients ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-muted-foreground">多個收件人請用逗號分隔</p>
                    {emailErrors.recipients && <p className="text-sm text-red-500">{emailErrors.recipients}</p>}
                  </div>

                  {/* 副本 (CC) */}
                  <div className="space-y-2">
                    <Label htmlFor="cc">副本 (CC)</Label>
                    <Input
                      id="cc"
                      placeholder="例如: manager@example.com"
                      value={emailReportData.cc}
                      onChange={(e) => setEmailReportData((prev) => ({ ...prev, cc: e.target.value }))}
                      className={emailErrors.cc ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-muted-foreground">多個收件人請用逗號分隔</p>
                    {emailErrors.cc && <p className="text-sm text-red-500">{emailErrors.cc}</p>}
                  </div>

                  {/* 密件副本 (BCC) */}
                  <div className="space-y-2">
                    <Label htmlFor="bcc">密件副本 (BCC)</Label>
                    <Input
                      id="bcc"
                      placeholder="例如: audit@example.com"
                      value={emailReportData.bcc}
                      onChange={(e) => setEmailReportData((prev) => ({ ...prev, bcc: e.target.value }))}
                      className={emailErrors.bcc ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-muted-foreground">多個收件人請用逗號分隔</p>
                    {emailErrors.bcc && <p className="text-sm text-red-500">{emailErrors.bcc}</p>}
                  </div>

                  {/* 信件內容說明 */}
                  <div className="space-y-2">
                    <Label htmlFor="content">信件內容說明</Label>
                    <Textarea
                      id="content"
                      placeholder="請輸入報表的額外說明或備註..."
                      value={emailReportData.content}
                      onChange={(e) => setEmailReportData((prev) => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">此內容將會包含在報表郵件中</p>
                  </div>

                  {/* 操作按鈕 */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEmailReportDialogOpen(false)
                        setEmailErrors({})
                      }}
                    >
                      取消
                    </Button>
                    <Button onClick={handleEmailReportSubmit}>確認設定</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* 主域名設定對話框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl">主域名設定</DialogTitle>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="text-base">請輸入您要配置WAF防護的主域名</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-3">
                <Label htmlFor="domain" className="text-base">
                  域名
                </Label>
                <Input
                  id="domain"
                  placeholder="例如: example.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="text-base h-12"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleDomainSubmit} size="lg" className="px-8">
                  送出
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 子域名設定對話框 */}
        <Dialog open={isSubdomainDialogOpen} onOpenChange={setIsSubdomainDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl">子域名設定</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsSubdomainDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="text-base">請輸入您要配置WAF防護的子域名</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-3">
                <Label htmlFor="subdomain" className="text-base">
                  子域名
                </Label>
                <Input
                  id="subdomain"
                  placeholder="例如: api"
                  value={subdomainInput}
                  onChange={(e) => setSubdomainInput(e.target.value)}
                  className="text-base h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="mainDomain" className="text-base">
                  主域名
                </Label>
                <Input
                  id="mainDomain"
                  placeholder="例如: example.com"
                  value={selectedMainDomain}
                  onChange={(e) => setSelectedMainDomain(e.target.value)}
                  className="text-base h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="ipv4Address" className="text-base">
                  IPv4 地址
                </Label>
                <Input
                  id="ipv4Address"
                  placeholder="例如: 192.168.1.1"
                  value={ipv4Address}
                  onChange={(e) => setIpv4Address(e.target.value)}
                  className="text-base h-12"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSubdomainSubmit} size="lg" className="px-8">
                  送出
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* WAF 政策設定對話框 - 完整版本 */}
        <Dialog open={isWafPolicyDialogOpen} onOpenChange={setIsWafPolicyDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                WAF 安全政策設定
              </DialogTitle>
              <DialogDescription>配置黑名單、白名單和國別阻擋設定來加強您的網站安全防護</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="blacklist" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="blacklist" className="flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  黑名單
                </TabsTrigger>
                <TabsTrigger value="whitelist" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  白名單
                </TabsTrigger>
                <TabsTrigger value="countries" className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  國別阻擋
                </TabsTrigger>
              </TabsList>

              {/* 黑名單設定 */}
              <TabsContent value="blacklist" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="輸入 IP 地址或域名 (例如: 192.168.1.1 或 malicious-site.com)"
                      value={blacklistInput}
                      onChange={(e) => setBlacklistInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addToBlacklist} disabled={!blacklistInput.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      新增
                    </Button>
                  </div>

                  {/* 子域名選擇區域 */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">選擇要加入黑名單的子域名</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border rounded-lg bg-muted/30">
                      {subdomains.map((domain, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`subdomain-${index}`}
                            checked={selectedSubdomains.includes(domain.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubdomains((prev) => [...prev, domain.name])
                              } else {
                                setSelectedSubdomains((prev) => prev.filter((name) => name !== domain.name))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`subdomain-${index}`} className="text-sm cursor-pointer">
                            {domain.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedSubdomains.length > 0 && (
                      <Button
                        onClick={() => {
                          selectedSubdomains.forEach((subdomain) => {
                            const newItem = {
                              id: Date.now() + Math.random(),
                              value: subdomain,
                              type: "子域名",
                            }
                            setBlacklist((prev) => [...prev, newItem])
                          })
                          setSelectedSubdomains([])
                        }}
                        className="w-full"
                      >
                        將選中的子域名加入黑名單 ({selectedSubdomains.length})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">目前黑名單 ({blacklist.length} 項)</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {blacklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950/30"
                        >
                          <div className="flex items-center gap-3">
                            <Ban className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="font-medium text-sm">{item.value}</p>
                              <p className="text-xs text-muted-foreground">{item.type}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromBlacklist(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 白名單設定 */}
              <TabsContent value="whitelist" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="輸入 IP 地址、IP段或域名 (例如: 203.0.113.0/24 或 trusted-site.com)"
                      value={whitelistInput}
                      onChange={(e) => setWhitelistInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addToWhitelist} disabled={!whitelistInput.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      新增
                    </Button>
                  </div>

                  {/* 子域名選擇區域 */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">選擇要加入白名單的子域名</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border rounded-lg bg-muted/30">
                      {subdomains.map((domain, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`whitelist-subdomain-${index}`}
                            checked={selectedSubdomains.includes(domain.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubdomains((prev) => [...prev, domain.name])
                              } else {
                                setSelectedSubdomains((prev) => prev.filter((name) => name !== domain.name))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`whitelist-subdomain-${index}`} className="text-sm cursor-pointer">
                            {domain.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedSubdomains.length > 0 && (
                      <Button
                        onClick={() => {
                          selectedSubdomains.forEach((subdomain) => {
                            const newItem = {
                              id: Date.now() + Math.random(),
                              value: subdomain,
                              type: "子域名",
                            }
                            setWhitelist((prev) => [...prev, newItem])
                          })
                          setSelectedSubdomains([])
                        }}
                        className="w-full"
                        variant="outline"
                      >
                        將選中的子域名加入白名單 ({selectedSubdomains.length})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">目前白名單 ({whitelist.length} 項)</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {whitelist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/30"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="font-medium text-sm">{item.value}</p>
                              <p className="text-xs text-muted-foreground">{item.type}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWhitelist(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 國別阻擋設定 */}
              <TabsContent value="countries" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">訪問控制模式</h4>
                    <RadioGroup value={countryAccessMode} onValueChange={setCountryAccessMode} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="block" id="block" />
                        <Label htmlFor="block">阻擋</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="allow" id="allow" />
                        <Label htmlFor="allow">放行</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select onValueChange={addBlockedCountry}>
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={countryAccessMode === "block" ? "選擇要阻擋的國家" : "選擇要放行的國家"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {countries
                          .filter((country) => !blockedCountries.find((blocked) => blocked.code === country.code))
                          .map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({country.code})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 子域名選擇區域 */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">選擇要應用此規則的子域名</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border rounded-lg bg-muted/30">
                      {subdomains.map((domain, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`country-subdomain-${index}`}
                            checked={selectedSubdomains.includes(domain.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubdomains((prev) => [...prev, domain.name])
                              } else {
                                setSelectedSubdomains((prev) => prev.filter((name) => name !== domain.name))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`country-subdomain-${index}`} className="text-sm cursor-pointer">
                            {domain.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedSubdomains.length > 0 && (
                      <Button
                        onClick={() => {
                          selectedSubdomains.forEach((subdomain) => {
                            const newItem = {
                              code: "SUBDOMAIN",
                              name: subdomain,
                              type: "子域名",
                            }
                            setBlockedCountries((prev) => [...prev, newItem])
                          })
                          setSelectedSubdomains([])
                        }}
                        className="w-full"
                        variant="outline"
                      >
                        將選中的子域名加入{countryAccessMode === "block" ? "阻擋" : "放行"}清單 (
                        {selectedSubdomains.length})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      {countryAccessMode === "block" ? "目前拒絕訪問的國家" : "目前允許訪問的國家"} (
                      {blockedCountries.length} 個)
                    </h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {blockedCountries.map((country) => (
                        <div
                          key={country.code}
                          className="flex items-center justify-between p-3 border rounded-lg bg-orange-50 dark:bg-orange-950/30"
                        >
                          <div className="flex items-center gap-3">
                            <Flag className="h-4 w-4 text-orange-500" />
                            <div>
                              <p className="font-medium text-sm">{country.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {country.type ? `${country.type} • ` : `國家代碼: ${country.code}`}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBlockedCountry(country.code)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button onClick={() => setIsWafPolicyDialogOpen(false)}>完成設定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// WAFAnalytics 和 StatCard 組件保持完全相同
function WAFAnalytics() {}

function StatCard({ title, value, description, trend, trendType, icon }) {}
