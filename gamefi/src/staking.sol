// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {IERC20} from "./interface.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

//users stake stakableTokens
//user get 20% APY CVIII as reward;
// token ratio 1: 1

contract StakERC20 is Ownable {
    IERC20 public rewardToken;
    IERC20[] public stakableTokens;
    

    uint256 constant SECONDS_PER_YEAR = 31536000;
    uint256 constant PENALTY_RATE = 10;

    struct User {
        uint256 stakedAmount;
        uint256 startTime;
        uint256 rewardAccrued;
        IERC20 stakeToken;
    }

    mapping(address => User) user;
    error tryAgain();

    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
    
    }

       modifier isStakable(address token) {
            require(_isStakable(token)==true, "token not stakable");
            _;
    }

function setStakeToken(address _token)
    external
    returns (address _newToken)
{
    require(_isStakable(_token) == false, "token already stakable");
    require(IERC20(_token) != rewardToken, "cannot stake reward");
    require(_token != address(0), "cannot set address zero");

    _newToken = address(IERC20(_token));
    stakableTokens.push(IERC20(_token));

    // Update the stakeToken for each user who has staked the token
    for (uint256 i = 0; i < stakableTokens.length; i++) {
        if (address(stakableTokens[i]) == _token) {
            User storage _user = user[msg.sender];
            _user.stakeToken = IERC20(_token);
        }
    }
}

    function _isStakable(address token) internal view returns (bool) {
        for (uint256 i = 0; i < stakableTokens.length; i++) {
            if (address(stakableTokens[i]) == token) {
                return true;
            }
        }
        return false;
    }

    function stake(address token, uint256 amount) external isStakable(token) {
        User storage _user = user[msg.sender];
        require(token != address(0), "address zero unstakabble");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        if (_user.stakedAmount == 0) {
            _user.stakeToken = IERC20(token);
            _user.stakedAmount = amount;
            _user.startTime = block.timestamp;
        } else {
            require(token == address(_user.stakeToken), "user already staked a different token");
            updateReward();
            _user.stakedAmount += amount;
        }
    }
 

    function addStakableToken(address token) public onlyOwner {
        require(!_isStakable(token), "Token already stakable");
        require(token != address(0), "cannot add address zero");
        require(token != address(rewardToken), "cannot stake reward");

        stakableTokens.push(IERC20(token));
    }

 function removeStakableToken(address token) external onlyOwner {
    require(_isStakable(token), "Token not stakable");
    for (uint256 i = 0; i < stakableTokens.length; i++) {
        if (address(stakableTokens[i]) == token) {
            if (i != stakableTokens.length - 1) {
                stakableTokens[i] = stakableTokens[stakableTokens.length - 1];
            }
            stakableTokens.pop();
            return;
        }
    }
}



    function calcReward() public view returns (uint256 _reward) {
        User storage _user = user[msg.sender];
        uint256 _amount = _user.stakedAmount;
        uint256 _startTime = _user.startTime;
        uint256 duration = block.timestamp - _startTime; 
        _reward = (duration * 20 * _amount) / (SECONDS_PER_YEAR * 100);
    }

function claimReward() public {
    User storage _user = user[msg.sender];
    updateReward();

    require(block.timestamp - _user.startTime >= 30, "stake duration less than a month");
    uint256 currentTime = block.timestamp;


    // require(_claimableReward >= amount, "insufficient funds");
    _user.startTime = currentTime;
    rewardToken.transfer(msg.sender, _user.rewardAccrued);
    _user.rewardAccrued = 0;
}


    function updateReward() public {
        User storage _user = user[msg.sender];
        uint256 _reward = calcReward();
        _user.rewardAccrued += _reward;
        _user.startTime = block.timestamp;
    }

function unstake() public {
    User storage _user = user[msg.sender];
    uint256 staked = _user.stakedAmount;
    require(staked > 0, "no staked amount");

    updateReward();

    uint256 penaltyAmount = 0;
    uint256 currentTime = block.timestamp;
    uint256 stakeDuration = currentTime - _user.startTime;

    if (stakeDuration < 30 days) {
        penaltyAmount = (staked) * PENALTY_RATE / 100;
    }

    // Calculate total amount to transfer to msg.sender (staked amount + reward)
    uint256 totalAmount = staked + _user.rewardAccrued;

    // Deduct 10% to keep
    uint256 keepAmount = totalAmount * 10 / 100;
    totalAmount -= keepAmount;

    // Reset staked amount and reward accrued
    _user.stakedAmount = 0;
    _user.rewardAccrued = 0;

    // Transfer total amount to msg.sender
    require(_user.stakeToken.transfer(msg.sender, totalAmount), "transfer failed");
}




    function userInfo(address _user) external view returns (User memory) {
        return user[_user];
    }
}