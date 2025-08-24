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
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Delivered';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  orderDate: string;
}
