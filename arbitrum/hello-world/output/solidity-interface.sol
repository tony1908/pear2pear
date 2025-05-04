// SPDX-License-Identifier: MIT-OR-APACHE-2.0
pragma solidity ^0.8.23;

interface ISimplePearScrow {
    function feeCollector() external view returns (address);

    function nextOrderId() external view returns (uint256);

    function createOrder(address token) external;

    function releaseOrder(uint256 order_id, bool result) external;
}