import { useState } from 'react';
import { NextPage } from 'next';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { ApproveTokensForm } from '@/components/tokens/ApproveTokensForm';

// Simplified demo modes
type DemoMode = 'buyer' | 'seller';

// Example token addresses (replace with actual token addresses)
const TOKEN_ADDRESSES = {
  USDC: '0x4C0e81CcABd6EF3D7559CC49e4d7A1B67B4fC0F4',
  USDT: '0x1C7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  DAI: '0x8F3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
};

const SimplePearScrowDemo: NextPage = () => {
  const { isConnected } = useAccount();
  const [mode, setMode] = useState<DemoMode | null>(null);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Simple PearScrow Demo</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Demostración del contrato SimplePearScrow (versión simplificada)
          </p>
          
          <div className="mt-4 flex justify-center">
            <ConnectButton />
          </div>
        </div>
        
        {!isConnected ? (
          <Card className="p-5 mb-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <p className="mb-4">Por favor conecta tu wallet para continuar</p>
          </Card>
        ) : !mode ? (
          <Card className="p-5 mb-6">
            <h2 className="text-lg font-medium mb-4">Selecciona tu rol</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Este contrato permite transacciones P2P usando un sistema de escrow simplificado.
              Cada participante tiene un rol específico. Por favor selecciona tu rol:
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => setMode('buyer')}
                className="w-full mb-2"
              >
                Comprador <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => setMode('seller')}
                className="w-full"
              >
                Vendedor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : mode === 'seller' ? (
          <>
            <Card className="p-5 mb-6">
              <h2 className="text-lg font-medium mb-4">Modo Vendedor</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Como vendedor, debes aprobar tokens para que el contrato pueda transferirlos
                cuando un comprador finaliza una orden. 
              </p>
              
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Importante</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      A diferencia del contrato original, esta versión simplificada no mantiene 
                      balances internos. En cambio, comprueba directamente el balance y la 
                      aprobación de tokens.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setMode(null)}
                className="w-full mt-2"
              >
                Volver a Selección de Rol
              </Button>
            </Card>
            
            <ApproveTokensForm tokenAddress={TOKEN_ADDRESSES.USDC} />
          </>
        ) : (
          <>
            <Card className="p-5 mb-6">
              <h2 className="text-lg font-medium mb-4">Modo Comprador</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Como comprador, puedes crear órdenes dirigidas a vendedores específicos. 
              </p>
              
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Importante</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Para crear una orden, el vendedor debe tener suficiente balance de tokens y 
                      haber aprobado al contrato para transferir esos tokens.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setMode(null)}
                className="w-full mt-2"
              >
                Volver a Selección de Rol
              </Button>
            </Card>
            
            <Button 
              onClick={() => window.location.href = '/comprar'}
              className="w-full"
            >
              Ir al Flujo de Compra Normal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
        
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
          <h2 className="text-lg font-bold mb-2">Sobre Este Contrato</h2>
          <p className="mb-2">
            SimplePearScrow es una versión simplificada del contrato PearScrow original con las siguientes diferencias:
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>No mantiene balances internos para vendedores</li>
            <li>Comprueba directamente el balance de tokens del vendedor</li>
            <li>Requiere que el vendedor apruebe tokens para que el contrato pueda transferirlos</li>
            <li>Las transferencias ocurren solo cuando se libera la orden</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SimplePearScrowDemo; 