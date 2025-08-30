
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Shapes } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategories } from '@/hooks/use-categories';
import { CategoryDataTable } from '@/components/admin/CategoryDataTable';
import { CategoryForm, FormType } from '@/components/admin/CategoryForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubCategoryDataTable } from '@/components/admin/SubCategoryDataTable';

export default function AdminCategoriesPage() {
    const { mainCategories, subCategories, loading } = useCategories();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState<FormType>('main');
    const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);

    const handleAddClick = (type: FormType, mainCategoryId?: string) => {
        setFormType(type);
        if (type === 'sub' && mainCategoryId) {
            setSelectedMainCategory(mainCategoryId);
        } else {
            setSelectedMainCategory(null);
        }
        setIsFormOpen(true);
    };

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold font-headline">Categories</h1>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleAddClick('main')}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Main Category
                        </Button>
                    </DialogTrigger>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Main Categories</span>
                                <Shapes className="w-5 h-5 text-muted-foreground"/>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <CategoryDataTable data={mainCategories} onAddSubCategory={id => handleAddClick('sub', id)} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center justify-between">
                                <span>Sub Categories</span>
                                 <Button variant="outline" size="sm" onClick={() => handleAddClick('sub')}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Sub Category
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SubCategoryDataTable data={subCategories} mainCategories={mainCategories}/>
                        </CardContent>
                    </Card>
                </div>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{formType === 'main' ? 'Add Main Category' : 'Add Sub Category'}</DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                        formType={formType}
                        setFormOpen={setIsFormOpen}
                        mainCategories={mainCategories}
                        preselectedMainCategoryId={selectedMainCategory}
                    />
                </DialogContent>
            </div>
        </Dialog>
    );
}
