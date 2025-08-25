
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SiteSettings } from '@/lib/types';
import { useToast } from './use-toast';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

// Default settings
const defaultSettings: SiteSettings = {
  heroImageUrl: 'https://i.ibb.co/qCXJ4tM/hero-bg.png',
  splashImageUrl: 'https://i.ibb.co/6PzD4gQ/splash-bg.png',
  menuImageUrl: 'https://i.ibb.co/M5pS1sV/menu-bg.png',
  splashLogoUrl: 'https://i.ibb.co/P9gL6M1/logo.png',
  deliveryFee: 150,
  menuCarouselImage1: 'https://placehold.co/1200x500/EAB308/FFFFFF',
  menuCarouselImage2: 'https://placehold.co/1200x500/22C55E/FFFFFF',
  menuCarouselImage3: 'https://placehold.co/1200x500/3B82F6/FFFFFF',
  menuCarouselImage4: 'https://placehold.co/1200x500/EF4444/FFFFFF',
  paymentMethods: [
    { value: 'Cash on Delivery', label: 'Cash on Delivery' },
    { value: 'Jazzcash', label: 'Jazzcash/Easypaisa' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Sadapay/Nayapay', label: 'Sadapay/Nayapay' },
    { value: 'Payoneer', label: 'Payoneer' },
  ]
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('quickbite-site-settings');
      if (storedSettings) {
        // Merge stored settings with defaults to ensure new fields are present
        setSettings(prevSettings => ({ ...prevSettings, ...JSON.parse(storedSettings) }));
      }
    } catch (error) {
      console.error("Could not load site settings from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      localStorage.setItem('quickbite-site-settings', JSON.stringify(updatedSettings));
      toast({ title: 'Settings Updated', description: 'Your site settings have been saved.' });
    } catch (error) {
      console.error("Could not save site settings to localStorage", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save settings.' });
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
