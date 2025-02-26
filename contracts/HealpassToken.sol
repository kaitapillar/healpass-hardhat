//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HealpassToken is ERC20 {
    uint maxSupply = 1000000000;
    address public owner;
    uint public total_supply;
    uint public constant MINT_PRICE = 0.01 ether; // Price per mint
    
    constructor() ERC20("HealCoin", "HEAL") {
        owner = msg.sender;
    }

    function mint(address addr) external payable {
        require(msg.value >= MINT_PRICE, "Insufficient ETH sent");
        require(total_supply < maxSupply, "Max supply reached");
        
        _mint(addr, 1000);
        total_supply += 1000;
        
        // Send the ETH to the owner
        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Failed to send ETH");
    }

    // Allow the contract to receive ETH
    receive() external payable {}
}