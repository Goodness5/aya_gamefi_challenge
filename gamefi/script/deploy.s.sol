// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Game} from "../src/game.sol";
import {GameNFT} from "../src/Nft.sol";
import {RewardToken} from "../src/Erc20.sol";
import {StakERC20} from "../src/staking.sol";

contract Deployscript is Script {
    Game _game;
    GameNFT _gameNFT;
    RewardToken _rewardToken;
    StakERC20 _stakeerc20;

    function run() public {
        uint256 key = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(key);
        _gameNFT = new GameNFT("Legend", "LGD",  0xf79D3EaCd50993471bA3f5D9E3534aE274cAe9dC);
        _rewardToken = new RewardToken( 0xf79D3EaCd50993471bA3f5D9E3534aE274cAe9dC);
        _stakeerc20 = new StakERC20(address(_rewardToken));

        // _rewardToken.mint(address(_stakeerc20), 10000 ether);
        _game = new Game( 0xf79D3EaCd50993471bA3f5D9E3534aE274cAe9dC, address(_gameNFT), address(_rewardToken));
    }
}
