// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib//openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib//openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract StakingContract is Ownable {

    constructor(address _initialowner) Ownable(_initialowner) {}

    struct TokenData {
        address tokenAddress;
        uint256 rewardRate; 
        uint256 lastUpdateTime;
        uint256 rewardPerTokenStored;
        uint256 totalBalance; 
    }

    struct Stake {
        uint256 amount;
        uint256 startTime;
        TokenData token;
    }
    mapping(address => Stake) stakes;

    mapping(address => TokenData) public tokens;

    event Staked(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event RewardPaid(address indexed user, address indexed token, uint256 reward);

    function stake(address token, address _staker, uint256 amount) public returns(uint) {
        require(amount > 0, "Amount must be greater than 0");
        TokenData storage tokenData = tokens[token];
        require(tokenData.tokenAddress != address(0), "Token not supported");
        require(
            IERC20(token).transferFrom(_staker, address(this), amount),
            "Transfer failed"
        );

        _updateReward(token, _staker);
        stakes[_staker].amount += amount;

        tokenData.totalBalance += amount; 

        stakes[_staker].startTime = block.timestamp;

        emit Staked(msg.sender, token, amount);
        return amount;
    }

    function withdraw(address token) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake to withdraw");

        _updateReward(token, msg.sender);

        uint256 amount = userStake.amount;
        delete stakes[msg.sender];

        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");

        TokenData storage tokenData = tokens[token];
        tokenData.totalBalance -= amount; 

        emit Withdrawn(msg.sender, token, amount);
    }

    function getReward(address token) external {
        TokenData storage tokenData = tokens[token];
        _updateReward(token, msg.sender);

        uint256 reward = stakes[msg.sender].amount *
            (tokenData.rewardPerTokenStored - stakes[msg.sender].startTime) /
            tokenData.rewardRate;
        require(reward > 0, "No reward to claim");

        tokenData.rewardPerTokenStored -= reward;
        stakes[msg.sender].startTime = block.timestamp;

        require(IERC20(token).transfer(msg.sender, reward), "Transfer failed");

        emit RewardPaid(msg.sender, token, reward);
    }

    function _updateReward(address token, address user) internal {
        TokenData storage tokenData = tokens[token];
        tokenData.rewardPerTokenStored +=
            (block.timestamp - tokenData.lastUpdateTime) *
            tokenData.rewardRate /
            stakes[user].amount;
        tokenData.lastUpdateTime = block.timestamp;
    }

    function addToken(address token, uint256 rewardRate, uint256 initialDepositAmount) external onlyOwner {
        require(token != address(0), "Invalid address");
        require(rewardRate > 0, "Reward rate must be greater than 0");
        require(tokens[token].tokenAddress == address(0), "Token already added");

        tokens[token] = TokenData(token, rewardRate, block.timestamp, 0, 0);

        if (initialDepositAmount > 0) {
            require(
                IERC20(token).transferFrom(msg.sender, address(this), initialDepositAmount),
                "Transfer failed"
            );
            stakes[owner()].amount += initialDepositAmount;
            stakes[owner()].startTime = block.timestamp;
            tokens[token].totalBalance += initialDepositAmount; 
        }
    }
}
