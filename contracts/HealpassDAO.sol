pragma solidity ^0.8.2;

interface Itoekn {
    function mint(address addr) external;
}

contract Healpass {

    mapping(uint => address) public members;

    constructor () {

    }

    function join(address addr) public {
    }

    function mintToken (address addr) public {

    }

}