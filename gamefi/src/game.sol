// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Inft} from "./Inft.sol";
import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract Game is Ownable {
    enum Hero {
        Superman,
        Batman,
        WonderWoman,
        GreenArrow,
        Flash,
        GreenLantern,
        Aquaman,
        MartianManhunter,
        IronMan,
        Thor,
        Hulk,
        Spiderman,
        Wolverine,
        Hawkeye
    }

    enum Villain {
        Magneto,
        Thanos,
        Darkseid,
        Loki,
        DoctorDoom,
        Apocalypse,
        Joker,
        LexLuthor
    }

    enum Level {
        BeginnerI,
        BeginnerII,
        BeginnerIII,
        BeginnerIV,
        EliteI,
        EliteII,
        EliteIII,
        EliteIV,
        MasterI,
        MasterII,
        MasterIII,
        MasterIV,
        Legendary
    }

    struct PlayerDetails {
        Level _playerLevel;
        uint _scorestreak;
        uint _rewardBalance;
        uint[] _correctorder;
    }

    uint LastLegendaryBadgeId;

    address public rewardToken;
    address public nftBadge;
    mapping(address => PlayerDetails) private Playerdetails;
    // mapping(address => uint[]) public userOrdering;

    mapping(uint => bool) public usedTokenIds;

    mapping(address => mapping(Level => uint)) public specificLevel;

    event BadgeIssued(address indexed player, uint timestamp);

    constructor(
        address _initialOwner,
        address _nftBadge,
        address _rewardtoken
    ) Ownable(_initialOwner) {
        nftBadge = _nftBadge;
        rewardToken = _rewardtoken;
    }

    function StartGame(uint[] memory _userguess) public {
        PlayerDetails storage _user = Playerdetails[msg.sender];
        // userOrdering[msg.sender] = _userguess;
        uint[] memory _order = setGameOrder(_user._playerLevel);
        uint correctguess = validateOrdering(_userguess, _order);
        increaseLevel(msg.sender, correctguess);
        _user._correctorder = _order;
    }

    function calculateNumCharacters(
        Level _userlevel
    ) internal pure returns (uint) {
        uint baseNumCharacters = 3; // Starting number of characters
        uint incrementFactor = 2; // Factor by which the number of characters increases per level
        uint numCharacters = baseNumCharacters;

        for (uint i = 0; i < uint(_userlevel); i++) {
            numCharacters *= incrementFactor;
        }

        return numCharacters;
    }

    // Function to set characters for each level
    function setLevelOrdering(
        Level _userlevel
    ) internal pure returns (uint[] memory _order) {
        uint numSelections = calculateNumCharacters(_userlevel);

        _order = new uint[](numSelections);

        // Define character arrays for each level and sublevel
        uint[11] memory beginnerCharacters = [
            uint(Hero.Spiderman),
            uint(Hero.IronMan),
            uint(Hero.Hawkeye),
            uint(Hero.Wolverine),
            uint(Hero.Batman),
            uint(Hero.WonderWoman),
            uint(Hero.GreenArrow),
            uint(Hero.Flash),
            uint(Villain.Magneto),
            uint(Villain.Thanos),
            uint(Villain.Darkseid)
        ];
        uint[11] memory eliteCharacters = [
            uint(Hero.Spiderman),
            uint(Hero.IronMan),
            uint(Hero.Hulk),
            uint(Hero.MartianManhunter),
            uint(Hero.Batman),
            uint(Hero.WonderWoman),
            uint(Hero.GreenArrow),
            uint(Hero.Flash),
            uint(Villain.Magneto),
            uint(Villain.Thanos),
            uint(Villain.Darkseid)
        ];
        uint[11] memory masterCharacters = [
            uint(Hero.Superman),
            uint(Hero.Batman),
            uint(Hero.WonderWoman),
            uint(Hero.GreenArrow),
            uint(Hero.Flash),
            uint(Hero.IronMan),
            uint(Hero.Thor),
            uint(Hero.Hulk),
            uint(Hero.Spiderman),
            uint(Hero.Wolverine),
            uint(Villain.Magneto)
        ];
        uint[11] memory legendaryCharacters = [
            uint(Hero.Superman),
            uint(Hero.MartianManhunter),
            uint(Hero.GreenArrow),
            uint(Hero.IronMan),
            uint(Hero.Thor),
            uint(Hero.Hulk),
            uint(Hero.WonderWoman),
            uint(Hero.Flash),
            uint(Villain.Thanos),
            uint(Villain.Darkseid),
            uint(Villain.Apocalypse)
        ];

        // Determine which characters to select based on the player's level
        uint[11] memory selectedCharacters;
        if (
            _userlevel == Level.BeginnerI ||
            _userlevel == Level.BeginnerII ||
            _userlevel == Level.BeginnerIII ||
            _userlevel == Level.BeginnerIV
        ) {
            selectedCharacters = beginnerCharacters;
        } else if (
            _userlevel == Level.EliteI ||
            _userlevel == Level.EliteII ||
            _userlevel == Level.EliteIII ||
            _userlevel == Level.EliteIV
        ) {
            selectedCharacters = eliteCharacters;
        } else if (
            _userlevel == Level.MasterI ||
            _userlevel == Level.MasterII ||
            _userlevel == Level.MasterIII ||
            _userlevel == Level.MasterIV
        ) {
            selectedCharacters = masterCharacters;
        } else if (_userlevel == Level.Legendary) {
            selectedCharacters = legendaryCharacters;
        }

        // Fill the order array with the selected characters
        for (uint i = 0; i < numSelections; i++) {
            _order[i] = selectedCharacters[i % selectedCharacters.length];
        }
    }

function increaseLevel(address player, uint _matches) internal {
        PlayerDetails storage playerDetails = Playerdetails[player];
        Level currentLevel = playerDetails._playerLevel;
        uint currentLevelProgress = specificLevel[player][currentLevel];
        uint requiredProgress = calculateRequiredProgress(currentLevel); 

        currentLevelProgress += _matches;

        if (currentLevelProgress >= requiredProgress) {
            if (currentLevel == Level.Legendary) {
                // Handle reaching the maximum level
                uint tokenId = issueBadge(player);
                emit BadgeIssued(player, tokenId);
                return;
            }
            // Increment to the next level
            playerDetails._playerLevel = Level(uint(currentLevel) + 1);
            // Reset the progress for the new level
            specificLevel[player][playerDetails._playerLevel] = 0;
            
            // Issue tokens to the player based on the new level
            uint tokensToIssue = calculateTokens(playerDetails._playerLevel, _matches);
            playerDetails._rewardBalance += tokensToIssue;
        }
    }

    function _withdrawErc20() public {
            PlayerDetails storage playerDetails = Playerdetails[msg.sender];
            require(playerDetails._rewardBalance >0, "insufficient balance");

                IERC20(rewardToken).transfer(msg.sender, playerDetails._rewardBalance);
        
    }

  function calculateTokens(Level _level, uint _matches) internal pure returns (uint) {
        // Reward pattern: 5 tokens for Beginner, token gets doubled for each subsequent level
        
        return _matches + (uint(_level) * 5);
    }

    // Function to issue badge NFT to the player upon reaching legendary level
function issueBadge(address player) internal returns (uint) {
    uint tokenId = LastLegendaryBadgeId;
    Inft(nftBadge).mint(player, tokenId); // Mint the badge NFT and transfer it to the player
    
    LastLegendaryBadgeId ++;
    return tokenId;
}
    // Function to calculate the required progress for leveling up based on the level
    function calculateRequiredProgress(
        Level _level
    ) internal pure returns (uint) {
        if (
            _level == Level.BeginnerI ||
            _level == Level.BeginnerII ||
            _level == Level.BeginnerIII ||
            _level == Level.BeginnerIV
        ) {
            return 5; // For Beginner levels, require 10 matches
        } else if (
            _level == Level.EliteI ||
            _level == Level.EliteII ||
            _level == Level.EliteIII ||
            _level == Level.EliteIV
        ) {
            return 15; // For Elite levels, require 15 matches
        } else if (
            _level == Level.MasterI ||
            _level == Level.MasterII ||
            _level == Level.MasterIII ||
            _level == Level.MasterIV
        ) {
            return 20; // For Master levels, require 20 matches
        } else if (_level == Level.Legendary) {
            // Handle Legendary level if necessary
            return 0; // Assuming no further progression after Legendary level
        }
    }

    // Function to validate the user's guess cont returns the correct number of guess
    // the player made
    function validateOrdering(
        uint[] memory _userOrdering,
        uint[] memory _correctorder
    ) internal pure returns (uint) {
        // require(_userOrdering.length == _correctorder.length, "Invalid character numbers");
        uint correctCount = 0;
        for (uint i = 0; i < _correctorder.length; i++) {
            if (_userOrdering[i] == _correctorder[i]) {
                correctCount++;
            }
        }
        return correctCount;
    }

    function setGameOrder(
        Level _userlevel
    ) internal view returns (uint[] memory _correctorder) {
        uint[] memory _characters = setLevelOrdering(_userlevel);

        // Define the minimum and maximum values for array length based on the level
        uint minRange;
        uint maxRange;

        if (
            _userlevel == Level.BeginnerI ||
            _userlevel == Level.BeginnerII ||
            _userlevel == Level.BeginnerIII ||
            _userlevel == Level.BeginnerIV
        ) {
            minRange = 3;
            maxRange = 5;
        } else if (
            _userlevel == Level.EliteI ||
            _userlevel == Level.EliteII ||
            _userlevel == Level.EliteIII ||
            _userlevel == Level.EliteIV
        ) {
            minRange = 5;
            maxRange = 7;
        } else if (
            _userlevel == Level.MasterI ||
            _userlevel == Level.MasterII ||
            _userlevel == Level.MasterIII ||
            _userlevel == Level.MasterIV
        ) {
            minRange = 7;
            maxRange = 9;
        } else if (_userlevel == Level.Legendary) {
            // Define the range for Legendary level
            minRange = 9;
            maxRange = _characters.length; // Set maximum range to the length of _characters array
        }

        // Calculate the array length within the defined range
        uint arraylength = (block.number % (maxRange - minRange + 1)) +
            minRange;

        _correctorder = new uint[](arraylength);
        for (uint i = 0; i < arraylength; i++) {
            _correctorder[i] = _characters[i % _characters.length];
        }
        return _correctorder;
    }
}
