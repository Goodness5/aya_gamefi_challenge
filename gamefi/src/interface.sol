// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.1;

interface Inft {
    function mint(address to, uint256 tokenId) external;
    function exists(uint256 tokenId) external returns (bool);
    
}
interface Istake {
    function stake(address token, address _staker, uint256 amount) external  returns(uint);
    
    
}