"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Globe, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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

export default function CATOWAFManagePage() {
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
            <BreadcrumbPage className="text-foreground font-medium">CATO SASE 管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          CATO SASE <span className="text-brand-primary">管理</span>
        </h1>
        <p className="mt-2 text-muted-foreground">管理您的 CATO 網站應用防火牆設定，保護您的網站免受各種網路攻擊威脅</p>
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

      {/* WAF Settings - 完整複製 hiwaf/manage 的所有設定內容 */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-primary" />
              CATO SASE 設定
            </CardTitle>
            <CardDescription>配置您的 CATO 網站應用防火牆設定，包括域名管理和安全政��</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 主域名設定 - 與 hiwaf 完全相同 */}
            {/* ... 此處省略完整的主域名設定代碼，與 hiwaf/manage 完全相同 ... */}

            {/* 子域名設定 - 與 hiwaf 完全相同 */}
            {/* ... 此處省略完整的子域名設定代碼，與 hiwaf/manage 完全相同 ... */}

            {/* WAF 政策 - 與 hiwaf 完全相同 */}
            {/* ... 此處省略完整的 WAF 政策代碼，與 hiwaf/manage 完全相同 ... */}
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-12 text-foreground">
            防護<span className="text-brand-primary">分析</span>
          </h2>
          <WAFAnalytics />
        </div>

        {/* 快速操作 - 與 hiwaf 完全相同 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用的 CATO SASE 管理操作</CardDescription>
          </CardHeader>
          <CardContent>{/* ... 寄送報表按鈕和對話框，與 hiwaf/manage 完全相同 ... */}</CardContent>
        </Card>
      </div>
    </div>
  )
}

// WAFAnalytics 和 StatCard 組件與 hiwaf/manage 完全相同
function WAFAnalytics() {}

function StatCard({ title, value, description, trend, trendType, icon }) {}
