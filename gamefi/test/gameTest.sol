// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Game} from "../src/game.sol";
import {GameNFT} from "../src/Nft.sol";
import {RewardToken} from "../src/Erc20.sol";


contract gameTest is Test {
    Game _game;
    GameNFT _nft;
    RewardToken _rewardToken;
    address player = mkaddr("player");
    address player2 = mkaddr("player2");
    address owner = mkaddr("owner");


    function setUp() public {
        vm.startPrank(owner);
        _nft = new GameNFT("GNFT", "GNT", owner);
        _rewardToken = new RewardToken(owner);
        _game = new Game(owner, address(_nft), address(_rewardToken));
        
        vm.stopPrank();

   }



    function mkaddr(string memory name) public returns (address) {
        address addr = address(
            uint160(uint256(keccak256(abi.encodePacked(name))))
        );
        vm.label(addr, name);
        return addr;
    }

function testStakingEmptyReward() public {
    // Start the prank
    vm.startPrank(player);
    
    // Use a try-catch block to capture revert
    bool success;
    bytes memory returnData;
    (success, returnData) = address(_game).call(abi.encodeWithSignature("stakeReward()"));

    // Assert that the call reverted
    assert(!success);
}

function testStartGame() public {
    vm.startPrank(player);
    _game.getnumofinput();
    uint[] memory userGuess = new uint[](3);
    userGuess[0] = 11;
    userGuess[1] = 8;
    userGuess[2] = 1;
    // userGuess[3] = 3;
    // userGuess[4] = 2;
    // userGuess[5] = 3;

    // // Call the StartGame function with the dynamic array
    _game.StartGame(userGuess);
}

function testrandomnumber() public {
    vm.startPrank(player);
    // vm.warp(111466637);
    _game.getRandomNumber(3, 5);
}




}
