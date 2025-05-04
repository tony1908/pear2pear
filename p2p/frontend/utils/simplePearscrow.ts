import { ethers } from 'ethers';
import { MOCK_AVS_ADDRESS } from './constants';

// The contract address will be set after deployment
export const SIMPLE_PEARSCROW_ADDRESS = "0x459bDbEa83B7EdD703E498a51946030b03A6dB3a"; // TODO: Update after deployment

/**
 * SimplePearScrow contract ABI fragments for the needed functions
 */
export const SimplePearScrowABI = [
  'function createOrder(address token) external',
  'function releaseOrder(uint256 orderId, bool result) external',
];

/**
 * Order data structure as returned by the contract
 */
export interface Order {
  token: string;
  buyer: string;
  amount: ethers.BigNumber;
  released: boolean;
  createdAt: ethers.BigNumber;
}

/**
 * Creates a SimplePearScrow contract instance
 * @param signerOrProvider - Ethers signer or provider
 * @returns Ethers contract instance
 */
export function getSimplePearScrowContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  // Ensure the contract address has the correct checksum
  const checksummedAddress = ethers.utils.getAddress(SIMPLE_PEARSCROW_ADDRESS);
  
  return new ethers.Contract(
    checksummedAddress,
    SimplePearScrowABI,
    signerOrProvider
  );
}

/**
 * Creates a new order in the SimplePearScrow escrow system
 * @param signer - Ethers signer of the buyer
 * @param tokenAddress - Address of the token used for payment
 * @returns Transaction response
 */
export async function createOrder(
  signer: ethers.Signer,
  tokenAddress: string
): Promise<ethers.ContractTransaction> {
  // Ensure address is correctly checksummed
  const checksummedTokenAddress = ethers.utils.getAddress(tokenAddress);
  
  const contract = getSimplePearScrowContract(signer);
  return contract.createOrder(checksummedTokenAddress);
}

/**
 * Releases an order with the associated orderId
 * @param signer - Ethers signer 
 * @param orderId - Sequential order ID (uint256)
 * @param result - Result from the AVS (typically true for success)
 * @returns Transaction response
 */
export async function releaseOrder(
  signer: ethers.Signer,
  orderId: ethers.BigNumberish,
  result: boolean
): Promise<ethers.ContractTransaction> {
  const contract = getSimplePearScrowContract(signer);
  return contract.releaseOrder(orderId, result);
}

/**
 * Retrieves order details from the contract
 * @param provider - Ethers provider
 * @param orderId - Sequential order ID (uint256)
 * @returns Order details
 */
export async function getOrder(
  provider: ethers.providers.Provider,
  orderId: ethers.BigNumberish
): Promise<Order> {
  const contract = getSimplePearScrowContract(provider);
  return contract.orders(orderId);
}

/**
 * Gets the next available order ID
 * @param provider - Ethers provider
 * @returns Next order ID (uint256)
 */
export async function getNextOrderId(
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const contract = getSimplePearScrowContract(provider);
  return contract.nextOrderId();
}

/**
 * Gets the fixed order amount (10 tokens = 10_000_000 units)
 * @param provider - Ethers provider
 * @returns Fixed amount in base units
 */
export async function getFixedAmount(
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const contract = getSimplePearScrowContract(provider);
  return contract.FIXED_AMOUNT();
}

/**
 * Calculates orderId hash as the contract would
 * Note: The seller parameter has been removed to match the contract
 * @param buyer - Buyer address
 * @param token - Token address
 * @param amount - Amount of tokens (in wei)
 * @param timestamp - Timestamp in seconds
 * @returns Bytes32 orderId hash
 */
export function calculateOrderId(
  buyer: string,
  token: string,
  amount: ethers.BigNumberish,
  timestamp: number
): string {
  // Ensure addresses are correctly checksummed
  const checksummedBuyer = ethers.utils.getAddress(buyer);
  const checksummedToken = ethers.utils.getAddress(token);
  
  return ethers.utils.keccak256(
    ethers.utils.solidityPack(
      ['address', 'address', 'uint256', 'uint256'],
      [checksummedBuyer, token, amount, timestamp]
    )
  );
}

/**
 * Deposits tokens to the contract for an order
 * @param signer - Ethers signer 
 * @param tokenAddress - Address of the token to deposit
 * @param amount - Amount of tokens to deposit
 * @returns Transaction response
 */
export async function depositTokens(
  signer: ethers.Signer,
  tokenAddress: string,
  amount: ethers.BigNumberish
): Promise<ethers.ContractTransaction> {
  const checksummedTokenAddress = ethers.utils.getAddress(tokenAddress);
  
  // ERC20 Token contract interface
  const erc20Interface = [
    'function transfer(address to, uint256 amount) external returns (bool)'
  ];
  
  const tokenContract = new ethers.Contract(
    checksummedTokenAddress,
    erc20Interface,
    signer
  );
  
  // Send tokens directly to the contract
  return tokenContract.transfer(SIMPLE_PEARSCROW_ADDRESS, amount);
} 