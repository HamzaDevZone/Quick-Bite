import type { Product, Category, Order } from './types';

export const CATEGORIES: Category[] = [
  { id: 'burgers', name: 'Burgers' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'sides', name: 'Sides' },
  { id: 'drinks', name: 'Drinks' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'A juicy beef patty with melted cheddar cheese, lettuce, tomato, and our special sauce.',
    price: 9.99,
    category: 'Burgers',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with a generous amount of pepperoni and mozzarella cheese.',
    price: 14.99,
    category: 'Pizza',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    name: 'Crispy French Fries',
    description: 'Golden, crispy fries lightly salted.',
    price: 3.99,
    category: 'Sides',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    name: 'Coca-Cola',
    description: 'A refreshing can of Coca-Cola.',
    price: 1.99,
    category: 'Drinks',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '5',
    name: 'Bacon Deluxe Burger',
    description: 'Our classic burger topped with crispy bacon and an extra slice of cheese.',
    price: 11.99,
    category: 'Burgers',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '6',
    name: 'Margherita Pizza',
    description: 'Simple and delicious pizza with fresh tomatoes, mozzarella, and basil.',
    price: 12.99,
    category: 'Pizza',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '7',
    name: 'Onion Rings',
    description: 'Battered and fried to perfection.',
    price: 4.99,
    category: 'Sides',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '8',
    name: 'Sprite',
    description: 'A refreshing can of Sprite.',
    price: 1.99,
    category: 'Drinks',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

export const ORDERS: Order[] = [
    {
        id: 'ORD001',
        customerName: 'John Doe',
        items: [
            { product: PRODUCTS[0], quantity: 1 },
            { product: PRODUCTS[2], quantity: 1 },
            { product: PRODUCTS[3], quantity: 1 },
        ],
        status: 'Pending',
        total: 15.97,
        orderDate: '2024-05-21T10:30:00Z',
    },
    {
        id: 'ORD002',
        customerName: 'Jane Smith',
        items: [
            { product: PRODUCTS[1], quantity: 1 },
            { product: PRODUCTS[6], quantity: 2 },
        ],
        status: 'Preparing',
        total: 24.97,
        orderDate: '2024-05-21T10:35:00Z',
    },
    {
        id: 'ORD003',
        customerName: 'Mike Johnson',
        items: [
            { product: PRODUCTS[4], quantity: 2 },
        ],
        status: 'Delivered',
        total: 23.98,
        orderDate: '2024-05-20T18:00:00Z',
    },
];
