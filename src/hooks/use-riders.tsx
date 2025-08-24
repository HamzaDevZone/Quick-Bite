'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Rider } from '@/lib/types';
import { useToast } from './use-toast';

interface RiderContextType {
  riders: Rider[];
  addRider: (rider: Omit<Rider, 'id'>) => Promise<void>;
  updateRider: (rider: Rider) => Promise<void>;
  deleteRider: (riderId: string) => Promise<void>;
  loading: boolean;
}

const RiderContext = createContext<RiderContextType | undefined>(undefined);

export const RiderProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiders = async () => {
    setLoading(true);
    try {
      const ridersCollection = collection(db, 'riders');
      const querySnapshot = await getDocs(ridersCollection);
      const ridersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rider));
      setRiders(ridersData);
    } catch (error) {
      console.error("Error fetching riders: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch riders.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const addRider = async (rider: Omit<Rider, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'riders'), rider);
      setRiders(prevRiders => [{ ...rider, id: docRef.id }, ...prevRiders]);
      toast({ title: 'Rider Added', description: `${rider.name} has been successfully added.` });
    } catch (error) {
      console.error("Error adding rider: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add rider.' });
    }
  };

  const updateRider = async (updatedRider: Rider) => {
    try {
      const riderDoc = doc(db, 'riders', updatedRider.id);
      await updateDoc(riderDoc, updatedRider);
      setRiders(prevRiders =>
        prevRiders.map(r => (r.id === updatedRider.id ? updatedRider : r))
      );
      toast({ title: 'Rider Updated', description: `${updatedRider.name} has been successfully updated.` });
    } catch (error) {
      console.error("Error updating rider: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update rider.' });
    }
  };

  const deleteRider = async (riderId: string) => {
    try {
      await deleteDoc(doc(db, 'riders', riderId));
      setRiders(prevRiders => prevRiders.filter(r => r.id !== riderId));
      toast({ variant: 'destructive', title: 'Rider Deleted', description: 'The rider has been successfully deleted.' });
    } catch (error) {
      console.error("Error deleting rider: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete rider.' });
    }
  };

  return (
    <RiderContext.Provider value={{ riders, addRider, updateRider, deleteRider, loading }}>
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
