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
  orderDate: string;
  riderId?: string;
  paymentMethod: string;
}

export interface SiteSettings {
  heroImageUrl: string;
}
