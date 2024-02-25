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
