"use client"

import { useRouter } from "next/router"
import { Button } from "@/components/ui/Button"
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import AppHeader from "@/components/app-header"
import MotionWrapper from "@/components/motion-wrapper"
import MainMenu from "@/components/main-menu"
import FooterWarning from "@/components/footer-warning"

export default function OrdenCompletadaPage() {
  const router = useRouter()

  return (
    <div className="px-4 pb-20">
      <AppHeader title="Orden creada" showBackButton={false} />

      <MotionWrapper className="flex flex-col items-center justify-center py-8">
        <div className="rounded-full h-24 w-24 flex items-center justify-center mb-6 bg-primary/10">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-center">¡Tu orden ha sido creada!</h2>
        <p className="text-center text-muted-foreground mb-8">
          El comprobante CEP ha sido verificado en la blockchain y tu cripto está en camino.
        </p>

        <Card className="p-4 w-full mb-6 bg-card">
          <h3 className="font-medium mb-4">Detalles de la orden</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
                Verificado
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto:</span>
              <span>10.00 MXNB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Canal de pago:</span>
              <span>Transferencia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CEP verificado:</span>
              <span className="text-green-600">✓ Válido</span>
            </div>
          </div>
        </Card>
        

        <div className="grid grid-cols-2 gap-4 w-full">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => router.push("/inicio")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Inicio
          </Button>
          <Button 
            className="w-full" 
            onClick={() => router.push("/historial")}
          >
            Ver órdenes <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </MotionWrapper>

      <MainMenu />
      <FooterWarning />
    </div>
  )
} 