import Head from 'next/head';
import { useState, useEffect } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home(){
  useEffect(() => {
    AOS.init();
  }, [])


useEffect(() => {
  const homePageMusic = () => {
  const audio = new Audio('sounds/intro.mp3');
  audio.volume = 1;
  audio.play().catch(error => {
    // Handle autoplay error (e.g., due to browser restrictions)
    console.error('Autoplay error:', error);
  });}

return homePageMusic();
}, []);

  // create countdown for navigation to game app
  const [count, setCount] = useState(30);
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(countdownInterval);
  }, []);

  //navigate to game app
  const [allowAutoNav, setAllowAutoNav] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const autoNav = allowAutoNav && setTimeout(() => {
      router.push("/gameapp");
    }, 30000);

    // Cleanup function to clear the timeout when the component is unmounted or auto navigation is stopped
    return () => clearTimeout(autoNav);
}, [allowAutoNav, router])

  //stop navigation to game app
  const stopNav = () => {
    setAllowAutoNav(false)
  }

  // function to set display property of navigation div
  const [initialDisplay, setinitialDisplay] = useState("none")
  useEffect(() => {
    const changeNavDivDisplay = () => {
      setTimeout(()=> {
        setinitialDisplay("block")
      }, 5000)
    }
    return changeNavDivDisplay();
  }, [])

  const navigateWithButtonToGameApp = () => {
    const audio = new Audio("sounds/navsounds.mp3")
    audio.play().catch(error => {
      // Handle autoplay error (e.g., due to browser restrictions)
      console.error('Autoplay error:', error);
    });
    audio.volume = 1
    setTimeout(()=> {
      router.push("/gameapp")
    }, 1000)
  }


  return (
    <>
    <Head>
   <title>Ultimate Galaxy Search - The most thrilling superhero/villain game on Ethereum.</title>
   <link rel="shortcut icon" href="/favicon.ico" />
   </Head>
   <div>

   <div data-aos="zoom-out" className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4 p-[5%]' style={{transition:"0.5s ease-in-out"}}>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/superman.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Superman</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/thor.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Thor</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/flash.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Flash</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/wolverine.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Wolverine</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/aquaman.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Aquaman</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/hulk.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Hulk</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>

    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/batman.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Batman</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/wonderwoman.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Wonderwoman</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/spiderman.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Spiderman</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/hawkeye.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Hawkeye</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/magneto.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Magneto</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/greenarrow.jpeg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Greenarrow</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>

    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/thanos.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Thanos</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/darkseid.png" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Darkseid</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/ironman.jpeg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Ironman</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/MartianManhunter.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Martianmanhunter</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/GreenLantern.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Greenlantern</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/lexluthor.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>LexLuthor</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/joker.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Joker</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/loki.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Loki</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/doctordoom.jpg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Doctordoom</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
    <div className='grid-cols-1 characterdiv'>
      <img src="images/characters/apocalypse.jpeg" className='character rounded-xl lg:h-[9cm] md:h-[7cm] h-[5cm] w-[100%]' />
      <div className='bg-[rgba(0,0,0,0.7)] font-[600] rounded-xl m-[auto] lg:w-[60%] w-[80%] text-center p-[0.2cm] charactername'>
        <div>Apocalypse</div>
        <div><i class="fa fa-chevron-circle-up text-[#fff]"></i></div>
      </div>
    </div>
   </div>


 <div data-aos="zoom-out" className='top-[25%] mx-[auto] w-[100%] text-center p-[5%]' style={{position:"fixed", zIndex:"9999", display:initialDisplay, transition:"0.5s ease-in-out"}}>
  <img src="images/gamelogo.png" width="350" className='m-[auto] rounded-[100%] p-[0.5cm] gamelogo' style={{border:"2px solid #fff"}} />
  <button onClick={(e) => navigateWithButtonToGameApp()} className='bg-[#502] mt-[0.5cm] px-[0.7cm] py-[0.2cm] text-[120%] m-[auto] rounded-full navbutton'>Play on-chain game <img src="images/game.png" width="30" className='ml-[0.3cm]' style={{display:"inline-block"}} /></button>
  {allowAutoNav ? (<div className='text-center timerdiv'>
  <span className='lg:text-[400%] md:text-[300%] text-[250%] font-[500] text-[#fff]'>{count} <br/> <img src="images/cancel.png" width="40" className='m-[auto] cursor-pointer cancelnavbutton rounded-[100%]' onClick={(e) => stopNav()} /></span>
 </div>) : (<div></div>)}
 </div>

   </div>
  </>
  );
};

