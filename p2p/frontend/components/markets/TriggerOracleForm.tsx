import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import { walletClientToSigner } from '@/utils/walletClientToSigner';
import { getP2PMarketContract, getP2POracleControllerContract } from '@/utils/contracts';
import { Order, OrderStatus, TriggerOrderFormData } from '@/types';

interface TriggerOracleFormProps {
  order: Order;
  onSuccess?: () => void;
}

export default function TriggerOracleForm({ order, onSuccess }: TriggerOracleFormProps) {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const signer = walletClientToSigner(walletClient);
      const oracleController = getP2POracleControllerContract(signer);

      // Call the oracle controller with 0.1 ETH payment
      const tx = await oracleController.addTrigger(
        order.id,
        { value: ethers.utils.parseEther('0.1') }
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      setSuccess('Oracle trigger successfully initiated! The order will be resolved once the oracle confirms the result.');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error triggering oracle:', err);
      setError(err.message || 'Failed to trigger oracle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show for funded orders
  if (order.status !== OrderStatus.Funded) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6">Trigger Oracle Verification</h2>
      
      <div className="mb-4">
        <p className="text-gray-300 mb-2">
          Trigger the oracle to verify and resolve this order. 
          This will cost 0.1 ETH to cover oracle fees.
        </p>
        <p className="text-yellow-300 text-sm mb-4">
          Note: The oracle will check the boolean result configured in the environment 
          and complete the token transfer if the result is true.
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-500 bg-opacity-30 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 bg-green-500 bg-opacity-30 border border-green-500 rounded text-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full crypto-button py-2"
        >
          {isSubmitting ? 'Triggering Oracle...' : 'Trigger Oracle (0.1 ETH)'}
        </button>
      </form>
    </div>
  );
}