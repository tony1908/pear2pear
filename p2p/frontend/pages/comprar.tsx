"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Globe, Coins, Check, AlertCircle } from "lucide-react"
import AppHeader from "@/components/app-header"
import StepIndicator from "@/components/step-indicator"
import MotionWrapper from "@/components/motion-wrapper"
import NetworkSelector from "@/components/network-selector"
import TokenSelector from "@/components/token-selector"
import SellerSelector from "@/components/seller-selector"
import FooterWarning from "@/components/footer-warning"
import MainMenu from "@/components/main-menu"
import Input from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { useSimplePearScrow } from "@/utils/hooks/useSimplePearScrow"
import { ethers } from "ethers"

export default function ComprarPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [network, setNetwork] = useState("arbitrum")
  const [token, setToken] = useState("usdc")
  const [seller, setSeller] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cbu")
  const [isNextStepDisabled, setIsNextStepDisabled] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  
  // PearScrow contract hook
  const { 
    createOrder, 
    createOrderTx,
    fetchFixedAmount,
    fixedAmount 
  } = useSimplePearScrow()

  // Fetch fixed amount on component mount
  useEffect(() => {
    fetchFixedAmount()
  }, [fetchFixedAmount])
  
  // Map network IDs to display names and icons
  const networkInfo = {
    arbitrum: { name: "Arbitrum", icon: "🔵" },
    scroll: { name: "Scroll", icon: "🟣" },
    mantle: { name: "Mantle", icon: "🟢" }
  }
  
  // Get network display name
  const getNetworkName = () => {
    return networkInfo[network as keyof typeof networkInfo]?.name || network
  }
  
  // Get network icon
  const getNetworkIcon = () => {
    return networkInfo[network as keyof typeof networkInfo]?.icon || "🌐"
  }
  
  const totalSteps = 4 // Reduced from 5 since amount is fixed
  
  // Validate each step
  useEffect(() => {
    if (currentStep === 1) {
      setIsNextStepDisabled(!network || !token)
    } else if (currentStep === 2) {
      setIsNextStepDisabled(!seller)
    } else if (currentStep === 3) {
      setIsNextStepDisabled(!paymentMethod || isCreatingOrder)
    } else {
      setIsNextStepDisabled(false)
    }
  }, [currentStep, network, token, seller, paymentMethod, isCreatingOrder])
  
  // Update to disable button when transaction is pending
  useEffect(() => {
    setIsCreatingOrder(createOrderTx.isLoading)
    if (createOrderTx.isError && createOrderTx.error) {
      setOrderError(createOrderTx.error.message)
    }
    
    // If order creation was successful and we're on step 3, redirect to the CEP page
    if (createOrderTx.hash && currentStep === 3) {
      router.push({
        pathname: "/subir-cep",
        query: { 
          orderId: createOrderTx.hash,
          network,
          token,
          amount: "10" // Fixed amount of 10 tokens
        }
      })
    }
  }, [createOrderTx, currentStep, router, network, token])
  
  const handleNetworkChange = (value: string) => {
    setNetwork(value)
    // Reset token when network changes
    setToken("")
  }
  
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === totalSteps - 1) {
      handleCreateOrder()
    }
  }
  
  const handleCreateOrder = async () => {
    setOrderError(null)
    setIsCreatingOrder(true)
    
    try {
      // Map token to actual token address (this is a simplified example)
      // In a real app, you'd have a mapping of tokens to their addresses per network
      const tokenAddresses: {[key: string]: string} = {
        usdc: "0x4C0e81CcABd6EF3D7559CC49e4d7A1B67B4fC0F4",
        usdt: "0x1C7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        dai: "0x8F3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        mxnb: "0x82B9e52b26A2954E113F94Ff26647754d5a4247D"
      }
      
      // Get token address and ensure it has the correct checksum format
      const tokenAddress = tokenAddresses[token as keyof typeof tokenAddresses]
      if (!tokenAddress) {
        throw new Error("Invalid token selected")
      }
      
      // Create order using SimplePearScrow contract - note we no longer need to specify the amount
      await createOrder(tokenAddress)
      
    } catch (error) {
      console.error("Error creating order:", error)
      setOrderError(error instanceof Error ? error.message : "Error creating order")
      setIsCreatingOrder(false)
    }
  }
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Selecciona red y token"
      case 2:
        return "Elige un vendedor"
      case 3:
        return "Método de pago"
      default:
        return "Comprar cripto"
    }
  }
  
  return (
    <div className="px-4 pb-20">
      <AppHeader title={renderStepTitle()} onBack={currentStep > 1 ? handlePrevStep : undefined} />
      
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      {/* Step 1: Select Network and Token */}
      {currentStep === 1 && (
        <MotionWrapper>
          <Card className="p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Red blockchain</h3>
              </div>
              {network && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full flex items-center text-sm font-medium">
                  <span className="mr-1">{getNetworkIcon()}</span> {getNetworkName()}
                </span>
              )}
            </div>
            
            <NetworkSelector
              selectedNetwork={network}
              onSelect={handleNetworkChange}
            />
            
            <div className="flex items-center justify-between mb-4 mt-6">
              <div className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Criptomoneda</h3>
              </div>
              {token && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {token.toUpperCase()}
                </span>
              )}
            </div>
            
            <TokenSelector
              network={network}
              selectedToken={token}
              onSelect={(value) => setToken(value)}
            />
          </Card>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {isNextStepDisabled ? (
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>Selecciona red y token para continuar</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  <span>Todo listo para continuar</span>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleNextStep} 
            className="w-full" 
            size="lg"
            disabled={isNextStepDisabled}
          >
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </MotionWrapper>
      )}
      
      {/* Step 2: Select Seller */}
      {currentStep === 2 && (
        <MotionWrapper>
          <Card className="p-5 mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Vendedores disponibles</h3>
              <div className="flex gap-2">
                <SimpleTooltip content={getNetworkName()}>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full flex items-center text-sm">
                    {getNetworkIcon()}
                  </span>
                </SimpleTooltip>
                <SimpleTooltip content="Token seleccionado">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {token.toUpperCase()}
                  </span>
                </SimpleTooltip>
              </div>
            </div>
            
            <SellerSelector
              network={network}
              token={token}
              selectedSeller={seller}
              onSelect={(value) => setSeller(value)}
            />
          </Card>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {isNextStepDisabled ? (
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>Selecciona un vendedor para continuar</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  <span>Vendedor seleccionado correctamente</span>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleNextStep} 
            className="w-full" 
            size="lg"
            disabled={isNextStepDisabled}
          >
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </MotionWrapper>
      )}
      
      {/* Step 3: Payment Method and Review */}
      {currentStep === 3 && (
        <MotionWrapper>
          <div className="mb-6">
            <h3 className="form-label mb-4">Método de pago</h3>
            
            <div className="flex flex-col space-y-3">
              {[
                { id: "cbu", name: "Transferencia", icon: "🏦", description: "Pago mediante transferencia bancaria" },
              ].map((method) => (
                <Card
                  key={method.id}
                  className="p-4 cursor-pointer"
                  style={{
                    background: paymentMethod === method.id 
                      ? "linear-gradient(145deg, hsl(20, 30%, 94%), hsl(20, 30%, 90%))"
                      : "white",
                    boxShadow:
                      paymentMethod === method.id
                        ? "inset 3px 3px 7px var(--shadow-inner-dark), inset -2px -2px 5px var(--shadow-inner-light)"
                        : "4px 4px 8px var(--shadow-outer-dark), -4px -4px 8px var(--shadow-outer-light)",
                    borderLeft: paymentMethod === method.id ? "4px solid var(--primary)" : "none"
                  }}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{method.icon}</span>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="ml-auto">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Resumen de la orden</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-muted-foreground">Red:</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">
                      {getNetworkIcon()}
                    </span>
                    <span className="font-medium">{getNetworkName()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-muted-foreground">Token:</span>
                  <span className="font-medium">{token.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-muted-foreground">Monto:</span>
                  <span className="font-medium">10 {token.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Método de pago:</span>
                  <span className="font-medium">{
                    paymentMethod === "cbu" ? "Transferencia" :
                    paymentMethod === "cash" ? "Efectivo" : "Mercado Pago"
                  }</span>
                </div>
              </div>
            </Card>
          </div>
          
          {orderError && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error al crear la orden</p>
                  <p className="text-xs text-red-700 mt-1">{orderError}</p>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleNextStep} 
            className="w-full" 
            size="lg"
            disabled={isNextStepDisabled}
          >
            {isCreatingOrder ? (
              <span className="flex items-center">
                Procesando <span className="ml-2 animate-pulse">...</span>
              </span>
            ) : (
              <span className="flex items-center">
                Continuar a pago <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </MotionWrapper>
      )}
      
      <MainMenu />
      <FooterWarning />
    </div>
  )
} 