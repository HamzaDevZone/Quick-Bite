
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SiteSettings, PaymentMethod } from '@/lib/types';
import { useToast } from './use-toast';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<Omit<SiteSettings, 'paymentMethods'>>) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (methodId: string) => void;
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
  menuCarouselImage1: 'https://picsum.photos/1200/500',
  menuCarouselImage2: 'https://picsum.photos/1200/501',
  menuCarouselImage3: 'https://picsum.photos/1200/502',
  menuCarouselImage4: 'https://picsum.photos/1200/503',
  paymentMethods: [
    { id: '1', label: 'Cash on Delivery', details: 'Please have the exact amount ready.' },
    { id: '2', label: 'Jazzcash/Easypaisa', details: 'Account: 0300-1234567, Name: John Doe' },
  ],
  whatsappUrl: 'https://wa.me/923001234567',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
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
        const parsed = JSON.parse(storedSettings);
        setSettings(prevSettings => ({ ...prevSettings, ...parsed }));
      }
    } catch (error) {
      console.error("Could not load site settings from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = (newSettings: SiteSettings) => {
    try {
        setSettings(newSettings);
        localStorage.setItem('quickbite-site-settings', JSON.stringify(newSettings));
    } catch (error) {
         console.error("Could not save site settings to localStorage", error);
         toast({ variant: 'destructive', title: 'Error', description: 'Could not save settings.' });
    }
  }


  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    saveSettings(updatedSettings);
    toast({ title: 'Settings Updated', description: 'Your site settings have been saved.' });
  };
  
  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = { ...method, id: new Date().getTime().toString() };
    const updatedMethods = [...(settings.paymentMethods || []), newMethod];
    saveSettings({ ...settings, paymentMethods: updatedMethods });
    toast({ title: 'Payment Method Added', description: `${method.label} has been added.` });
  };
  
  const updatePaymentMethod = (methodToUpdate: PaymentMethod) => {
    const updatedMethods = (settings.paymentMethods || []).map(m =>
      m.id === methodToUpdate.id ? methodToUpdate : m
    );
    saveSettings({ ...settings, paymentMethods: updatedMethods });
    toast({ title: 'Payment Method Updated', description: `${methodToUpdate.label} has been updated.` });
  };
  
  const deletePaymentMethod = (methodId: string) => {
    const methodToDelete = settings.paymentMethods.find(m => m.id === methodId);
    const updatedMethods = (settings.paymentMethods || []).filter(m => m.id !== methodId);
    saveSettings({ ...settings, paymentMethods: updatedMethods });
    toast({ title: 'Payment Method Deleted', description: `${methodToDelete?.label} has been deleted.`, variant: 'destructive' });
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, isLoading }}>
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
