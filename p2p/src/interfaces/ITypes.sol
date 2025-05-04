// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface ITypes {
    struct DataWithId {
        TriggerId triggerId;
        bytes data;
    }

    struct TriggerInfo {
        TriggerId triggerId;
        address creator;
        bytes data;
    }

    enum OrderStatus {
        Created,
        Funded,
        Completed,
        Cancelled
    }

    event NewTrigger(bytes);
    event OrderCreated(uint256 indexed orderId, address maker, address taker, uint256 amount);
    event OrderFunded(uint256 indexed orderId);
    event OrderCompleted(uint256 indexed orderId);
    event OrderCancelled(uint256 indexed orderId);

    type TriggerId is uint64;
}
