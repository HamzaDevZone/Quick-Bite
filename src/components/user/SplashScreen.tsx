
'use client';

import { Logo } from '@/components/shared/Logo';

export function SplashScreen() {
  return (
    <div
      id="splash-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animate-splash-fade-out"
      style={{
        background: 'radial-gradient(ellipse at bottom, hsl(var(--primary) / 0.2), hsl(var(--background)))'
      }}
    >
      <div className="z-10 flex flex-col items-center justify-center text-center animate-splash-content-fade-in">
        <Logo className="w-40 h-40" />
        <h1
          className="text-4xl md:text-5xl font-bold text-foreground mt-6 font-headline"
          style={{textShadow: '2px 2px 8px hsl(var(--background))'}}
        >
          NexusMart
        </h1>
      </div>
    </div>
  );
}
