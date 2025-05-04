import React from 'react';
import OrderCard from './OrderCard';
import { Order } from '@/types';

interface OrderGridProps {
  orders: Order[];
  title: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function OrderGrid({ 
  orders, 
  title, 
  emptyMessage = 'No orders found', 
  isLoading = false 
}: OrderGridProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400">{emptyMessage}</div>
          )}
        </>
      )}
    </div>
  );
} 