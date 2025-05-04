"use client"

import { useState } from "react"
import AppHeader from "@/components/app-header"
import FooterWarning from "@/components/footer-warning"
import MainMenu from "@/components/main-menu"
import MotionWrapper from "@/components/motion-wrapper"
import { Card } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BalancePage() {
  const [activeTab, setActiveTab] = useState("cripto")
  
  return (
    <div className="container mx-auto max-w-md p-4 mb-24">
      <AppHeader title="Mi Balance" />
      
      <MotionWrapper>
        <Tabs defaultValue="cripto" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cripto">Cripto</TabsTrigger>
            <TabsTrigger value="fiat">Fiat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cripto" className="mt-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Tus criptomonedas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">💵</span>
                    <div>
                      <p className="font-medium">USDC</p>
                      <p className="text-sm text-muted-foreground">Arbitrum</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">125.50</p>
                    <p className="text-sm text-muted-foreground">≈ $125.50 USD</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🇲🇽</span>
                    <div>
                      <p className="font-medium">MXNB</p>
                      <p className="text-sm text-muted-foreground">Arbitrum</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">750.00</p>
                    <p className="text-sm text-muted-foreground">≈ $44.11 USD</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-card border border-border rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Balance total:</span>
                  <span className="font-medium">$169.61 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actualizado:</span>
                  <span className="text-sm">Hace 5 minutos</span>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="fiat" className="mt-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Tu balance en monedas fiat</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🇲🇽</span>
                    <div>
                      <p className="font-medium">Pesos (MXN)</p>
                      <p className="text-sm text-muted-foreground">En tu cuenta</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">1,800.00</p>
                    <p className="text-sm text-muted-foreground">≈ $105.88 USD</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-card border border-border rounded-xl">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total en fiat:</span>
                  <span className="font-medium">$105.88 USD</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </MotionWrapper>
      
      <MainMenu />
      <FooterWarning />
    </div>
  )
} 