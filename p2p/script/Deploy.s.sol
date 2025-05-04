// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {stdJson} from "forge-std/StdJson.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {P2PMarket} from "../src/contracts/P2PMarket.sol";
import {P2POracleController} from "../src/contracts/P2POracleController.sol";
import {ERC20Mintable} from "../src/contracts/ERC20Mintable.sol";

// forge script ./script/Deploy.s.sol ${SERVICE_MANAGER} --sig "run(string)" --rpc-url http://localhost:8545 --broadcast
contract DeployScript is Script {
    using stdJson for string;

    string root = vm.projectRoot();
    string deployments_path = string.concat(root, "/.docker/deployments.json");
    string script_output_path =
        string.concat(root, "/.docker/script_deploy.json");

    uint256 privateKey =
        vm.envOr(
            "ANVIL_PRIVATE_KEY",
            uint256(
                0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
            )
        );

    function run(string calldata serviceManagerAddr) public {
        address serviceManager = vm.parseAddress(serviceManagerAddr);
        address deployer = vm.addr(privateKey);

        // Mint initial tokens for testing
        uint256 initialTokens = 1_000e18;

        vm.startBroadcast(privateKey);

        // Deploy the contracts
        P2POracleController oracleController = new P2POracleController(
                serviceManager
            );
        P2PMarket market = oracleController.market();
        ERC20Mintable token = new ERC20Mintable("P2P Token", "P2P");

        // Mint tokens to the deployer for testing
        token.mint(deployer, initialTokens);

        vm.stopBroadcast();

        // Log the deployment
        console.log("Service manager:", serviceManager);
        console.log("Oracle controller address:", address(oracleController));
        console.log("P2P Market address:", address(market));
        console.log("Token address:", address(token));

        string memory json = "json";
        json.serialize("service_manager", serviceManager);
        json.serialize("oracle_controller", address(oracleController));
        json.serialize("market", address(market));
        string memory finalJson = json.serialize(
            "token",
            address(token)
        );
        vm.writeFile(script_output_path, finalJson);
    }
}
