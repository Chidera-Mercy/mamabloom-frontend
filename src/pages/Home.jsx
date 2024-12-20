import React from 'react'
import BubbleCursor from '../components/CanvasCursor';
import heroImage from '../assets/hero-img.png';
import LogoImg from '../assets/logo.png';
import aboutImage from '../assets/about.png';
import about1 from '../assets/about1.jpg';
import about2 from '../assets/about2.jpg';
import about3 from '../assets/about3.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div 
      className="relative w-full min-h-screen bg-cover bg-center flex items-center"
      style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
        }}
    >
      {/* Navigation Bar - Only Logo */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
        <div>
          <img src={LogoImg} className='h-16' alt="logo" />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-2xl text-[#013f40] pl-4 md:pl-10">
          <h1 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            A Support System
            <br />
            <span className="block">for Mothers</span>
          </h1>
          <p className="font-delius text-amber-50 text-4xl mb-8">
            We are Stronger Together
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-[#013f40] font-poppins text-amber-50 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300 ease-in-out"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="relative w-full min-h-[90vh]"> 
      <img 
        src={aboutImage} 
        alt="Background" 
        className="absolute w-full h-full object-cover"
      />
      
      <div className="relative h-full flex flex-col justify-center gap-12 py-16">
        {/* Header */}
        <div className="text-center"> 
          <h2 className="font-poppins text-[#013f40] text-4xl font-medium md:text-5xl lg:text-6xl">
            Who We Are
          </h2>
        </div>

        {/* Cards container */}
        <div className="px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center flex-wrap">
            {/* Card 1 - Child Care */}
            <div className="relative w-72 h-72 group">
              <img 
                src={about1} 
                alt="Child Care" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center p-4">
                <p className="text-white font-delius text-center text-sm">
                  Expert guidance and resources for child care, helping mothers navigate the beautiful journey of parenthood with confidence and knowledge.
                </p>
              </div>
            </div>

            {/* Card 2 - Community */}
            <div className="relative w-72 h-72 group">
              <img 
                src={about2} 
                alt="Community" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center p-4">
                <p className="text-white font-delius text-center text-sm">
                  A welcoming space where every mother belongs. We celebrate diversity and foster connections that last a lifetime.
                </p>
              </div>
            </div>

            {/* Card 3 - Support */}
            <div className="relative w-72 h-72 group">
              <img 
                src={about3} 
                alt="Support" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center p-4">
                <p className="text-white font-delius text-center text-sm">
                  24/7 emotional and practical support from our community of mothers who understand and care about your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-gradient-to-r from-pink-200 to-blue-200">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="text-[#4B382A] font-delius text-sm">
            © 2024 Mama Bloom. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  return (
    <div>
      <BubbleCursor /> 
      <Hero />
      <About />
      <Footer />
    </div>
  )
}

export default Home