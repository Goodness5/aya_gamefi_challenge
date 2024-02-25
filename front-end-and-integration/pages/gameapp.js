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
import {gameContractABI, rewardContractABI, nftContractABI, stakeContractABI} from '@/abi'

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
    setnumberOfInputs(true)
    //for audio
    gameOnAudio.play().catch(error => {
      // Handle autoplay error (e.g., due to browser restrictions)
      console.error('Autoplay error:', error);
    });
    gameOnAudio.volume = 1
      //to first clear the blur useStates for the characters
      setbatmanblur("none");setspidermanblur("none");setmagnetoblur("none"); setthanosblur("none");setflashblur("none");setgreenarrowblur("none");
      setironmanblur("none");sethawkeyeblur("none");setwonderwomanblur("none"); setwolverineblur("none");setdarkseidblur("none");
      setGreenLanternblur("none");setAquamanblur("none");setMartianManhunterblur("none"); setThorblur("none");setHulkblur("none");setLokiblur("none");
      setDoctorDoomblur("none");setApocalypseblur("none");setJokerblur("none"); setLexLuthorblur("none");setSupermanblur("none");

      setbatman(null);setspiderman(null);setmagneto(null);setthanos(null);setflash(null);setgreenarrow(null);setironman(null);sethawkeye(null);
      setwonderwoman(null);setwolverine(null);setdarkseid(null);
      setGreenLantern(null);setAquaman(null);setMartianManhunter(null);setThor(null);setHulk(null);setLoki(null);setDoctorDoom(null);setApocalypse(null);
      setJoker(null);setLexLuthor(null);setSuperman(null);
      
    setTimeout(()=> {
        setStartGame(false)
        setSendValues(true)
        setnumberOfInputs(false)
      // Pause the audio before removing it
      gameOnAudio.pause();
      gameOnAudio.currentTime = 0; // Reset the audio to the beginning
      gameOnAudio.remove();
    }, 60000)}
    
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
      setCount(60); // Reset the count to 60 when the function is called again
    
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

      //useState for game instructions (How to play)
      const [howToPlay, setHowToPlay] = useState(false)
      const [instruction1, setInstruction1] = useState(true)
      const [instruction2, setInstruction2] = useState(true)
      const [instruction3, setInstruction3] = useState(true)
      const [instruction4, setInstruction4] = useState(true)
      const [instruction5, setInstruction5] = useState(true)

      //staking instructions
      const [staking, setStaking] = useState(false)

            //setting up useState for values of all the characters
            const [batman, setbatman] = useState("")
            const [spiderman, setspiderman] = useState("")
            const [magneto, setmagneto] = useState("")
            const [thanos, setthanos] = useState("")
            const [flash, setflash] = useState("")
            const [greenarrow, setgreenarrow] = useState("")
            const [ironman, setironman] = useState("")
            const [hawkeye, sethawkeye] = useState("")
            const [wonderwoman, setwonderwoman] = useState("")
            const [wolverine, setwolverine] = useState("")
            const [darkseid, setdarkseid] = useState("")
            const [GreenLantern, setGreenLantern] = useState("")
            const [Aquaman, setAquaman] = useState("")
            const [MartianManhunter, setMartianManhunter] = useState("")
            const [Thor, setThor] = useState("")
            const [Hulk, setHulk] = useState("")
            const [Loki, setLoki] = useState("")
            const [DoctorDoom, setDoctorDoom] = useState("")
            const [Apocalypse, setApocalypse] = useState("")
            const [Joker, setJoker] = useState("")
            const [LexLuthor, setLexLuthor] = useState("")
            const [Superman, setSuperman] = useState("")
      
            //setting up useState for blur effect on all characters
            const [batmanblur, setbatmanblur] = useState("blur(7px)")
            const [spidermanblur, setspidermanblur] = useState("blur(7px)")
            const [magnetoblur, setmagnetoblur] = useState("blur(7px)")
            const [thanosblur, setthanosblur] = useState("blur(7px)")
            const [flashblur, setflashblur] = useState("blur(7px)")
            const [greenarrowblur, setgreenarrowblur] = useState("blur(7px)")
            const [ironmanblur, setironmanblur] = useState("blur(7px)")
            const [hawkeyeblur, sethawkeyeblur] = useState("blur(7px)")
            const [wonderwomanblur, setwonderwomanblur] = useState("blur(7px)")
            const [wolverineblur, setwolverineblur] = useState("blur(7px)")
            const [darkseidblur, setdarkseidblur] = useState("blur(7px)")
            const [GreenLanternblur, setGreenLanternblur] = useState("blur(7px)")
            const [Aquamanblur, setAquamanblur] = useState("blur(7px)")
            const [MartianManhunterblur, setMartianManhunterblur] = useState("blur(7px)")
            const [Thorblur, setThorblur] = useState("blur(7px)")
            const [Hulkblur, setHulkblur] = useState("blur(7px)")
            const [Lokiblur, setLokiblur] = useState("blur(7px)")
            const [DoctorDoomblur, setDoctorDoomblur] = useState("blur(7px)")
            const [Apocalypseblur, setApocalypseblur] = useState("blur(7px)")
            const [Jokerblur, setJokerblur] = useState("blur(7px)")
            const [LexLuthorblur, setLexLuthorblur] = useState("blur(7px)")
            const [Supermanblur, setSupermanblur] = useState("blur(7px)")
      
      
            //Contract addresses, RPC and their settings to write to and read from contracts
            const BaseSepoliaRPC = new ethers.providers.JsonRpcProvider("https://base-sepolia.g.alchemy.com/v2/qI8bxNGIpzU-b3LNo8LbOvPUf_VRgbiu");
            //For Game contract
            const gameContractAddress = "0x8a20493b81F9568FD12235b110b8c67E960E0cc0"         
            const readGameContractSettings = new ethers.Contract(gameContractAddress, gameContractABI, BaseSepoliaRPC)

            //for reward contract
            const rewardContractAddress = "0xd0B703E2dDc4Cb9aF423d24D6a2Cd3aD191699c1" 
            const readRewardContractSettings = new ethers.Contract(rewardContractAddress, rewardContractABI, BaseSepoliaRPC)

            //for NFT contract
            const nftContractAddress = "0xaDc938CD77e465958489D44201D941dC7Aa7a2B9"       
            const readNFTContractSettings = new ethers.Contract(nftContractAddress, nftContractABI, BaseSepoliaRPC)

            //for staking contract
            const stakeContractAddress = "0x336AE0AaEc99fDcfa9c7005FC7c339B43268A7c3"   
            const readStakeContractSettings = new ethers.Contract(stakeContractAddress, stakeContractABI, BaseSepoliaRPC)

           //functions to read from contracts
           const [PLayerLevel, setPlayerLevel] = useState("Beginner I")
           const [playerRewardBalance, setplayerRewardBalance] = useState()
           const [playerStakingReward, setPlayerStakingReward] = useState()
           useEffect(()=> {
           const readFromContracts = async () => {
            try {
              const readPlayerLevel = await readGameContractSettings.getplayerLevel();
              const convertedPlayerLevel = readPlayerLevel.toString()
              if (convertedPlayerLevel == "0,0" ||
              convertedPlayerLevel == "0,1" ||
              convertedPlayerLevel == "0,2" ||
              convertedPlayerLevel == "0,3" ||
              convertedPlayerLevel == "0,4" ||
              convertedPlayerLevel == "0,5" ||
              convertedPlayerLevel == "0,6" ||
              convertedPlayerLevel == "0,7" ||
              convertedPlayerLevel == "0,8" ||
              convertedPlayerLevel == "0,9" ||
              convertedPlayerLevel == "0,10"){
              setPlayerLevel("Beginner I")
              }
              else if (convertedPlayerLevel == "1,0" ||
              convertedPlayerLevel == "1,1" ||
              convertedPlayerLevel == "1,2" ||
              convertedPlayerLevel == "1,3" ||
              convertedPlayerLevel == "1,4" ||
              convertedPlayerLevel == "1,5" ||
              convertedPlayerLevel == "1,6" ||
              convertedPlayerLevel == "1,7" ||
              convertedPlayerLevel == "1,8" ||
              convertedPlayerLevel == "1,9" ||
              convertedPlayerLevel == "1,10"){
                setPlayerLevel("Beginner II")
                }
                else if (
                  convertedPlayerLevel == "2,0" ||
                  convertedPlayerLevel == "2,1" ||
                  convertedPlayerLevel == "2,2" ||
                  convertedPlayerLevel == "2,3" ||
                  convertedPlayerLevel == "2,4" ||
                  convertedPlayerLevel == "2,5" ||
                  convertedPlayerLevel == "2,6" ||
                  convertedPlayerLevel == "2,7" ||
                  convertedPlayerLevel == "2,8" ||
                  convertedPlayerLevel == "2,9" ||
                  convertedPlayerLevel == "2,10"
                ) {
                  setPlayerLevel("Beginner III");
                }
                else if (
                  convertedPlayerLevel == "3,0" ||
                  convertedPlayerLevel == "3,1" ||
                  convertedPlayerLevel == "3,2" ||
                  convertedPlayerLevel == "3,3" ||
                  convertedPlayerLevel == "3,4" ||
                  convertedPlayerLevel == "3,5" ||
                  convertedPlayerLevel == "3,6" ||
                  convertedPlayerLevel == "3,7" ||
                  convertedPlayerLevel == "3,8" ||
                  convertedPlayerLevel == "3,9" ||
                  convertedPlayerLevel == "3,10"
                ) {
                  setPlayerLevel("Beginner IV");
                }
                else if (
                  convertedPlayerLevel == "4,0" ||
                  convertedPlayerLevel == "4,1" ||
                  convertedPlayerLevel == "4,2" ||
                  convertedPlayerLevel == "4,3" ||
                  convertedPlayerLevel == "4,4" ||
                  convertedPlayerLevel == "4,5" ||
                  convertedPlayerLevel == "4,6" ||
                  convertedPlayerLevel == "4,7" ||
                  convertedPlayerLevel == "4,8" ||
                  convertedPlayerLevel == "4,9" ||
                  convertedPlayerLevel == "4,10" ||
                  convertedPlayerLevel == "4,11" ||
                  convertedPlayerLevel == "4,12" ||
                  convertedPlayerLevel == "4,13" ||
                  convertedPlayerLevel == "4,14" ||
                  convertedPlayerLevel == "4,15"
                ) {
                  setPlayerLevel("Elite I");
                }
                else if (
                  convertedPlayerLevel == "5,0" ||
                  convertedPlayerLevel == "5,1" ||
                  convertedPlayerLevel == "5,2" ||
                  convertedPlayerLevel == "5,3" ||
                  convertedPlayerLevel == "5,4" ||
                  convertedPlayerLevel == "5,5" ||
                  convertedPlayerLevel == "5,6" ||
                  convertedPlayerLevel == "5,7" ||
                  convertedPlayerLevel == "5,8" ||
                  convertedPlayerLevel == "5,9" ||
                  convertedPlayerLevel == "5,10" ||
                  convertedPlayerLevel == "5,11" ||
                  convertedPlayerLevel == "5,12" ||
                  convertedPlayerLevel == "5,13" ||
                  convertedPlayerLevel == "5,14" ||
                  convertedPlayerLevel == "5,15"
                ) {
                  setPlayerLevel("Elite II");
                }
                else if (
                  convertedPlayerLevel == "6,0" ||
                  convertedPlayerLevel == "6,1" ||
                  convertedPlayerLevel == "6,2" ||
                  convertedPlayerLevel == "6,3" ||
                  convertedPlayerLevel == "6,4" ||
                  convertedPlayerLevel == "6,5" ||
                  convertedPlayerLevel == "6,6" ||
                  convertedPlayerLevel == "6,7" ||
                  convertedPlayerLevel == "6,8" ||
                  convertedPlayerLevel == "6,9" ||
                  convertedPlayerLevel == "6,10" ||
                  convertedPlayerLevel == "6,11" ||
                  convertedPlayerLevel == "6,12" ||
                  convertedPlayerLevel == "6,13" ||
                  convertedPlayerLevel == "6,14" ||
                  convertedPlayerLevel == "6,15"
                ) {
                  setPlayerLevel("Elite III");
                }
                else if (
                  convertedPlayerLevel == "7,0" ||
                  convertedPlayerLevel == "7,1" ||
                  convertedPlayerLevel == "7,2" ||
                  convertedPlayerLevel == "7,3" ||
                  convertedPlayerLevel == "7,4" ||
                  convertedPlayerLevel == "7,5" ||
                  convertedPlayerLevel == "7,6" ||
                  convertedPlayerLevel == "7,7" ||
                  convertedPlayerLevel == "7,8" ||
                  convertedPlayerLevel == "7,9" ||
                  convertedPlayerLevel == "7,10" ||
                  convertedPlayerLevel == "7,11" ||
                  convertedPlayerLevel == "7,12" ||
                  convertedPlayerLevel == "7,13" ||
                  convertedPlayerLevel == "7,14" ||
                  convertedPlayerLevel == "7,15"
                ) {
                  setPlayerLevel("Elite IV");
                }
                else if (
                  convertedPlayerLevel == "8,0" ||
                  convertedPlayerLevel == "8,1" ||
                  convertedPlayerLevel == "8,2" ||
                  convertedPlayerLevel == "8,3" ||
                  convertedPlayerLevel == "8,4" ||
                  convertedPlayerLevel == "8,5" ||
                  convertedPlayerLevel == "8,6" ||
                  convertedPlayerLevel == "8,7" ||
                  convertedPlayerLevel == "8,8" ||
                  convertedPlayerLevel == "8,9" ||
                  convertedPlayerLevel == "8,10" ||
                  convertedPlayerLevel == "8,11" ||
                  convertedPlayerLevel == "8,12" ||
                  convertedPlayerLevel == "8,13" ||
                  convertedPlayerLevel == "8,14" ||
                  convertedPlayerLevel == "8,15" ||
                  convertedPlayerLevel == "8,16" ||
                  convertedPlayerLevel == "8,17" ||
                  convertedPlayerLevel == "8,18" ||
                  convertedPlayerLevel == "8,19" ||
                  convertedPlayerLevel == "8,20"
                ) {
                  setPlayerLevel("Master I");
                }
                else if (
                  convertedPlayerLevel == "9,0" ||
                  convertedPlayerLevel == "9,1" ||
                  convertedPlayerLevel == "9,2" ||
                  convertedPlayerLevel == "9,3" ||
                  convertedPlayerLevel == "9,4" ||
                  convertedPlayerLevel == "9,5" ||
                  convertedPlayerLevel == "9,6" ||
                  convertedPlayerLevel == "9,7" ||
                  convertedPlayerLevel == "9,8" ||
                  convertedPlayerLevel == "9,9" ||
                  convertedPlayerLevel == "9,10" ||
                  convertedPlayerLevel == "9,11" ||
                  convertedPlayerLevel == "9,12" ||
                  convertedPlayerLevel == "9,13" ||
                  convertedPlayerLevel == "9,14" ||
                  convertedPlayerLevel == "9,15" ||
                  convertedPlayerLevel == "9,16" ||
                  convertedPlayerLevel == "9,17" ||
                  convertedPlayerLevel == "9,18" ||
                  convertedPlayerLevel == "9,19" ||
                  convertedPlayerLevel == "9,20"
                ) {
                  setPlayerLevel("Master II");
                }
                else if (
                  convertedPlayerLevel == "10,0" ||
                  convertedPlayerLevel == "10,1" ||
                  convertedPlayerLevel == "10,2" ||
                  convertedPlayerLevel == "10,3" ||
                  convertedPlayerLevel == "10,4" ||
                  convertedPlayerLevel == "10,5" ||
                  convertedPlayerLevel == "10,6" ||
                  convertedPlayerLevel == "10,7" ||
                  convertedPlayerLevel == "10,8" ||
                  convertedPlayerLevel == "10,9" ||
                  convertedPlayerLevel == "10,10" ||
                  convertedPlayerLevel == "10,11" ||
                  convertedPlayerLevel == "10,12" ||
                  convertedPlayerLevel == "10,13" ||
                  convertedPlayerLevel == "10,14" ||
                  convertedPlayerLevel == "10,15" ||
                  convertedPlayerLevel == "10,16" ||
                  convertedPlayerLevel == "10,17" ||
                  convertedPlayerLevel == "10,18" ||
                  convertedPlayerLevel == "10,19" ||
                  convertedPlayerLevel == "10,20"
                ) {
                  setPlayerLevel("Master III");
                }
                else if (
                  convertedPlayerLevel == "11,0" ||
                  convertedPlayerLevel == "11,1" ||
                  convertedPlayerLevel == "11,2" ||
                  convertedPlayerLevel == "11,3" ||
                  convertedPlayerLevel == "11,4" ||
                  convertedPlayerLevel == "11,5" ||
                  convertedPlayerLevel == "11,6" ||
                  convertedPlayerLevel == "11,7" ||
                  convertedPlayerLevel == "11,8" ||
                  convertedPlayerLevel == "11,9" ||
                  convertedPlayerLevel == "11,10" ||
                  convertedPlayerLevel == "11,11" ||
                  convertedPlayerLevel == "11,12" ||
                  convertedPlayerLevel == "11,13" ||
                  convertedPlayerLevel == "11,14" ||
                  convertedPlayerLevel == "11,15" ||
                  convertedPlayerLevel == "11,16" ||
                  convertedPlayerLevel == "11,17" ||
                  convertedPlayerLevel == "11,18" ||
                  convertedPlayerLevel == "11,19" ||
                  convertedPlayerLevel == "11,20"
                ) {
                  setPlayerLevel("Master IV");
                }
                else if (
                  convertedPlayerLevel == "12,0" ||
                  convertedPlayerLevel == "12,1" ||
                  convertedPlayerLevel == "12,2" ||
                  convertedPlayerLevel == "12,3" ||
                  convertedPlayerLevel == "12,4" ||
                  convertedPlayerLevel == "12,5" ||
                  convertedPlayerLevel == "12,6" ||
                  convertedPlayerLevel == "12,7" ||
                  convertedPlayerLevel == "12,8" ||
                  convertedPlayerLevel == "12,9" ||
                  convertedPlayerLevel == "12,10" ||
                  convertedPlayerLevel == "12,11" ||
                  convertedPlayerLevel == "12,12" ||
                  convertedPlayerLevel == "12,13" ||
                  convertedPlayerLevel == "12,14" ||
                  convertedPlayerLevel == "12,15" ||
                  convertedPlayerLevel == "12,16" ||
                  convertedPlayerLevel == "12,17" ||
                  convertedPlayerLevel == "12,18" ||
                  convertedPlayerLevel == "12,19" ||
                  convertedPlayerLevel == "12,20"
                ) {
                  setPlayerLevel("Legendary");
                }

              const readPlayerRewardBalance = await readRewardContractSettings.balanceOf(theWalletAddress);
              const convertedreadPlayerRewardBalance = readPlayerRewardBalance.toString()
              const parsedRewardBalance = parseFloat(convertedreadPlayerRewardBalance)
              const rewardBalanceToFix = isNaN(parsedRewardBalance) ? 0 : (parsedRewardBalance).toFixed(2);
              setplayerRewardBalance(rewardBalanceToFix)

              const readPlayerStakingReward = await readStakeContractSettings.calcReward();
              const convertedreadPlayerStakingReward = readPlayerStakingReward.toString()
              const parsedStakingReward = parseFloat(convertedreadPlayerStakingReward)
              const stakingRewardToFix = isNaN(parsedStakingReward) ? 0 : (parsedStakingReward).toFixed(2);
              setPlayerStakingReward(stakingRewardToFix)   
            } catch (error) {
              console.log(error) 
            }
           }
            readFromContracts();
             }, [readGameContractSettings, readRewardContractSettings, readStakeContractSettings, setPlayerLevel, setplayerRewardBalance, setPlayerStakingReward])

          
           //function to write to the game contract and send game values to the blockchain
           const [sendValues, setSendValues] = useState(false)
           const sendGameValues = async () => {
            if (connectedWallet){
              const ethereum = (window).ethereum;
              const accounts = await ethereum.request({
                   method: "eth_requestAccounts",
               })
                // first account in MetaMask
               const walletAddress = accounts[0]; 
               const provider = new ethers.providers.Web3Provider(ethereum);
               const signer = provider.getSigner(walletAddress);
               const gameContractWriteSettings = new ethers.Contract(gameContractAddress, gameContractABI, signer)
            try {
                 // array to send character values to the blockchain
                 const arrayOfCharacters = [batman, spiderman, magneto, thanos, flash, greenarrow, ironman, hawkeye, wonderwoman, wolverine, darkseid, 
                  DoctorDoom, Apocalypse, Joker, LexLuthor, Loki, MartianManhunter, Aquaman, GreenLantern, Superman, Thor, Hulk];
                 const newArrayOfCharacters = arrayOfCharacters.filter(item => item !== null && item !== undefined && item != "");
                 console.log(newArrayOfCharacters);
                 const sendGameValues = await gameContractWriteSettings.connect(signer).StartGame(newArrayOfCharacters)
                 setSendValues(false)
            } catch (error) {
              console.log(error) 
            }
           }
           }  

           //Get number of inputs for player using write and read functions
           const [numberOfInputs, setnumberOfInputs] = useState(false)
           const writeToGetNumberOfInputs = async () => {
            if (connectedWallet){
              const ethereum = (window).ethereum;
              const accounts = await ethereum.request({
                   method: "eth_requestAccounts",
               })
                // first account in MetaMask
               const walletAddress = accounts[0]; 
               const provider = new ethers.providers.Web3Provider(ethereum);
               const signer = provider.getSigner(walletAddress);
               const gameContractWriteSettings = new ethers.Contract(gameContractAddress, gameContractABI, signer)
               try {
                const writeToGetNumberOfInputs = await gameContractWriteSettings.getnumofinput(theWalletAddress);
                const readNumberOfInputs = await readGameContractSettings.getnumberofinput(theWalletAddress);
                const convertedNumOfInputs = readNumberOfInputs.toString()
                setnumberOfInputs(convertedNumOfInputs)
                console.log(convertedNumOfInputs)
               } catch (error) {
                console.log(error)
               }
              }
           }
           
           //function to withdraw accumulated game-play rewards
           const [withdrawNotification, setwithdrawNotification] = useState(false)
           const withdrawGameplayRewards = async () => {
            const ethereum = (window).ethereum;
            const accounts = await ethereum.request({
                 method: "eth_requestAccounts",
             })
              // first account in MetaMask
             const walletAddress = accounts[0]; 
             const provider = new ethers.providers.Web3Provider(ethereum);
             const signer = provider.getSigner(walletAddress);
             const gameContractWriteSettings = new ethers.Contract(gameContractAddress, gameContractABI, signer)
             try {
              if (playerRewardBalance > 0){
              const withdrawAccumulatedRewards = await gameContractWriteSettings.connect(signer)._withdrawErc20()}
              else {
                setwithdrawNotification(true)
                setTimeout(()=> {
                  setwithdrawNotification(false)
                }, 5000)
              }
             } catch (error) {
              console.log(error) 
             }
           }
    

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
        <div className='py-[0.1cm] px-[0.3cm] rounded-md bg-[#001]' style={{border:"1px solid #fff"}}><span className='font-[600]'>Level <i className='fa fa-chevron-down text-[80%] mr-[0.1cm]'></i></span> {PLayerLevel} </div>
        <div className='py-[0.1cm] px-[0.3cm] my-[0.2cm] rounded-md bg-[#001]' style={{border:"1px solid #fff"}}><span className='font-[600]'>Balance <i className='fa fa-chevron-down text-[80%] mr-[0.2cm]'></i></span> {playerRewardBalance} UGST</div>
        <div className='py-[0.1cm] px-[0.3cm] my-[0.2cm] rounded-md bg-[#001]' style={{border:"1px solid #fff"}}><span className='font-[600]'>Staking reward <i className='fa fa-chevron-down text-[80%] mr-[0.2cm]'></i></span> {playerStakingReward} UGST</div>
        {startGame ? (<div></div>) : (<span><button className='bg-[#502] text-[#fff] px-[0.3cm] py-[0.1cm] rounded-md mt-[0.1cm] w-[100%] stakebutton' onClick={(e) => buttonsAudio(e) & withdrawGameplayRewards(e)}>Withdraw reward <img src="images/withdrawal.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></button> <br />
        {withdrawNotification ? (<div data-aos="zoom-in" className='text-center text-[#fff] mt-[0.2cm] m-[auto]'>No withdrawable rewards <span><img src="images/disappointment.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></span></div>) : (<span></span>)}
        <button className='bg-[#502] text-[#fff] px-[0.3cm] py-[0.1cm] rounded-md mt-[0.2cm] w-[100%] stakebutton' onClick={(e) => buttonsAudio(e) & setStaking(true)}>Stake/unstake reward <img src="images/coin.png" width="20" className='ml-[0.2cm] stakecoinimg' style={{display:"inline-block"}} /></button></span>)}
     </span>) : (<div></div>)}
     {startGame ? (<div className='lg:text-[350%] md:text-[200%] text-[150%] clear-both text-center font-[500]'>
        <span className='p-[0.4cm] rounded-[100%] fa-fade bg-[#fff] text-[#502]' style={{border:"2px solid #502", transition:"0.2s ease-in-out"}}>{count}</span>
     </div>) :
     (<div className='text-center clear-both'>
     <button className='bg-[#502] m-[0.2cm] text-[#fff] px-[0.5cm] py-[0.15cm] rounded-full navbutton' onClick={(e) => buttonsAudio(e) & playAndUpdateGame(e) & countdownInterval(e) & writeToGetNumberOfInputs(e)}>Start game <img src="images/game-controller.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}} /></button>
     {sendValues ? (<button className='bg-[#502] m-[0.2cm] text-[#fff] px-[0.5cm] py-[0.15cm] rounded-full navbutton' onClick={(e) => buttonsAudio(e) & sendGameValues(e)}>Submit characters<img src="images/superhero.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}} /></button>) : (<span></span>)}
     <button className='bg-[#502] m-[0.2cm] text-[#fff] px-[0.5cm] py-[0.15cm] rounded-full navbutton' onClick={(e) => buttonsAudio(e) & setHowToPlay(true)}>How to play <img src="images/play.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}} /></button>
     {connectNotification ? (<div data-aos="slide-up" className='text-[#fff] mt-[0.1cm] font-[500]'>Please connect wallet! <span><img src="images/disappointment.png" width="20" className='ml-[0.2cm]' style={{display:"inline-block"}} /></span></div>) : (<div></div>)}
     </div>)}
     {numberOfInputs && connectedWallet && startGame ? (<div className='text-center mt-[0.5cm] text-[120%]'><span>Select {numberOfInputs} characters from the list <span className='text-[#999]'>(typically 3 to 5)</span></span><span><img src="images/info.png" className='ml-[0.2cm]' width="20" style={{display:"inline-block"}} /></span></div>) : (<div></div>)}
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
      <Dapp buttonsAudio={buttonsAudio} playerRewardBalance={playerRewardBalance} stakeContractAddress={stakeContractAddress} stakeContractABI={stakeContractABI} rewardContractAddress={rewardContractAddress} rewardContractABI={rewardContractABI} setStaking={setStaking} playerStakingReward={playerStakingReward}/>
      </div>
      </div>) : 
      (<div></div>)
     }




     <div className='mt-[1cm] m-[-5%] '>
     {connectedWallet ? 
     (<div className='lg:mx-[10%] mx-[5%]'>
        {PLayerLevel === ("Beginner I" || PLayerLevel === "Beginner II" || PLayerLevel === "Beginner III" || PLayerLevel === "Beginner IV")  && (<div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 p-[2%] playgamediv' style={{backgroundImage:"url(images/batmanbg.jpg)", border:"4px solid #502"}}>
            <div className='grid-cols-1'>
                <img src="images/characters/batman.jpg" onClick={(e) => setbatman("1") & setbatmanblur("blur(7px)") & buttonsAudio(e)} className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:batmanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/spiderman.jpg" onClick={(e) => setspiderman("11") & setspidermanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:spidermanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/magneto.jpg" onClick={(e) => setmagneto("0") & setmagnetoblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:magnetoblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/thanos.jpg" onClick={(e) => setthanos("1") & setthanosblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:thanosblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/flash.jpg" onClick={(e) => setflash("4") & setflashblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:flashblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/greenarrow.jpg" onClick={(e) => setgreenarrow("3") & setgreenarrowblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:greenarrowblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/ironman.jpg" onClick={(e) => setironman("8") & setironmanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:ironmanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/hawkeye.jpg" onClick={(e) => sethawkeye("13") & sethawkeyeblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:hawkeyeblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/wonderwoman.jpg" onClick={(e) => setwonderwoman("2") & setwonderwomanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:wonderwomanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/wolverine.jpg" onClick={(e) => setwolverine("12") & setwolverineblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:wolverineblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/darkseid.jpg" onClick={(e) => setdarkseid("2") & setdarkseidblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:darkseidblur}}/>
            </div>
        </div>)}

        {(PLayerLevel === "Elite I" || PLayerLevel === "Elite II" || PLayerLevel === "Elite III" || PLayerLevel === "Elite IV") && (<div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 p-[2%] playgamediv' style={{backgroundImage:"url(images/hulkbg.jpg)", border:"4px solid #502"}}>
            <div className='grid-cols-1'>
                <img src="images/characters/hulk.jpg" onClick={(e) => setHulk("10") & setHulkblur("blur(7px)") & buttonsAudio(e)} className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Hulkblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/spiderman.jpg" onClick={(e) => setspiderman("11") & setspidermanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:spidermanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/magneto.jpg" onClick={(e) => setmagneto("0") & setmagnetoblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:magnetoblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/thanos.jpg" onClick={(e) => setthanos("1") & setthanosblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:thanosblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/flash.jpg" onClick={(e) => setflash("4") & setflashblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:flashblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/MartianManhunter.jpg" onClick={(e) => setMartianManhunter("7") & setMartianManhunterblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:MartianManhunterblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/ironman.jpg" onClick={(e) => setironman("8") & setironmanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:ironmanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/batman.jpg" onClick={(e) => setbatman("1") & setbatmanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:batmanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/wonderwoman.jpg" onClick={(e) => setwonderwoman("2") & setwonderwomanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:wonderwomanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/greenarrow.jpg" onClick={(e) => setgreenarrow("3") & setgreenarrowblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:greenarrowblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/darkseid.jpg" onClick={(e) => setdarkseid("2") & setdarkseidblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:darkseidblur}}/>
            </div>
        </div>)}

        {(PLayerLevel === "Master I" || PLayerLevel === "Master II" || PLayerLevel === "Master III" || PLayerLevel === "Master IV") && (<div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 p-[2%] playgamediv' style={{backgroundImage:"url(images/supermanbg.jpg)", border:"4px solid #502"}}>
            <div className='grid-cols-1'>
                <img src="images/characters/superman.jpg" onClick={(e) => setSuperman("0") & setSupermanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Supermanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/hulk.jpg" onClick={(e) => setHulk("10") & setHulkblur("blur(7px)") & buttonsAudio(e)} className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Hulkblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/spiderman.jpg" onClick={(e) => setspiderman("11") & setspidermanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:spidermanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/magneto.jpg" onClick={(e) => setmagneto("0") & setmagnetoblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:magnetoblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/thor.jpg" onClick={(e) => setThor("9") & setThorblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Thorblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/flash.jpg" onClick={(e) => setflash("4") & setflashblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:flashblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/ironman.jpg" onClick={(e) => setironman("8") & setironmanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:ironmanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/batman.jpg" onClick={(e) => setbatman("1") & setbatmanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:batmanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/wonderwoman.jpg" onClick={(e) => setwonderwoman("2") & setwonderwomanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:wonderwomanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/greenarrow.jpg" onClick={(e) => setgreenarrow("3") & setgreenarrowblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:greenarrowblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/wolverine.jpg" onClick={(e) => setwolverine("12") & setwolverineblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:wolverineblur}}/>
            </div>
        </div>)}

        {PLayerLevel === "Legendary" && (<div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 p-[2%] playgamediv' style={{backgroundImage:"url(images/thanosbg.jpg)", border:"4px solid #502"}}>
            <div className='grid-cols-1'>
                <img src="images/characters/thanos.jpg" onClick={(e) => setthanos("1") & setthanosblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:thanosblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/darkseid.jpg" onClick={(e) => setdarkseid("2") & setdarkseidblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:darkseidblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/thor.jpg" onClick={(e) => setThor("9") & setThorblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Thorblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/flash.jpg" onClick={(e) => setflash("4") & setflashblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:flashblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/superman.jpg" onClick={(e) => setSuperman("0") & setSupermanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Supermanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/hulk.jpg" onClick={(e) => setHulk("10") & setHulkblur("blur(7px)") & buttonsAudio(e)} className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Hulkblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/ironman.jpg" onClick={(e) => setironman("8") & setironmanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:ironmanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/wonderwoman.jpg" onClick={(e) => setwonderwoman("2") & setwonderwomanblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:wonderwomanblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/apocalypse.jpg" onClick={(e) => setApocalypse("2") & setApocalypseblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:Apocalypseblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/greenarrow.jpg" onClick={(e) => setgreenarrow("3") & setgreenarrowblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:greenarrowblur}}/>
            </div>
            <div className='grid-cols-1'>
                <img src="images/characters/MartianManhunter.jpg" onClick={(e) => setMartianManhunter("7") & setMartianManhunterblur("blur(7px)") & buttonsAudio(e)}  className='w-[100%] lg:h-[9cm] md:h-[7cm] h-[5cm] playgamecharacter cursor-pointer' style={{boxShadow:"7px 7px 4px 1px rgba(0,0,0,0.7)", filter:MartianManhunterblur}}/>
            </div>
        </div>)}
     </div>)
        :
      (<div className='lg:mx-[20%] m-[5%]'> 
     <SlideAnimation />
     </div>)
     }
     </div>



   </div>
  </>
  );
};

