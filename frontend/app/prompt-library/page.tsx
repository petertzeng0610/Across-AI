"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PromptLibraryRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/prompt-library/cloudflare")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#08131D]">
      <div className="text-white">正在載入...</div>
    </div>
  )
}
