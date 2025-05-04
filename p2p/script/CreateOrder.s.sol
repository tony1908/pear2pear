// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {P2PMarket} from "../src/contracts/P2PMarket.sol";

// forge script ./script/CreateOrder.s.sol ${MARKET_ADDRESS} ${TOKEN_ADDRESS} ${TAKER_ADDRESS} ${AMOUNT} --sig "run(string,string,string,string)" --rpc-url http://localhost:8545 --broadcast
contract CreateOrderScript is Script {
    uint256 privateKey =
        vm.envOr(
            "ANVIL_PRIVATE_KEY",
            uint256(
                0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
            )
        );

    function run(
        string calldata marketAddr,
        string calldata tokenAddr, 
        string calldata takerAddr,
        string calldata amountStr
    ) public {
        address marketAddress = vm.parseAddress(marketAddr);
        address tokenAddress = vm.parseAddress(tokenAddr);
        address takerAddress = vm.parseAddress(takerAddr);
        uint256 amount = vm.parseUint(amountStr);

        P2PMarket market = P2PMarket(marketAddress);
        IERC20 token = IERC20(tokenAddress);

        address deployer = vm.addr(privateKey);
        
        vm.startBroadcast(privateKey);

        // Create the order
        uint256 orderId = market.createOrder(takerAddress, tokenAddress, amount);
        console.log("Order created with ID:", orderId);
        
        // Check token balance
        uint256 balance = token.balanceOf(deployer);
        console.log("Token balance before funding:", balance);
        
        // Approve tokens to be spent by the market
        token.approve(address(market), amount);
        
        // Fund the order
        market.fundOrder(orderId);
        console.log("Order funded successfully");
        
        // Check new token balance
        balance = token.balanceOf(deployer);
        console.log("Token balance after funding:", balance);

        vm.stopBroadcast();
    }
} 