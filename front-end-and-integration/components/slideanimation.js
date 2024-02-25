import Head from 'next/head';
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function SlideAnimation() {
    useEffect(() => {
        AOS.init();
      }, [])

    return (
   <div>
     <div data-aos="fade-in" className='slideimg1' style={{transition:"0.5s ease-in-out"}}>
    <img src="images/batmanbg.jpg" className='w-[100%]' style={{boxShadow:"2px 2px 8px 2px rgba(0,0,0,0.7)"}} />
    <div className='lg:text-[350%] md:text-[250%] text-[150%] w-[100%] font-[600] mt-[-35%] text-center uppercase' style={{position:"absolute"}}>
      <span className='px-[1cm] py-[0.5cm] bg-[rgba(0,0,0,0.7)]' style={{border:"2px solid #502"}}>Beginner</span>
    </div>
    </div>
    <div data-aos="fade-in" className='slideimg2' style={{transition:"0.5s ease-in-out"}}>
    <img src="images/hulkbg.jpg" className='w-[100%]' style={{boxShadow:"2px 2px 8px 2px rgba(0,0,0,0.7)"}} />
    <div className='lg:text-[350%] md:text-[250%] text-[150%] w-[100%] font-[600] mt-[-35%] text-center uppercase' style={{position:"absolute"}}>
      <span className='px-[1cm] py-[0.5cm] bg-[rgba(0,0,0,0.7)]' style={{border:"2px solid #502"}}>Elite</span>
    </div>
    </div>
    <div data-aos="fade-in" className='slideimg3' style={{transition:"0.5s ease-in-out"}}>
    <img src="images/supermanbg.jpg" className='w-[100%]' style={{boxShadow:"2px 2px 8px 2px rgba(0,0,0,0.7)"}} />
    <div className='lg:text-[350%] md:text-[250%] text-[150%] w-[100%] font-[600] mt-[-35%] text-center uppercase' style={{position:"absolute"}}>
      <span className='px-[1cm] py-[0.5cm] bg-[rgba(0,0,0,0.7)]' style={{border:"2px solid #502"}}>Master</span>
    </div>
    </div>
    <div data-aos="fade-in" className='slideimg4' style={{transition:"0.5s ease-in-out"}}>
    <img src="images/thanosbg.jpg" className='w-[100%]' style={{boxShadow:"2px 2px 8px 2px rgba(0,0,0,0.7)"}} />
    <div className='lg:text-[350%] md:text-[250%] text-[150%] w-[100%] font-[600] mt-[-35%] text-center uppercase' style={{position:"absolute"}}>
      <span className='px-[1cm] py-[0.5cm] bg-[rgba(0,0,0,0.7)]' style={{border:"2px solid #502"}}>Legendary</span>
    </div>
    </div>
   </div>
)}