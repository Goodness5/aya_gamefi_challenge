// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
 
 
    constructor(address _initialowner) ERC20("MyToken", "MTK") Ownable(_initialowner) {
        _mint(msg.sender, 1000000 ether);
    }


}
