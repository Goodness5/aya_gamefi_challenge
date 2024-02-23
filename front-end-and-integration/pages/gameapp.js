import Head from 'next/head';
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import SlideAnimation from '@/components/slideanimation';
import HowToPlay from '@/components/howtoplay';
import Dapp from '@/components/dApp';

export default function GameApp(){
  useEffect(() => {
    AOS.init();
  }, [])

  // wallet connection instructions (using the ethers.js library)
  const [connectWallet, setConnectWallet] = useState(true)
  const [connectedWallet, setConnectedWallet] = useState(false)
  const [theWalletAddress, setTheWalletaddress] = useState()
  //to connect our wallet
  //we will use cookies to ensure consistency of the connecting button on all pages of the application
  const cookie = require('cookie');
  const { ethers } = require("ethers");    //require ethers to connect
  const connecttheWallet = async (e) => {
    try {
      e.preventDefault();
      const ethereum = (window).ethereum;
      const accounts = await ethereum.request({
           method: "eth_requestAccounts",
       })
        // first account in MetaMask
       const walletAddress = accounts[0]; 
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner(walletAddress);

      console.log(walletAddress)
      setTheWalletaddress(walletAddress)
      
       // Update state
       setConnectedWallet(true);
       setConnectWallet(false);  

     // Set the wallet address as a cookie on the browser
     document.cookie = `walletaddresscookie1=${encodeURIComponent(walletAddress)}; secure; max-age=${60 * 60 * 24}; sameSite=strict; path=/`;
    } catch (error) {
      console.log('Error connecting to StarkNet:', error.message);
    }
  };

  // this ensures continous mounting of the connecting button and it runs once using the useEffect hook
 const confirmCookies = () => {
  // to check if the wallet address cookie is present
  const walletCookie1 = document.cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith('walletaddresscookie1='));

  if (walletCookie1) {
    // Extracting the wallet address from the cookie
    const walletAddress = decodeURIComponent(walletCookie1.split('=')[1]);

    // Update state
    setConnectedWallet(true);
    setConnectWallet(false);
    setTheWalletaddress(walletAddress);
  }
};

useEffect(() => {
  confirmCookies();
}, []); 


  //to disconnect our wallet
  const disconnectWallet = async(e) => {
    e.preventDefault();
    setConnectedWallet(false)
    setConnectWallet(true)
      // Delete the wallet address cookie
    document.cookie = 'walletaddresscookie1=; max-age=0; path=/';
  } 

  //to start the game
  const [startGame, setStartGame] = useState(false)
  const [connectNotification, setConnectNotification] = useState(false)
  const [gameOnAudio, setgameOnAudio] = useState(null);
  const playAndUpdateGame = () => {
    if (connectedWallet){
    setStartGame(true)
    gameOnAudio.play().catch(error => {
      // Handle autoplay error (e.g., due to browser restrictions)
      console.error('Autoplay error:', error);
    });
    gameOnAudio.volume = 1
    setTimeout(()=> {
        setStartGame(false)
      // Pause the audio before removing it
      gameOnAudio.pause();
      gameOnAudio.currentTime = 0; // Reset the audio to the beginning
      gameOnAudio.remove();
    }, 30000)}
    else {
        setConnectNotification(true)
        setTimeout(()=> {
          setConnectNotification(false)
        }, 5000)
    }
  }

    // create countdown for game start
    const [count, setCount] = useState(30);
    let calculateInterval;

    const countdownInterval = () => {
        if (connectedWallet){
      setCount(30); // Reset the count to 30 when the function is called again
    
      calculateInterval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount === 1) {
            clearInterval(calculateInterval); // Clear the interval when countdown reaches zero
            return 0; // Set count to 0 when countdown reaches zero
          } else {
            return prevCount - 1;
          }
        });
      }, 1000);}
      else {console.log("Please connect wallet!")}
    };

  // Create the audio element to use while playing the game and pass it as a useState effect
  useEffect(() => {
    const newAudio = new Audio("sounds/gamemusic.mp3");
    setgameOnAudio(newAudio);

    // Clean up the original audio element when the component unmounts
    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.currentTime = 0;
        setgameOnAudio(null);
      }
    };
  }, []);

       //to stop the game
       const stopGame = () => {
        setStartGame(false);
        if (gameOnAudio) {
          // Pause the audio before removing it
          gameOnAudio.pause();
          gameOnAudio.currentTime = 0; // Reset the audio to the beginning
          gameOnAudio.remove();
      }
        }

    //play audio for pressing buttons
    const buttonsAudio = () => {
        const audio = new Audio("sounds/navsounds.mp3")
        audio.play().catch(error => {
          // Handle autoplay error (e.g., due to browser restrictions)
          console.error('Autoplay error:', error);
        });
        audio.volume = 1
      }


    //play audio for connecting wallet with buttons
    const connectButtonsAudio = () => {
        const audio = new Audio("sounds/connectsound.mp3")
        audio.play().catch(error => {
          // Handle autoplay error (e.g., due to browser restrictions)
          console.error('Autoplay error:', error);
        });
        audio.volume = 1
      }

      //video for game app
      const [showVideo, setShowVideo] = useState(true)
      useEffect(() => {
        const gameAppVideo = () => {
        const video = document.createElement('video');
        video.src = 'videos/introvideo1.mp4';
        video.volume = 1;
        video.width = 10000;
         // Add event listeners to handle errors or perform actions when the video ends, etc.
      video.addEventListener('error', (error) => {
        console.error('Video error:', error);
      });

      video.addEventListener('ended', () => {
        // Do something when the video ends
      });

      // Append the video element to a div
        const videoContainer = document.getElementsByClassName('videodiv')[0];
        videoContainer.appendChild(video)
        // Play the video
        video.play().catch(error => {
          console.error('Autoplay error:', error);
        });

        setTimeout(()=> {
         // Pause the video before removing it
        video.pause();
        video.currentTime = 0; // Reset the video to the beginning
        video.remove();
        if (videoContainer.contains(video)) {
          videoContainer.removeChild(video); // Remove the video element from the container
        }
        setShowVideo(false)
      }, 60000)
    }
      
     gameAppVideo();
      // Clean up function
     return () => {
      // cleanup task to remove duplicate video elements from the DOM
      const video = document.querySelector('video');
      if (video) {
        video.pause();
        video.parentNode.removeChild(video);
      }
    };
      }, []);

      //useState for game instructions (How to play)
      const [howToPlay, setHowToPlay] = useState(false)
      const [instruction1, setInstruction1] = useState(true)
      const [instruction2, setInstruction2] = useState(true)
      const [instruction3, setInstruction3] = useState(true)
      const [instruction4, setInstruction4] = useState(true)
      const [instruction5, setInstruction5] = useState(true)

      //staking instructions
      const [staking, setStaking] = useState(false)

  return (
    <>
    <Head>
   <title>Ultimate Galaxy Search - Game app</title>
   <link rel="shortcut icon" href="/favicon.ico" />
   </Head>
   <div className='p-[5%] lg:pt-[1cm] pt-[0.5cm] maindiv' style={{backgroundImage:"url(/images/mainbg.jpg)"}}>

     <div>
     <div className="float-right clear-both mb-[0.5cm]">
        {connectWallet ? (<span className="bg-[#001] px-[0.5cm] py-[0.2cm] text-center font-[600] rounded-full cursor-pointer connectwalletbutton" style={{border:"2px solid #fff"}} onClick={(e) => connectButtonsAudio(e) & connecttheWallet(e)}><img src="images/wallet.png" width="23" style={{display:"inline-block"}} /> &nbsp; Connect wallet</span>) : (<div></div>)}
        {connectedWallet ? (<span className="bg-[#002] px-[0.5cm] py-[0.2cm] text-center font-[600] rounded-full cursor-pointer disconnectwalletbutton" style={{border:"2px solid #502"}} onClick={(e) => connectButtonsAudio(e) & disconnectWallet(e) & stopGame(e)}><img src="images/wallet.png" width="23" style={{display:"inline-block"}} /> &nbsp; Connected &nbsp; {theWalletAddress.substring(0, 5)}...{theWalletAddress.substring(37, 42)}</span>) : (<div></div>)}
     </div>
     {connectedWallet ? (<span className='float-right clear-both lg:mb-[1cm] mb-[0.7cm] bg-[rgba(0,0,20,0.7)] p-[0.5cm] rounded-md mr-[0.1cm]' style={{boxShadow:"2px 2px 3px 1px #502"}}>
        <div className='py-[0.1cm] px-[0.3cm] rounded-md bg-[#001]' style={{border:"1px solid #fff"}}><span className='font-[600]'>Level <i className='fa fa-chevron-down text-[80%] mr-[0.1cm]'></i></span> Beginner I</div>
        <div className='py-[0.1cm] px-[0.3cm] my-[0.2cm] rounded-md bg-[#001]' style={{border:"1px solid #fff"}}><span className='font-[600]'>Reward <i className='fa fa-chevron-down text-[80%] mr-[0.2cm]'></i></span> 0 UGST</div>
        <div className='py-[0.1cm] px-[0.3cm] my-[0.2cm] rounded-md bg-[#001]' style={{border:"1px solid #fff"}}><span className='font-[600]'>Staked balance <i className='fa fa-chevron-down text-[80%] mr-[0.2cm]'></i></span> 0 UGST</div>
        {startGame ? (<div></div>) : (<button className='bg-[#502] text-[#fff] px-[0.3cm] py-[0.1cm] rounded-md mt-[0.1cm] w-[100%] stakebutton' onClick={(e) => buttonsAudio(e) & setStaking(true)}>Stake/unstake reward <img src="images/coin.png" width="20" className='ml-[0.2cm] stakecoinimg' style={{display:"inline-block"}} /></button>)}
     </span>) : (<div></div>)}
     {startGame ? (<div className='lg:text-[350%] md:text-[200%] text-[150%] clear-both text-center font-[500]'>
        <span className='p-[0.4cm] rounded-[100%] fa-fade bg-[#fff] text-[#502]' style={{border:"2px solid #502", transition:"0.2s ease-in-out"}}>{count}</span>
     </div>) :
     (<div className='text-center clear-both'>
     <button className='bg-[#502] m-[0.2cm] text-[#fff] px-[0.5cm] py-[0.15cm] rounded-full navbutton' onClick={(e) => buttonsAudio(e) & playAndUpdateGame(e) & countdownInterval(e)}>Start game <img src="images/game-controller.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}} /></button>
     <button className='bg-[#502] m-[0.2cm] text-[#fff] px-[0.5cm] py-[0.15cm] rounded-full navbutton' onClick={(e) => buttonsAudio(e) & setHowToPlay(true) & setShowVideo(false)}>How to play <img src="images/play.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}} /></button>
     {connectNotification ? (<div data-aos="slide-up" className='text-[#fff] mt-[0.1cm] font-[500]'>Please connect wallet! <img src="images/disappointment.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></div>) : (<div></div>)}
     </div>)}
     </div>

    {howToPlay ? 
     (<div className='howToPlay bg-[rgba(0,0,0,0.9)] w-[100%] mx-[-5%] lg:pb-[100%] pb-[200%] top-0' style={{position:"absolute", zIndex:"9999"}}>
      <div data-aos="zoom-out" className='lg:mx-[25%] md:mx-[10%] mx-[5%]'>
      <img src="images/cancel.png" width="40" className='m-[auto] lg:mt-[12%] md:mt-[15%] mt-[25%] cursor-pointer cancelnavbutton rounded-[100%]' onClick={(e) => buttonsAudio(e) & setHowToPlay(false)} />
       <HowToPlay instruction1={instruction1} instruction2={instruction2} setInstruction1={setInstruction1} setInstruction2={setInstruction2} instruction3={instruction3} instruction4={instruction4} setInstruction3={setInstruction3} setInstruction4={setInstruction4} instruction5={instruction5} setInstruction5={setInstruction5} />
      </div>
     </div>) : (<div></div>)
     }

     {staking ? 
      (<div className='bg-[rgba(0,0,0,0.9)] w-[100%] mx-[-5%] lg:pb-[100%] pb-[200%] top-0' style={{position:"absolute", zIndex:"9999"}}>
      <div data-aos="zoom-out" className='lg:mx-[30%] md:mx-[25%] mx-[5%]'>
      <img src="images/cancel.png" width="40" className='m-[auto] lg:mt-[12%] md:mt-[15%] mt-[25%] cursor-pointer cancelnavbutton rounded-[100%]' onClick={(e) => buttonsAudio(e) & setStaking(false)} />
      <Dapp buttonsAudio={buttonsAudio}/>
      </div>
      </div>) : 
      (<div></div>)
     }


     <div className='mt-[1cm] m-[-5%] '>
     {connectedWallet ? 
     (<div>
   This is the game play div
     </div>)
        :
      (<div className='lg:mx-[20%] m-[5%]'>
     {showVideo ? (<div className='videodiv' style={{boxShadow:"2px 2px 15px 2px rgba(0,0,0,0.8)"}}></div>) :
     (<SlideAnimation />)
     }
     </div>)
     }
     </div>

   </div>
  </>
  );
};

