import React from 'react'
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Features from '../../components/Features';
import Analytics from '../../components/Analytics';

const LandingPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
        <Header/>
        <Hero/>
        <Features/>
        <Analytics/>
        <Footer/>
    </div>
  )
}

export default LandingPage;