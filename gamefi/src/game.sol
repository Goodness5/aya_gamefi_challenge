// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from '../lib/openzeppelin-contracts/contracts/access/Ownable.sol';

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
        
    }

    mapping (address => PlayerDetails) public Playerdetails;
    mapping(address => uint[]) public userOrdering;
    mapping(address => mapping(Level => uint)) public specificLevel;
    uint[] public correctOrder;

    constructor(address _initialOwner) Ownable(_initialOwner) {
        
    }

    function calculateNumCharacters(Level _userlevel) internal pure returns (uint) {
        uint baseNumCharacters = 3; // Starting number of characters
        uint incrementFactor = 2; // Factor by which the number of characters increases per level
        uint numCharacters = baseNumCharacters;

        for (uint i = 0; i < uint(_userlevel); i++) {
            numCharacters *= incrementFactor;
        }

        return numCharacters;
    }




    // Function to set characters for each level
    function setLevelOrdering(Level _userlevel, address _playeraddress) internal returns(uint[] memory _order) {
        uint numCharacters = 22; // Total number of characters (heroes and villains)
        uint numSelections = calculateNumCharacters(_userlevel);

        _order = new uint[](numSelections);

        // Define character arrays for each level and sublevel
        uint[11] memory beginnerCharacters = [uint(Hero.Spiderman), uint(Hero.IronMan), uint(Hero.Hawkeye), uint(Hero.Wolverine), uint(Hero.Batman), uint(Hero.WonderWoman), uint(Hero.GreenArrow), uint(Hero.Flash), uint(Villain.Magneto), uint(Villain.Thanos), uint(Villain.Darkseid)];
        uint[11] memory eliteCharacters = [uint(Hero.Spiderman), uint(Hero.IronMan), uint(Hero.Hulk), uint(Hero.MartianManhunter), uint(Hero.Batman), uint(Hero.WonderWoman), uint(Hero.GreenArrow), uint(Hero.Flash), uint(Villain.Magneto), uint(Villain.Thanos), uint(Villain.Darkseid)];
        uint[11] memory masterCharacters = [uint(Hero.Superman), uint(Hero.Batman), uint(Hero.WonderWoman), uint(Hero.GreenArrow), uint(Hero.Flash), uint(Hero.IronMan), uint(Hero.Thor), uint(Hero.Hulk), uint(Hero.Spiderman), uint(Hero.Wolverine), uint(Villain.Magneto)];
        uint[11] memory legendaryCharacters = [uint(Hero.Superman), uint(Hero.MartianManhunter), uint(Hero.GreenArrow), uint(Hero.IronMan), uint(Hero.Thor), uint(Hero.Hulk), uint(Hero.WonderWoman), uint(Hero.Flash), uint(Villain.Thanos), uint(Villain.Darkseid), uint(Villain.Apocalypse)];

        // Determine which characters to select based on the player's level
        uint[11] memory selectedCharacters;
        if (_userlevel == Level.BeginnerI || _userlevel == Level.BeginnerII || _userlevel == Level.BeginnerIII || _userlevel == Level.BeginnerIV) {
            selectedCharacters = beginnerCharacters;
        } else if (_userlevel == Level.EliteI || _userlevel == Level.EliteII || _userlevel == Level.EliteIII || _userlevel == Level.EliteIV) {
            selectedCharacters = eliteCharacters;
        } else if (_userlevel == Level.MasterI || _userlevel == Level.MasterII || _userlevel == Level.MasterIII || _userlevel == Level.MasterIV) {
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
        currentLevelProgress += _matches;

        if (currentLevelProgress >= 10) {
            if (currentLevel == Level.Legendary) {
                // Handle reaching the maximum level
                return;
            }
            // Increment to the next level
            playerDetails._playerLevel = Level(uint(currentLevel) + 1);
            // Reset the progress for the new level
            specificLevel[player][playerDetails._playerLevel] = 0;
        }
    }

    // Function to validate the user's ordering
    function validateOrdering() public view returns (bool) {
        require(userOrdering[msg.sender].length == correctOrder.length, "Invalid ordering length");
        for (uint i = 0; i < correctOrder.length; i++) {
            if (userOrdering[msg.sender][i] != correctOrder[i]) {
                return false;
            }
        }
        return true;
    }

    function setGameOrder(Level _userlevel, address _playeraddress) internal returns (uint[] memory _correctorder) {
        uint[] memory _characters = setLevelOrdering(_userlevel, _playeraddress);
        
        // Define the minimum and maximum values for array length based on the level
        uint minRange;
        uint maxRange;
        
        if (_userlevel == Level.BeginnerI || _userlevel == Level.BeginnerII || _userlevel == Level.BeginnerIII || _userlevel == Level.BeginnerIV) {
            minRange = 3;
            maxRange = 5;
        } else if (_userlevel == Level.EliteI || _userlevel == Level.EliteII || _userlevel == Level.EliteIII || _userlevel == Level.EliteIV) {
            minRange = 5;
            maxRange = 7;
        } else if (_userlevel == Level.MasterI || _userlevel == Level.MasterII || _userlevel == Level.MasterIII || _userlevel == Level.MasterIV) {
            minRange = 7;
            maxRange = 9;
        } else if (_userlevel == Level.Legendary) {
            // Define the range for Legendary level
            minRange = 9;
            maxRange = _characters.length; // Set maximum range to the length of _characters array
        }
        
        // Calculate the array length within the defined range
        uint arraylength = (block.number % (maxRange - minRange + 1)) + minRange;

        _correctorder = new uint[](arraylength);
        for (uint i = 0; i < arraylength; i++) {
            _correctorder[i] = _characters[i % _characters.length];
        }
        return _correctorder;
    }


}
