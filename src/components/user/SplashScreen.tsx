
'use client';

import Image from 'next/image';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Skeleton } from '../ui/skeleton';

export function SplashScreen() {
  const { settings, isLoading } = useSiteSettings();

  // If settings are loading, show a minimal loading state to avoid flashes of default/broken content
  if (isLoading) {
    return (
      <div id="splash-screen-loading" className="fixed inset-0 z-[100] bg-background" />
    );
  }

  // Use settings from the hook, which are now dynamic
  const splashImageUrl = settings.splashImageUrl;
  const splashLogoUrl = settings.splashLogoUrl;

  return (
    <div
      id="splash-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animate-splash-fade-out"
    >
      {splashImageUrl && (
        <Image 
          src={splashImageUrl} 
          alt="Splash background"
          fill
          priority
          className="object-cover -z-10"
          data-ai-hint="restaurant food background"
        />
      )}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="z-10 flex flex-col items-center justify-center text-center animate-splash-content-fade-in">
        <div className="relative w-40 h-40">
          {splashLogoUrl ? (
             <Image 
                src={splashLogoUrl}
                alt="QuickBite Logo"
                fill
                priority
                className="object-contain"
                data-ai-hint="app logo"
              />
          ) : (
            <Skeleton className="w-full h-full rounded-full" />
          )}
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
