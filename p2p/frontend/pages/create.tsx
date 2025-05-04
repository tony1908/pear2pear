import React from 'react';
import { useAccount } from 'wagmi';
import CreateOrderForm from '@/components/markets/CreateOrderForm';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function CreateOrderPage() {
  const { isConnected } = useAccount();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/" passHref legacyBehavior>
          <a className="text-gray-400 hover:text-white transition-colors flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Orders
          </a>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Create P2P Order</h1>

      {!isConnected ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl mb-6">Connect your wallet to create a P2P order</p>
          <div className="inline-block crypto-button cursor-pointer">
            Connect Wallet
          </div>
        </div>
      ) : (
        <CreateOrderForm />
      )}
    </div>
  );
}
