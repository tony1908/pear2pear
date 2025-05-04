import { ethers } from 'ethers';
import { useState, useCallback } from 'react';
import { 
  getSimplePearScrowContract, 
  createOrder as createOrderUtil, 
  releaseOrder as releaseOrderUtil,
  getOrder,
  getNextOrderId,
  getFixedAmount,
  Order
} from '../simplePearscrow';
import { useAccount, usePublicClient } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { walletClientToSigner } from '../walletClientToSigner';

/**
 * Interface for transaction responses
 */
interface TransactionResponse {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: string | null;
  reset: () => void;
}

/**
 * React hook to interact with the SimplePearScrow contract
 */
export function useSimplePearScrow() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [createOrderTx, setCreateOrderTx] = useState<TransactionResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: null,
    reset: () => setCreateOrderTx({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
      reset: createOrderTx.reset
    })
  });

  const [releaseOrderTx, setReleaseOrderTx] = useState<TransactionResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: null,
    reset: () => setReleaseOrderTx({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
      reset: releaseOrderTx.reset
    })
  });

  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<Error | null>(null);
  const [nextOrderId, setNextOrderId] = useState<ethers.BigNumber | null>(null);
  const [fixedAmount, setFixedAmount] = useState<ethers.BigNumber | null>(null);

  /**
   * Creates a new order in the SimplePearScrow escrow system
   * @param tokenAddress - Address of the token used for payment
   */
  const createOrder = useCallback(async (tokenAddress: string) => {
    if (!walletClient) {
      const error = new Error('Wallet client not available');
      setCreateOrderTx({
        ...createOrderTx,
        isError: true,
        error,
      });
      return;
    }

    setCreateOrderTx({
      ...createOrderTx,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
    });

    try {
      const signer = walletClientToSigner(walletClient);
      const tx = await createOrderUtil(signer, tokenAddress);
      
      setCreateOrderTx({
        ...createOrderTx,
        isLoading: true,
        hash: tx.hash,
      });

      await tx.wait();
      
      setCreateOrderTx({
        ...createOrderTx,
        isLoading: false,
        isSuccess: true,
      });

      return tx;
    } catch (error) {
      setCreateOrderTx({
        ...createOrderTx,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [walletClient, createOrderTx]);

  /**
   * Releases an order with the associated orderId
   * @param orderId - Sequential order ID (uint256)
   * @param result - Result from the AVS (typically true for success)
   */
  const releaseOrder = useCallback(async (
    orderId: ethers.BigNumberish,
    result: boolean = true
  ) => {
    if (!walletClient) {
      const error = new Error('Wallet client not available');
      setReleaseOrderTx({
        ...releaseOrderTx,
        isError: true,
        error,
      });
      return;
    }

    setReleaseOrderTx({
      ...releaseOrderTx,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
    });

    try {
      const signer = walletClientToSigner(walletClient);
      const tx = await releaseOrderUtil(signer, orderId, result);
      
      setReleaseOrderTx({
        ...releaseOrderTx,
        isLoading: true,
        hash: tx.hash,
      });

      await tx.wait();
      
      setReleaseOrderTx({
        ...releaseOrderTx,
        isLoading: false,
        isSuccess: true,
      });

      return tx;
    } catch (error) {
      setReleaseOrderTx({
        ...releaseOrderTx,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [walletClient, releaseOrderTx]);

  /**
   * Fetches order details from the contract
   * @param orderId - Sequential order ID (uint256)
   */
  const fetchOrder = useCallback(async (orderId: ethers.BigNumberish) => {
    setIsLoadingOrder(true);
    setOrderError(null);

    try {
      // Convert publicClient to a provider
      const provider = new ethers.providers.Web3Provider(publicClient as any);
      const order = await getOrder(provider, orderId);
      setOrderDetails(order);
      return order;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setOrderError(errorObj);
    } finally {
      setIsLoadingOrder(false);
    }
  }, [publicClient]);

  /**
   * Fetches the next available order ID
   */
  const fetchNextOrderId = useCallback(async () => {
    try {
      const provider = new ethers.providers.Web3Provider(publicClient as any);
      const id = await getNextOrderId(provider);
      setNextOrderId(id);
      return id;
    } catch (error) {
      console.error('Error fetching next order ID:', error);
    }
  }, [publicClient]);

  /**
   * Fetches the fixed order amount (10 tokens)
   */
  const fetchFixedAmount = useCallback(async () => {
    try {
      const provider = new ethers.providers.Web3Provider(publicClient as any);
      const amount = await getFixedAmount(provider);
      setFixedAmount(amount);
      return amount;
    } catch (error) {
      console.error('Error fetching fixed amount:', error);
    }
  }, [publicClient]);

  return {
    address,
    publicClient,
    walletClient,
    createOrder,
    createOrderTx,
    releaseOrder,
    releaseOrderTx,
    fetchOrder,
    orderDetails,
    isLoadingOrder,
    orderError,
    fetchNextOrderId,
    nextOrderId,
    fetchFixedAmount,
    fixedAmount
  };
} 