// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {IWavsServiceHandler} from "@wavs/interfaces/IWavsServiceHandler.sol";
import {IWavsServiceManager} from "@wavs/interfaces/IWavsServiceManager.sol";

import {ITypes} from "../interfaces/ITypes.sol";
import {P2PMarket} from "./P2PMarket.sol";

// The contract responsible for triggering the oracle to verify transactions and handling the oracle output
contract P2POracleController is IWavsServiceHandler {
    // The P2P market that handles creating and resolving orders
    P2PMarket public market;

    mapping(ITypes.TriggerId => Trigger) public triggersById;

    IWavsServiceManager public serviceManager;
    ITypes.TriggerId public nextTriggerId;

    struct Trigger {
        address creator;
        bytes data;
    }

    // The data that is passed to the oracle AVS via the `NewTrigger` event
    struct TriggerInputData {
        uint256 orderId;
    }

    // The data that is returned from the oracle AVS
    struct AvsOutputData {
        uint256 orderId;
        bool result;
    }

    constructor(address serviceManager_) {
        require(serviceManager_ != address(0), "Invalid service manager");

        market = new P2PMarket();
        serviceManager = IWavsServiceManager(serviceManager_);
    }

    /**
     * @dev Handle the AVS oracle verification result
     * @param data The data returned from the oracle AVS
     * @param signature The signature of the data
     */
    function handleSignedData(
        bytes calldata data,
        bytes calldata signature
    ) external override {
        serviceManager.validate(data, signature);

        ITypes.DataWithId memory dataWithId = abi.decode(
            data,
            (ITypes.DataWithId)
        );

        Trigger memory trigger = triggersById[dataWithId.triggerId];
        require(trigger.creator != address(0), "Trigger does not exist");

        AvsOutputData memory returnData = abi.decode(
            dataWithId.data,
            (AvsOutputData)
        );

        // Tell market to resolve the order based on oracle result
        market.resolveOrder(
            returnData.orderId,
            returnData.result
        );
    }

    /**
     * @dev Trigger the oracle AVS to verify an order
     * @param orderId The order ID to verify
     * @return triggerId The ID of the trigger
     */
    function addTrigger(
        uint256 orderId
    ) external payable returns (ITypes.TriggerId triggerId) {
        require(msg.value == 0.1 ether, "Payment must be exactly 0.1 ETH");

        // Get the next trigger ID
        triggerId = nextTriggerId;
        nextTriggerId = ITypes.TriggerId.wrap(
            ITypes.TriggerId.unwrap(nextTriggerId) + 1
        );

        TriggerInputData memory triggerData = TriggerInputData({
            orderId: orderId
        });
        
        bytes memory data = abi.encode(triggerData);

        Trigger memory trigger = Trigger({creator: msg.sender, data: data});
        triggersById[triggerId] = trigger;

        ITypes.TriggerInfo memory triggerInfo = ITypes.TriggerInfo({
            triggerId: triggerId,
            creator: trigger.creator,
            data: trigger.data
        });

        emit ITypes.NewTrigger(abi.encode(triggerInfo));
    }

    /**
     * @dev Get the trigger info for a given trigger ID
     * @param triggerId The ID of the trigger to get the info for
     * @return triggerInfo The trigger info
     */
    function getTrigger(
        ITypes.TriggerId triggerId
    ) external view returns (Trigger memory) {
        return triggersById[triggerId];
    }
} 