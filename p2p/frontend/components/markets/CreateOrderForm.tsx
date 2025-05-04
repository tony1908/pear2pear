import React, { useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { CreateOrderFormData } from '@/types';
import { walletClientToSigner } from '@/utils/walletClientToSigner';
import { getP2PMarketContract, getERC20Contract } from '@/utils/contracts';
import { useWalletClient } from 'wagmi';
import { TOKEN_ADDRESS } from '@/utils/env';

interface CreateOrderFormProps {
  onSuccess?: (orderId: string) => void;
}

export default function CreateOrderForm({ onSuccess }: CreateOrderFormProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [formData, setFormData] = useState<CreateOrderFormData>({
    taker: '',
    token: TOKEN_ADDRESS,
    amount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const signer = walletClientToSigner(walletClient);
      const marketContract = getP2PMarketContract(signer);

      // Check if taker address is valid
      if (!ethers.utils.isAddress(formData.taker)) {
        setError('Invalid taker address');
        setIsSubmitting(false);
        return;
      }

      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(formData.amount);

      // Create the order
      const tx = await marketContract.createOrder(
        formData.taker,
        formData.token,
        amountInWei
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Get the OrderCreated event from the transaction receipt
      const event = receipt.events?.find(
        (e: any) => e.event === 'OrderCreated'
      );

      if (event && event.args) {
        const orderId = event.args.orderId.toString();
        
        if (onSuccess) {
          onSuccess(orderId);
        } else {
          // Navigate to the order details page
          router.push(`/orders/${orderId}`);
        }
      }
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create P2P Token Transfer Order</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="taker" className="block text-sm font-medium">
            Recipient Address
          </label>
          <input
            id="taker"
            name="taker"
            type="text"
            required
            value={formData.taker}
            onChange={handleChange}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>
          <div className="flex">
            <input
              id="amount"
              name="amount"
              type="text"
              required
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.0"
              className="w-full px-4 py-2 bg-gray-700 rounded-l border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="inline-flex items-center px-3 py-2 rounded-r border border-l-0 border-gray-600 bg-gray-600">
              ETH
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500 bg-opacity-30 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full crypto-button py-2"
        >
          {isSubmitting ? 'Creating...' : 'Create Order'}
        </button>
      </form>
    </div>
  );
} 