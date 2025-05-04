import React, { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import { Order, OrderStatus } from '@/types';
import Link from 'next/link';
import OrderGrid from '@/components/markets/OrderGrid';
import { getP2PMarketContract } from '@/utils/contracts';
import { P2P_MARKET_ADDRESS } from '@/utils/env';
import Card from '@/components/ui/Card';

export default function PortfolioPage() {
  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  
  const [createdOrders, setCreatedOrders] = useState<Order[]>([]); 
  const [receivedOrders, setReceivedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isConnected || !address) {
        setCreatedOrders([]);
        setReceivedOrders([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);

        if (!P2P_MARKET_ADDRESS) {
          console.warn("P2P Market address not found in environment variables");
          setIsLoading(false);
          return;
        }

        // Create a provider from the public client
        const provider = new ethers.providers.Web3Provider(
          publicClient.transport as any
        );

        // Create contract instance
        const marketContract = getP2PMarketContract(provider);
        
        // Get the next order ID (represents the total number of orders)
        const nextOrderId = await marketContract.nextOrderId();
        
        // Fetch all orders
        const created: Order[] = [];
        const received: Order[] = [];
        
        // Loop through all order IDs
        for (let i = 1; i < nextOrderId.toNumber(); i++) {
          try {
            const orderData = await marketContract.getOrder(i);
            
            const order: Order = {
              id: orderData.id.toString(),
              maker: orderData.maker,
              taker: orderData.taker,
              token: orderData.token,
              amount: orderData.amount,
              status: orderData.status,
              oracleResult: orderData.oracleResult
            };
            
            // Filter orders made by the user or where the user is the taker
            if (order.maker.toLowerCase() === address.toLowerCase()) {
              created.push(order);
            } else if (order.taker.toLowerCase() === address.toLowerCase()) {
              received.push(order);
            }
          } catch (err) {
            console.warn(`Failed to fetch order ${i}:`, err);
          }
        }
        
        setCreatedOrders(created);
        setReceivedOrders(received);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [isConnected, address, publicClient]);
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Your P2P Orders</h1>
      
      {!isConnected ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-xl mb-6">Please connect your wallet</p>
            <p className="text-gray-400">Connect your wallet to view your P2P orders.</p>
          </div>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : createdOrders.length === 0 && receivedOrders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-xl mb-6">No orders found</p>
            <p className="text-gray-400 mb-6">You don't have any P2P orders yet.</p>
            
            <Link href="/create" passHref legacyBehavior>
              <a className="crypto-button inline-flex">
                Create New Order
              </a>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <OrderGrid
            orders={createdOrders}
            title="Orders You Created"
            emptyMessage="You haven't created any orders yet"
            isLoading={isLoading}
          />
          
          <OrderGrid
            orders={receivedOrders}
            title="Orders Sent To You"
            emptyMessage="You haven't received any orders yet"
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
