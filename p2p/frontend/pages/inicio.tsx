"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import FooterWarning from "@/components/footer-warning"
import MainMenu from "@/components/main-menu"
import MotionWrapper from "@/components/motion-wrapper"

export default function InicioPage() {
  return (
    <div className="container mx-auto max-w-md p-4 mb-24">
      <div className="mb-8 flex justify-center">
        <span className="text-3xl font-bold">🍐2🍐</span>
      </div>
      
      <MotionWrapper>
        <div className="text-center mb-10">
          <h1 className="text-2xl font-medium">Hola, @juanito 👋</h1>
          <p className="text-muted-foreground mt-2">¿Qué quieres hacer hoy?</p>
        </div>
        
        <div className="rounded-2xl p-6 mb-10 neumorph-card">
          <div className="space-y-4">
            <Button className="w-full py-6 text-primary-foreground bg-primary hover:bg-primary/90" asChild>
              <Link href="/comprar">
                <span className="mr-2 text-xl">📈</span> Comprar Cripto
              </Link>
            </Button>
            
            <Button className="w-full py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link href="/vender">
                <span className="mr-2 text-xl">💹</span> Vender Cripto
              </Link>
            </Button>
            
            <Button className="w-full py-6 border-primary text-primary bg-transparent hover:bg-primary/10" variant="outline" asChild>
              <Link href="/balance">
                <span className="mr-2 text-xl">💼</span> Ver Mi Balance
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-center text-sm text-amber-700">
              Usa transferencias SPEI con código CEP para compras seguras
            </p>
          </div>
        </div>
      </MotionWrapper>
      
      <MainMenu />
      <FooterWarning />
    </div>
  );
} 