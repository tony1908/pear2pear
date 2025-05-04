import { ethers } from 'ethers';

// Original addresses (reference)
const _MOCK_AVS_ADDRESS = "0x7b01d9F5338f348ab7A90AF84F797C0EA51C7A44";
const _PEARSCROW_ADDRESS = "0x6189ec837f973DB8fD13268F8E431B497319D203";

// Corrected addresses with proper checksum
export const MOCK_AVS_ADDRESS = ethers.utils.getAddress("0x7b01d9F5338f348ab7A90AF84F797C0EA51C7A44");
export const PEARSCROW_ADDRESS = ethers.utils.getAddress("0x6189ec837f973DB8fD13268F8E431B497319D203"); 