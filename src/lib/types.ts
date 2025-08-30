
import type { Timestamp } from 'firebase/firestore';

export const serviceTypes = ['Food', 'Grocery', 'Electronics'] as const;
export type ServiceType = typeof serviceTypes[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface Category {
  id:string;
  name: string;
  iconUrl: string;
  serviceType: ServiceType;
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
  userId?: string; // Link to the authenticated user
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
  orderNotes?: string;
  serviceType: ServiceType;
}

export interface PaymentMethod {
  id: string;
  label: string;
  details: string;
}

export interface SiteSettings {
  heroImageUrl: string;
  splashImageUrl: string;
  menuImageUrl: string;
  deliveryFee: number;
  splashLogoUrl: string;
  menuCarouselImage1: string;
  menuCarouselImage2: string;
  menuCarouselImage3: string;
  menuCarouselImage4: string;
  paymentMethods: PaymentMethod[];
  whatsappUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: Timestamp;
}
