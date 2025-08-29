
'use client';

import Image from 'next/image';

const SPLASH_IMAGE_URL = 'https://i.ibb.co/6PzD4gQ/splash-bg.png';
const SPLASH_LOGO_URL = 'https://i.ibb.co/P9gL6M1/logo.png';

export function SplashScreen() {
  return (
    <div
      id="splash-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animate-splash-fade-out"
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

      <div className="z-10 flex flex-col items-center justify-center text-center animate-splash-content-fade-in">
        <div className="relative w-40 h-40">
          <Image 
              src={SPLASH_LOGO_URL}
              alt="QuickBite Logo"
              fill
              priority
              className="object-contain"
              data-ai-hint="app logo"
            />
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-white mt-6 font-headline"
          style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}
        >
          QuickBite
        </h1>
      </div>
    </div>
  );
}
