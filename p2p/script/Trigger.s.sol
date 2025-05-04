// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {ITypes} from "../src/interfaces/ITypes.sol";
import {P2POracleController} from "../src/contracts/P2POracleController.sol";

// forge script ./script/Trigger.s.sol ${ORACLE_CONTROLLER_ADDRESS} ${ORDER_ID} --sig "run(string,string)" --rpc-url http://localhost:8545 --broadcast
contract TriggerScript is Script {
    uint256 privateKey =
        vm.envOr(
            "ANVIL_PRIVATE_KEY",
            uint256(
                0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
            )
        );

    function run(
        string calldata oracleControllerAddr,
        string calldata orderIdStr
    ) public {
        address oracleAddress = vm.parseAddress(oracleControllerAddr);
        uint256 orderId = vm.parseUint(orderIdStr);

        P2POracleController oracle = P2POracleController(oracleAddress);

        vm.startBroadcast(privateKey);

        // Add trigger (sends 0.1 ETH)
        ITypes.TriggerId triggerId = oracle.addTrigger{value: 0.1 ether}(
            orderId
        );

        vm.stopBroadcast();

        uint64 tid = ITypes.TriggerId.unwrap(triggerId);
        console.log("Trigger ID:", tid);
    }
}
