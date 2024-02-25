import Head from 'next/head';
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Dapp({buttonsAudio, playerRewardBalance, stakeContractAddress, stakeContractABI, rewardContractAddress, rewardContractABI, setStaking, playerStakingReward }) {
    useEffect(() => {
        AOS.init();
      }, [])

      const { ethers } = require("ethers");    //require ethers to connect
      const [stakeOption, setStakeOption] = useState(true)
      const [UGSTamount, setUGSTamount] = useState()
      const [stakeError, setstakeError] = useState(false)
      const [unstakeError, setUnstakeError] = useState(false)
      const [withdrawstakingRewardError, setwithdrawstakingRewardError] = useState(false)

      //to stake UGST
      const stakeWithStakeContract = async () => {
        const ethereum = (window).ethereum;
        const accounts = await ethereum.request({
             method: "eth_requestAccounts",
         })
          // first account in MetaMask
         const walletAddress = accounts[0]; 
         const provider = new ethers.providers.Web3Provider(ethereum);
         const signer = provider.getSigner(walletAddress);
         const stakeContractWriteSettings = new ethers.Contract(stakeContractAddress, stakeContractABI, signer)
         const rewardContractWriteSettings = new ethers.Contract(rewardContractAddress, rewardContractABI, signer)
         try {
          if (playerRewardBalance > 0){
            //first approve staking contract to spend reward token
          const approveStakingContractFRomRewardContract = await rewardContractWriteSettings.connect(signer).approve(stakeContractAddress, ethers.utils.parseUnits(UGSTamount, 18));
          const writeToStake = await stakeContractWriteSettings.connect(signer).stake(rewardContractAddress, ethers.utils.parseUnits(UGSTamount, 18));
          setStaking(false)
         }
          else {
            setstakeError(true)
            setTimeout(()=> {
              setstakeError(false)
            }, 5000)
          }
         } catch (error) {
          console.log(error)
         }
      }

      //to unstake UGST
      const unstakeWithStakeContract = async () => {
        const ethereum = (window).ethereum;
        const accounts = await ethereum.request({
             method: "eth_requestAccounts",
         })
          // first account in MetaMask
         const walletAddress = accounts[0]; 
         const provider = new ethers.providers.Web3Provider(ethereum);
         const signer = provider.getSigner(walletAddress);
         const stakeContractWriteSettings = new ethers.Contract(stakeContractAddress, stakeContractABI, signer)
         try {
          if (playerStakingReward == 0){
            setUnstakeError(true)
            setTimeout(()=> {
              setUnstakeError(false)
            }, 5000)
          }
          const writeToUnstake = await stakeContractWriteSettings.connect(signer).unstake();
         } catch (error) {
          console.log(error)
         }
      }

      //to withdraw staking rewards
      const withdrawStakingReward = async () => {
        const ethereum = (window).ethereum;
        const accounts = await ethereum.request({
             method: "eth_requestAccounts",
         })
          // first account in MetaMask
         const walletAddress = accounts[0]; 
         const provider = new ethers.providers.Web3Provider(ethereum);
         const signer = provider.getSigner(walletAddress);
         const stakeContractWriteSettings = new ethers.Contract(stakeContractAddress, stakeContractABI, signer)
         try {
          if (playerStakingReward > 0) {
            const writeToWithdrawStakingReward = await stakeContractWriteSettings.connect(signer).claimReward();
          }
          else {
            setwithdrawstakingRewardError(true)
            setTimeout(()=> {
              setwithdrawstakingRewardError(false);
            }, 5000)
          }
         } catch (error) {
          console.log(error)
         }
      }

    return (
        <div className='mt-[2cm]'>
    {stakeOption ? 
(<div className='bg-[#001] p-[1cm] rounded-xl dAppdiv'>
<div className='mb-[1cm] text-center font-[500]'>Stake UGST to earn huge rewards</div>
<form>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#111] font-[500]'><span>UGST balance</span><span className='float-right text-right text-[#003]'>Stake amount</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
  <span className='text-[#111]'>≈ {playerRewardBalance}</span>
  <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" id="UGSTamount" name="UGSTamount" onChange={(e) => setUGSTamount(e.target.value)} placeholder='0' />
</div>
</div>
<div className='text-center clear-both text-[120%] my-[0.3cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#502] text-[#eee] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => setStakeOption(false) & buttonsAudio(e)}></i></div>
<div className='my-[1cm] text-center text-[#aaa] text-[110%] font-[500]'>Stake for at least 30 days &nbsp; <i className='fa fa-info-circle'></i></div>
<button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full stakebutton cursor-pointer' onClick={(e) => {e.preventDefault();stakeWithStakeContract(UGSTamount) & buttonsAudio(e)}}>Stake</button>
{stakeError ? (<div className='text-center my-[0.5cm] font-[500]'>You don't have rewards to stake <span><img src="images/disappointment.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></span></div>) : (<div></div>)}
</form>
</div>)
  :
(<div className='bg-[#111] p-[1cm] rounded-xl dAppdiv'>
<div className='mb-[1cm] text-center font-[500]'>Unstake UGST <img src="images/disappointment.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></div>
<form>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#111] font-[500]'><span>UGST balance</span><span className='float-right text-right text-[#003]'>Staking reward</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
  <span className='text-[#111]'>≈ {playerRewardBalance}</span>
  <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" value={playerStakingReward} />
</div>
</div>
<div className='text-center clear-both text-[120%] my-[0.3cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#eee] text-[#502] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => setStakeOption(true) & buttonsAudio(e)}></i></div>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#111] font-[500]'><span>You Get (UGST)</span></div>
<div className='mt-[0.5cm] clear-both text-[#111]' style={{display:"block"}}>
 <span>≈ Amount staked + {playerStakingReward}</span>
</div>
</div>
<div className='my-[1cm] text-center text-[#aaa] text-[110%] font-[500]'>When you unstake before 30 days, you don't get the full amount you staked earlier. You get your full staked amount and reward if you unstake after 30 days. &nbsp; <i className='fa fa-info-circle'></i></div>
<button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full stakebutton cursor-pointer' onClick={(e) => {e.preventDefault();unstakeWithStakeContract() & buttonsAudio(e)}}>Unstake</button>
{unstakeError ? (<div className='text-center my-[0.5cm] font-[500]'>Oops! You don't seem to have accumulated rewards yet<span><img src="images/disappointment.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></span></div>) : (<div></div>)}
<div className='mt-[0.5cm] font-[500] text-center'>OR</div>
<button className='text-center py-[0.3cm] bg-[#003] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full stakebutton cursor-pointer' onClick={(e) => {e.preventDefault();withdrawStakingReward() & buttonsAudio(e)}}>Withdraw staking reward</button>
{withdrawstakingRewardError ? (<div className='text-center my-[0.5cm] font-[500]'>Oops! What exactly are you trying to do? <span><img src="images/shocked.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></span></div>) : (<div></div>)}
</form>
</div>)
}
 </div>
    )
}