// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
 
 
    constructor(address _initialowner) ERC20("utGsearch", "UGST") Ownable(_initialowner) {
        _mint(msg.sender, 1000000 ether);
    }

    function mint(address _to, uint amount) public onlyOwner  {
        _mint(_to, amount);
        
    }


}
