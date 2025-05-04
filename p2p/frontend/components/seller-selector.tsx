"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"

interface SellerSelectorProps {
  network: string
  token: string
  onSelect: (seller: string) => void
  selectedSeller: string
}

interface Seller {
  id: string
  address: string
  alias: string
  liquidity: string
  completedOrders: number
  rating: number
}

export default function SellerSelector({ network, token, onSelect, selectedSeller }: SellerSelectorProps) {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de vendedores disponibles
    setIsLoading(true)

    // En producción, esto sería una llamada a la API o al contrato
    setTimeout(() => {
      const mockSellers: Seller[] = [
        {
          id: "seller1",
          address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          alias: "@marifer",
          liquidity: token === "usdc" ? "500.00" : "2500.00",
          completedOrders: 124,
          rating: 4.9,
        },
        {
          id: "seller2",
          address: "0x8F7d7b61D28D7eBC1e8C9f9CC5b9Bf8846c688D5",
          alias: "@carlos",
          liquidity: token === "usdc" ? "1200.00" : "5000.00",
          completedOrders: 87,
          rating: 4.7,
        },
        {
          id: "seller3",
          address: "0x3A54f23D1e5fF8b6131Db7E194104D96D1830B7A",
          alias: "@pear_master",
          liquidity: token === "usdc" ? "3000.00" : "15000.00",
          completedOrders: 256,
          rating: 4.8,
        },
      ]

      setSellers(mockSellers)
      setIsLoading(false)

      // Seleccionar automáticamente el primer vendedor si no hay ninguno seleccionado
      if (!selectedSeller && mockSellers.length > 0) {
        onSelect(mockSellers[0].id)
      }
    }, 1000)
  }, [network, token, onSelect, selectedSeller])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="mb-6">
        <h3 className="form-label mb-3">Buscando vendedores disponibles...</h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (sellers.length === 0) {
    return (
      <Card className="p-4 mb-6">
        <h3 className="form-label mb-2">No hay vendedores disponibles</h3>
        <p className="text-sm text-muted-foreground">
          No se encontraron vendedores con liquidez para {token.toUpperCase()} en {network}. Intenta con otro token o
          red.
        </p>
      </Card>
    )
  }

  return (
    <div className="mb-6">
      <motion.h3
        className="form-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Selecciona un vendedor
      </motion.h3>

      <RadioGroup value={selectedSeller} onValueChange={onSelect}>
        <motion.div className="grid gap-3" variants={containerVariants} initial="hidden" animate="show">
          {sellers.map((seller) => (
            <motion.div key={seller.id} variants={itemVariants}>
              <RadioGroupItem value={seller.id} id={seller.id} className="peer sr-only" />
              <Label
                htmlFor={seller.id}
                className="flex cursor-pointer flex-col rounded-2xl p-4 transition-all duration-300 bg-card text-card-foreground"
                style={{
                  background: "linear-gradient(145deg, hsl(20, 30%, 94%), hsl(20, 30%, 90%))",
                  boxShadow:
                    selectedSeller === seller.id
                      ? "inset 3px 3px 7px var(--shadow-inner-dark), inset -2px -2px 5px var(--shadow-inner-light)"
                      : "4px 4px 8px var(--shadow-outer-dark), -4px -4px 8px var(--shadow-outer-light)",
                  transform: selectedSeller === seller.id ? "translateY(1px)" : "translateY(0)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{seller.alias}</span>
                  <span className="text-sm bg-primary/10 px-2 py-0.5 rounded-full">⭐ {seller.rating}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {seller.address.substring(0, 6)}...{seller.address.substring(seller.address.length - 4)}
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    Liquidez: {seller.liquidity} {token.toUpperCase()}
                  </span>
                  <span>{seller.completedOrders} órdenes</span>
                </div>
              </Label>
            </motion.div>
          ))}
        </motion.div>
      </RadioGroup>
    </div>
  )
} 