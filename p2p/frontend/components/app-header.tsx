"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  title: string
  showBackButton?: boolean
  onBack?: () => void
  backUrl?: string
}

export default function AppHeader({ title, showBackButton = true, onBack, backUrl = "/inicio" }: AppHeaderProps) {
  return (
    <div className="mb-4 flex items-center">
      {showBackButton && (
        <Button variant="ghost" size="icon" onClick={onBack ? onBack : undefined} className="mr-2" asChild={!onBack}>
          {onBack ? (
            <span>
              <ArrowLeft className="h-5 w-5" />
            </span>
          ) : (
            <Link href={backUrl}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
        </Button>
      )}
      <h1 className="step-title mb-0">{title}</h1>
      <Link href="/inicio" className="ml-auto">
        <span className="app-logo-small flex items-center">🍐2🍐</span>
      </Link>
    </div>
  )
} 