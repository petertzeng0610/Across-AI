"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { LoginDialog } from "./login-dialog"

const services = [
  {
    title: "WAF防禦",
    href: "/services/hiwaf",
    description: "網站應用防火牆服務，保護您的網站免受各種攻擊",
  },
  {
    title: "應用層DDoS防禦",
    href: "/services/application-defense",
    description: "防範任何規模或類型的 DDoS 攻擊",
  },
  {
    title: "全球CDN加速",
    href: "/services/cdn",
    description: "通過全球分佈的節點加速內容傳遞",
  },
]

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground font-normal">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8 bg-[rgba(10,22,40,1)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#3B82F6] text-sky-500" />
          <span className="text-xl font-normal">ADAS ONE</span>
        </Link>

        <div className="hidden md:flex ml-auto">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground font-light">
                  服務總覽
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 grid-cols-1">
                    {services.map((service) => (
                      <ListItem key={service.title} title={service.title} href={service.href}>
                        {service.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button asChild className="bg-[#EFC457] hover:bg-[#D4A947] text-black font-normal ml-4">
            <a href="/contact">聯絡我們</a>
          </Button>

          <div className="ml-4 flex items-center gap-2">
            <LoginDialog />
          </div>
        </div>

        <div className="md:hidden ml-auto flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打開選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-light hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  首頁
                </Link>
                <div className="border-t pt-4">
                  <p className="text-lg font-light mb-2">服務總覽</p>
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="block py-2 text-muted-foreground hover:text-primary font-light transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
                <Button
                  asChild
                  className="bg-[#EFC457] hover:bg-[#D4A947] text-black font-normal w-full mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  <a href="/contact">聯絡我們</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
