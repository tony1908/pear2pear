import React, { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useWalletClient } from 'wagmi';
import Card from '@/components/ui/Card';
import { Order, OrderStatus } from '@/types';
import TriggerOracleForm from '@/components/markets/TriggerOracleForm';
import { ethers } from 'ethers';
import { P2P_MARKET_ADDRESS, P2P_ORACLE_CONTROLLER_ADDRESS, TOKEN_ADDRESS } from '@/utils/env';
import { getP2PMarketContract, getP2POracleControllerContract, getERC20Contract } from '@/utils/contracts';
import { walletClientToSigner } from '@/utils/walletClientToSigner';

export default function AdminPage() {
  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [faucetAmount, setFaucetAmount] = useState('10');
  const [faucetStatus, setFaucetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [faucetError, setFaucetError] = useState('');
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  
  // Function to fetch funded orders that need oracle verification
  const fetchPendingOrders = async () => {
    if (!publicClient) return;
    
    try {
      setIsLoading(true);
      
      // Only proceed if we have the market address
      if (!P2P_MARKET_ADDRESS) {
        console.warn("P2P Market address not found in environment variables");
        setIsLoading(false);
        return;
      }
      
      const provider = new ethers.providers.Web3Provider(
        publicClient.transport as any
      );
      
      // Create contract instance
      const marketContract = getP2PMarketContract(provider);
      
      // Get the next order ID
      const nextOrderId = await marketContract.nextOrderId();
      
      // Fetch all funded orders
      const funded: Order[] = [];
      
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
          
          // Only include funded orders that need oracle verification
          if (order.status === OrderStatus.Funded) {
            funded.push(order);
          }
        } catch (err) {
          console.warn(`Failed to fetch order ${i}:`, err);
        }
      }
      
      setPendingOrders(funded);
      
      // Reset selected order if it's no longer in the list
      if (selectedOrder && !funded.find(order => order.id === selectedOrder.id)) {
        setSelectedOrder(null);
      }
      
    } catch (err) {
      console.error("Error fetching orders:", err);
      setPendingOrders([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPendingOrders();
  }, [publicClient]);

  useEffect(() => {
    if (address) {
      fetchCurrentBalance();
    }
  }, [address, publicClient]);
  
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const handleResolveOrder = async (orderId: string, result: boolean) => {
    if (!walletClient || !P2P_ORACLE_CONTROLLER_ADDRESS) return;
    
    try {
      const signer = walletClientToSigner(walletClient);
      const oracleContract = getP2POracleControllerContract(signer);
      
      // Call the oracle controller to add a trigger for this order
      const tx = await oracleContract.addTrigger(orderId, {
        value: ethers.utils.parseEther("0.1")  // Standard payment for trigger
      });
      
      await tx.wait();
      
      // Refresh orders list after resolution
      fetchPendingOrders();
      
      return true;
    } catch (error) {
      console.error("Error resolving order:", error);
      return false;
    }
  };

  const fetchCurrentBalance = async () => {
    if (!address || !publicClient) return;
    
    try {
      setIsBalanceLoading(true);
      const balance = await publicClient.getBalance({ address });
      setCurrentBalance(ethers.utils.formatEther(ethers.BigNumber.from(balance.toString())));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setCurrentBalance(null);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const handleMintTokens = async () => {
    if (!walletClient || !address || !TOKEN_ADDRESS) return;
    
    try {
      const signer = walletClientToSigner(walletClient);
      const tokenContract = getERC20Contract(TOKEN_ADDRESS, signer);
      
      // Mint 100 tokens for testing
      const tx = await tokenContract.mint(address, ethers.utils.parseEther("100"));
      await tx.wait();
      
      // Success notification could be added here
      alert("Successfully minted 100 test tokens!");
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Failed to mint tokens. See console for details.");
    }
  };

  const handleFaucetRequest = async () => {
    if (!address) return;
    
    try {
      setFaucetStatus('loading');
      setFaucetError('');
      
      // Convert amount to wei (1 ETH = 10^18 wei)
      const amountInWei = ethers.utils.parseEther(faucetAmount).toHexString();
      
      // Call anvil_setBalance RPC method
      const result = await publicClient.transport.request({
        method: 'anvil_setBalance',
        params: [address, amountInWei]
      });

      console.log("Balance set via anvil_setBalance:", result);
      
      setFaucetStatus('success');
      
      // Update the balance display after setting new balance
      fetchCurrentBalance();
    } catch (error: any) {
      console.error('Faucet error:', error);
      setFaucetStatus('error');
      setFaucetError(error.message || 'Failed to set balance');
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        <p className="text-gray-400 mb-6">
          This page allows you to manage P2P order transactions and interact with the oracle.
          In a production system, the oracle process would be automated.
        </p>
      </div>
      
      {!isConnected ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-xl mb-6">Please connect your wallet</p>
            <p className="text-gray-400">You need to connect an Ethereum wallet to access admin functions.</p>
          </div>
        </Card>
      ) : (
        <>
          {/* ETH Faucet Section */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Testnet ETH Faucet</h2>
            
            <div className="mb-4">
              <p className="text-gray-400 mb-2">Your current balance:</p>
              {isBalanceLoading ? (
                <div className="animate-pulse bg-gray-700 h-6 w-24 rounded"></div>
              ) : (
                <p className="text-lg font-mono">{currentBalance ? `${currentBalance} ETH` : 'Unknown'}</p>
              )}
            </div>
            
            <div className="flex items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="faucet-amount" className="block text-sm font-medium text-gray-400 mb-1">
                  ETH Amount
                </label>
                <input
                  id="faucet-amount"
                  type="number"
                  value={faucetAmount}
                  onChange={(e) => setFaucetAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.1"
                  step="0.1"
                />
              </div>
              
              <button
                onClick={handleFaucetRequest}
                disabled={faucetStatus === 'loading' || !faucetAmount}
                className="crypto-button"
              >
                {faucetStatus === 'loading' ? 'Setting...' : 'Set Balance'}
              </button>
            </div>
            
            {faucetStatus === 'error' && (
              <div className="mt-2 p-2 text-red-400 bg-red-900/20 rounded">
                {faucetError || 'An error occurred. Try again later.'}
              </div>
            )}
            
            {faucetStatus === 'success' && (
              <div className="mt-2 p-2 text-green-400 bg-green-900/20 rounded">
                Balance successfully updated!
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={handleMintTokens}
                className="crypto-button bg-purple-600 hover:bg-purple-700"
              >
                Mint Test Tokens
              </button>
              <p className="text-xs text-gray-400 mt-2">
                This will mint 100 test tokens to your address for testing P2P transfers.
              </p>
            </div>
          </Card>
          
          {/* Oracle Resolution Section */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Verify P2P Orders</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No funded orders pending verification.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4 mb-2 text-sm text-gray-400 pb-2 border-b border-gray-700">
                  <div>Order ID</div>
                  <div>Maker</div>
                  <div>Taker</div>
                </div>
                
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleOrderSelect(order)}
                    className={`grid grid-cols-3 gap-4 p-3 rounded cursor-pointer ${
                      selectedOrder?.id === order.id
                        ? 'bg-blue-900/30 border border-blue-600'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-mono">#{order.id}</div>
                    <div className="font-mono text-sm truncate">{order.maker.substring(0, 10)}...</div>
                    <div className="font-mono text-sm truncate">{order.taker.substring(0, 10)}...</div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedOrder && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="font-semibold mb-4">Order Details</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Maker</div>
                    <div className="font-mono text-sm truncate">{selectedOrder.maker}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Taker</div>
                    <div className="font-mono text-sm truncate">{selectedOrder.taker}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Amount</div>
                    <div>{ethers.utils.formatEther(selectedOrder.amount)} ETH</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Status</div>
                    <div>{OrderStatus[selectedOrder.status]}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleResolveOrder(selectedOrder.id, true)}
                    className="crypto-button bg-green-600 hover:bg-green-700"
                  >
                    Verify as Authentic
                  </button>
                  
                  <button
                    onClick={() => handleResolveOrder(selectedOrder.id, false)}
                    className="crypto-button bg-red-600 hover:bg-red-700"
                  >
                    Mark as Fraudulent
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 mt-4">
                  Note: Triggering the oracle will cost 0.1 ETH to pay for the oracle service.
                  In a production environment, this would be done by an automated system.
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
