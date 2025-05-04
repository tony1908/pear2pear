"use client"
import { useRouter, usePathname } from "next/navigation"
import { Home, BarChart2, History, Settings, Wallet } from "lucide-react"
import Link from "next/link"

export default function MainMenu() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Inicio", path: "/inicio" },
    { icon: BarChart2, label: "Balance", path: "/balance" },
    { icon: Wallet, label: "Liquidez", path: "/liquidez" },
    { icon: History, label: "Historial", path: "/historial" },
    { icon: Settings, label: "Ajustes", path: "/ajustes" },
  ]

  return (
    <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center">
      <div
        className="flex space-x-1 rounded-full px-2 py-1"
        style={{
          background: "linear-gradient(145deg, hsl(50, 30%, 94%), hsl(50, 30%, 90%))",
          boxShadow: "4px 4px 8px var(--shadow-outer-dark), -4px -4px 8px var(--shadow-outer-light)",
        }}
      >
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon

          return (
            <Link href={item.path} key={item.path}>
              <div
                className={`flex flex-col items-center justify-center rounded-full p-2 transition-all ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(145deg, hsl(80, 40%, 70%), hsl(80, 40%, 60%))",
                        boxShadow:
                          "inset 2px 2px 5px var(--shadow-inner-dark), inset -2px -2px 5px var(--shadow-inner-light)",
                      }
                    : {}
                }
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 