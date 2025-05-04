"use client"

import AppHeader from '@/components/app-header';
import FooterWarning from '@/components/footer-warning';
import MainMenu from '@/components/main-menu';
import MotionWrapper from '@/components/motion-wrapper';
import { Card } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

type TransactionStatus = "completada" | "pendiente" | "cancelada"

interface Transaction {
  id: string
  type: "compra" | "venta"
  amount: string
  token: string
  date: string
  status: TransactionStatus
  counterparty: string
}

export default function HistorialPage() {
  const [activeTab, setActiveTab] = useState("todas")
  
  const transactions: Transaction[] = [
    {
      id: "TX-7639",
      type: "compra",
      amount: "500.00",
      token: "USDC",
      date: "20/09/2023 14:32",
      status: "completada",
      counterparty: "@marifer"
    },
    {
      id: "TX-7624",
      type: "compra",
      amount: "750.00",
      token: "MXNB",
      date: "15/09/2023 09:15",
      status: "completada",
      counterparty: "@pear_master"
    },
    {
      id: "TX-7618",
      type: "compra",
      amount: "200.00",
      token: "USDC",
      date: "10/09/2023 18:45",
      status: "cancelada",
      counterparty: "@carlos"
    },
    {
      id: "TX-7609",
      type: "venta",
      amount: "100.00",
      token: "MXNB",
      date: "05/09/2023 11:20",
      status: "pendiente",
      counterparty: "@lucia"
    }
  ]
  
  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case "completada":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "pendiente":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "cancelada":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    }
  }
  
  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case "completada":
        return "Completada"
      case "pendiente":
        return "Pendiente"
      case "cancelada":
        return "Cancelada"
    }
  }
  
  const filteredTransactions = 
    activeTab === "todas" 
      ? transactions 
      : transactions.filter(tx => 
          activeTab === "compras" ? tx.type === "compra" : tx.type === "venta"
        )
  
  return (
    <div className="container mx-auto max-w-md p-4 mb-24">
      <AppHeader title="Historial" />
      
      <MotionWrapper>
        <Tabs defaultValue="todas" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="compras">Compras</TabsTrigger>
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todas" className="mt-4">
            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <Card key={tx.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{tx.type === "compra" ? "Compra" : "Venta"} de {tx.token}</h3>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(tx.status)}`}>
                        {getStatusText(tx.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {tx.type === "compra" ? "De" : "A"}: {tx.counterparty}
                      </span>
                      <span className="font-semibold">{tx.amount} {tx.token}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-muted-foreground">No hay transacciones para mostrar</p>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="compras" className="mt-4">
            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <Card key={tx.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Compra de {tx.token}</h3>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(tx.status)}`}>
                        {getStatusText(tx.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        De: {tx.counterparty}
                      </span>
                      <span className="font-semibold">{tx.amount} {tx.token}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-muted-foreground">No hay compras para mostrar</p>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="ventas" className="mt-4">
            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <Card key={tx.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Venta de {tx.token}</h3>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(tx.status)}`}>
                        {getStatusText(tx.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        A: {tx.counterparty}
                      </span>
                      <span className="font-semibold">{tx.amount} {tx.token}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-muted-foreground">No hay ventas para mostrar</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </MotionWrapper>
      
      <MainMenu />
      <FooterWarning />
    </div>
  );
} 