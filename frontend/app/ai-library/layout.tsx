"use client"

import type React from "react"

const brands = [
  { name: "Cloudflare", logo: "/logos/Cloudflar.png", href: "/ai-library/cloudflare", disabled: false },
  { name: "Palo Alto", logo: "/logos/palo-alto-networks-1.png", href: "#", disabled: true },
  { name: "F5", logo: "/logos/f5_b.png", href: "#", disabled: true },
  { name: "CATO", logo: "/logos/cato-networks.png", href: "#", disabled: true },
  { name: "Intezer", logo: "/logos/INTEZER_logo.png", href: "#", disabled: true },
  { name: "CyCraft", logo: "/logos/craftai.png", href: "#", disabled: true },
]

export default function AILibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
