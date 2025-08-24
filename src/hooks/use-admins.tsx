'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Admin } from '@/lib/types';
import { ADMINS } from '@/lib/data';
import { useToast } from './use-toast';

interface AdminContextType {
  admins: Admin[];
  addAdmin: (admin: Omit<Admin, 'id'>) => void;
  updateAdmin: (admin: Admin) => void;
  deleteAdmin: (adminId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>(ADMINS);

  const addAdmin = (admin: Omit<Admin, 'id'>) => {
    const newAdmin = { ...admin, id: `admin-${Date.now()}` };
    setAdmins(prevAdmins => [newAdmin, ...prevAdmins]);
    toast({ title: 'Admin Added', description: `${admin.name} has been successfully added.` });
  };

  const updateAdmin = (updatedAdmin: Admin) => {
    setAdmins(prevAdmins =>
      prevAdmins.map(a => (a.id === updatedAdmin.id ? updatedAdmin : a))
    );
    toast({ title: 'Admin Updated', description: `${updatedAdmin.name} has been successfully updated.` });
  };

  const deleteAdmin = (adminId: string) => {
    // Prevent deleting the last admin
    if (admins.length <= 1) {
        toast({ variant: 'destructive', title: 'Action Forbidden', description: 'You cannot delete the last admin account.' });
        return;
    }
    setAdmins(prevAdmins => prevAdmins.filter(a => a.id !== adminId));
    toast({ variant: 'destructive', title: 'Admin Deleted', description: 'The admin has been successfully deleted.' });
  };

  return (
    <AdminContext.Provider value={{ admins, addAdmin, updateAdmin, deleteAdmin }}>
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
