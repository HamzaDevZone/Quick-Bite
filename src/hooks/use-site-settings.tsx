'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SiteSettings } from '@/lib/types';
import { useToast } from './use-toast';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

// Default settings
const defaultSettings: SiteSettings = {
  heroImageUrl: 'https://placehold.co/1920x1080.png',
  splashImageUrl: 'https://placehold.co/1080x1920.png',
  menuImageUrl: 'https://placehold.co/1920x1080.png',
  deliveryFee: 150,
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('quickbite-site-settings');
      if (storedSettings) {
        // Merge stored settings with defaults to ensure new fields are present
        setSettings(prevSettings => ({ ...prevSettings, ...JSON.parse(storedSettings) }));
      }
    } catch (error) {
      console.error("Could not load site settings from localStorage", error);
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
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
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
