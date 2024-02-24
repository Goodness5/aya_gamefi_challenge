// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.1;

interface Inft {
    function mint(address to, uint256 tokenId) external;
    function exists(uint256 tokenId) external returns (bool);
    
}
interface Istake {
    function stake(address token, address _staker, uint256 amount) external  returns(uint);
    
    
}


interface IERC20 {
   
    event Transfer(address indexed from, address indexed to, uint256 value);

    
    event Approval(address indexed owner, address indexed spender, uint256 value);

   
    function totalSupply() external view returns (uint256);

   
    function balanceOf(address account) external view returns (uint256);

   
    function transfer(address to, uint256 amount) external returns (bool);

  
    function allowance(address owner, address spender) external view returns (uint256);

      function approve(address spender, uint256 amount) external returns (bool);

     function symbol() external view returns (string memory);



    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}