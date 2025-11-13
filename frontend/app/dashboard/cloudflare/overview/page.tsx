"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, TrendingUp, X, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useWAFData } from "../../waf-data-context"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts"

export default function CloudflareOverviewPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [aiSuggestion, setAiSuggestion] = useState<{
    show: boolean
    title: string
    content: string
  }>({
    show: false,
    title: "",
    content: "",
  })

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const cdnMapContainerRef = useRef<HTMLDivElement>(null)
  const cdnMapRef = useRef<any>(null)

  const tabs = [
    { id: "overview", label: "總覽", sublabel: "Overview" },
    { id: "ddos", label: "DDoS 防護" },
    { id: "waf", label: "WAF 分析" },
    { id: "cdn", label: "CDN 性能" },
  ]

  const trafficData = [
    { time: "0", attack: 0.5, clean: 2.1 },
    { time: "5", attack: 0.8, clean: 2.3 },
    { time: "10", attack: 1.2, clean: 2.5 },
    { time: "15", attack: 2.5, clean: 2.8 },
    { time: "20", attack: 4.2, clean: 3.1 },
    { time: "25", attack: 5.8, clean: 2.9 },
    { time: "30", attack: 7.5, clean: 2.7 },
    { time: "35", attack: 8.2, clean: 2.5 },
    { time: "40", attack: 6.8, clean: 2.6 },
    { time: "45", attack: 5.2, clean: 2.8 },
    { time: "50", attack: 4.1, clean: 3.0 },
    { time: "55", attack: 3.5, clean: 3.2 },
    { time: "60", attack: 2.8, clean: 3.5 },
  ]

  const attackSources = [
    { country: "俄羅斯", percentage: 45, color: "#ef4444", x: "65%", y: "28%", lng: 105.3188, lat: 61.524 },
    { country: "巴西", percentage: 20, color: "#f97316", x: "28%", y: "62%", lng: -47.9292, lat: -15.7801 },
    { country: "越南", percentage: 12, color: "#eab308", x: "72%", y: "48%", lng: 108.2772, lat: 14.0583 },
  ]

  const attackTypeData = [
    { name: "UDP Flood", value: 72, color: "#ef4444" },
    { name: "SYN Flood", value: 18, color: "#f97316" },
    { name: "HTTP Flood", value: 8, color: "#3b82f6" },
    { name: "其他", value: 2, color: "#6b7280" },
  ]

  const protocolData = [
    { name: "UDP", value: 75, color: "#ef4444" },
    { name: "TCP", value: 20, color: "#f97316" },
    { name: "ICMP", value: 5, color: "#3b82f6" },
  ]

  const [packetRateData, setPacketRateData] = useState([
    { time: "0", rate: 0.5 },
    { time: "5", rate: 0.8 },
    { time: "10", rate: 1.5 },
    { time: "15", rate: 2.8 },
    { time: "20", rate: 4.2 },
    { time: "25", rate: 5.5 },
    { time: "30", rate: 7.2 },
    { time: "35", rate: 8.5 },
    { time: "40", rate: 6.8 },
    { time: "45", rate: 5.2 },
    { time: "50", rate: 3.8 },
    { time: "55", rate: 2.5 },
    { time: "60", rate: 1.8 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketRateData((prevData) => {
        const newData = prevData.slice(1)
        const lastTime = Number.parseInt(newData[newData.length - 1].time)
        const newTime = lastTime + 5
        const newRate = Math.max(0.5, Math.min(9, Math.random() * 8 + 1))
        return [...newData, { time: newTime.toString(), rate: Number.parseFloat(newRate.toFixed(1)) }]
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const topAttackIPs = [
    { ip: "195.191.171.12", country: "俄羅斯", flag: "🇷🇺", traffic: "1.2 Gbps" },
    { ip: "200.221.12.45", country: "巴西", flag: "🇧🇷", traffic: "850 Mbps" },
  ]

  const wafEventTrendData = [
    { hour: "0", blocked: 120, monitored: 15 },
    { hour: "2", blocked: 180, monitored: 22 },
    { hour: "4", blocked: 150, monitored: 18 },
    { hour: "6", blocked: 220, monitored: 28 },
    { hour: "8", blocked: 380, monitored: 45 },
    { hour: "10", blocked: 520, monitored: 62 },
    { hour: "12", blocked: 680, monitored: 78 },
    { hour: "14", blocked: 750, monitored: 85 },
    { hour: "16", blocked: 620, monitored: 70 },
    { hour: "18", blocked: 480, monitored: 55 },
    { hour: "20", blocked: 350, monitored: 42 },
    { hour: "22", blocked: 280, monitored: 35 },
    { hour: "24", blocked: 200, monitored: 25 },
  ]

  const topWafRules = [
    { name: "SQL 注入防護", count: 3120, color: "#3b82f6" },
    { name: "惡意機器人防護", count: 2541, color: "#3b82f6" },
    { name: "跨站腳本 (XSS) 防護", count: 1890, color: "#3b82f6" },
    { name: "路徑遍歷防護", count: 1456, color: "#3b82f6" },
    { name: "命令注入防護", count: 982, color: "#3b82f6" },
  ]

  const topAttackedUrls = [
    { url: "/login.php", attackType: "SQL Injection", count: 2876, color: "#f97316" },
    { url: "/search?query=...", attackType: "XSS", count: 1543, color: "#ef4444" },
    { url: "/admin/config.php", attackType: "Path Traversal", count: 1234, color: "#eab308" },
    { url: "/api/user/delete", attackType: "Command Injection", count: 987, color: "#f97316" },
    { url: "/upload.php", attackType: "File Upload", count: 856, color: "#ef4444" },
    { url: "/wp-admin/", attackType: "Brute Force", count: 745, color: "#eab308" },
    { url: "/api/v1/auth", attackType: "SQL Injection", count: 623, color: "#f97316" },
    { url: "/checkout.php", attackType: "XSS", count: 512, color: "#ef4444" },
  ]

  // ADDED CODE START
  const httpStatusData = [
    { name: "2xx (成功)", value: 98.9, color: "#06b6d4" },
    { name: "3xx (重定向)", value: 1.0, color: "#3b82f6" },
    { name: "4xx (客戶端錯誤)", value: 0.09, color: "#f97316" },
    { name: "5xx (伺服器錯誤)", value: 0.01, color: "#ef4444" },
  ]

  const trafficTrendData = [
    { hour: "0", traffic: 0.8, requests: 45 },
    { hour: "2", traffic: 0.9, requests: 48 },
    { hour: "4", traffic: 0.7, requests: 42 },
    { hour: "6", traffic: 1.1, requests: 55 },
    { hour: "8", traffic: 1.5, requests: 72 },
    { hour: "10", traffic: 1.8, requests: 85 },
    { hour: "12", traffic: 2.2, requests: 98 },
    { hour: "14", traffic: 2.5, requests: 105 },
    { hour: "16", traffic: 2.1, requests: 92 },
    { hour: "18", traffic: 1.9, requests: 88 },
    { hour: "20", traffic: 1.6, requests: 78 },
    { hour: "22", traffic: 1.3, requests: 65 },
    { hour: "24", traffic: 1.0, requests: 52 },
  ]

  const latencyRegions = [
    { region: "北美", x: "20%", y: "30%", latency: 35, color: "#10b981", lng: -95.7129, lat: 37.0902 },
    { region: "歐洲", x: "50%", y: "25%", latency: 45, color: "#10b981", lng: 10.4515, lat: 51.1657 },
    { region: "亞洲", x: "75%", y: "40%", latency: 120, color: "#f97316", lng: 100.6197, lat: 34.0479 },
    { region: "南美", x: "28%", y: "65%", latency: 180, color: "#ef4444", lng: -58.3816, lat: -14.235 },
    { region: "非洲", x: "52%", y: "55%", latency: 160, color: "#ef4444", lng: 17.8739, lat: -4.0383 },
    { region: "大洋洲", x: "82%", y: "70%", latency: 95, color: "#f97316", lng: 133.7751, lat: -25.2744 },
  ]
  // ADDED CODE END

  const { setWafRisks, setSelectedBrand } = useWAFData()

  useEffect(() => {
    setSelectedBrand("cloudflare")
    setWafRisks([
      // 高風險 (High Severity)
      {
        id: "waf-1",
        title: "SQL 注入攻擊激增",
        severity: "critical",
        openIssues: 3120,
        resolvedIssues: 0,
        affectedAssets: 45,
        tags: ["SQL Injection", "Internet Exposed", "Exploit In Wild"],
        description:
          "檢測到針對 /login.php 和 /api/v1/auth 端點的大規模 SQL 注入攻擊嘗試，攻擊者試圖繞過身份驗證機制並獲取敏感數據庫資訊。此類攻擊可能導致數據洩露、帳戶劫持和系統完整性受損。",
        createdDate: "Apr 9, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: "CVE-2025-1234",
        recommendations: [
          {
            title: "���用 WAF SQL 注入防護規則",
            description: "立即啟用並更新 SQL 注入防護規則至最新版本，阻擋惡意 SQL 查詢",
            priority: "high",
          },
          {
            title: "封鎖惡意 IP 地址",
            description: "將檢測到的攻擊來源 IP 加入黑名單，防止持續攻擊",
            priority: "high",
          },
          {
            title: "加強輸入驗證",
            description: "在應用層實施嚴格的輸入驗證和參數化查詢",
            priority: "high",
          },
        ],
      },
      {
        id: "waf-2",
        title: "跨站腳本 (XSS) 攻擊檢測",
        severity: "high",
        openIssues: 1890,
        resolvedIssues: 456,
        affectedAssets: 23,
        tags: ["XSS", "Internet Exposed", "Confirmed Exploitable"],
        description:
          "在 /search 和 /checkout.php 端點檢測到 XSS 攻擊嘗試，攻擊者試圖注入惡意 JavaScript 腳本以竊取用戶 Cookie、會話令牌或執行未授權操作。",
        createdDate: "Apr 8, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: "CVE-2025-2345",
        recommendations: [
          {
            title: "更新 XSS 防護規則",
            description: "啟用更嚴格的 XSS 過濾規則，阻擋腳本注入嘗試",
            priority: "high",
          },
          {
            title: "實施內容安全策略 (CSP)",
            description: "配置 Content-Security-Policy 標頭以限制腳本執行",
            priority: "high",
          },
        ],
      },

      // 中風險 (Medium Severity)
      {
        id: "waf-3",
        title: "惡意機器人流量",
        severity: "medium",
        openIssues: 2541,
        resolvedIssues: 1200,
        affectedAssets: 67,
        tags: ["Bot Traffic", "Rate Limiting", "Automated Attacks"],
        description:
          "檢測到大量自動化機器人流量，主要針對 API 端點和登入頁面。這些機器人可能用於撞庫攻擊、內容抓取或 DDoS 攻擊，可能導致服務降級和資源耗盡。",
        createdDate: "Apr 7, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: "啟用機器人管理",
            description: "配置 Cloudflare Bot Management 以識別和過濾惡意機器人",
            priority: "medium",
          },
          {
            title: "實施 Rate Limiting",
            description: "對 API 端點設置請求速率限制，防止濫用",
            priority: "medium",
          },
        ],
      },
      {
        id: "waf-4",
        title: "路徑遍歷攻擊嘗試",
        severity: "medium",
        openIssues: 1456,
        resolvedIssues: 890,
        affectedAssets: 18,
        tags: ["Path Traversal", "File Access", "Directory Listing"],
        description:
          "檢測到針對 /admin/config.php 和文件上傳端點的路徑遍歷攻擊，攻擊者試圖訪問系統文件或敏感配置文件。",
        createdDate: "Apr 6, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: "CVE-2025-3456",
        recommendations: [
          {
            title: "啟用路徑遍歷防護",
            description: "配置 WAF 規則以阻擋包含 ../ 或絕對路徑的請求",
            priority: "medium",
          },
          {
            title: "限制文件訪問權限",
            description: "在應用層實施嚴格的文件路徑驗證和訪問控制",
            priority: "medium",
          },
        ],
      },

      // 低風險 (Low Severity)
      {
        id: "waf-5",
        title: "異常 User-Agent 檢測",
        severity: "low",
        openIssues: 982,
        resolvedIssues: 1500,
        affectedAssets: 12,
        tags: ["Suspicious Activity", "Monitoring"],
        description:
          "檢測到使用異常或偽造 User-Agent 標頭的請求，可能是自動化工具或爬蟲程序。雖然風險較低，但建議持續監控以識別潛在威脅。",
        createdDate: "Apr 5, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: "建立 User-Agent 白名單",
            description: "配置允許的 User-Agent 列表，阻擋可疑請求",
            priority: "low",
          },
          {
            title: "啟用監控模式",
            description: "先以監控模式觀察流量模式，避免誤判",
            priority: "low",
          },
        ],
      },
      {
        id: "waf-6",
        title: "HTTP 方法濫用",
        severity: "low",
        openIssues: 745,
        resolvedIssues: 2100,
        affectedAssets: 8,
        tags: ["HTTP Methods", "Protocol Abuse"],
        description: "檢測到使用非標準 HTTP 方法（如 TRACE、OPTIONS）的請求，可能用於信息收集或繞過安全控制。",
        createdDate: "Apr 4, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: "限制允許的 HTTP 方法",
            description: "僅允許必要的 HTTP 方法（GET、POST、PUT、DELETE）",
            priority: "low",
          },
        ],
      },
    ])
  }, [setWafRisks, setSelectedBrand])

  useEffect(() => {
    if (activeTab !== "overview" || !mapContainerRef.current) return

    // Load MapLibre CSS and JS
    const loadMapLibre = async () => {
      // Add CSS
      if (!document.getElementById("maplibre-css")) {
        const link = document.createElement("link")
        link.id = "maplibre-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
        document.head.appendChild(link)
      }

      // Load MapLibre JS
      if (!(window as any).maplibregl) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const maplibregl = (window as any).maplibregl

      if (mapRef.current) return

      // Initialize map
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json", // Native MapLibre style
        center: [30, 30],
        zoom: 1.2,
        interactive: true,
      })

      mapRef.current = map

      map.on("load", () => {
        map.addSource("attack-labels", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: attackSources.map((source) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [source.lng, source.lat],
              },
              properties: {
                label: `${source.country} ${source.percentage}%`,
              },
            })),
          },
        })

        map.addLayer({
          id: "attack-labels-layer",
          type: "symbol",
          source: "attack-labels",
          layout: {
            "text-field": ["get", "label"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-offset": [0, 1.5],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#000000",
            "text-halo-width": 2,
          },
        })

        // Add pulsing dot for each attack source
        attackSources.forEach((source, index) => {
          const size = 100

          const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd: function () {
              const canvas = document.createElement("canvas")
              canvas.width = this.width
              canvas.height = this.height
              this.context = canvas.getContext("2d")
            },

            render: function () {
              const duration = 2000
              const t = (performance.now() % duration) / duration

              const radius = (size / 2) * 0.3
              const outerRadius = (size / 2) * 0.7 * t + radius
              const context = this.context

              // Clear canvas
              context.clearRect(0, 0, this.width, this.height)

              // Outer pulsing circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
              context.fillStyle = `rgba(239, 68, 68, ${1 - t})`
              context.fill()

              // Inner circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
              context.fillStyle = source.color
              context.strokeStyle = "white"
              context.lineWidth = 2
              context.fill()
              context.stroke()

              // Update this image's data
              this.data = context.getImageData(0, 0, this.width, this.height).data

              // Continuously repaint the map
              map.triggerRepaint()

              return true
            },
          }

          map.addImage(`pulsing-dot-${index}`, pulsingDot as any, { pixelRatio: 2 })

          map.addSource(`attack-source-${index}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [source.lng, source.lat],
                  },
                  properties: {
                    country: source.country,
                    percentage: source.percentage,
                  },
                },
              ],
            },
          })

          map.addLayer({
            id: `attack-layer-${index}`,
            type: "symbol",
            source: `attack-source-${index}`,
            layout: {
              "icon-image": `pulsing-dot-${index}`,
              "icon-size": 0.5,
              "icon-allow-overlap": true,
            },
          })

          // Add popup on click
          map.on("click", `attack-layer-${index}`, (e: any) => {
            const coordinates = e.features[0].geometry.coordinates.slice()
            const { country, percentage } = e.features[0].properties

            new maplibregl.Popup()
              .setLngLat(coordinates)
              .setHTML(
                `<div style="color: #000; padding: 4px;"><strong>${country}</strong><br/>攻擊比例: ${percentage}%</div>`,
              )
              .addTo(map)
          })

          map.on("mouseenter", `attack-layer-${index}`, () => {
            map.getCanvas().style.cursor = "pointer"
          })

          map.on("mouseleave", `attack-layer-${index}`, () => {
            map.getCanvas().style.cursor = ""
          })
        })
      })
    }

    loadMapLibre()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "cdn" || !cdnMapContainerRef.current) return

    const loadMapLibre = async () => {
      // Add CSS
      if (!document.getElementById("maplibre-css")) {
        const link = document.createElement("link")
        link.id = "maplibre-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
        document.head.appendChild(link)
      }

      // Load MapLibre JS
      if (!(window as any).maplibregl) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const maplibregl = (window as any).maplibregl

      if (cdnMapRef.current) return

      // Initialize map
      const map = new maplibregl.Map({
        container: cdnMapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [30, 30],
        zoom: 1.2,
        interactive: true,
      })

      cdnMapRef.current = map

      map.on("load", () => {
        // Add labels for latency regions
        map.addSource("latency-labels", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: latencyRegions.map((region) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [region.lng, region.lat],
              },
              properties: {
                label: `${region.region} ${region.latency}ms`,
              },
            })),
          },
        })

        map.addLayer({
          id: "latency-labels-layer",
          type: "symbol",
          source: "latency-labels",
          layout: {
            "text-field": ["get", "label"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-offset": [0, 1.5],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#000000",
            "text-halo-width": 2,
          },
        })

        // Add pulsing dot for each latency region
        latencyRegions.forEach((region, index) => {
          const size = 100

          const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd: function () {
              const canvas = document.createElement("canvas")
              canvas.width = this.width
              canvas.height = this.height
              this.context = canvas.getContext("2d")
            },

            render: function () {
              const duration = 2000
              const t = (performance.now() % duration) / duration

              const radius = (size / 2) * 0.3
              const outerRadius = (size / 2) * 0.7 * t + radius
              const context = this.context

              // Clear canvas
              context.clearRect(0, 0, this.width, this.height)

              // Outer pulsing circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)

              // Color based on latency
              let pulseColor = "16, 185, 129" // green
              if (region.latency > 150) {
                pulseColor = "239, 68, 68" // red
              } else if (region.latency > 50) {
                pulseColor = "249, 115, 22" // orange
              }

              context.fillStyle = `rgba(${pulseColor}, ${1 - t})`
              context.fill()

              // Inner circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
              context.fillStyle = region.color
              context.strokeStyle = "white"
              context.lineWidth = 2
              context.fill()
              context.stroke()

              // Update this image's data
              this.data = context.getImageData(0, 0, this.width, this.height).data

              // Continuously repaint the map
              map.triggerRepaint()

              return true
            },
          }

          map.addImage(`latency-dot-${index}`, pulsingDot as any, { pixelRatio: 2 })

          map.addSource(`latency-source-${index}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [region.lng, region.lat],
                  },
                  properties: {
                    region: region.region,
                    latency: region.latency,
                  },
                },
              ],
            },
          })

          map.addLayer({
            id: `latency-layer-${index}`,
            type: "symbol",
            source: `latency-source-${index}`,
            layout: {
              "icon-image": `latency-dot-${index}`,
              "icon-size": 0.5,
              "icon-allow-overlap": true,
            },
          })

          // Add popup on click
          map.on("click", `latency-layer-${index}`, (e: any) => {
            const coordinates = e.features[0].geometry.coordinates.slice()
            const { region, latency } = e.features[0].properties

            new maplibregl.Popup()
              .setLngLat(coordinates)
              .setHTML(
                `<div style="color: #000; padding: 4px;"><strong>${region}</strong><br/>延遲: ${latency}ms</div>`,
              )
              .addTo(map)
          })

          map.on("mouseenter", `latency-layer-${index}`, () => {
            map.getCanvas().style.cursor = "pointer"
          })

          map.on("mouseleave", `latency-layer-${index}`, () => {
            map.getCanvas().style.cursor = ""
          })
        })
      })
    }

    loadMapLibre()

    return () => {
      if (cdnMapRef.current) {
        cdnMapRef.current.remove()
        cdnMapRef.current = null
      }
    }
  }, [activeTab])

  const generateAISuggestion = (actionType: string) => {
    let title = ""
    let content = ""

    switch (actionType) {
      case "產生摘要":
        title = "DDoS 攻擊摘要報告"
        content = `
📊 **當前攻擊狀態分析**

🔴 **攻擊概況**
-當前狀態：攻擊緩解中
- 攻擊峰值：8.2 Gbps (近1小時)
- 已清洗流量：1.5 TB
- 攔截率：99.8%

🎯 **攻擊��型分佈**
- UDP Flood：72% (主要攻擊類型)
- SYN Flood：18%
- HTTP Flood：8%
- 其他：2%

🌍 **主要攻擊來源**
1. 俄羅斯 (45%) - 1.2 Gbps
2. 巴西 (20%) - 850 Mbps
3. 越南 (12%)

✅ **系統狀態**
- 源伺服器運行正常
- CDN 快取命中率：98.5%
- 自動緩解機制已啟動並有效運作
        `
        break

      case "產生報告":
      case "產生建議":
        title = "AI 智能分析與建議"
        content = `
🤖 **AI 深度分析報告**

📈 **攻擊趨勢分析**
根據過去60分鐘的數據分析，攻擊流量在35分鐘前達到峰值 8.2 Gbps，目前呈現下降趨勢。主要攻擊類型為 UDP Flood (72%)，這是典型的容量耗盡型攻擊。

🎯 **建議措施**
1. **立即行動**：
   - 封鎖 TOP 3 攻擊來源 IP (俄羅斯、巴西、越南)
   - 啟用更嚴格的 Rate Limiting 規則

2. **短期優化**：
   - 調整 UDP 流量過濾規則
   - 增加 SYN Cookie 保護
   - 啟用地理位置封鎖 (針對高風險地區)

3. **長期防護**：
   - 部署 AI 驅動的異常流量檢測
   - 建立攻擊模式學習機制
   - 定期更新 WAF 規則庫

⚠️ **風險評估**
當前風險等級：中等
預計攻擊持續時間：1-2 小時
建議保持高度警戒狀態
        `
        break

      case "建立保護任務":
      case "建立修復任務":
        title = "自動化保護任務建議"
        content = `
🛡️ **智能保護任務配置**

**任務 1：IP 封鎖清單更新**
- 目標：封鎖 TOP 10 攻擊來源 IP
- 優先級：高
- 預計效果：減少 60% 攻擊流量
- 執行時間：立即

**任務 2：UDP Flood 防護強化**
- 啟用 UDP 流量限速
- 設定閾值：1000 pps per IP
- 超時封鎖時間：30 分鐘
- 預計效果：阻擋 72% 的主要攻擊

**任務 3：地理位置過濾**
- 臨時封鎖高風險地區 (俄羅斯、巴西)
- 允許白名單 IP 通過
- 持續時間：2 小時
- 預計效果：減少 65% 攻擊來源

**任務 4：Rate Limiting 規則**
- 全域 Rate Limit：10000 req/min
- 單 IP Rate Limit：100 req/min
- 自動封鎖超限 IP：15 分鐘

✅ 點擊「執行全部任務」開始自動化防護
        `
        break

      case "查詢 WAF 規則":
        title = "WAF 規則檢查與建議"
        content = `
🔍 **WAF 規則狀態檢查**

**當前 WAF 配置**
- 已啟用規則：156 條
- 自定義規則：23 條
- 最後更新：2 天前

**建議更新的規則**
1. **UDP Flood 防護規則**
   - 當前版本：v2.1
   - 最新版本：v2.3
   - 更新內容：增強 UDP 流量識別能力
   - 建議：立即更新

2. **SYN Flood 防護規則**
   - 狀態：已啟用
   - 建議：調整觸發閾值從 5000 降至 3000

3. **HTTP Flood 防護規則**
   - 狀態：已啟用
   - 建議：添加 User-Agent 黑名單規則

**新增規則建議**
- 地理位置封鎖規則 (針對高風險地區)
- IP 信譽評分規則
- 異常流量模式檢測規則

🔄 建議執行完整的 WAF 規則庫更新
        `
        break

      case "封鎖來源 IP":
        title = "攻擊來源 IP 封鎖建議"
        content = `
🚫 **IP 封鎖策略建議**

**TOP 10 攻擊來源 IP**
1. 195.191.171.12 (俄羅斯) - 1.2 Gbps
   ⚠️ 建議：永久封鎖
   
2. 200.221.12.45 (巴西) - 850 Mbps
   ⚠️ 建議：永久封鎖

3. 103.45.67.89 (越南) - 620 Mbps
   ⚠️ 建議：臨時封鎖 24 小時

4. 185.220.101.23 (俄羅斯) - 580 Mbps
   ⚠️ 建議：永久封鎖

5. 177.54.32.11 (巴西) - 450 Mbps
   ⚠️ 建議：臨時封鎖 12 小時

**封鎖策略**
- 永久封鎖：針對重複攻擊者
- 臨時封鎖：針對可疑流量
- 自動解封：24 小時後重新評估

**預計效果**
- 封鎖後預計減少 85% 攻擊流量
- 降低伺服器負載 70%
- 提升正常用戶體驗

✅ 建議立即執行批量封鎖操作
        `
        break

      case "啟用 Rate Limit":
        title = "Rate Limiting 配置建議"
        content = `
⚡ **智能 Rate Limiting 配置**

**當前流量分析**
- 正常流量：3.5 Gbps
- 攻擊流量：2.8 Gbps (持續下降中)
- 峰值封包速率：8.5 Mpps

**建議的 Rate Limit 配置**

**1. 全域限制**
- 總請求數：10,000 req/min
- 總帶寬：5 Gbps
- 超限動作：臨時封鎖 15 分鐘

**2. 單 IP 限制**
- 請求數：100 req/min
- 帶寬：50 Mbps
- 連接數：50 concurrent
- 超限動作：封鎖 30 分鐘

**3. 地理位置限制**
- 高風險地區：50 req/min per IP
- 一般地區：100 req/min per IP
- 白名單地區：無限制

**4. 協議限制**
- UDP：1000 pps per IP
- TCP SYN：500 pps per IP
- ICMP：100 pps per IP

**預期效果**
- 阻擋 90% 的異常流量
- 保護正常用戶訪問
- 降低伺服器負載 80%

⚙️ 建議立即啟用智能 Rate Limiting
        `
        break

      default:
        title = "AI 助手"
        content = "正在分析中..."
    }

    setAiSuggestion({
      show: true,
      title,
      content,
    })
  }

  const renderAISuggestionSection = () => (
    <AnimatePresence>
      {aiSuggestion.show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mt-4"
        >
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{aiSuggestion.title}</h3>
              </div>
              <button
                onClick={() => setAiSuggestion({ show: false, title: "", content: "" })}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
                  {aiSuggestion.content}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/80 flex justify-end gap-3">
              <button
                onClick={() => setAiSuggestion({ show: false, title: "", content: "" })}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
              >
                關閉
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                執行建議
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const renderContent = () => {
    if (activeTab === "waf") {
      return (
        <>
          {/* WAF Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs font-normal text-slate-300">總安全事件</div>
              <div className="text-white font-medium text-2xl">8,452</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">已阻擋 (Blocked)</div>
              <div className="text-white font-medium text-2xl">7,980</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">僅監控 (Monitored)</div>
              <div className="text-green-400 font-medium text-2xl">472</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">阻擋率</div>
              <div className="text-green-400 font-medium text-2xl">94.4%</div>
            </motion.div>
          </div>

          {/* Event Trend & Top Rules */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Event Trend Chart */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">事件趨勢 (近24小時)</h3>

              <div className="text-xs text-slate-400 mb-4">
                Y軸: 事件數量
                <br />
                X軸: 小時
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wafEventTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Bar dataKey="blocked" stackId="a" fill="#ef4444" name="已阻擋" />
                    <Bar dataKey="monitored" stackId="a" fill="#f97316" name="僅監控" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500" />
                  <span className="text-sm text-slate-300">已阻擋 (Blocked)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500" />
                  <span className="text-sm text-slate-300">僅監控 (Monitored)</span>
                </div>
              </div>
            </motion.div>

            {/* TOP 5 Rules */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">TOP 5 觸發規則</h3>

              <div className="space-y-6">
                {topWafRules.map((rule, index) => {
                  const maxCount = topWafRules[0].count
                  const percentage = (rule.count / maxCount) * 100

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">{rule.name}</span>
                        <span className="text-sm text-white font-semibold">{rule.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: rule.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* TOP 10 Attacked URLs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">TOP 10 被攻擊的 URL</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">URL 路徑</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">攻擊類型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">事件數</th>
                  </tr>
                </thead>
                <tbody>
                  {topAttackedUrls.map((item, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-sm text-slate-300 font-mono">{item.url}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                          }}
                        >
                          {item.attackType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300 font-semibold">{item.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )
    }

    if (activeTab === "ddos") {
      return (
        <>
          {/* DDoS Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md px-5 py-5"
            >
              <div className="mb-2 text-xs font-normal text-slate-300">當前狀態</div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="text-red-400 font-medium text-xl">攻擊緩解中</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md px-5 py-5"
            >
              <div className="mb-2 text-xs text-slate-300">攻擊峰值 (近1小時)</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-white font-medium text-2xl">8.2</div>
                <div className="text-lg text-white">Gbps</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md px-5 py-5"
            >
              <div className="mb-2 text-xs text-slate-300">已清洗流量</div>
              <div className="flex items-baseline gap-2 mb-2 font-extralight">
                <div className="text-3xl text-red-400 font-medium">6.5</div>
                <div className="text-lg text-red-400">Gbps</div>
              </div>
              <div className="text-xs text-red-400">狀態: 繼續中</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md px-5 py-5"
            >
              <div className="mb-2 text-xs text-slate-300">攔截率</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-green-400 font-medium text-2xl">99.8%</div>
              </div>
              <div className="text-xs text-green-400">狀態: 極佳</div>
            </motion.div>
          </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Attack Type & Protocol Analysis */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">攻擊類型與協議分佈</h3>

              <div className="grid grid-cols-2 gap-8">
                {/* Attack Type Pie Chart */}
                <div>
                  <div className="text-sm text-slate-400 mb-4 text-center">攻擊類型圓餅圖</div>
                  <div style={{ width: "100%", height: "192px" }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={attackTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {attackTypeData.map((entry, index) => (
                            <Cell key={`attack-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "0px solid #334155",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {attackTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-semibold" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Protocol Pie Chart */}
                <div>
                  <div className="text-sm text-slate-400 mb-4 text-center">流量協議圓餅圖</div>
                  <div style={{ width: "100%", height: "192px" }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={protocolData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {protocolData.map((entry, index) => (
                            <Cell key={`protocol-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {protocolData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-semibold" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Packet Rate Trend */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">封包速率趨勢 (近1小時)</h3>

              <div className="text-xs text-slate-400 mb-4">Y軸: Mpps (百萬封包/秒)</div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={packetRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                      formatter={(value: number) => [`${value} Mpps`, ""]}
                      labelFormatter={(label) => `時間: ${label} 分鐘`}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 text-xs text-slate-400">顯示傳入的惡意封包速率，對於分析非流量型攻擊至關重要。</div>
            </motion.div>
          </div>

          {/* TOP 10 Attack Source IPs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
          >
            <h3 className="text-white mb-4 font-normal">TOP 10 攻擊來源 IP</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">IP 位址</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">地理位置</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">攻擊流量</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {topAttackIPs.map((item, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-sm text-slate-300">{item.ip}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">
                        <span className="mr-2">{item.flag}</span>
                        {item.country}
                      </td>
                      <td className="py-3 px-4 text-sm text-red-400 font-semibold">{item.traffic}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors">
                            永久封鎖
                          </button>
                          <button className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors">
                            解除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* AI Assistant Actions */}
        </>
      )
    }

    // ADDED CODE START
    if (activeTab === "cdn") {
      return (
        <>
          {/* CDN Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs font-normal text-slate-300">總傳輸流量</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-white font-medium text-2xl">25.8</div>
                <div className="text-lg text-white">TB</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">總請求數</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-white font-medium text-2xl">1.2</div>
                <div className="text-lg text-white">億</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">快取命中率 (流量)</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-white font-medium text-2xl">98.5%</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">節省頻寬</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-green-400 font-medium text-2xl">25.4</div>
                <div className="text-lg text-green-400">TB</div>
              </div>
            </motion.div>
          </div>

          {/* Latency Map & HTTP Status */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Global Latency Map */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">全球平均延遲 (P95 Latency)</h3>

              <div ref={cdnMapContainerRef} className="h-64 bg-slate-950/50 rounded-lg overflow-hidden mb-4" />

              <div className="text-xs text-slate-400 mb-3">
                地圖上用不同顏色標示各區域的連線延遲，例如綠色(快)、黃色(中)、紅色(慢)。
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-slate-300">{"< 50ms"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-slate-300">50-150ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-slate-300">{"> 150ms"}</span>
                </div>
              </div>
            </motion.div>

            {/* HTTP Status Distribution */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">HTTP 狀態碼分佈</h3>

              <div style={{ width: "100%", height: "192px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={httpStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {httpStatusData.map((entry, index) => (
                        <Cell key={`status-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {httpStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: item.color }}>
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Traffic & Request Trend */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">流量與請求數趨勢 (近24小時)</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis
                    yAxisId="left"
                    stroke="#3b82f6"
                    tick={{ fill: "#3b82f6", fontSize: 10 }}
                    label={{ value: "流量 (TB)", angle: -90, position: "insideLeft", fill: "#3b82f6" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    tick={{ fill: "#10b981", fontSize: 10 }}
                    label={{ value: "請求數 (百萬)", angle: 90, position: "insideRight", fill: "#10b981" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "traffic" ? `${value} TB` : `${value} 百萬`,
                      name === "traffic" ? "流量" : "請求數",
                    ]}
                    labelFormatter={(label) => `時間: ${label} 時`}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="traffic"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    name="traffic"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="requests"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="requests"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-xs text-slate-400">幫助使用者觀察流量尖峰與請求數的關係。</div>
          </motion.div>
        </>
      )
    }
    // ADDED CODE END

    // Overview tab content
    return (
      <>
        {/* Alert Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-950/30 border border-red-500/50 p-6 mb-6 rounded-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-red-400 font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-xs bg-red-500/20 px-2 py-1 rounded">REQUIRES ATTENTION</span>
                </h3>
                <h4 className="text-white font-semibold mb-2">
                  偵測到大規模 DDoS 攻擊 (Large-Scale DDoS Attack Detected)
                </h4>
                <p className="text-slate-300 text-sm">
                  系統已自動啟動緩解機制，當前攻擊峰值 <span className="text-red-400 font-semibold">8.2 Gbps</span>
                  ，主要類型為 UDP Flood，源伺服器仍正常運作。
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex-shrink-0">
              查看即時攻擊詳情
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs font-normal text-slate-300">DDoS 清洗流量 (Inbound)</div>
            <div className="flex items-baseline gap-2 mb-2 font-extralight">
              <div className="text-3xl font-medium text-green-400">6.5</div>
              <div className="text-lg text-green-400">Gbps</div>
            </div>
            <div className="text-xs text-green-400">狀態: 繼續中</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs text-slate-300">WAF 已阻擋威脅 (近1小時)</div>
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-3xl text-white font-medium">1,280</div>
              <div className="flex items-center gap-1 text-orange-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">150%</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs text-slate-300">CDN 快取命中率 (Cache Hit)</div>
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-3xl text-green-400 font-medium">98.5%</div>
            </div>
            <div className="text-xs text-green-400">狀態: 極佳</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs text-slate-300">源伺服器錯誤率 (5xx)</div>
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-3xl text-green-400 font-medium">0.01%</div>
            </div>
            <div className="text-xs text-green-400">狀態: 穩定</div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Traffic Analysis Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">即時流量分析 (近60分鐘)</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorClean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    label={{ value: "時間 (分鐘)", position: "insideBottom", offset: -5, fill: "#94a3b8" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    label={{ value: "流量 (Gbps)", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} Gbps`,
                      name === "attack" ? "攻擊流量" : "正常流量",
                    ]}
                    labelFormatter={(label) => `時間: ${label} 分鐘`}
                  />
                  <Area
                    type="monotone"
                    dataKey="attack"
                    stackId="1"
                    stroke="#ef4444"
                    fill="url(#colorAttack)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="clean"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="url(#colorClean)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-300">攻擊流量 (Attack Traffic)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-300">正常流量 (Clean Traffic)</span>
              </div>
            </div>

            {/* AI Insight */}
            <div className="mt-4 text-xs text-cyan-400">
              AI 洞察: 攻擊流量在 15 分鐘前達到峰值，目前已趨於平緩，清洗中心已有效過濾 99.8% 的惡意流量。
            </div>
          </motion.div>

          {/* Global Attack Sources with MapLibre */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">全球攻擊來源 (近1小時)</h3>

            <div ref={mapContainerRef} className="h-64 bg-slate-950/50 rounded-lg overflow-hidden mb-4" />

            {/* TOP 3 Sources */}
            <div>
              <div className="text-sm text-slate-400 mb-3">TOP 3 來源:</div>
              <div className="space-y-2">
                {attackSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-sm text-slate-300">
                        {index + 1}. {source.country}
                      </span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: source.color }}>
                      ({source.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#08131D] p-8">
      {/* Top Navigation Tabs */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 mb-6 rounded-md"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${
              activeTab === tab.id
                ? "bg-white text-black"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.sublabel && <span className="ml-2 text-xs opacity-70">({tab.sublabel})</span>}
          </button>
        ))}
      </motion.div>

      {renderContent()}
    </div>
  )
}
