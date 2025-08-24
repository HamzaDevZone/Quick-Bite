'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProductDataTable } from '@/components/admin/ProductDataTable';
import { useProducts } from '@/hooks/use-products';
import { useState } from 'react';
import { ProductForm } from '@/components/admin/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AdminProductsPage() {
    const { products } = useProducts();
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Products</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <ProductForm setFormOpen={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <ProductDataTable data={products} />
        </div>
    );
}
