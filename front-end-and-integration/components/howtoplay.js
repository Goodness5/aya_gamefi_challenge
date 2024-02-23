import Head from 'next/head';
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function HowToPlay({instruction1, instruction2, instruction3, instruction4, instruction5, setInstruction1, setInstruction2, setInstruction3, setInstruction4, setInstruction5}) {
    useEffect(() => {
        AOS.init();
      }, [])
    return (
        <div className='mt-[1cm] bg-[#fff]' style={{border:"2px solid #502"}}>
        <div className='text-center bg-[#002] p-[0.3cm] text-[120%] font-[500]'>How to play Ultimate Galaxy Search <img src="images/gamepad.png" width="30" className='ml-[0.3cm]' style={{display:"inline-block"}} /></div>
        <div className='text-[#001] p-[0.5cm]'>
         <div className='mb-[0.5cm]'>
         {instruction1 ? (<div onClick={(e) => setInstruction1(false)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Connect wallet</span><img src="images/add.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>) :
         (<div className='pb-[0.5cm]' style={{borderBottom:"2px ridge #502"}}>
         <div onClick={(e) => setInstruction1(true)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Connect wallet</span><img src="images/crossed.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>
         <div data-aos="slide-down" className='text-[#002] ml-[1cm] mt-[0.3cm]'>To connect wallet, install Metamask or Trust wallet or any other wallet of your choice on your device. 
         Connect your wallet by clicking on the "Connect wallet" button on the upper right of the screen. Ensure to
         change network to Testnet, then Base Sepolia test network. The display on the screen will change after connecting.</div>
         </div>)
         }
         </div>
         <div className='mb-[0.5cm]'>
         {instruction2 ? (<div onClick={(e) => setInstruction2(false)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Base Sepolia test ETH for gas fees</span><img src="images/add.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>) :
         (<div className='pb-[0.5cm]' style={{borderBottom:"2px ridge #502"}}>
         <div onClick={(e) => setInstruction2(true)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Base Sepolia test ETH for gas fees</span><img src="images/crossed.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>
         <div data-aos="slide-down" className='text-[#002] ml-[1cm] mt-[0.3cm]'>
          With Ultimate Galaxy Search being an on-chain game, Base Sepolia test ETH would be required to pay gas fees for transactions. Base Sepolia can be found on the Base Sepolia faucet.
         </div>
         </div>)
         }
         </div>
         <div className='mb-[0.5cm]'>
         {instruction3 ? (<div onClick={(e) => setInstruction3(false)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Start game</span><img src="images/add.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>) :
         (<div className='pb-[0.5cm]' style={{borderBottom:"2px ridge #502"}}>
         <div onClick={(e) => setInstruction3(true)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Start game</span><img src="images/crossed.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>
         <div data-aos="slide-down" className='text-[#002] ml-[1cm] mt-[0.3cm]'>
          Click on the "Start game" button after connecting wallet to start game. While playing the game, guess the appropriate super hero or villain. Select as much as you want while the timeout feature is running. Immediately your time is up, your game will end. A screen will pop-up 
          prompting you to sign the transaction to submit your score. Your score will be displayed according to your correct number of guesses. If you pass the current stage, you will be upgraded to the next level.
         </div>
         </div>)
         }
         </div>
         <div className='mb-[0.5cm]'>
         {instruction4 ? (<div onClick={(e) => setInstruction4(false)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Reward system</span><img src="images/add.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>) :
         (<div className='pb-[0.5cm]' style={{borderBottom:"2px ridge #502"}}>
         <div onClick={(e) => setInstruction4(true)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Reward system</span><img src="images/crossed.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>
         <div data-aos="slide-down" className='text-[#002] ml-[1cm] mt-[0.3cm]'>
         For every stage passed, you will be rewarded with in-game tokens (UGST). You also get to be rewarded with Ultimate Galaxy Search NFTs for specific levels attained.
         </div>
         </div>)
         }
         </div>
         <div className='mb-[0.5cm]'>
         {instruction5 ? (<div onClick={(e) => setInstruction5(false)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Stake reward</span><img src="images/add.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>) :
         (<div className='pb-[0.5cm]' style={{borderBottom:"2px ridge #502"}}>
         <div onClick={(e) => setInstruction5(true)} className='lg:text-[120%] md:text-[120%] text-[110%] font-[500] cursor-pointer'><img src="images/dot.png" width="20" className='mr-[0.2cm]' style={{display:"inline-block"}} /><span>Stake reward</span><img src="images/crossed.png" width="25" className='float-right' style={{display:"inline-block"}} /></div>
         <div data-aos="slide-down" className='text-[#002] ml-[1cm] mt-[0.3cm]'>
         Optionally, Ultimate Galaxy Search Tokens (UGST) can be staked for as long as you want to obtain more UGST. To stake, connect wallet and click on the "Stake reward" button on the 
         upper right of the screen. It will pop-up the staking dApp. Input the amount to stake and click on the "Stake" button, then sign the transaction with your wallet. Unstaking before 
         a three month period will cost you 10% of your staked amount with no reward.
         </div>
         </div>)
         }
         </div>

         <div className='mt-[2cm]'>
         <Link href="twitter.com"><img src="images/twitter.png" className='m-[0.2cm]' width="25" style={{display:"inline-block"}} /></Link>
         <Link href="facebook.com"><img src="images/facebook.png" className='m-[0.2cm]' width="25" style={{display:"inline-block"}} /></Link>
         <Link href="instagram.com"><img src="images/instagram.png" className='m-[0.2cm]' width="25" style={{display:"inline-block"}} /></Link>
         <Link href="linkedin.com"><img src="images/linkedin.png" className='m-[0.2cm]' width="25" style={{display:"inline-block"}} /></Link>
         </div>
        </div>
      </div>
    )
}