// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Inft, Istake} from "./interface.sol";
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
        uint _noofinput;
    }

    uint LastLegendaryBadgeId;
    // PlayerDetails[] myarrar;
    address public rewardToken;
    address stakeAddress;
    address public nftBadge;
    mapping(address => PlayerDetails) private Playerdetails;
    // mapping(address => uint[]) public userOrdering;

    mapping(uint => bool) public usedTokenIds;

    mapping(address => mapping(Level => uint)) public specificLevel;

    event BadgeIssued(address indexed player, uint timestamp);
    event startGame(address indexed player, uint indexed _score, uint _rewardbalance);

    modifier correctLevel(address _player, Level _level) {
        // PlayerDetails storage _initplayer = Playerdetails[_player];
        require(
            Playerdetails[_player]._playerLevel == _level,
            "not your level"
        );
        _;
    }

    constructor(
        address _initialOwner,
        address _nftBadge,
        address _rewardtoken
    ) Ownable(_initialOwner) {
        nftBadge = _nftBadge;
        rewardToken = _rewardtoken;
    }

function getnumberofinput(address _player) view public returns (uint _arraylength){
        PlayerDetails storage _user = Playerdetails[_player];
        _arraylength = _user._noofinput;
        
}
function getnumofinput(address _player) public returns(uint _number) {
    Level _userlevel = Playerdetails[_player]._playerLevel;
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
        maxRange = 15;
    }
    
    uint arrayLength = getRandomNumber(minRange, maxRange);

    Playerdetails[_player]._noofinput = arrayLength;

    _number = arrayLength;
}


    function getplayerLevel() public view returns (Level level, uint stage) {
        PlayerDetails storage _user = Playerdetails[msg.sender];
        level = _user._playerLevel;
        stage = specificLevel[msg.sender][level];
    }

function StartGame(uint[] memory _userguess) public returns (uint) {
    
    PlayerDetails storage _user = Playerdetails[msg.sender];
    // require(_userguess.length == _user._noofinput, "array length invalid");
    uint[] memory _order = setGameOrder(_user._playerLevel, msg.sender);
    uint correctGuess = validateOrdering(_userguess, _order);
    increaseLevel(msg.sender, correctGuess);
    _user._correctorder = _order;
    emit startGame(msg.sender, correctGuess, _user._rewardBalance);
    return correctGuess;
}


    function calculateNumCharacters(
        Level _userlevel
    ) internal pure returns (uint) {
        uint baseNumCharacters = 3; // Starting number of characters
        uint incrementFactor = 2; // Factor by which the number of characters increases per level
        uint numCharacters = incrementFactor *
            uint(_userlevel) +
            baseNumCharacters;

        return numCharacters;
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
            uint tokensToIssue = calculateTokens(
                playerDetails._playerLevel,
                _matches
            );
            playerDetails._rewardBalance += tokensToIssue;
        }
    }

    function _withdrawErc20() public {
        PlayerDetails storage playerDetails = Playerdetails[msg.sender];
        require(playerDetails._rewardBalance > 0, "insufficient balance");

        IERC20(rewardToken).transfer(msg.sender, playerDetails._rewardBalance);
    }

    function calculateTokens(
        Level _level,
        uint _matches
    ) internal pure returns (uint) {
        // Reward pattern: 5 tokens for Beginner, token gets doubled for each subsequent level
        return _matches + (uint(_level) * 5);
    }

    // Function to issue badge NFT to the player upon reaching legendary level

    function issueBadge(address player) internal returns (uint) {
        uint tokenId = LastLegendaryBadgeId;
        Inft(nftBadge).mint(player, tokenId); // Mint the badge NFT and transfer it to the player

        LastLegendaryBadgeId++;
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
            return 0;
        }
    }

    // Function to validate the user's guess cont returns the correct number of guess
    // the player made
function validateOrdering(
    uint[] memory _userOrdering,
    uint[] memory _correctorder
) internal pure returns (uint) {
    require(_userOrdering.length == _correctorder.length, "Array lengths do not match");
    
    uint correctCount = 0;
    for (uint i = 0; i < _userOrdering.length; i++) {
        if (_userOrdering[i] == _correctorder[i]) {
            correctCount++;
        }
    }
    return correctCount;
}


    // Function to set characters for each level
    function setLevelOrdering(
        Level _userlevel
    ) internal pure returns (uint[] memory _order) {
        uint numSelections = calculateNumCharacters(_userlevel);

        _order = new uint[](numSelections);

        // Define character arrays for each level and sublevel
        uint[] memory beginnerCharacters = new uint[](11);
        beginnerCharacters[0] = uint(Hero.Spiderman);
        beginnerCharacters[1] = uint(Hero.IronMan);
        beginnerCharacters[2] = uint(Hero.Hawkeye);
        beginnerCharacters[3] = uint(Hero.Wolverine);
        beginnerCharacters[4] = uint(Hero.Batman);
        beginnerCharacters[5] = uint(Hero.WonderWoman);
        beginnerCharacters[6] = uint(Hero.GreenArrow);
        beginnerCharacters[7] = uint(Hero.Flash);
        beginnerCharacters[8] = uint(Villain.Magneto);
        beginnerCharacters[9] = uint(Villain.Thanos);
        beginnerCharacters[10] = uint(Villain.Darkseid);

        uint[] memory eliteCharacters = new uint[](11);
        eliteCharacters[0] = uint(Hero.Spiderman);
        eliteCharacters[1] = uint(Hero.IronMan);
        eliteCharacters[2] = uint(Hero.Hulk);
        eliteCharacters[3] = uint(Hero.MartianManhunter);
        eliteCharacters[4] = uint(Hero.Batman);
        eliteCharacters[5] = uint(Hero.WonderWoman);
        eliteCharacters[6] = uint(Hero.GreenArrow);
        eliteCharacters[7] = uint(Hero.Flash);
        eliteCharacters[8] = uint(Villain.Magneto);
        eliteCharacters[9] = uint(Villain.Thanos);
        eliteCharacters[10] = uint(Villain.Darkseid);

        uint[] memory masterCharacters = new uint[](11);
        masterCharacters[0] = uint(Hero.Superman);
        masterCharacters[1] = uint(Hero.Batman);
        masterCharacters[2] = uint(Hero.WonderWoman);
        masterCharacters[3] = uint(Hero.GreenArrow);
        masterCharacters[4] = uint(Hero.Flash);
        masterCharacters[5] = uint(Hero.IronMan);
        masterCharacters[6] = uint(Hero.Thor);
        masterCharacters[7] = uint(Hero.Hulk);
        masterCharacters[8] = uint(Hero.Spiderman);
        masterCharacters[9] = uint(Hero.Wolverine);
        masterCharacters[10] = uint(Villain.Magneto);
        uint[] memory legendaryCharacters = new uint[](11);

        legendaryCharacters[0] = uint(Hero.Superman);
        legendaryCharacters[1] = uint(Hero.MartianManhunter);
        legendaryCharacters[2] = uint(Hero.GreenArrow);
        legendaryCharacters[3] = uint(Hero.IronMan);
        legendaryCharacters[4] = uint(Hero.Thor);
        legendaryCharacters[5] = uint(Hero.Hulk);
        legendaryCharacters[6] = uint(Hero.WonderWoman);
        legendaryCharacters[7] = uint(Hero.Flash);
        legendaryCharacters[8] = uint(Villain.Thanos);
        legendaryCharacters[9] = uint(Villain.Darkseid);
        legendaryCharacters[10] = uint(Villain.Apocalypse);

        // Determine which characters to select based on the player's level
        uint[] memory selectedCharacters;
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

        uint currentIndex = 0;
        for (uint i = 0; i < numSelections; i++) {
            _order[i] = selectedCharacters[currentIndex];
            currentIndex = (currentIndex + 1) % selectedCharacters.length;
        }
    }

    function setGameOrder(
        Level _userlevel,
        address _player
    ) internal view returns (uint[] memory _correctorder) {
        uint[] memory _characters = setLevelOrdering(_userlevel);

        uint arrayLength = Playerdetails[_player]._noofinput;
        // Create _correctorder array with the determined length
        _correctorder = new uint[](arrayLength);

        for (uint i = 0; i < (_correctorder.length - 1); i++) {
            if (i < _characters.length - 1) {
                _correctorder[i] = _characters[i];
                
            } else {
                _correctorder[i] = _characters[_characters.length % i];
            }
        }

        return _correctorder;
    }

    function getRandomNumber(uint min, uint max) internal view returns (uint) {
        uint randomHash = uint256(blockhash(block.number - 1));
        uint randomNumber = uint(
            keccak256(
                abi.encodePacked(
                    randomHash,
                    block.difficulty,
                    block.coinbase,
                    block.timestamp,
                    block.gaslimit,
                    tx.gasprice,
                    tx.origin
                )
            )
        );
        return (randomNumber % (max - min + 1)) + min;
    }

    function stakeReward() public returns (uint) {
        PlayerDetails storage _user = Playerdetails[msg.sender];
        // Approve the transfer of tokens to the StakingContract
        require(_user._rewardBalance > 0, "staking empty value not allowed");
        require(
            IERC20(rewardToken).approve(stakeAddress, _user._rewardBalance),
            "Approval failed"
        );

        // Call the stake function of the StakingContract
        uint stakedamount = Istake(stakeAddress).stake(
            rewardToken,
            msg.sender,
            _user._rewardBalance
        );
        _user._rewardBalance = 0;
        return stakedamount;
    }

        
    receive() external payable {}

    
    fallback() external payable {}
}
