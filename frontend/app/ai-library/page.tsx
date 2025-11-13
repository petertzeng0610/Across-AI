"use client"

import { useState } from "react"
import Link from "next/link"
import { Marketplace, type AIModule } from "@/components/marketplace"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layers, Box, ArrowLeft } from "lucide-react"

// Default modules that appear in the dropdown
export const defaultModules: AIModule[] = [
  {
    id: "default-vllm",
    name: "Default (VLLM)",
    version: "1.0.0",
    description: "vLLM 預設模組，高效能的大型語言模型推理引擎",
    size: "5 GB",
    category: "語言模型",
    performance: "高性能",
    provider: "vLLM Team",
    isDefaultModule: true,
    type: "LLM Runtime",
    tags: ["高效能", "開源", "GPU 加速", "推理引擎"],
  },
]

export const availableModules: AIModule[] = [
  {
    id: "tade-ai",
    name: "TADE-AI",
    version: "1.0.0",
    description: "TADE-AI 智能模型，提供先進的 AI 解決方案",
    size: "30 GB",
    category: "語言模型",
    performance: "高性能",
    provider: "TADE",
    type: "AI Platform",
  },
  {
    id: "gpt-oss20b",
    name: "GPT-OSS20b",
    version: "1.0.0",
    description: "開源的 20B 參數語言模型，適用於多種自然語言處理任務",
    size: "40 GB",
    category: "語言模型",
    performance: "高性能",
    provider: "OpenSource AI",
  },
  {
    id: "qwen2.5",
    name: "Qwen2.5",
    version: "2.5.0",
    description: "通義千問 2.5，強大的多語言理解與生成能力",
    size: "15 GB",
    category: "語言模型",
    performance: "高性能",
    provider: "Alibaba Cloud",
  },
  {
    id: "llama3-70b",
    name: "LLaMA 3 70B",
    version: "3.0.0",
    description: "Meta 開發的 70B 參數大型語言模型，卓越的推理能力",
    size: "140 GB",
    category: "語言模型",
    performance: "極高性能",
    provider: "Meta",
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    version: "0.2.0",
    description: "輕量級但功能強大的 7B 模型，適合資源受限環境",
    size: "14 GB",
    category: "語言模型",
    performance: "中等性能",
    provider: "Mistral AI",
  },
  {
    id: "claude-instant",
    name: "Claude Instant",
    version: "1.2.0",
    description: "快速響應的對話模型，平衡性能與速度",
    size: "25 GB",
    category: "對話模型",
    performance: "高性能",
    provider: "Anthropic",
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    version: "1.0.0",
    description: "高質量圖像生成模型，支援多種藝術風格",
    size: "6.9 GB",
    category: "圖像生成",
    performance: "高性能",
    provider: "Stability AI",
  },
  {
    id: "whisper-large",
    name: "Whisper Large",
    version: "3.0.0",
    description: "準確的語音識別模型，支援 99 種語言",
    size: "3 GB",
    category: "語音識別",
    performance: "高性能",
    provider: "OpenAI",
  },
  {
    id: "codellama-34b",
    name: "CodeLlama 34B",
    version: "2.0.0",
    description: "專為程式碼生成和理解優化的模型",
    size: "68 GB",
    category: "程式碼生成",
    performance: "高性能",
    provider: "Meta",
  },
]

export default function AILibraryPage() {
  const [selectedModule, setSelectedModule] = useState<string>("default-vllm")
  const [installedModules, setInstalledModules] = useState<string[]>(["gpt-oss20b", "qwen2.5"])
  const [allModules, setAllModules] = useState<AIModule[]>(availableModules)

  const handleInstall = (moduleId: string) => {
    setInstalledModules((prev) => [...prev, moduleId])
  }

  const handleUninstall = (moduleId: string) => {
    setInstalledModules((prev) => prev.filter((id) => id !== moduleId))
    if (selectedModel === moduleId) {
      const remainingModels = installedModelsList.filter((m) => m.id !== moduleId)
      setSelectedModel(remainingModels.length > 0 ? remainingModels[0].id : "")
    }
  }

  const handleAddModule = (module: AIModule) => {
    setAllModules((prev) => [...prev, module])
    setInstalledModules((prev) => [...prev, module.id])
  }

  const installedModelsList = allModules.filter((m) => installedModules.includes(m.id))

  const [selectedModel, setSelectedModel] = useState<string>(
    installedModelsList.length > 0 ? installedModelsList[0].id : "",
  )

  return (
    <div className="min-h-screen bg-[#08131D]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-white text-2xl font-medium">AI 模組管理平台</h1>
          </div>
          <p className="text-slate-400">瀏覽、安裝和管理您的 AI 模型</p>
        </div>

        {/* Module Selector */}
        <Card className="p-6 mb-8 bg-slate-800/50 border-slate-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="size-5 text-cyan-400" />
              <h2 className="text-xl text-white font-normal">模組選擇</h2>
            </div>
            <div className="max-w-2xl">
              <Label htmlFor="module-select" className="text-slate-300 mb-2 block">
                當前使用模組
              </Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger
                  id="module-select"
                  className="bg-slate-700/50 border-slate-600 text-white hover:border-cyan-400/50"
                >
                  <SelectValue placeholder="選擇模組" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {defaultModules.map((module) => (
                    <SelectItem
                      key={module.id}
                      value={module.id}
                      className="text-white focus:bg-slate-700 focus:text-white"
                    >
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Module Details */}
              {(() => {
                const currentModule = defaultModules.find((m) => m.id === selectedModule)
                return currentModule ? (
                  <div className="mt-4 space-y-3">
                    <p className="text-slate-400">{currentModule.description}</p>

                    {/* Module Type */}
                    {currentModule.type && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                          {currentModule.type}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : null
              })()}
            </div>
          </div>
        </Card>

        {/* Installed Models Selector */}
        <Card className="p-6 mb-8 bg-slate-800/50 border-slate-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Box className="size-5 text-cyan-400" />
              <h2 className="text-xl text-white font-normal">已安裝模型</h2>
              <span className="text-slate-400 ml-auto">共 {installedModelsList.length} 個模型</span>
            </div>
            <div className="max-w-md">
              <Label htmlFor="model-select" className="text-slate-300 mb-2 block">
                選擇模型
              </Label>
              {installedModelsList.length > 0 ? (
                <>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger
                      id="model-select"
                      className="bg-slate-700/50 border-slate-600 text-white hover:border-cyan-400/50"
                    >
                      <SelectValue placeholder="選擇模型" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {installedModelsList.map((model) => (
                        <SelectItem
                          key={model.id}
                          value={model.id}
                          className="text-white focus:bg-slate-700 focus:text-white"
                        >
                          {model.name} - {model.version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-slate-400 mt-2">
                    {installedModelsList.find((m) => m.id === selectedModel)?.description}
                  </p>
                </>
              ) : (
                <p className="text-slate-400">尚未安裝任何模型，請從下方模組市集安裝</p>
              )}
            </div>
          </div>
        </Card>

        {/* Module Marketplace */}
        <div>
          <h2 className="text-2xl text-white mb-4 font-medium">模型市集</h2>
          <Marketplace
            modules={allModules}
            installedModules={installedModules}
            onInstall={handleInstall}
            onUninstall={handleUninstall}
            onAddModule={handleAddModule}
          />
        </div>

        <div className="flex justify-center mt-12 mb-8">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-slate-100 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回 Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
