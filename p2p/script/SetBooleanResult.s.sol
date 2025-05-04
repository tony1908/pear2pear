// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

// This script demonstrates how you would toggle the P2P boolean result
// In a real implementation, this would be part of a frontend tool
// or interact with a separate admin API to modify the environment variable

// forge script ./script/SetBooleanResult.s.sol true --sig "run(string)" --rpc-url http://localhost:8545
contract SetBooleanResultScript is Script {
    function run(string calldata boolResult) public {
        bool result = vm.parseBool(boolResult);
        
        console.log("Setting P2P Boolean Oracle result to:", result);
        console.log("Note: In a real implementation, this would modify an environment variable or database.");
        console.log("For this demo, you need to manually set the P2P_BOOLEAN_RESULT value in the Makefile");
        console.log("or use the P2P_BOOLEAN_RESULT parameter with the deploy-service command:");
        console.log("make deploy-service P2P_BOOLEAN_RESULT=", result ? "true" : "false");
    }
} 