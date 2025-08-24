'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
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
            src={settings.splashImageUrl} 
            alt="Splash background"
            fill
            className="object-cover -z-10"
            data-ai-hint="restaurant food background"
          />
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="z-10 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="flex items-center justify-center bg-primary rounded-full w-24 h-24"
            >
              <span className="text-5xl font-bold text-primary-foreground">Q</span>
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
