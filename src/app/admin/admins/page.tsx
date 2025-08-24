'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAdmins } from '@/hooks/use-admins';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminForm } from '@/components/admin/AdminForm';

export default function AdminAdminsPage() {
    const { admins } = useAdmins();
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Admins</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Admin</DialogTitle>
                        </DialogHeader>
                        <AdminForm setFormOpen={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <AdminDataTable data={admins} />
        </div>
    );
}
