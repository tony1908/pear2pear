import { useState } from 'react';
import { ethers } from 'ethers';
import { useSimplePearScrow } from '@/utils/hooks/useSimplePearScrow';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { AlertCircle, Check } from 'lucide-react';

interface ApproveTokensFormProps {
  tokenAddress: string;
  onSuccess?: () => void;
}

export function ApproveTokensForm({ tokenAddress, onSuccess }: ApproveTokensFormProps) {
  const { address, isConnected } = useAccount();
  const { approveTokens, approveTokensTx } = useSimplePearScrow();
  
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const handleApprove = async () => {
    if (!isConnected || !address) {
      setError('Por favor conecta tu wallet primero');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Por favor ingresa un monto válido');
      return;
    }
    
    try {
      setError(null);
      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Approve tokens
      await approveTokens(tokenAddress, amountInWei);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error approving tokens:', err);
      setError(err instanceof Error ? err.message : 'Error aprobando tokens');
    }
  };
  
  return (
    <Card className="p-5 mb-6">
      <h2 className="text-lg font-medium mb-4">Aprobar tokens como vendedor</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Como vendedor, debes aprobar tokens para que el contrato inteligente pueda transferirlos
        cuando un comprador completa una orden. Esta es una operación única por monto.
      </p>
      
      <div className="space-y-4">
        <Input
          id="amount"
          name="amount"
          label="Monto a aprobar"
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.0"
          required
        />
        
        {error && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {approveTokensTx.isSuccess && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-green-700">
                  Tokens aprobados exitosamente. Ahora puedes recibir órdenes hasta por {amount} tokens.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Button
          onClick={handleApprove}
          disabled={approveTokensTx.isLoading}
          className="w-full"
        >
          {approveTokensTx.isLoading ? 'Procesando...' : 'Aprobar Tokens'}
        </Button>
      </div>
    </Card>
  );
} 