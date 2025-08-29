
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// The URLs are now hardcoded to ensure they load instantly without relying on localStorage.
// This prevents the splash screen from appearing blank on the first load.
const SPLASH_IMAGE_URL = 'https://i.ibb.co/6PzD4gQ/splash-bg.png';
const SPLASH_LOGO_URL = 'https://i.ibb.co/P9gL6M1/logo.png';


export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Attempt to hide body overflow to prevent scrolling during splash
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsVisible(false);
       // Restore body overflow after splash
      document.body.style.overflow = 'auto';
    }, 4000); // Show for 4 seconds

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto'; // Ensure overflow is restored on component unmount
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          <Image 
              src={SPLASH_IMAGE_URL} 
              alt="Splash background"
              fill
              priority
              className="object-cover -z-10"
              data-ai-hint="restaurant food background"
            />
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="z-10 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="relative w-40 h-40"
            >
              <Image 
                  src={SPLASH_LOGO_URL}
                  alt="QuickBite Logo"
                  fill
                  priority
                  className="object-contain"
                  data-ai-hint="app logo"
                />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mt-6 font-headline"
              style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}
            >
              QuickBite
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
