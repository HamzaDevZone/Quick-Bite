
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { PlusCircle, Trash2, Wallet, Edit } from 'lucide-react';
import { useState } from 'react';
import type { PaymentMethod } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const formSchema = z.object({
  label: z.string().min(2, 'Label is required'),
  details: z.string().min(2, 'Details are required'),
});


export default function AdminFinancePage() {
  const { settings, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useSiteSettings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [methodToEdit, setMethodToEdit] = useState<PaymentMethod | null>(null);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);

  const handleEditClick = (method: PaymentMethod) => {
    setMethodToEdit(method);
    setIsFormOpen(true);
  };
  
  const handleAddNewClick = () => {
    setMethodToEdit(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (methodToDelete) {
      deletePaymentMethod(methodToDelete.id);
      setMethodToDelete(null);
    }
  };


  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold font-headline">Finance</h1>
            <Button onClick={handleAddNewClick}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
        </div>
      
        <Card>
            <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage the payment methods available to customers at checkout.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                {(settings.paymentMethods || []).map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 rounded-md border bg-secondary">
                    <div>
                        <p className="flex items-center gap-2 font-semibold"><Wallet className="w-4 h-4 text-muted-foreground"/> {method.label}</p>
                        <p className="text-sm text-muted-foreground pl-6">{method.details}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon" onClick={() => handleEditClick(method)}>
                            <Edit className="w-4 h-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setMethodToDelete(method)}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
                ))}
                {(!settings.paymentMethods || settings.paymentMethods.length === 0) && <p className="text-muted-foreground text-sm p-4 text-center">No payment methods configured.</p>}
            </div>
            </CardContent>
        </Card>

        <PaymentMethodDialog
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            methodToEdit={methodToEdit}
            addPaymentMethod={addPaymentMethod}
            updatePaymentMethod={updatePaymentMethod}
        />
        
        <AlertDialog open={!!methodToDelete} onOpenChange={(isOpen) => !isOpen && setMethodToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the payment method: "{methodToDelete?.label}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}


interface PaymentMethodDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  methodToEdit: PaymentMethod | null;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
}

function PaymentMethodDialog({ isOpen, setIsOpen, methodToEdit, addPaymentMethod, updatePaymentMethod }: PaymentMethodDialogProps) {
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: '',
            details: '',
        },
    });

    useState(() => {
        if(methodToEdit) {
            form.reset({
                label: methodToEdit.label,
                details: methodToEdit.details,
            });
        } else {
            form.reset({
                label: '',
                details: '',
            });
        }
    }, [methodToEdit, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (methodToEdit) {
            updatePaymentMethod({ ...methodToEdit, ...values });
        } else {
            addPaymentMethod(values);
        }
        setIsOpen(false);
    };

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{methodToEdit ? 'Edit Payment Method' : 'Add New Payment Method'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Easypaisa" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g. Account: 0300-1234567, Name: John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button type="submit">{methodToEdit ? 'Save Changes' : 'Add Method'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}