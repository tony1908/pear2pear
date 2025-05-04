import { BigNumber } from 'ethers';

export enum OrderStatus {
  Created = 0,
  Funded = 1,
  Completed = 2,
  Cancelled = 3
}

export interface Order {
  id: string;
  maker: string;
  taker: string;
  token: string;
  amount: BigNumber;
  status: OrderStatus;
  oracleResult?: boolean;
}

export interface CreateOrderFormData {
  taker: string;
  token: string;
  amount: string;
}

export interface TriggerOrderFormData {
  orderId: string;
}

// Keeping some original interfaces for backward compatibility
export interface Market {
  id: string;
  question: string;
  createdAt: number;
  resolvedAt?: number;
  isResolved: boolean;
  result?: boolean;
  marketMakerAddress: string;
  conditionalTokensAddress: string;
  collateralTokenAddress: string;
  funding: BigNumber;
  volume: BigNumber;
  yesPrice: number;
  noPrice: number;
}

export interface MarketTrade {
  id: string;
  marketId: string;
  trader: string;
  timestamp: number;
  outcome: 'YES' | 'NO';
  amount: BigNumber;
  price: BigNumber;
}

export interface CreateMarketFormData {
  question: string;
  funding: string;
  fee: string;
}

export interface MarketBuyFormData {
  outcome: 'YES' | 'NO';
  amount: string;
}

export interface MarketProbability {
  timestamp: number;
  yesProbability: number;
  noProbability: number;
}

export interface MarketPosition {
  outcome: 'YES' | 'NO';
  amount: BigNumber;
  isResolved: boolean;
  canRedeem: boolean;
}