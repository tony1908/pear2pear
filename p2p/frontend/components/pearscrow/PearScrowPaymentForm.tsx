import React, { useState } from 'react';
import { ethers } from 'ethers';
import { usePearScrow } from '@/utils/hooks/usePearScrow';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

interface PearScrowPaymentFormProps {
  tokenAddress: string;
  sellerAddress: string;
  onSuccess?: () => void;
}

export function PearScrowPaymentForm({
  tokenAddress,
  sellerAddress,
  onSuccess
}: PearScrowPaymentFormProps) {
  const { address, isConnected } = useAccount();
  const { 
    createOrder, 
    createOrderTx, 
    releaseOrder, 
    releaseOrderTx 
  } = usePearScrow();

  const [amount, setAmount] = useState<string>('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStep, setOrderStep] = useState<'initial' | 'created' | 'completed'>('initial');

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  // Handle the "Continuar a Pago" button click
  const handleCreateOrder = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Create the order
      const tx = await createOrder(tokenAddress, sellerAddress, amountInWei);
      
      if (tx) {
        // Get the order ID from the transaction receipt
        const receipt = await tx.wait();
        const event = receipt.events?.find((e: any) => e.event === 'OrderCreated');
        
        if (event && event.args) {
          const newOrderId = event.args.orderId;
          setOrderId(newOrderId);
          setOrderStep('created');
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. See console for details.');
    }
  };

  // Handle the "Enviar Comprobante" button click
  const handleReleaseOrder = async () => {
    if (!orderId) {
      alert('No order has been created yet');
      return;
    }

    try {
      // Release the order with a positive result
      await releaseOrder(orderId, true);
      setOrderStep('completed');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error releasing order:', error);
      alert('Failed to release order. See console for details.');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {orderStep === 'initial'
            ? 'Make a Payment'
            : orderStep === 'created'
            ? 'Confirm Payment'
            : 'Payment Completed'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {orderStep === 'initial'
            ? 'Enter the amount and proceed to payment'
            : orderStep === 'created'
            ? 'Send proof of payment to complete the transaction'
            : 'Your payment has been successfully processed'}
        </p>
      </div>

      {orderStep === 'initial' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              id="amount"
              name="amount"
              label="Amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.0"
            />
          </div>

          <Button
            onClick={handleCreateOrder}
            disabled={createOrderTx.isLoading}
            className="w-full"
          >
            {createOrderTx.isLoading ? 'Processing...' : 'Continuar a Pago'}
          </Button>
        </div>
      )}

      {orderStep === 'created' && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
            <p className="text-sm">
              Order created successfully! Order ID: {orderId?.substring(0, 10)}...
            </p>
          </div>

          <Button
            onClick={handleReleaseOrder}
            disabled={releaseOrderTx.isLoading}
            className="w-full"
          >
            {releaseOrderTx.isLoading ? 'Processing...' : 'Enviar Comprobante'}
          </Button>
        </div>
      )}

      {orderStep === 'completed' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
          <p className="text-sm">Transaction completed successfully!</p>
        </div>
      )}

      {(createOrderTx.isError || releaseOrderTx.isError) && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">
            {createOrderTx.error?.message || releaseOrderTx.error?.message || 'An error occurred'}
          </p>
        </div>
      )}
    </div>
  );
} 