import type { Product, Category, Order, Rider } from './types';

export const CATEGORIES: Category[] = [
  { id: 'burgers', name: 'Burgers', iconUrl: 'https://i.ibb.co/GcmC6GZ/burgers.png' },
  { id: 'pizza', name: 'Pizza', iconUrl: 'https://i.ibb.co/gJFyVz4/pizza.png' },
  { id: 'sides', name: 'Sides', iconUrl: 'https://i.ibb.co/VMyxQzV/sides.png' },
  { id: 'drinks', name: 'Drinks', iconUrl: 'https://i.ibb.co/hH0vS2d/drinks.png' },
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
    {
        id: 'ORD001',
        customerName: 'John Doe',
        customerPhone: '555-123-4567',
        customerAddress: '123 Main St, Anytown, USA',
        items: [
            { product: PRODUCTS[0], quantity: 1 },
            { product: PRODUCTS[2], quantity: 1 },
            { product: PRODUCTS[3], quantity: 1 },
        ],
        status: 'Preparing',
        total: 15.97,
        orderDate: '2024-05-21T10:30:00Z',
        riderId: 'rider-1',
    },
    {
        id: 'ORD002',
        customerName: 'Jane Smith',
        customerPhone: '555-987-6543',
        customerAddress: '456 Oak Ave, Anytown, USA',
        items: [
            { product: PRODUCTS[1], quantity: 1 },
            { product: PRODUCTS[6], quantity: 2 },
        ],
        status: 'Picked',
        total: 24.97,
        orderDate: '2024-05-21T10:35:00Z',
        riderId: 'rider-1',
    },
    {
        id: 'ORD003',
        customerName: 'Mike Johnson',
        customerPhone: '555-555-5555',
        customerAddress: '789 Pine Ln, Othertown, USA',
        items: [
            { product: PRODUCTS[4], quantity: 2 },
        ],
        status: 'Delivered',
        total: 23.98,
        orderDate: '2024-05-20T18:00:00Z',
        riderId: 'rider-2',
    },
     {
        id: 'ORD004',
        customerName: 'Sarah Brown',
        customerPhone: '555-222-3333',
        customerAddress: '789 Pine Ln, Anytown, USA',
        items: [
            { product: PRODUCTS[5], quantity: 1 },
            { product: PRODUCTS[7], quantity: 1 },
        ],
        status: 'Pending',
        total: 13.98,
        orderDate: '2024-05-21T11:00:00Z',
    },
];
