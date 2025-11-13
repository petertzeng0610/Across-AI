"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { PageTitle } from "@/components/page-title"

export default function PurchasePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <PageTitle>優惠組合方案</PageTitle>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-normal">
          三項服務一起購買的特惠價格，為您提供全方位的網路安全保護
        </p>
      </div>

      <div className="flex justify-center">
        <div className="max-w-md w-full">
          <Card className="bg-card border-border shadow-lg ring-2 ring-blue-600 shadow-xl">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-medium text-card-foreground">三項一起購買優惠</CardTitle>
                  <CardDescription className="font-normal text-muted-foreground">
                    WAF防禦 + 應用層DDoS防禦 + 全球CDN加速
                  </CardDescription>
                </div>
                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">推薦</div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-muted-foreground font-normal">$</span>
                  <span className="text-3xl font-medium text-card-foreground">5萬</span>
                  <span className="text-muted-foreground font-normal">/月起</span>
                  <span className="text-sm text-muted-foreground line-through font-normal">原價$7.5萬</span>
                </div>
              </div>
            </CardHeader>

            <div className="px-6 py-6">
              <Button
                className="w-full text-white font-normal"
                style={{ backgroundColor: "#0D99FF", borderColor: "#0D99FF" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0A85E9")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0D99FF")}
              >
                立即購買
              </Button>
            </div>

            <CardContent className="pt-0">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: "#0D99FF" }} />
                  <span className="text-muted-foreground font-normal">WAF 網站應用防火牆</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: "#0D99FF" }} />
                  <span className="text-muted-foreground font-normal">應用層 DDoS 防禦</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: "#0D99FF" }} />
                  <span className="text-muted-foreground font-normal">全球 CDN 加速服務</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: "#0D99FF" }} />
                  <span className="text-muted-foreground font-normal">乾淨流量 10TB</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: "#0D99FF" }} />
                  <span className="text-muted-foreground font-normal">應用程式 1個</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: "#0D99FF" }} />
                  <span className="text-muted-foreground font-normal">7x24 專業技術支援</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-medium text-foreground mb-4">需要自定義方案？</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6 font-normal">
          我們提供靈活的自定義方案，以滿足您的特定需求。聯繫我們的銷售團隊，獲取專屬方案。
        </p>
        <Button
          className="text-white font-normal"
          style={{ backgroundColor: "#0D99FF", borderColor: "#0D99FF" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0A85E9")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0D99FF")}
        >
          聯繫我們
        </Button>
      </div>
    </div>
  )
}
