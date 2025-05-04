import { ethers } from 'ethers';
import { COLLATERAL_TOKEN_ADDRESS, P2P_MARKET_ADDRESS, P2P_ORACLE_CONTROLLER_ADDRESS, TOKEN_ADDRESS } from './env';

// ABI fragments for the P2P market contracts
export const P2PMarketABI = [
  'function createOrder(address taker, address token, uint256 amount) external returns (uint256 orderId)',
  'function fundOrder(uint256 orderId) external',
  'function cancelOrder(uint256 orderId) external',
  'function resolveOrder(uint256 orderId, bool result) external',
  'function getOrder(uint256 orderId) external view returns (tuple(uint256 id, address maker, address taker, address token, uint256 amount, uint8 status, bool oracleResult))',
  'function orders(uint256 orderId) external view returns (tuple(uint256 id, address maker, address taker, address token, uint256 amount, uint8 status, bool oracleResult))',
  'function nextOrderId() external view returns (uint256)',
  'function oracle() external view returns (address)',
];

export const P2POracleControllerABI = [
  'function addTrigger(uint256 orderId) external payable returns (uint64 triggerId)',
  'function handleSignedData(bytes calldata data, bytes calldata signature) external',
  'function market() external view returns (address)',
  'function getTrigger(uint64 triggerId) external view returns (tuple(address creator, bytes data))',
];

export const ERC20ABI = [
  'function balanceOf(address owner) external view returns (uint)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 value) external returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function mint(address to, uint256 amount) external',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
];

// Keep older ABIs for backward compatibility
export const PredictionMarketFactoryABI = [
  'function createConditionalTokenAndLMSRMarketMaker(string uri, bytes32 questionId, address collateralTokenAddress, uint64 fee, uint256 funding) external returns (address conditionalTokens, address lmsrMarketMaker)',
  'function resolveMarket(address lmsrMarketMaker, address conditionalTokens, bool result) external',
];

export const PredictionMarketOracleControllerABI = [
  'function addTrigger((address lmsrMarketMaker, address conditionalTokens)) external payable returns (uint64 triggerId)',
  'function handleSignedData(bytes calldata data, bytes calldata signature) external',
];

export const LMSRMarketMakerABI = [
  'function trade(int256[] memory outcomeTokenAmounts, int256 collateralLimit) external returns (int256 netCost)',
  'function calcNetCost(int256[] memory outcomeTokenAmounts) external view returns (int256)',
  'function calcMarginalPrice(uint8 outcomeIndex) external view returns (uint256)',
  'function atomicOutcomeSlotCount() external view returns (uint256)',
  'function collateralToken() external view returns (address)',
  'function pmSystem() external view returns (address)',
  'function conditionIds(uint256 index) external view returns (bytes32)',
  'function pause() external',
  'function resume() external',
  'function stage() external view returns (uint8)',
  'function funding() external view returns (uint256)',
  'function fee() external view returns (uint64)',
];

export const ConditionalTokensABI = [
  'function getConditionId(address oracle, bytes32 questionId, uint outcomeSlotCount) external pure returns (bytes32)',
  'function getCollectionId(bytes32 parentCollectionId, bytes32 conditionId, uint indexSet) external pure returns (bytes32)',
  'function getPositionId(address collateralToken, bytes32 collectionId) external pure returns (uint)',
  'function reportPayouts(bytes32 questionId, uint[] calldata payouts) external',
  'function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] calldata indexSets) external',
  'function balanceOf(address owner, uint positionId) external view returns (uint)',
  'function payoutDenominator(bytes32 conditionId) external view returns (uint)',
  'function payoutNumerators(bytes32 conditionId, uint index) external view returns (uint)',
  'function getOutcomeSlotCount(bytes32 conditionId) external view returns (uint256)',
];

// P2P Market contract factory functions
export function getP2PMarketContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(
    P2P_MARKET_ADDRESS,
    P2PMarketABI,
    signerOrProvider
  );
}

export function getP2POracleControllerContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(
    P2P_ORACLE_CONTROLLER_ADDRESS,
    P2POracleControllerABI,
    signerOrProvider
  );
}

export function getERC20Contract(address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(address, ERC20ABI, signerOrProvider);
}

// Keep older contract factory functions for backward compatibility
export function getPredictionMarketFactoryContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(
    '',
    PredictionMarketFactoryABI,
    signerOrProvider
  );
}

export function getPredictionMarketOracleControllerContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(
    '',
    PredictionMarketOracleControllerABI,
    signerOrProvider
  );
}

export function getLMSRMarketMakerContract(address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(address, LMSRMarketMakerABI, signerOrProvider);
}

export function getConditionalTokensContract(address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(address, ConditionalTokensABI, signerOrProvider);
}