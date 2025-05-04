"use client"

import { ReactNode } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/Card"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { motion } from "framer-motion"

interface NetworkInfo {
  id: string
  name: string
  icon: string
  description: string
  gasPrice?: string
}

interface NetworkSelectorProps {
  onSelect: (network: string) => void
  selectedNetwork: string
}

export default function NetworkSelector({ onSelect, selectedNetwork }: NetworkSelectorProps) {
  const networks: NetworkInfo[] = [
    { 
      id: "arbitrum", 
      name: "Arbitrum", 
      icon: "🔵", 
      description: "Rollup de capa 2 con tarifas bajas y alta seguridad",
      gasPrice: "~0.01 USD"
    },
    { 
      id: "scroll", 
      name: "Scroll", 
      icon: "🟣", 
      description: "Rollup de capa 2 con pruebas zk y compatibilidad EVM",
      gasPrice: "~0.03 USD"
    },
    { 
      id: "mantle", 
      name: "Mantle", 
      icon: "🟢", 
      description: "Capa 2 con enfoque en descentralización y tarifas bajas",
      gasPrice: "~0.005 USD"
    },
  ]

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

  const NetworkCardContent = ({ network }: { network: NetworkInfo }): ReactNode => (
    <div className="flex flex-col w-full">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{network.icon}</span>
        <span className="font-medium text-lg">{network.name}</span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{network.description}</div>
      {network.gasPrice && (
        <div className="mt-1 text-xs text-primary flex items-center">
          <span className="mr-1">Gas:</span> {network.gasPrice}
        </div>
      )}
    </div>
  )

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <motion.h3
          className="form-label mb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Selecciona la red
        </motion.h3>
        <SimpleTooltip content="La red blockchain determina la velocidad, costo y seguridad de tus transacciones.">
          <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
        </SimpleTooltip>
      </div>

      <RadioGroup value={selectedNetwork} onValueChange={onSelect}>
        <motion.div className="grid gap-4" variants={containerVariants} initial="hidden" animate="show">
          {networks.map((network) => (
            <motion.div key={network.id} variants={itemVariants}>
              <RadioGroupItem value={network.id} id={network.id} className="peer sr-only" />
              <Label
                htmlFor={network.id}
                className="flex cursor-pointer items-center rounded-2xl p-4 transition-all duration-300 bg-card border border-transparent"
                style={{
                  background: selectedNetwork === network.id 
                    ? "linear-gradient(145deg, hsl(20, 40%, 94%), hsl(20, 40%, 90%))" 
                    : "white",
                  boxShadow:
                    selectedNetwork === network.id
                      ? "inset 3px 3px 7px var(--shadow-inner-dark), inset -2px -2px 5px var(--shadow-inner-light)"
                      : "4px 4px 8px var(--shadow-outer-dark), -4px -4px 8px var(--shadow-outer-light)",
                  transform: selectedNetwork === network.id ? "translateY(1px)" : "translateY(0)",
                  borderColor: selectedNetwork === network.id ? "var(--primary)" : "transparent",
                }}
              >
                <NetworkCardContent network={network} />
                {selectedNetwork === network.id && (
                  <div className="ml-auto">
                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                  </div>
                )}
              </Label>
            </motion.div>
          ))}
        </motion.div>
      </RadioGroup>
    </div>
  )
} 