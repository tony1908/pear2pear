import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import { walletClientToSigner } from '@/utils/walletClientToSigner';
import { getP2PMarketContract, getERC20Contract } from '@/utils/contracts';
import { Order, OrderStatus } from '@/types';

interface FundOrderFormProps {
  order: Order;
  onSuccess?: () => void;
}

export default function FundOrderForm({ order, onSuccess }: FundOrderFormProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState('TOKEN');
  const [allowance, setAllowance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [needsApproval, setNeedsApproval] = useState(false);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!walletClient || !order.token) return;
      
      try {
        const signer = walletClientToSigner(walletClient);
        const tokenContract = getERC20Contract(order.token, signer);
        
        // Get token symbol
        const symbol = await tokenContract.symbol();
        setTokenSymbol(symbol);
        
        // Check allowance for the P2P market contract
        if (address) {
          const marketContract = getP2PMarketContract(signer);
          const currentAllowance = await tokenContract.allowance(
            address,
            marketContract.address
          );
          setAllowance(currentAllowance);
          setNeedsApproval(currentAllowance.lt(order.amount));
        }
      } catch (err) {
        console.error('Error fetching token details:', err);
      }
    };
    
    fetchTokenDetails();
  }, [walletClient, order, address]);

  const handleApprove = async () => {
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const signer = walletClientToSigner(walletClient);
      const tokenContract = getERC20Contract(order.token, signer);
      const marketContract = getP2PMarketContract(signer);

      // Approve tokens
      const tx = await tokenContract.approve(
        marketContract.address,
        order.amount
      );

      // Wait for transaction to be mined
      await tx.wait();
      
      // Update allowance
      const newAllowance = await tokenContract.allowance(
        address,
        marketContract.address
      );
      setAllowance(newAllowance);
      setNeedsApproval(newAllowance.lt(order.amount));
      
    } catch (err: any) {
      console.error('Error approving tokens:', err);
      setError(err.message || 'Failed to approve tokens');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFund = async () => {
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const signer = walletClientToSigner(walletClient);
      const marketContract = getP2PMarketContract(signer);

      // Fund the order
      const tx = await marketContract.fundOrder(order.id);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error funding order:', err);
      setError(err.message || 'Failed to fund order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only maker can fund the order
  if (address !== order.maker) {
    return null;
  }

  // Only show funding options for orders in Created state
  if (order.status !== OrderStatus.Created) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6">Fund this Order</h2>
      
      <div className="mb-4">
        <p className="text-gray-300 mb-2">
          You need to fund this order with {ethers.utils.formatEther(order.amount)} {tokenSymbol} 
          to make it active.
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-500 bg-opacity-30 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {needsApproval ? (
        <button
          onClick={handleApprove}
          disabled={isSubmitting}
          className="w-full crypto-button py-2"
        >
          {isSubmitting ? 'Approving...' : `Approve ${tokenSymbol} for Transfer`}
        </button>
      ) : (
        <button
          onClick={handleFund}
          disabled={isSubmitting}
          className="w-full crypto-button py-2"
        >
          {isSubmitting ? 'Funding...' : 'Fund Order'}
        </button>
      )}
    </div>
  );
} 