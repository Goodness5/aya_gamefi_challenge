// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract GameNFT is ERC721, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        address _initialOwner
    ) ERC721(name, symbol) Ownable(_initialOwner) {}

    function mint(address to, uint256 tokenId) public onlyOwner {
        require(exists(tokenId), "Token ID already exists");
        _safeMint(to, tokenId);
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) == address(0);
    }
}
