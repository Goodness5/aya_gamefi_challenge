# Ultimate Galaxy Search Documentation [Web App](https://ultimategalaxysearch.vercel.app) [Demo Video](https://clinexapp.vercel.app)
This blockchain gaming project is built on the Base Sepolia Ethereum network from scratch using gamification concepts, gas optimisation concepts, solidity principles and front end technologies. With a combination of robust smart contracts and an intuitive design aiming for the best user interface and user experience, Ultimate Galaxy Search is the go-to area for blockchain play-to-earn, staking, dApp, ERC-20 and NFTs.

## About the Game
If you are a super hero lover, then this blockchain based game is for you. The game features a collection of 22 superheros and villains. The logic is that at every level of the game, a collection of characters is being searched for in 60 seconds. Typically, between 3 to 5 characters as pre-determined by the game contract are being searched for. A player searches for these characters by clicking on them, and at the end of the duration, a smart contract call is executed to determine if the correct character has been chosen. Ultimate Galaxy Search ensures fairness by allowing the smart contract to determine the correct character randomly. After playing a level, your reward is being determined by the correct number of guesses and you are then rewarded with Ultimate Galaxy Search Tokens (UGST) of which your reward is displayed on the top right of the web app. A button has been created for players to claim their gaming rewards. If you cannot claim, then it means you have no correct guesses.

## Features of the Ultimate Galaxy Serach Game
The game features a robust combination of smart contracts and front end tools ranging from play-to-earn, staking/unstake rewards, dApp, ERC-20, NFTs, smart connect button, game sounds, animations, responsive design, gaming instructions, and overall, an intuitive interface with a smooth user experience.

## Tools used to create the Ultimate Galaxy Search Game

### Smart Contract Tools
Solidity, Foundry

### Front end and Integration Tools
Ethers.js, Next.js, JavaScript, Tailwind CSS

## How to Play the Ultimate Galaxy Search Game

### Connect Wallet
To connect wallet, install Metamask or Trust wallet or any other wallet of your choice on your device's browser. Connect your wallet by clicking on the "Connect wallet" button on the upper right of the screen. Ensure to change network to Testnet, then Base Sepolia test network. The display on the screen will change after connecting.

### Get Base Sepolia test ETH for gas fees payments
With Ultimate Galaxy Search being an on-chain game, Base Sepolia test ETH would be required to pay gas fees for transactions. Base Sepolia ETH can be found on the Base Sepolia faucet.

### Start Game
 Click on the "Start game" button after connecting wallet to start game. While playing the game, guess the appropriate super hero or villain. Select as much as required while the timeout feature is running. Immediately your time is up, your game will end. A button will pop-up prompting you to submit chosen characters and sign the transaction to determine your reward. Your reward will be allocated according to your correct number of guesses. If you pass the current stage, you will be upgraded to the next level. Each level has at least 10 sub-levels. Typically, your reward is allocated after submitting the characters and signing the transaction. Please sign all transactions that pop-up while playing the game.

 ### Reward System
For every stage passed, you will be rewarded with in-game tokens (UGST). You also get to be rewarded with Ultimate Galaxy Search NFTs for specific levels attained. To get your accumulated token rewards, click on the "Withdraw reward" button at the upper right of the screen.

### Stake Rewards
Optionally, Ultimate Galaxy Search Tokens (UGST) can be staked for as long as you want to obtain more UGST. To stake, connect wallet and click on the "Stake reward" button on the 
upper right of the screen. It will pop-up the staking dApp. Input the amount to stake and click on the "Stake" button, then sign the transaction with your wallet (firstly approve, then stake). Unstaking before a 30 day period will cost you 10% of your staked amount with no reward. You also have an option to withdraw staking rewards after 30 days.

## Additional Notes
Thorough documentation about the smart contracts is being discussed below.

## Team Members (Team Questgeeks)
* Patrick Ominisan - Blockchain engineer
* Kolapo Goodness - Smart contract engineer

# Game Contract Documentation

## Enums

### `Hero`

- Superman
- Batman
- WonderWoman
- GreenArrow
- Flash
- GreenLantern
- Aquaman
- MartianManhunter
- IronMan
- Thor
- Hulk
- Spiderman
- Wolverine
- Hawkeye

### `Villain`

- Magneto
- Thanos
- Darkseid
- Loki
- DoctorDoom
- Apocalypse
- Joker
- LexLuthor

### `Level`

- BeginnerI
- BeginnerII
- BeginnerIII
- BeginnerIV
- EliteI
- EliteII
- EliteIII
- EliteIV
- MasterI
- MasterII
- MasterIII
- MasterIV
- Legendary

## Structs

### `PlayerDetails`

- `_playerLevel`: Level of the player.
- `_scorestreak`: Player's score streak.
- `_rewardBalance`: Player's reward balance.
- `_correctorder`: Array containing the correct order of characters for the player.

## Contract Variables

- `LastLegendaryBadgeId`: Id of the last legendary badge issued.
- `rewardToken`: Address of the reward token.
- `stakeAddress`: Address of the staking contract.
- `nftBadge`: Address of the NFT badge contract.
- `Playerdetails`: Mapping of player addresses to their details.
- `usedTokenIds`: Mapping of used token IDs.
- `specificLevel`: Mapping of player addresses to their specific levels.

## Events

### `BadgeIssued`

- Parameters:
  - `player`: Address of the player.
  - `timestamp`: Timestamp when the badge is issued.
- Explanation: Event emitted when a badge is issued to a player upon reaching the legendary level.

## Functions

### `constructor(address _initialOwner, address _nftBadge, address _rewardtoken)`

- Parameters:
  - `_initialOwner`: Initial owner address.
  - `_nftBadge`: Address of the NFT badge contract.
  - `_rewardtoken`: Address of the reward token.
- Explanation: Constructor function to initialize the contract with required addresses.

### `getnumofinput(address _player)`

- Parameters:
  - `_player`: Address of the player.
- Return: Number of characters required for the player's level.
- Explanation: Retrieves the number of gueses o be passed in based on player's level.

### `getplayerLevel()`

- Return: Player's current level and stage.
- Explanation: Retrieves the player's current level and stage.

### `StartGame(uint[] memory _userguess)`

- Parameters:
  - `_userguess`: Array containing the user's guesses.
- Return: Number of correct guesses made by the player.
- Explanation: Starts the game by accepting the player's guesses and calculating the number of correct guesses.

### `calculateNumCharacters(Level _userlevel)`

- Parameters:
  - `_userlevel`: Level of the player.
- Return: Number of characters for the specified level.
- Explanation: Calculates the number of characters based on the player's level.

### `increaseLevel(address player, uint _matches)`

- Parameters:
  - `player`: Address of the player.
  - `_matches`: Number of correct matches made by the player.
- Explanation: Increases the player's level based on the number of correct matches.

### `_withdrawErc20()`

- Explanation: Withdraws ERC20 tokens from the contract to the player.

### `calculateTokens(Level _level, uint _matches)`

- Parameters:
  - `_level`: Level of the player.
  - `_matches`: Number of correct matches made by the player.
- Return: Number of tokens to be issued to the player.
- Explanation: Calculates the number of tokens to be issued to the player based on their level and matches.

### `issueBadge(address player)`

- Parameters:
  - `player`: Address of the player.
- Return: ID of the issued badge.
- Explanation: Issues a badge NFT to the player upon reaching the legendary level.

### `calculateRequiredProgress(Level _level)`

- Parameters:
  - `_level`: Level of the player.
- Return: Required progress for leveling up.
- Explanation: Calculates the required progress for leveling up based on the player's level.

### `validateOrdering(uint[] memory _userOrdering, uint[] memory _correctorder)`

- Parameters:
  - `_userOrdering`: Array containing the user's ordering.
  - `_correctorder`: Array containing the correct ordering.
- Return: Number of correct guesses made by the player.
- Explanation: Validates the user's ordering and returns the number of correct guesses.

### `setLevelOrdering(Level _userlevel)`

- Parameters:
  - `_userlevel`: Level of the player.
- Return: Array containing the ordered characters for the specified level.
- Explanation: Selects chracters a player can pick or choose from based on their level.

### `setGameOrder(Level _userlevel, address _player)`

- Parameters:
  - `_userlevel`: Level of the player.
  - `_player`: Address of the player.
- Return: Array containing the correct order of characters for the player's level.
- Explanation: takes the charcters arrray from setlevelordering and shuffles while also either expanding them or trimming them basd on the lenght of characters the getnumber of input returns.

### `getRandomNumber(uint min, uint max)`

- Parameters:
  - `min`: Minimum range.
  - `max`: Maximum range.
- Return: Random number within the specified range.
- Explanation: Generates a random number within the specified range.
- Bug: The number generated is not truely random but somehow deterministic a little bit.

### `stakeReward()`

- Return: Amount of tokens staked.
- Explanation: Stakes the player's reward tokens in the staking contract.

### GAME CONTRACT : <https://sepolia.basescan.org/address/0x8a20493b81f9568fd12235b110b8c67e960e0cc0>

### REWARD ERC20 TOKEN:  <https://sepolia.basescan.org/address/0xd0b703e2ddc4cb9af423d24d6a2cd3ad191699c1>

### NFT TOKEN REWARD : <https://sepolia.basescan.org/address/0xadc938cd77e465958489d44201d941dc7aa7a2b9>

### STAKING CONTRACT: <https://sepolia.basescan.org/address/0x336ae0aaec99fdcfa9c7005fc7c339b43268a7c3>
