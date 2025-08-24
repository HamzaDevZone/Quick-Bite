import type { Product, Category, Order, Rider, Admin } from './types';

// This file is now used as a fallback or for initial data structure reference.
// The primary data source is Firebase Firestore.
// The data here will NOT be reflected in the app unless you modify the hooks
// to read from these arrays instead of Firestore.

export const ADMINS: Admin[] = [
    {
        id: 'default-admin',
        name: 'Default Admin',
        email: 'admin@example.com',
        password: 'password'
    }
];

export const CATEGORIES: Category[] = [
];

export const PRODUCTS: Product[] = [
];

export const RIDERS: Rider[] = [
];

export const ORDERS: Order[] = [
];
