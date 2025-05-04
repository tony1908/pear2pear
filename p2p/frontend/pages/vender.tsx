"use client"

import { Button } from "@/components/ui/Button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import MotionWrapper from "@/components/motion-wrapper"
import FooterWarning from "@/components/footer-warning"
import MainMenu from "@/components/main-menu"
import { Card } from "@/components/ui/Card"

export default function VenderPage() {
  return (
    <div className="px-4 pb-20">
      <AppHeader title="Vender cripto" backUrl="/inicio" />
      
      <MotionWrapper>
        <div className="flex justify-center mb-8">
          <div className="h-32 w-32 flex items-center justify-center">
            <span className="text-6xl">🚧</span>
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-medium mb-4 text-center">Próximamente</h2>
          <p className="text-muted-foreground text-center mb-4">
            La funcionalidad de venta estará disponible en la próxima actualización.
          </p>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <p className="text-sm text-amber-700">
              Estamos trabajando para implementar un sistema de venta seguro y descentralizado 
              con verificación de pagos a través de comprobantes CEP.
            </p>
          </div>
          
          <Button className="w-full" asChild>
            <Link href="/inicio">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Link>
          </Button>
        </Card>
      </MotionWrapper>
      
      <MainMenu />
      <FooterWarning />
    </div>
  )
} 