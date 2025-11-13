"use client"

import { motion } from "framer-motion"
import { Server, SettingsIcon } from "lucide-react"

export default function F5LtmSettingsPage() {
  return (
    <div className="min-h-screen bg-[#08131D] p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">LTM 設定</h1>
        <p className="text-slate-400">配置 Local Traffic Manager 負載均衡設定</p>
      </motion.div>

      <div className="space-y-6">
        {/* Load Balancing Methods */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5" />
            負載均衡方法
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-white font-medium mb-2">Round Robin</div>
              <div className="text-sm text-slate-400">依序分配請求到每個伺服器</div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-white font-medium mb-2">Least Connections</div>
              <div className="text-sm text-slate-400">將請求分配到連接數最少的伺服器</div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-white font-medium mb-2">IP Hash</div>
              <div className="text-sm text-slate-400">根據客戶端 IP 進行一致性雜湊</div>
            </div>
          </div>
        </motion.div>

        {/* Health Monitors */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            健康檢查設定
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">檢查間隔</div>
              <div className="text-white font-medium">5 秒</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">超時時間</div>
              <div className="text-white font-medium">16 秒</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">重試次數</div>
              <div className="text-white font-medium">3 次</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">檢查類型</div>
              <div className="text-white font-medium">HTTP</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
