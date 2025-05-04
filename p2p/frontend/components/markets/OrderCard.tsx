import React from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { Order, OrderStatus } from '@/types';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusBadge = () => {
    switch (order.status) {
      case OrderStatus.Created:
        return (
          <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded text-xs font-bold">
            Created
          </span>
        );
      case OrderStatus.Funded:
        return (
          <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded text-xs font-bold">
            Funded
          </span>
        );
      case OrderStatus.Completed:
        return (
          <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded text-xs font-bold">
            Completed
          </span>
        );
      case OrderStatus.Cancelled:
        return (
          <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded text-xs font-bold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-400 rounded text-xs font-bold">
            Unknown
          </span>
        );
    }
  };

  return (
    <Link href={`/orders/${order.id}`} passHref legacyBehavior>
      <a className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:bg-gray-700">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-lg font-bold mb-1">
                Order #{order.id}
              </div>
              <div className="text-sm text-gray-400 mb-3">
                {getStatusBadge()}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Amount:</span>
              <span className="font-medium">
                {ethers.utils.formatEther(order.amount)} TOKENS
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">From:</span>
              <span className="font-medium truncate max-w-[180px]">
                {order.maker.substring(0, 6)}...{order.maker.substring(order.maker.length - 4)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">To:</span>
              <span className="font-medium truncate max-w-[180px]">
                {order.taker.substring(0, 6)}...{order.taker.substring(order.taker.length - 4)}
              </span>
            </div>

            {order.status === OrderStatus.Completed && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Oracle Result:</span>
                <span className="font-medium text-green-400">
                  Verified ✓
                </span>
              </div>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
} 