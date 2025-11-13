"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Trash2, Plus, Package, X } from "lucide-react"

export interface AIModule {
  id: string
  name: string
  version: string
  description: string
  size: string
  category: string
  performance: string
  provider: string
  authName?: string
  baseUrl?: string
  contextSize?: string
  isCustom?: boolean
  isDefaultModule?: boolean
  type?: string
  tags?: string[]
}

interface MarketplaceProps {
  modules: AIModule[]
  installedModules: string[]
  onInstall: (moduleId: string) => void
  onUninstall: (moduleId: string) => void
  onAddModule: (module: AIModule) => void
}

export function Marketplace({ modules, installedModules, onInstall, onUninstall, onAddModule }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newModule, setNewModule] = useState({
    name: "",
    moduleType: "",
    authName: "",
    baseUrl: "",
    contextSize: "",
  })

  const categories = ["全部", "語言模型", "對話模型", "圖像生成", "語音識別", "程式碼生成"]

  const moduleTypes = ["語言模型", "對話模型", "圖像生成", "語音識別", "程式碼生成", "其他"]

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || module.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddCustomModule = () => {
    if (!newModule.name || !newModule.moduleType) return

    const customModule: AIModule = {
      id: `custom-${Date.now()}`,
      name: newModule.name,
      version: "1.0.0",
      description: `自訂模組：${newModule.name}`,
      size: "未知",
      category: newModule.moduleType,
      performance: "未知",
      provider: "Custom",
      authName: newModule.authName,
      baseUrl: newModule.baseUrl,
      contextSize: newModule.contextSize,
      isCustom: true,
    }

    onAddModule(customModule)
    setIsAddDialogOpen(false)
    setNewModule({ name: "", moduleType: "", authName: "", baseUrl: "", contextSize: "" })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="搜尋模組..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              新增模型
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2A3441] border-slate-700 text-white max-w-2xl">
            <DialogHeader className="relative pb-4 border-b border-slate-700">
              <DialogTitle className="text-2xl font-bold text-white">新增模型</DialogTitle>
              <p className="text-slate-400 mt-2 text-sm">填寫以下資訊以新增您的自訂 AI 模組</p>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="absolute right-0 top-0 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              {/* Module Name */}
              <div className="space-y-2">
                <Label htmlFor="module-name" className="text-white text-base">
                  模型名稱 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="module-name"
                  placeholder="例如：GPT-4"
                  value={newModule.name}
                  onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                  className="bg-[#3A4556] border-slate-600 text-white placeholder:text-slate-500 h-12 rounded-lg"
                />
              </div>

              {/* Module Type */}
              <div className="space-y-2">
                <Label htmlFor="module-type" className="text-white text-base">
                  模型類型 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newModule.moduleType}
                  onValueChange={(value) => setNewModule({ ...newModule, moduleType: value })}
                >
                  <SelectTrigger id="module-type" className="bg-[#3A4556] border-slate-600 text-white h-12 rounded-lg">
                    <SelectValue placeholder="選擇模組類型" className="text-slate-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {moduleTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white focus:bg-slate-700 focus:text-white">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-white text-lg font-semibold mb-4">模型認證</h3>

                {/* Authorization Name */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="auth-name" className="text-white text-base">
                    授權名稱
                  </Label>
                  <Input
                    id="auth-name"
                    placeholder="例如：API Key"
                    value={newModule.authName}
                    onChange={(e) => setNewModule({ ...newModule, authName: e.target.value })}
                    className="bg-[#3A4556] border-slate-600 text-white placeholder:text-slate-500 h-12 rounded-lg"
                  />
                </div>

                {/* Base URL */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="base-url" className="text-white text-base">
                    Base URL
                  </Label>
                  <Input
                    id="base-url"
                    placeholder="例如：https://api.example.com/v1"
                    value={newModule.baseUrl}
                    onChange={(e) => setNewModule({ ...newModule, baseUrl: e.target.value })}
                    className="bg-[#3A4556] border-slate-600 text-white placeholder:text-slate-500 h-12 rounded-lg"
                  />
                </div>

                {/* Module Context Size */}
                <div className="space-y-2">
                  <Label htmlFor="context-size" className="text-white text-base">
                    Module Context Size
                  </Label>
                  <Input
                    id="context-size"
                    placeholder="例如：8192"
                    value={newModule.contextSize}
                    onChange={(e) => setNewModule({ ...newModule, contextSize: e.target.value })}
                    className="bg-[#3A4556] border-slate-600 text-white placeholder:text-slate-500 h-12 rounded-lg"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700 px-8"
                >
                  取消
                </Button>
                <Button
                  onClick={handleAddCustomModule}
                  disabled={!newModule.name || !newModule.moduleType}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新增
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => {
          const isInstalled = installedModules.includes(module.id)

          return (
            <Card
              key={module.id}
              className="bg-slate-800/50 border-slate-700 p-4 hover:border-cyan-400/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{module.name}</h3>
                      <p className="text-slate-400 text-xs">{module.version}</p>
                    </div>
                  </div>
                  {isInstalled && <Badge className="bg-green-500/20 text-green-400 border-green-500/30">已安裝</Badge>}
                </div>

                <p className="text-slate-400 text-xs line-clamp-2">{module.description}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                    {module.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                    {module.size}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400 text-xs">{module.provider}</span>
                  <Button
                    size="sm"
                    onClick={() => (isInstalled ? onUninstall(module.id) : onInstall(module.id))}
                    className={
                      isInstalled
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white"
                    }
                  >
                    {isInstalled ? (
                      <>
                        <Trash2 className="h-3 w-3 mr-1" />
                        解除安裝
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" />
                        安裝
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">找不到符合條件的模組</p>
        </div>
      )}
    </div>
  )
}
