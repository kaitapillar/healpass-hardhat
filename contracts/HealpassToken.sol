//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HealpassToken is ERC20 {

    uint maxSupply = 1000000000;
    address public owner;

    uint public total_supply;
    
    constructor() ERC20("HealCoin", "HEAL") {
        owner = msg.sender;
    }

    function mint(address addr) external {
        require(msg.sender == owner, "Only owner can mint");
        require(total_supply < maxSupply, "Max supply reached");
        _mint(addr, 1000 * (10**18));
        total_supply += 1000 * (10**18);
    }
}