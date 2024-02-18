// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Game} from "../src/game.sol";
import {GameNFT} from "../src/Nft.sol";
import {RewardToken} from "../src/Erc20.sol";

contract Deployscript is Script {
    Game _game;
    GameNFT _gameNFT;
    RewardToken _rewardToken;

    function run() public {
        uint256 key = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(key);
        _gameNFT = new GameNFT("Legend", "LGD", msg.sender);
        _rewardToken = new RewardToken(msg.sender);
        _game = new Game(msg.sender, address(_gameNFT), address(_rewardToken));
    }
}
