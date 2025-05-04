// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {console} from "forge-std/console.sol";

import {ITypes} from "../interfaces/ITypes.sol";

contract P2PMarket {
    struct Order {
        uint256 id;
        address maker;      // The user who creates the order and provides the tokens
        address taker;      // The user who will receive the tokens
        address token;      // The ERC20 token being transferred
        uint256 amount;     // Amount of tokens to transfer
        ITypes.OrderStatus status;
        bool oracleResult;  // Result from the oracle (true = complete the transfer)
    }

    uint256 public nextOrderId = 1;
    mapping(uint256 => Order) public orders;
    address public oracle;  // The address that can call resolveOrder

    event OrderCreated(uint256 indexed orderId, address indexed maker, address indexed taker, address token, uint256 amount);
    event OrderFunded(uint256 indexed orderId);
    event OrderCompleted(uint256 indexed orderId);
    event OrderCancelled(uint256 indexed orderId);

    constructor() {
        oracle = msg.sender;
    }

    /**
     * @dev Create a new P2P order
     * @param taker The address that will receive the tokens
     * @param token The ERC20 token address
     * @param amount The amount of tokens to transfer
     * @return orderId The ID of the created order
     */
    function createOrder(address taker, address token, uint256 amount) external returns (uint256 orderId) {
        require(token != address(0), "Invalid token address");
        require(taker != address(0), "Invalid taker address");
        require(amount > 0, "Amount must be greater than 0");

        orderId = nextOrderId++;
        
        orders[orderId] = Order({
            id: orderId,
            maker: msg.sender,
            taker: taker, 
            token: token,
            amount: amount,
            status: ITypes.OrderStatus.Created,
            oracleResult: false
        });

        emit OrderCreated(orderId, msg.sender, taker, token, amount);
        
        return orderId;
    }

    /**
     * @dev Fund an existing order with tokens
     * @param orderId The ID of the order to fund
     */
    function fundOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        
        require(order.id == orderId, "Order does not exist");
        require(order.maker == msg.sender, "Only maker can fund order");
        require(order.status == ITypes.OrderStatus.Created, "Order is not in Created state");
        
        // Transfer tokens from maker to this contract
        IERC20 token = IERC20(order.token);
        require(token.transferFrom(msg.sender, address(this), order.amount), "Token transfer failed");
        
        // Update order status
        order.status = ITypes.OrderStatus.Funded;
        
        emit OrderFunded(orderId);
    }

    /**
     * @dev Cancel an order and return tokens to maker (if funded)
     * @param orderId The ID of the order to cancel
     */
    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        
        require(order.id == orderId, "Order does not exist");
        require(order.maker == msg.sender, "Only maker can cancel order");
        require(order.status == ITypes.OrderStatus.Created || order.status == ITypes.OrderStatus.Funded, 
                "Order cannot be cancelled");
        
        // If order was funded, return tokens to maker
        if (order.status == ITypes.OrderStatus.Funded) {
            IERC20 token = IERC20(order.token);
            require(token.transfer(order.maker, order.amount), "Token return failed");
        }
        
        // Update order status
        order.status = ITypes.OrderStatus.Cancelled;
        
        emit OrderCancelled(orderId);
    }

    /**
     * @dev Resolves an order based on the oracle result
     * @param orderId The order ID to resolve
     * @param result The boolean result from the oracle
     */
    function resolveOrder(uint256 orderId, bool result) external {
        require(msg.sender == oracle, "Only oracle can resolve orders");
        
        Order storage order = orders[orderId];
        require(order.id == orderId, "Order does not exist");
        require(order.status == ITypes.OrderStatus.Funded, "Order is not funded");
        
        order.oracleResult = result;
        
        if (result) {
            // If oracle returned true, complete the transfer to taker
            IERC20 token = IERC20(order.token);
            require(token.transfer(order.taker, order.amount), "Token transfer to taker failed");
            order.status = ITypes.OrderStatus.Completed;
            emit OrderCompleted(orderId);
        } else {
            // If oracle returned false, return tokens to maker
            IERC20 token = IERC20(order.token);
            require(token.transfer(order.maker, order.amount), "Token return to maker failed");
            order.status = ITypes.OrderStatus.Cancelled;
            emit OrderCancelled(orderId);
        }
    }

    /**
     * @dev Get order details
     * @param orderId The ID of the order to get
     * @return Order details of the specified order
     */
    function getOrder(uint256 orderId) external view returns (Order memory) {
        Order memory order = orders[orderId];
        require(order.id == orderId, "Order does not exist");
        return order;
    }
}
