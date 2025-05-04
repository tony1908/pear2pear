import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount, usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import FundOrderForm from '@/components/markets/FundOrderForm';
import TriggerOracleForm from '@/components/markets/TriggerOracleForm';
import { getP2PMarketContract, getERC20Contract } from '@/utils/contracts';
import { FaArrowLeft } from 'react-icons/fa';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [order, setOrder] = useState<Order | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState('TOKEN');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !publicClient) return;

      try {
        setIsLoading(true);
        setError(null);

        // Create an ethers provider from the public client
        const provider = new ethers.providers.Web3Provider(
          publicClient.transport as any
        );

        // Get the market contract
        const marketContract = getP2PMarketContract(provider);
        
        // Get order details
        const orderData = await marketContract.getOrder(id);
        
        // Format the order data
        const formattedOrder: Order = {
          id: orderData.id.toString(),
          maker: orderData.maker,
          taker: orderData.taker,
          token: orderData.token,
          amount: orderData.amount,
          status: orderData.status,
          oracleResult: orderData.oracleResult
        };

        setOrder(formattedOrder);

        // Get token symbol
        if (formattedOrder.token) {
          const tokenContract = getERC20Contract(formattedOrder.token, provider);
          try {
            const symbol = await tokenContract.symbol();
            setTokenSymbol(symbol);
          } catch (err) {
            console.error('Error fetching token symbol:', err);
          }
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. The order may not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, publicClient]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Created:
        return (
          <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded font-medium">
            Created
          </span>
        );
      case OrderStatus.Funded:
        return (
          <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded font-medium">
            Funded
          </span>
        );
      case OrderStatus.Completed:
        return (
          <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded font-medium">
            Completed
          </span>
        );
      case OrderStatus.Cancelled:
        return (
          <span className="px-3 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded font-medium">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500 bg-opacity-20 text-gray-400 rounded font-medium">
            Unknown
          </span>
        );
    }
  };

  const handleRefresh = () => {
    router.reload();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link href="/" passHref legacyBehavior>
          <a className="text-gray-400 hover:text-white transition-colors flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Orders
          </a>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : order ? (
        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Order #{order.id}</h1>
              {getStatusBadge(order.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Amount</h3>
                  <p className="text-xl font-bold">{ethers.utils.formatEther(order.amount)} {tokenSymbol}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Token Contract</h3>
                  <p className="font-mono text-sm break-all">{order.token}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">From (Maker)</h3>
                  <p className="font-mono text-sm break-all">{order.maker}</p>
                  {address === order.maker && (
                    <span className="text-blue-400 text-xs">(You)</span>
                  )}
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">To (Taker)</h3>
                  <p className="font-mono text-sm break-all">{order.taker}</p>
                  {address === order.taker && (
                    <span className="text-blue-400 text-xs">(You)</span>
                  )}
                </div>
              </div>
            </div>

            {order.status === OrderStatus.Completed && (
              <div className="mt-6 p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg">
                <h3 className="text-green-400 font-bold mb-2">Order Completed</h3>
                <p className="text-gray-300">
                  This order has been successfully completed. The tokens have been transferred from 
                  the maker to the taker based on the oracle's verification.
                </p>
              </div>
            )}

            {order.status === OrderStatus.Cancelled && (
              <div className="mt-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                <h3 className="text-red-400 font-bold mb-2">Order Cancelled</h3>
                <p className="text-gray-300">
                  This order has been cancelled. Any funded tokens have been returned to the maker.
                </p>
              </div>
            )}
          </div>

          {/* Forms for actions */}
          {order && (
            <>
              <FundOrderForm order={order} onSuccess={handleRefresh} />
              <TriggerOracleForm order={order} onSuccess={handleRefresh} />
            </>
          )}
        </div>
      ) : null}
    </div>
  );
} 