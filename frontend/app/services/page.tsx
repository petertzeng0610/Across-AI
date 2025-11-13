"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Globe, Brain } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      title: "WAF防禦",
      description: "網站應用防火牆，保護您的網站免受各種網路攻擊威脅，包括SQL注入、XSS攻擊等。",
      icon: <Shield className="h-8 w-8" />,
      features: ["SQL注入防護", "XSS攻擊防護", "CSRF防護", "實時監控"],
      href: "/services/hiwaf",
      manageHref: "/services/hiwaf/manage",
      subscribed: true,
    },
    {
      title: "應用層DDoS防禦",
      description: "專業的DDoS攻擊防護，確保您的服務在攻擊下仍能正常運行。",
      icon: <Globe className="h-8 w-8" />,
      features: ["多層防護", "智能識別", "自動緩解", "實時報告"],
      href: "/services/application-defense",
      manageHref: "/services/application-defense/manage",
      subscribed: true,
    },
    {
      title: "全球CDN加速",
      description: "全球內容傳遞網路，加速您的網站載入速度，提升用戶體驗。",
      icon: <Zap className="h-8 w-8" />,
      features: ["全球節點", "智能路由", "快取優化", "SSL加速"],
      href: "/services/cdn",
      manageHref: "/services/cdn/manage",
      subscribed: true,
    },
    {
      title: "F5 WAF 防禦",
      description: "企業級 F5 網站應用防火牆，提供進階威脅防護與應用層安全防禦。",
      icon: <Shield className="h-8 w-8" />,
      features: ["進階威脅防護", "應用層防護", "Bot 防護", "API 安全"],
      href: "/services/f5-waf",
      manageHref: "/services/f5-waf/manage",
      subscribed: true,
    },
    {
      title: "CATO SASE 整合",
      description: "雲端原生 CATO WAF 解決方案，整合 SASE 架構提供全方位安全防護。",
      icon: <Shield className="h-8 w-8" />,
      features: ["雲端原生防護", "SASE 整合", "零信任架構", "全球防護"],
      href: "/services/cato-waf",
      manageHref: "/services/cato-waf/manage",
      subscribed: true,
    },
    {
      title: "Security AI 一鍵分析",
      description: "運用AI技術快速分析安全事件，提供智能化威脅偵測與防護建議。",
      icon: <Brain className="h-8 w-8" />,
      features: ["圖表分析", "行為分析", "AI智能建議", "AI趨勢對比"],
      href: "/services/security-ai",
      manageHref: "/services/security-ai/manage",
      subscribed: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl">
          <span className="text-brand-primary">服務</span>管理
        </h1>
        <p className="mt-4 text-muted-foreground text-lg font-normal max-w-2xl mx-auto">
          全面的網路安全和性能優化解決方案，保護您的數位資產並提升用戶體驗
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card
            key={index}
            className={`relative shadow-lg hover:shadow-xl transition-all duration-300 bg-card border-2 ${
              service.subscribed
                ? "border-green-500 dark:border-green-400 hover:border-green-400 dark:hover:border-green-300"
                : "border-border hover:border-primary"
            }`}
          >
            {service.subscribed && (
              <Badge className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md z-10">
                已訂閱
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-brand-primary">{service.icon}</div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-2 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center pt-4">
                  <Button
                    asChild
                    size="sm"
                    className="w-full font-normal bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm"
                  >
                    <Link href={service.manageHref}>服務管理</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
