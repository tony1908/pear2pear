"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Calendar, CircleHelp, AlertCircle, Check } from "lucide-react"
import AppHeader from "@/components/app-header"
import MotionWrapper from "@/components/motion-wrapper"
import FooterWarning from "@/components/footer-warning"
import MainMenu from "@/components/main-menu"
import Input from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { useSimplePearScrow } from "@/utils/hooks/useSimplePearScrow"
import { ethers } from "ethers"

export default function SubirCEPPage() {
  const router = useRouter()
  const { orderId, network, token, amount } = router.query
  
  const [paymentDate, setPaymentDate] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [senderBank, setSenderBank] = useState("")
  const [receiverBank, setReceiverBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [destinationBank, setDestinationBank] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // PearScrow contract hook
  const { releaseOrder, releaseOrderTx } = useSimplePearScrow()
  
  // Validate form
  useEffect(() => {
    setIsFormValid(
      !!paymentDate && 
      !!referenceNumber && 
      !!paymentAmount
    )
  }, [paymentDate, referenceNumber, paymentAmount])
  
  // Track transaction state
  useEffect(() => {
    setIsSubmitting(releaseOrderTx.isLoading)
    
    if (releaseOrderTx.isError && releaseOrderTx.error) {
      setError(releaseOrderTx.error.message)
    }
    
    if (releaseOrderTx.isSuccess) {
      // Redirect to completion page
      router.push({
        pathname: "/orden-completada",
        query: { 
          txHash: releaseOrderTx.hash,
          network,
          token,
          amount
        }
      })
    }
  }, [releaseOrderTx, router, network, token, amount])
  
  // Initialize payment amount from query param if available
  useEffect(() => {
    if (amount && typeof amount === 'string') {
      // For demo purposes: simulating a fiat amount that's roughly worth the token amount
      // In a real app, you'd use an oracle to get the actual exchange rate
      const fiatAmount = 10; // example rate
      setPaymentAmount(fiatAmount.toFixed(oderID));
    }
  }, [amount])
  
  const handleSubmit = async () => {
    if (!isFormValid || !orderId || typeof orderId !== 'string') {
      setError("Por favor completa todos los campos obligatorios o la orden no es válida");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Convert orderId to BigNumber since SimplePearScrow uses uint256
      const orderIdBN = ethers.BigNumber.from(3);
      
      // Call the smart contract to release the order
      // The true parameter indicates a successful payment verification
      await releaseOrder(orderIdBN, true);
      
      // Note: the redirect happens in the useEffect that watches releaseOrderTx.isSuccess
    } catch (err) {
      console.error("Error releasing order:", err);
      setError(err instanceof Error ? err.message : "Error al procesar el comprobante");
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="px-4 pb-20">
      <AppHeader title="Subir comprobante" backUrl="/comprar" />
      
      <MotionWrapper>
        {orderId ? (
          <>
            <div className="mb-4">
              <Card className="p-4 mb-4">
                <h3 className="font-medium mb-2">Resumen de la orden</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Red:</span>
                    <span className="font-medium">{network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token:</span>
                    <span className="font-medium">{token && typeof token === 'string' ? token.toUpperCase() : token}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto:</span>
                    <span className="font-medium">{amount} {token && typeof token === 'string' ? token.toUpperCase() : token}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID de orden:</span>
                    <span className="font-medium truncate max-w-[160px]">{orderId}</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="p-5 mb-6">
              <h2 className="text-lg font-medium mb-4">Datos del comprobante</h2>
              
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="flex items-center mb-1">
                    Fecha de pago <span className="text-primary ml-1">*</span>
                    <div className="relative ml-1">
                      <CircleHelp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </label>
                  <div className="relative">
                    <Input
                      id="paymentDate"
                      name="paymentDate"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      placeholder="dd/mm/yyyy"
                      required
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center mb-1">
                    Número de referencia <span className="text-primary ml-1">*</span>
                    <div className="relative ml-1">
                      <CircleHelp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </label>
                  <Input
                    id="referenceNumber"
                    name="referenceNumber"
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="123456789"
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-1">Institución emisora</label>
                  <Input
                    id="senderBank"
                    name="senderBank"
                    type="text"
                    value={senderBank}
                    onChange={(e) => setSenderBank(e.target.value)}
                    placeholder="BBVA, Banorte, etc."
                  />
                </div>
                
                <div>
                  <label className="mb-1">Institución receptora</label>
                  <Input
                    id="receiverBank"
                    name="receiverBank"
                    type="text"
                    value={receiverBank}
                    onChange={(e) => setReceiverBank(e.target.value)}
                    placeholder="AFIRME, STP, etc."
                  />
                </div>
                
                <div>
                  <label className="mb-1">Cuenta beneficiaria</label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01234567890123456"
                  />
                </div>
                
                <div>
                  <label className="mb-1">Banco destino</label>
                  <Input
                    id="destinationBank"
                    name="destinationBank"
                    type="text"
                    value={destinationBank}
                    onChange={(e) => setDestinationBank(e.target.value)}
                    placeholder="AFIRME, STP, etc."
                  />
                </div>
                
                <div>
                  <label className="flex items-center mb-1">
                    Monto (MXN) <span className="text-primary ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="paymentAmount"
                      name="paymentAmount"
                      type="text"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="100.00"
                      required
                      className="pl-7"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Importante: Los campos marcados con <span className="text-primary">*</span> son obligatorios. El comprobante será verificado antes de liberar los fondos.</p>
              </div>
            </Card>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {!isFormValid ? (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>Completa los campos obligatorios</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    <span>Comprobante listo para enviar</span>
                  </div>
                )}
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error al procesar</p>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              size="lg"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  Procesando <span className="ml-2 animate-pulse">...</span>
                </span>
              ) : (
                <span className="flex items-center">
                  Enviar comprobante <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </>
        ) : (
          <Card className="p-5 mb-6">
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-lg font-medium mb-2">Orden no encontrada</h3>
                <p className="text-muted-foreground mb-4">No se ha encontrado información de la orden. Por favor, inicia el proceso de compra nuevamente.</p>
                <Button onClick={() => router.push('/comprar')}>
                  Volver a compra
                </Button>
              </div>
            </div>
          </Card>
        )}
      </MotionWrapper>
      
      <MainMenu />
      <FooterWarning />
    </div>
  )
} 