'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRiders } from '@/hooks/use-riders';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RiderDataTable } from '@/components/admin/RiderDataTable';
import { RiderForm } from '@/components/admin/RiderForm';

export default function AdminRidersPage() {
    const { riders } = useRiders();
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Riders</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Rider
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Rider</DialogTitle>
                        </DialogHeader>
                        <RiderForm setFormOpen={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <RiderDataTable data={riders} />
        </div>
    );
}
