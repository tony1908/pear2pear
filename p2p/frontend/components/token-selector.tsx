"use client"

import { ReactNode, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { motion } from "framer-motion"

interface TokenInfo {
  id: string
  name: string
  icon: string
  description: string
  marketCap?: string
}

interface TokenSelectorProps {
  network: string
  onSelect: (token: string) => void
  selectedToken: string
}

export default function TokenSelector({ network, onSelect, selectedToken }: TokenSelectorProps) {
  // Define available tokens per network with enhanced details
  const networkTokens: Record<string, Array<TokenInfo>> = {
    arbitrum: [
      { 
        id: "usdc", 
        name: "USDC", 
        icon: "💵", 
        description: "Stablecoin respaldada por USD", 
        marketCap: "$29B"
      },
      { 
        id: "mxnb", 
        name: "MXNB", 
        icon: "🇲🇽", 
        description: "Stablecoin respaldada por pesos mexicanos", 
        marketCap: "$2.5M" 
      },
    ],
    scroll: [
      { 
        id: "usdc", 
        name: "USDC", 
        icon: "💵", 
        description: "Stablecoin respaldada por USD", 
        marketCap: "$29B"
      }
    ],
    mantle: [
      { 
        id: "usdc", 
        name: "USDC", 
        icon: "💵", 
        description: "Stablecoin respaldada por USD", 
        marketCap: "$29B"
      }
    ],
  }

  // Get tokens for the selected network
  const tokens = networkTokens[network] || []

  // Update selected token when network changes
  useEffect(() => {
    if (tokens.length > 0 && (!selectedToken || !tokens.some((t) => t.id === selectedToken))) {
      onSelect(tokens[0].id)
    }
  }, [network, tokens, selectedToken, onSelect])

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

  const TokenCardContent = ({ token }: { token: TokenInfo }): ReactNode => (
    <div className="flex flex-col w-full">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{token.icon}</span>
        <span className="font-medium text-lg">{token.name}</span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{token.description}</div>
      {token.marketCap && (
        <div className="mt-1 text-xs text-primary flex items-center">
          <span className="mr-1">Market Cap:</span> {token.marketCap}
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
          Selecciona el token
        </motion.h3>
        <SimpleTooltip content="La criptomoneda que deseas comprar. Las stablecoins mantienen un valor estable respecto a una moneda fiat.">
          <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
        </SimpleTooltip>
      </div>

      <RadioGroup value={selectedToken} onValueChange={onSelect}>
        <motion.div className="grid gap-4" variants={containerVariants} initial="hidden" animate="show">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <motion.div key={token.id} variants={itemVariants}>
                <RadioGroupItem value={token.id} id={`token-${token.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`token-${token.id}`}
                  className="flex cursor-pointer items-center rounded-2xl p-4 transition-all duration-300 bg-card border border-transparent"
                  style={{
                    background: selectedToken === token.id 
                      ? "linear-gradient(145deg, hsl(20, 40%, 94%), hsl(20, 40%, 90%))" 
                      : "white",
                    boxShadow:
                      selectedToken === token.id
                        ? "inset 3px 3px 7px var(--shadow-inner-dark), inset -2px -2px 5px var(--shadow-inner-light)"
                        : "4px 4px 8px var(--shadow-outer-dark), -4px -4px 8px var(--shadow-outer-light)",
                    transform: selectedToken === token.id ? "translateY(1px)" : "translateY(0)",
                    borderColor: selectedToken === token.id ? "var(--primary)" : "transparent",
                  }}
                >
                  <TokenCardContent token={token} />
                  {selectedToken === token.id && (
                    <div className="ml-auto">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                  )}
                </Label>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-xl text-muted-foreground">
              No hay tokens disponibles para esta red. Por favor, selecciona otra red.
            </div>
          )}
        </motion.div>
      </RadioGroup>
    </div>
  )
} 