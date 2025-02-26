// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IHealpassToken {
    function mint(address addr) external payable;
}

contract HealpassDAO {
    mapping(uint => address) public members;
    IHealpassToken public tokenContract;
    uint public constant MINT_PRICE = 0.01 ether;

    constructor(address _tokenAddress) {
        tokenContract = IHealpassToken(_tokenAddress);
    }

    function join(address addr) public {
        // Your join logic here
    }

    function mintToken(address addr) public payable {
        require(msg.value >= MINT_PRICE, "Insufficient ETH sent");
        tokenContract.mint{value: msg.value}(addr);
    }

    // Allow the contract to receive ETH
    receive() external payable {}
}