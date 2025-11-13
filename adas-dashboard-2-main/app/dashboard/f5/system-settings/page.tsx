"use client"

import { motion } from "framer-motion"
import { Settings, Info } from "lucide-react"

export default function F5SystemSettingsPage() {
  return (
    <div className="min-h-screen bg-[#08131D] p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">系統設定</h1>
        <p className="text-slate-400">配置 F5 系統參數和管理設定</p>
      </motion.div>

      <div className="space-y-6">
        {/* System Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            系統資訊
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">主機名稱</div>
              <div className="text-white font-medium">f5-bigip-01.example.com</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">系統版本</div>
              <div className="text-white font-medium">BIG-IP 17.1.0</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">授權狀態</div>
              <div className="text-green-400 font-medium">已啟用</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">授權到期日</div>
              <div className="text-white font-medium">2025-12-31</div>
            </div>
          </div>
        </motion.div>

        {/* Network Settings */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            網路設定
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">管理 IP</div>
              <div className="text-white font-medium font-mono">192.168.1.100</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">子網路遮罩</div>
              <div className="text-white font-medium font-mono">255.255.255.0</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">預設閘道</div>
              <div className="text-white font-medium font-mono">192.168.1.1</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
