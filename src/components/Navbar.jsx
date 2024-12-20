import React, { useState, useEffect } from 'react';

//import asset
import LogoImg from '../assets/logo.png'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Change navbar style when scrolled more than 100 pixels
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`
        fixed top-0 left-0 w-full z-50 transition-colors duration-300 ease-in-out
        flex items-center justify-between p-4
        ${isScrolled 
          ? 'bg-[#ca9c44]' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="flex">
        <img src={LogoImg} className='h-16' alt="logo" />
      </div>
    </nav>
  );
};

export default Navbar;