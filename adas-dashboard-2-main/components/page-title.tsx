import type React from "react"

interface PageTitleProps {
  children: React.ReactNode
  className?: string
  highlightText?: string
}

export function PageTitle({ children, className = "", highlightText }: PageTitleProps) {
  if (highlightText) {
    // 如果有高亮文字，將其分開處���
    const parts = String(children).split(highlightText)
    return (
      <h1 className={`text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl ${className}`}>
        {parts[0]}
        <span style={{ color: "#0D99FF" }}>{highlightText}</span>
        {parts.length > 1 ? parts[1] : ""}
      </h1>
    )
  }

  return <h1 className={`text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl ${className}`}>{children}</h1>
}
