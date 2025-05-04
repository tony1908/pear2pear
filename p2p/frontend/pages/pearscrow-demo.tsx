import React from 'react';
import { NextPage } from 'next';
import { PearScrowPaymentForm } from '@/components/pearscrow/PearScrowPaymentForm';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MOCK_AVS_ADDRESS, PEARSCROW_ADDRESS } from '@/utils/constants';

const PearScrowDemo: NextPage = () => {
  const { isConnected } = useAccount();

  // For demo purposes, let's use a specific token address
  // In a real application, you would get this from your state or props
  const tokenAddress = '0x4c0e81ccABd6EF3D7559cC49e4d7A1B67B4fc0F4'; // Example token address
  
  // For demo purposes, use a fixed seller address
  // In a real application, this would come from user selection
  const sellerAddress = '0x8cF27D1A5a8189bE4BDdB261bA6B19686b89818A'; // Example seller address

  const handleSuccess = () => {
    console.log('Transaction completed successfully');
    // Here you could redirect to another page or show a success message
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">PearScrow P2P Payment Demo</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Demonstration of PearScrow smart contract integration
          </p>
          
          <div className="mt-4 flex justify-center">
            <ConnectButton />
          </div>

          <div className="mt-4 space-y-2">
            <p><strong>Contract Address:</strong> {PEARSCROW_ADDRESS}</p>
            <p><strong>AVS Address:</strong> {MOCK_AVS_ADDRESS}</p>
          </div>
        </div>

        {isConnected ? (
          <PearScrowPaymentForm
            tokenAddress={tokenAddress}
            sellerAddress={sellerAddress}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p>Please connect your wallet to continue</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Connect your wallet using the button above</li>
            <li>Enter an amount to send</li>
            <li>Click "Continuar a Pago" to create an escrow order</li>
            <li>After order creation, click "Enviar Comprobante" to release the payment</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PearScrowDemo; 