
'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SubCategory, MainCategory } from '@/lib/types';
import { useCategories } from '@/hooks/use-categories';
import { CategoryForm, FormType } from './CategoryForm';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

interface SubCategoryDataTableProps {
  data: SubCategory[];
  mainCategories: MainCategory[];
}

export function SubCategoryDataTable({ data, mainCategories }: SubCategoryDataTableProps) {
  const { deleteSubCategory } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<FormType>('sub');
  const [categoryToEdit, setCategoryToEdit] = useState<SubCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<SubCategory | null>(null);
  
  const mainCategoryMap = useMemo(() => {
    return new Map(mainCategories.map(mc => [mc.id, mc.name]));
  }, [mainCategories]);

  const handleEdit = (category: SubCategory) => {
    setFormType('sub');
    setCategoryToEdit(category);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteSubCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <ScrollArea className="h-96 w-full whitespace-nowrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Main Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(category => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={category.iconUrl} alt={category.name} data-ai-hint="category icon"/>
                      <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {mainCategoryMap.get(category.mainCategoryId) || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryToDelete(category)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sub Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            formType={formType}
            categoryToEdit={categoryToEdit}
            mainCategories={mainCategories}
            setFormOpen={setIsFormOpen}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!categoryToDelete} onOpenChange={(isOpen) => !isOpen && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category "{categoryToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
