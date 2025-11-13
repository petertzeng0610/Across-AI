"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Phone, MapPin, Clock, Mail, AlertCircle } from "lucide-react"
import { PageTitle } from "@/components/page-title"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  position: string
  inquiryType: string
  requirements: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  company?: string
  position?: string
  requirements?: string
  inquiryType?: string
  general?: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    inquiryType: "",
    requirements: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone) return false // 電話號為必填
    const phoneRegex = /^[\d\-+().\s]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 8
  }

  const validateName = (name: string): boolean => {
    const trimmedName = name.trim()
    return trimmedName.length >= 2 && trimmedName.length <= 10
  }

  const validateCompany = (company: string): boolean => {
    if (!company) return false // 公司名稱改為必填
    const trimmedCompany = company.trim()
    return trimmedCompany.length >= 2 && trimmedCompany.length <= 30
  }

  const validatePosition = (position: string): boolean => {
    if (!position) return false // 職稱改為必填
    const trimmedPosition = position.trim()
    return trimmedPosition.length >= 2 && trimmedPosition.length <= 30
  }

  const validateRequirements = (requirements: string): boolean => {
    if (!requirements) return true // 需求說明是選填的
    return requirements.trim().length <= 1000
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // 驗證姓名
    if (!formData.name.trim()) {
      newErrors.name = "姓名為必填欄位"
    } else if (!validateName(formData.name)) {
      newErrors.name = "姓名長度需要在2-10個字元之間"
    }

    // 驗證 Email
    if (!formData.email) {
      newErrors.email = "Email 為必填欄位"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "請輸入有效的 Email 格式"
    } else if (formData.email.length > 50) {
      newErrors.email = "Email 長度不能超過50個字元"
    }

    // 驗證電話（改為必填）
    if (!formData.phone) {
      newErrors.phone = "聯絡電話為必填欄位"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "請輸入有效的電話號碼格式（至少8位數字）"
    } else if (formData.phone.length > 20) {
      newErrors.phone = "電話號碼長度不能超過20個字元"
    }

    // 驗證公司名稱（改為必填）
    if (!formData.company.trim()) {
      newErrors.company = "公司名稱為必填欄位"
    } else if (!validateCompany(formData.company)) {
      newErrors.company = "公司名稱長度需要在2-30個字元之間"
    }

    // 驗證職稱（改為必填）
    if (!formData.position.trim()) {
      newErrors.position = "職稱為必填欄位"
    } else if (!validatePosition(formData.position)) {
      newErrors.position = "職稱長度需要在2-30個字元之間"
    }

    // 驗證需求說明
    if (formData.requirements && !validateRequirements(formData.requirements)) {
      newErrors.requirements = "需求說明不能超過1000個字元"
    }

    // 驗證諮詢項目
    if (!formData.inquiryType) {
      newErrors.inquiryType = "請選擇諮詢項目"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除該欄位的錯誤訊息
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 模擬 API 呼叫
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("表單提交:", formData)
      setSubmitSuccess(true)

      // 重置表單
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        inquiryType: "",
        requirements: "",
      })
    } catch (error) {
      setErrors({ general: "提交失敗，請稍後再試" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="聯絡我們" description="歡迎聯絡我們，我們將竭誠為您服務" />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 聯絡資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">聯絡資訊</CardTitle>
              <CardDescription>我們的專業團隊隨時為您提供協助</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-primary mt-1" />
                <div>
                  <h3 className="font-medium">客服電話</h3>
                  <p className="text-muted-foreground">02-8979-8887</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-primary mt-1" />
                <div>
                  <h3 className="font-medium">地址</h3>
                  <p className="text-muted-foreground">台北市信義區松德路159號12樓</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-brand-primary mt-1" />
                <div>
                  <h3 className="font-medium">服務時間</h3>
                  <p className="text-muted-foreground">週一至五 9:30-17:30</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-primary mt-1" />
                <div>
                  <h3 className="font-medium">來信聯絡</h3>
                  <a href="mailto:info@twister5.com.tw" className="text-brand-primary hover:underline">
                    info@twister5.com.tw
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 聯絡表單 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">聯絡表單</CardTitle>
              <CardDescription>請填寫以下資訊，我們會盡快與您聯繫</CardDescription>
            </CardHeader>
            <CardContent>
              {submitSuccess && (
                <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>感謝您的聯絡，我們已收到您的訊息，將會在24小時內回覆您！</AlertDescription>
                </Alert>
              )}

              {errors.general && (
                <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      姓名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      maxLength={10}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="請輸入您的姓名（2-10字元）"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    <p className="text-xs text-muted-foreground">{formData.name.length}/10</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      maxLength={50}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="請輸入您的電子郵件"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    <p className="text-xs text-muted-foreground">{formData.email.length}/50</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      聯絡電話 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      maxLength={20}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="請輸入您的聯絡電話"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    <p className="text-xs text-muted-foreground">{formData.phone.length}/20</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">
                      公司名稱 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      required
                      maxLength={30}
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="請輸入您的公司名稱（2-30字元）"
                      className={errors.company ? "border-red-500" : ""}
                    />
                    {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                    <p className="text-xs text-muted-foreground">{formData.company.length}/30</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">
                      職稱 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="position"
                      type="text"
                      required
                      maxLength={30}
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      placeholder="請輸入您的職稱（2-30字元）"
                      className={errors.position ? "border-red-500" : ""}
                    />
                    {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                    <p className="text-xs text-muted-foreground">{formData.position.length}/30</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">
                      諮詢項目 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      required
                      value={formData.inquiryType}
                      onValueChange={(value) => handleInputChange("inquiryType", value)}
                    >
                      <SelectTrigger className={errors.inquiryType ? "border-red-500" : ""}>
                        <SelectValue placeholder="請選擇諮詢項目" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">產品咨詢</SelectItem>
                        <SelectItem value="technical">技術服務</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.inquiryType && <p className="text-sm text-red-500">{errors.inquiryType}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">需求說明</Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    maxLength={1000}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="請詳細描述您的需求或問題..."
                    className={errors.requirements ? "border-red-500" : ""}
                  />
                  {errors.requirements && <p className="text-sm text-red-500">{errors.requirements}</p>}
                  <p className="text-xs text-muted-foreground">{formData.requirements.length}/1000</p>
                </div>

                <Button type="submit" className="w-full btn-primary text-white" disabled={isSubmitting}>
                  {isSubmitting ? "送出中..." : "送出聯絡表單"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
