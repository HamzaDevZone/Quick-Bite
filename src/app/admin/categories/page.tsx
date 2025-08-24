'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategories } from '@/hooks/use-categories';
import { CategoryDataTable } from '@/components/admin/CategoryDataTable';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function AdminCategoriesPage() {
    const { categories } = useCategories();
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Categories</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm setFormOpen={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <CategoryDataTable data={categories} />
        </div>
    );
}
