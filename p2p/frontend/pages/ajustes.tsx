"use client"

import AppHeader from '@/components/app-header';
import FooterWarning from '@/components/footer-warning';
import MainMenu from '@/components/main-menu';
import MotionWrapper from '@/components/motion-wrapper';
import { Card } from "@/components/ui/Card"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function AjustesPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [biometrics, setBiometrics] = useState(false)
  
  return (
    <div className="container mx-auto max-w-md p-4 mb-24">
      <AppHeader title="Ajustes" />
      
      <MotionWrapper>
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-medium mb-4">Preferencias</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo oscuro</p>
                <p className="text-sm text-muted-foreground">Activar tema oscuro</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones</p>
                <p className="text-sm text-muted-foreground">Recibir alertas de órdenes</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticación biométrica</p>
                <p className="text-sm text-muted-foreground">Para transacciones</p>
              </div>
              <Switch checked={biometrics} onCheckedChange={setBiometrics} />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-medium mb-4">Cuenta</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dirección de wallet</p>
                <p className="text-xs font-mono text-muted-foreground">0x742d...8f44e</p>
              </div>
              <button className="text-primary text-sm">Copiar</button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nivel de usuario</p>
                <p className="text-sm text-muted-foreground">Regular</p>
              </div>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Nivel 1</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Soporte</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Centro de ayuda</p>
                <p className="text-sm text-muted-foreground">Preguntas frecuentes y guías</p>
              </div>
              <span className="text-primary">→</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Contactar soporte</p>
                <p className="text-sm text-muted-foreground">Abrir un ticket</p>
              </div>
              <span className="text-primary">→</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Versión de la app</p>
                <p className="text-sm text-muted-foreground">v0.1.0-beta</p>
              </div>
            </div>
          </div>
        </Card>
      </MotionWrapper>
      
      <MainMenu />
      <FooterWarning />
    </div>
  );
} 