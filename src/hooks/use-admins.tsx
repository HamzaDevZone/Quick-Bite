'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Admin } from '@/lib/types';
import { useToast } from './use-toast';

interface AdminContextType {
  admins: Admin[];
  addAdmin: (admin: Omit<Admin, 'id'>) => Promise<void>;
  updateAdmin: (admin: Admin) => Promise<void>;
  deleteAdmin: (adminId: string) => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const adminsCollection = collection(db, 'admins');
      const querySnapshot = await getDocs(adminsCollection);
      const adminsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Admin));
      setAdmins(adminsData);
    } catch (error) {
      console.error("Error fetching admins: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch admins.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const addAdmin = async (admin: Omit<Admin, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'admins'), admin);
      setAdmins(prevAdmins => [{ ...admin, id: docRef.id }, ...prevAdmins]);
      toast({ title: 'Admin Added', description: `${admin.name} has been successfully added.` });
    } catch (error) {
      console.error("Error adding admin: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add admin.' });
    }
  };

  const updateAdmin = async (updatedAdmin: Admin) => {
    try {
      const adminDoc = doc(db, 'admins', updatedAdmin.id);
      await updateDoc(adminDoc, updatedAdmin);
      setAdmins(prevAdmins =>
        prevAdmins.map(a => (a.id === updatedAdmin.id ? updatedAdmin : a))
      );
      toast({ title: 'Admin Updated', description: `${updatedAdmin.name} has been successfully updated.` });
    } catch (error) {
      console.error("Error updating admin: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update admin.' });
    }
  };

  const deleteAdmin = async (adminId: string) => {
    if (admins.length <= 1) {
      toast({ variant: 'destructive', title: 'Action Forbidden', description: 'You cannot delete the last admin account.' });
      return;
    }
    try {
      await deleteDoc(doc(db, 'admins', adminId));
      setAdmins(prevAdmins => prevAdmins.filter(a => a.id !== adminId));
      toast({ variant: 'destructive', title: 'Admin Deleted', description: 'The admin has been successfully deleted.' });
    } catch (error) {
      console.error("Error deleting admin: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete admin.' });
    }
  };

  return (
    <AdminContext.Provider value={{ admins, addAdmin, updateAdmin, deleteAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmins = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmins must be used within an AdminProvider');
  }
  return context;
};
