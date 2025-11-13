"use client"

import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Globe, Settings, Copy, Check, ChevronDown, ChevronUp, Trash2, Mail } from "lucide-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Helper components for Table
const Table = ({ children }) => <table className="w-full">{children}</table>
const TableHeader = ({ children }) => <thead>{children}</thead>
const TableBody = ({ children }) => <tbody>{children}</tbody>
const TableRow = ({ children }) => <tr className="border-b">{children}</tr>
const TableHead = ({ className, children }) => (
  <th className={`px-4 py-2 text-left font-medium ${className || ""}`}>{children}</th>
)
const TableCell = ({ className, children }) => <td className={`px-4 py-2 ${className || ""}`}>{children}</td>

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

export default function WAFManagePage() {
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

  // WAF 政策相關狀態
  const [blacklistInput, setBlacklistInput] = useState("")
  const [whitelistInput, setWhitelistInput] = useState("")
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

  // 國家列表
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
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>{"規則值"}</TableHead>
            </TableRow>
          </TableHeader>
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

  // WAF 政策相關函數
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
      // 設置編輯中的域名數據
      const domain = configuredDomains.find((d) => d.name === domainName)
      if (domain) {
        setEditingDomain({
          originalName: domain.name,
          name: domain.name.split(".")[0], // 取子域名前綴
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

      // 關閉編輯表單
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

  // 獲取所有主域名
  const mainDomains = configuredDomains.filter((domain) => domain.type === "主域名")
  const subdomains = configuredDomains.filter((domain) => domain.type === "子域名")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateEmailList = (emailList) => {
    if (!emailList.trim()) return true // Empty is valid
    const emails = emailList.split(",").map((email) => email.trim())
    return emails.every((email) => validateEmail(email))
  }

  const handleEmailReportSubmit = () => {
    const errors = {}

    if (!emailReportData.subject.trim()) {
      errors.subject = "主旨為必填欄位"
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
      // Handle successful submission
      console.log("Email report scheduled:", emailReportData)
      setIsEmailReportDialogOpen(false)
      // Reset form
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
    <div className="container mx-auto p-6 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/f5">F5 Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>WAF 設定</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          WAF防禦<span className="text-brand-primary">管理</span>
        </h1>
        <p className="mt-2 text-muted-foreground">管理您的網站應用防火牆設定，保護您的網站免受各種網路攻擊威脅</p>
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
            <p className="text-sm text-muted-foreground">99.9% 可用性</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">防護域名</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configuredDomains.length}</div>
            <p className="text-muted-foreground text-sm">已配置域名數量</p>
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
              WAF 設定
            </CardTitle>
            <CardDescription>配置您的網站應用防火牆設定，包括域名管理和安全政策</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 主域名設定 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border gap-3 sm:gap-0 rounded-md">
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
                        <DialogDescription>請輸入您要配置WAF防護的主域名</DialogDescription>
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
                      {/* 域名信息 */}
                      <div className="flex items-center justify-between p-3 border bg-muted/30 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">{domain.name}</p>
                            <p className="text-sm text-muted-foreground">{domain.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* TXT 記錄展開/收合按鈕 */}
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

                      {/* TXT 記錄 - 可收合 */}
                      {domain.txtRecord && expandedTxtRecords[domain.name] && (
                        <div className="ml-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 animate-in slide-in-from-top-2 duration-200">
                          <h4 className="font-medium text-sm mb-3 text-blue-700 dark:text-blue-300">
                            DNS TXT 記錄設定
                          </h4>
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
            </div>

            {/* 子域名設定 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border gap-3 sm:gap-0 rounded-md">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">子域名設定</h3>
                    <p className="text-sm text-muted-foreground">配置子域名的WAF防護設定</p>
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
                        <DialogDescription>請輸入您要配置WAF防護的子域名</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="subdomain" className="text-right">
                            子域名
                          </Label>
                          <Input
                            id="subdomain"
                            placeholder="例如: api"
                            value={subdomainInput}
                            onChange={(e) => setSubdomainInput(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="main-domain" className="text-right">
                            主域名
                          </Label>
                          <Select
                            value={selectedMainDomain}
                            onValueChange={setSelectedMainDomain}
                            className="col-span-3"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="選擇主域名" />
                            </SelectTrigger>
                            <SelectContent>
                              {mainDomains.map((domain) => (
                                <SelectItem key={domain.name} value={domain.name}>
                                  {domain.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="ipv4-address" className="text-right">
                            IPv4 地址
                          </Label>
                          <Input
                            id="ipv4-address"
                            placeholder="例如: 192.168.1.100"
                            value={ipv4Address}
                            onChange={(e) => setIpv4Address(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="record-type" className="text-right">
                            記錄類型
                          </Label>
                          <Select value={recordType} onValueChange={setRecordType} className="col-span-3">
                            <SelectTrigger>
                              <SelectValue placeholder="選擇記錄類型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="CNAME">CNAME</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="proxy-status" className="text-right">
                            代理狀態
                          </Label>
                          <Switch checked={proxyStatus} onCheckedChange={setProxyStatus} className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={handleSubdomainSubmit}
                          disabled={!subdomainInput.trim() || !selectedMainDomain.trim() || !ipv4Address.trim()}
                        >
                          送出
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* 子域名列表 */}
              {subdomains.length > 0 && (
                <div className="ml-8 space-y-4">
                  {subdomains.map((domain, index) => (
                    <div key={index} className="space-y-3">
                      {/* 域名信息 */}
                      <div className="flex items-center justify-between p-3 border bg-muted/30 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">{domain.name}</p>
                            <p className="text-sm text-muted-foreground">{domain.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* 編輯按鈕 */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEditForm(domain.name)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedEditForms[domain.name] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          {/* 刪除按鈕 */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDomain(domain.name)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      {/* 編輯表單 - 可收合 */}
                      {expandedEditForms[domain.name] && (
                        <div className="ml-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 animate-in slide-in-from-top-2 duration-200">
                          <h4 className="font-medium text-sm mb-3 text-blue-700 dark:text-blue-300">編輯子域名設定</h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-subdomain" className="text-sm font-medium">
                                子域名
                              </Label>
                              <Input
                                id="edit-subdomain"
                                placeholder="例如: api"
                                value={editingDomain ? editingDomain.name : ""}
                                onChange={(e) => setEditingDomain({ ...editingDomain, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-record-type" className="text-sm font-medium">
                                記錄類型
                              </Label>
                              <Select
                                value={editingDomain ? editingDomain.recordType : "A"}
                                onValueChange={(value) => setEditingDomain({ ...editingDomain, recordType: value })}
                                className="col-span-3"
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="選擇記錄類型" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="CNAME">CNAME</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-ipv4-address" className="text-sm font-medium">
                                IPv4 地址
                              </Label>
                              <Input
                                id="edit-ipv4-address"
                                placeholder="例如: 192.168.1.100"
                                value={editingDomain ? editingDomain.ipAddress : ""}
                                onChange={(e) => setEditingDomain({ ...editingDomain, ipAddress: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-proxy-status" className="text-sm font-medium">
                                代理狀態
                              </Label>
                              <Switch
                                checked={editingDomain ? editingDomain.proxy : true}
                                onCheckedChange={(value) => setEditingDomain({ ...editingDomain, proxy: value })}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button
                              type="submit"
                              onClick={() => handleEditSubmit(domain.name)}
                              disabled={!editingDomain || !editingDomain.name.trim() || !editingDomain.ipAddress.trim()}
                            >
                              保存更改
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 安全策略 */}
            

            {/* 攻擊特徵庫 */}
            

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
                <CardDescription>常用的WAF管理操作</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-purple-500" />
                          設定報表寄送
                        </DialogTitle>
                        <DialogDescription>設定安全分析報表的寄送排程和收件人資訊</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="schedule-type" className="text-sm font-medium">
                            寄送排程
                          </Label>
                          <Select
                            value={emailReportData.scheduleType}
                            onValueChange={(value) => setEmailReportData({ ...emailReportData, scheduleType: value })}
                            className="col-span-3"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="選擇寄送排程" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">每日</SelectItem>
                              <SelectItem value="weekly">每周</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="subject" className="text-sm font-medium">
                            主旨
                          </Label>
                          <Input
                            id="subject"
                            placeholder="例如: 安全報告"
                            value={emailReportData.subject}
                            onChange={(e) => setEmailReportData({ ...emailReportData, subject: e.target.value })}
                            className="col-span-3"
                          />
                          {emailErrors.subject && <p className="text-red-500 text-sm">{emailErrors.subject}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="recipients" className="text-sm font-medium">
                            收件人
                          </Label>
                          <Input
                            id="recipients"
                            placeholder="例如: admin@example.com"
                            value={emailReportData.recipients}
                            onChange={(e) => setEmailReportData({ ...emailReportData, recipients: e.target.value })}
                            className="col-span-3"
                          />
                          {emailErrors.recipients && <p className="text-red-500 text-sm">{emailErrors.recipients}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cc" className="text-sm font-medium">
                            CC
                          </Label>
                          <Input
                            id="cc"
                            placeholder="例如: cc@example.com"
                            value={emailReportData.cc}
                            onChange={(e) => setEmailReportData({ ...emailReportData, cc: e.target.value })}
                            className="col-span-3"
                          />
                          {emailErrors.cc && <p className="text-red-500 text-sm">{emailErrors.cc}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="bcc" className="text-sm font-medium">
                            BCC
                          </Label>
                          <Input
                            id="bcc"
                            placeholder="例如: bcc@example.com"
                            value={emailReportData.bcc}
                            onChange={(e) => setEmailReportData({ ...emailReportData, bcc: e.target.value })}
                            className="col-span-3"
                          />
                          {emailErrors.bcc && <p className="text-red-500 text-sm">{emailErrors.bcc}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="content" className="text-sm font-medium">
                            內容
                          </Label>
                          <Textarea
                            id="content"
                            placeholder="例如: 安全報告內容"
                            value={emailReportData.content}
                            onChange={(e) => setEmailReportData({ ...emailReportData, content: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={handleEmailReportSubmit}
                          disabled={!emailReportData.recipients.trim()}
                        >
                          送出
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
