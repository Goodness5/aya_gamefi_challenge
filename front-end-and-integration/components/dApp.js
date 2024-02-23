import Head from 'next/head';
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Dapp({buttonsAudio}) {
    useEffect(() => {
        AOS.init();
      }, [])

      const [stakeOption, setStakeOption] = useState(true)
      const [UGSTamount, setUGSTamount] = useState()
      const stakeWithStakeContract = () => {

      }

      const unstakeWithStakeContract = () => {

      }

      const withdrawReward = () => {

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
  <span className='text-[#111]'>≈ 208</span>
  <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" id="UGSTamount" name="UGSTamount" onChange={(e) => setUGSTamount(e.target.value)} placeholder='0' />
</div>
</div>
<div className='text-center clear-both text-[120%] my-[0.3cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#502] text-[#eee] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => setStakeOption(false) & buttonsAudio(e)}></i></div>
<div className='my-[1cm] text-center text-[#aaa] text-[110%] font-[500]'>Stake for 30 days &nbsp; <i className='fa fa-info-circle'></i></div>
<button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full stakebutton cursor-pointer' onClick={(e) => {e.preventDefault();stakeWithStakeContract(UGSTamount) & buttonsAudio(e)}}>Stake</button>
</form>
</div>)
  :
(<div className='bg-[#111] p-[1cm] rounded-xl dAppdiv'>
<div className='mb-[1cm] text-center font-[500]'>Unstake UGST <img src="images/disappointment.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></div>
<form>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#111] font-[500]'><span>UGST balance</span><span className='float-right text-right text-[#003]'>Unstake amount</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
  <span className='text-[#111]'>≈ 205</span>
  <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" id="UGSTamount" name="UGSTamount" onChange={(e) => setUGSTamount(e.target.value)} placeholder='0' />
</div>
</div>
<div className='text-center clear-both text-[120%] my-[0.3cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#eee] text-[#502] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => setStakeOption(true) & buttonsAudio(e)}></i></div>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#111] font-[500]'><span>You Get (UGST)</span></div>
<div className='mt-[0.5cm] clear-both text-[#111]' style={{display:"block"}}>
 <span>≈ 200.456</span>
</div>
</div>
<div className='my-[1cm] text-center text-[#aaa] text-[110%] font-[500]'>When you unstake before 30 days, you don't get the full amount you staked earlier. You get your staked amount and reward if you unstake after 30 days. &nbsp; <i className='fa fa-info-circle'></i></div>
<button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full stakebutton cursor-pointer' onClick={(e) => {e.preventDefault();unstakeWithStakeContract(UGSTamount) & buttonsAudio(e)}}>Unstake</button>
<div className='mt-[0.5cm] font-[500] text-center'>OR</div>
<button className='text-center py-[0.3cm] bg-[#003] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full stakebutton cursor-pointer' onClick={(e) => {e.preventDefault();withdrawReward() & buttonsAudio(e)}}>Withdraw reward</button>
</form>
</div>)
}
 </div>
    )
}