'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Rider } from '@/lib/types';
import { RIDERS } from '@/lib/data';
import { useToast } from './use-toast';

interface RiderContextType {
  riders: Rider[];
  addRider: (rider: Omit<Rider, 'id'>) => void;
  updateRider: (rider: Rider) => void;
  deleteRider: (riderId: string) => void;
}

const RiderContext = createContext<RiderContextType | undefined>(undefined);

export const RiderProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [riders, setRiders] = useState<Rider[]>(RIDERS);

  const addRider = (rider: Omit<Rider, 'id'>) => {
    const newRider = { ...rider, id: `rider-${Date.now()}` };
    setRiders(prevRiders => [newRider, ...prevRiders]);
    toast({ title: 'Rider Added', description: `${rider.name} has been successfully added.` });
  };

  const updateRider = (updatedRider: Rider) => {
    setRiders(prevRiders =>
      prevRiders.map(r => (r.id === updatedRider.id ? updatedRider : r))
    );
    toast({ title: 'Rider Updated', description: `${updatedRider.name} has been successfully updated.` });
  };

  const deleteRider = (riderId: string) => {
    setRiders(prevRiders => prevRiders.filter(r => r.id !== riderId));
    toast({ variant: 'destructive', title: 'Rider Deleted', description: 'The rider has been successfully deleted.' });
  };

  return (
    <RiderContext.Provider value={{ riders, addRider, updateRider, deleteRider }}>
      {children}
    </RiderContext.Provider>
  );
};

export const useRiders = () => {
  const context = useContext(RiderContext);
  if (context === undefined) {
    throw new Error('useRiders must be used within a RiderProvider');
  }
  return context;
};
