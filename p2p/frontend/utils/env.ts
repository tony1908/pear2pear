// P2P Market environment variables
export const P2P_MARKET_ADDRESS = process.env.NEXT_PUBLIC_P2P_MARKET_ADDRESS || '';
export const P2P_ORACLE_CONTROLLER_ADDRESS = process.env.NEXT_PUBLIC_P2P_ORACLE_CONTROLLER_ADDRESS || '';
export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '';

// Original prediction market environment variables (kept for backward compatibility)
export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '';
export const ORACLE_CONTROLLER_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_CONTROLLER_ADDRESS || '';
export const CONDITIONAL_TOKENS_ADDRESS = process.env.NEXT_PUBLIC_CONDITIONAL_TOKENS_ADDRESS || '';
export const COLLATERAL_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS || '';
export const MARKET_MAKER_ADDRESS = process.env.NEXT_PUBLIC_MARKET_MAKER_ADDRESS || '';
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || 'localhost';

// Validate essential environment variables
if (
  !P2P_MARKET_ADDRESS ||
  !P2P_ORACLE_CONTROLLER_ADDRESS ||
  !TOKEN_ADDRESS
) {
  console.warn("Missing P2P market environment variables");
}
