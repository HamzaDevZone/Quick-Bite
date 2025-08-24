import type { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  iconUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Picked' | 'Delivered';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Rider {
    id: string;
    name: string;
    email: string;
    password?: string; // Should not be sent to client
    phone: string;
    vehicleInfo: string;
    profilePictureUrl?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  orderDate: Timestamp | string;
  riderId?: string;
  paymentMethod: string;
  deliveryFee: number;
}

export interface SiteSettings {
  heroImageUrl: string;
  splashImageUrl: string;
  menuImageUrl: string;
  deliveryFee: number;
  splashLogoUrl: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'admin' or user's ID/name
  text: string;
  createdAt: Timestamp;
}

export interface Conversation {
  id: string;
  userId: string; // Could be customer name or a unique ID
  userName: string;
  lastMessage: string;
  updatedAt: Timestamp;
  isReadByAdmin: boolean;
}
