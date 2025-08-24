import type { Product, Category, Order, Rider, Admin } from './types';

export const ADMINS: Admin[] = [
  { id: 'admin-1', name: 'Super Admin', email: 'gk00536789@gmail.com', password: 'gk00536789' }
];

export const CATEGORIES: Category[] = [
];

export const PRODUCTS: Product[] = [
];

export const RIDERS: Rider[] = [
    {
        id: 'rider-1',
        name: 'Alex Green',
        email: 'rider@example.com',
        password: 'password123',
        phone: '123-456-7890',
        vehicleInfo: 'Motorcycle - Yamaha MT-07',
        profilePictureUrl: 'https://placehold.co/100x100.png'
    },
    {
        id: 'rider-2',
        name: 'Ben Carter',
        email: 'ben@example.com',
        password: 'password123',
        phone: '098-765-4321',
        vehicleInfo: 'Scooter - Honda PCX150',
        profilePictureUrl: 'https://placehold.co/100x100.png'
    }
];

export const ORDERS: Order[] = [
];
