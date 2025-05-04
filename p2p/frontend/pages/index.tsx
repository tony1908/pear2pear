import React, { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { ethers, BigNumber } from "ethers";
import OrderGrid from "@/components/markets/OrderGrid";
import { Order, OrderStatus } from "@/types";
import { FaPlus, FaFilter, FaSync } from "react-icons/fa";
import Link from "next/link";
import { getP2PMarketContract, getERC20Contract } from "@/utils/contracts";
import { P2P_MARKET_ADDRESS } from "@/utils/env";
import { useRouter } from 'next/router';

export default function Home() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const router = useRouter();

  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMine, setFilterMine] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch orders from the P2P market contract
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        if (!P2P_MARKET_ADDRESS) {
          console.warn(
            "P2P Market address not found in environment variables"
          );
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
        const active: Order[] = [];
        const completed: Order[] = [];
        
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
            
            // Filter by address if needed
            if (filterMine && address && 
                order.maker.toLowerCase() !== address.toLowerCase() && 
                order.taker.toLowerCase() !== address.toLowerCase()) {
              continue;
            }
            
            // Add to appropriate list based on status
            if (order.status === OrderStatus.Created || order.status === OrderStatus.Funded) {
              active.push(order);
            } else if (order.status === OrderStatus.Completed || order.status === OrderStatus.Cancelled) {
              completed.push(order);
            }
          } catch (err) {
            console.warn(`Failed to fetch order ${i}:`, err);
          }
        }
        
        setActiveOrders(active);
        setCompletedOrders(completed);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [publicClient, address, filterMine, refreshTrigger]);

  useEffect(() => {
    router.push('/inicio');
  }, [router]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Redirecting to P2P Market...</p>
      </div>
    </div>
  );
}
