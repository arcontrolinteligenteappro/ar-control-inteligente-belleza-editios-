export enum Category {
  HAIR = 'Cabello',
  BARBER = 'Barbería',
  NAILS = 'Uñas',
  SPA = 'Spa & Facial',
  MAKEUP = 'Maquillaje',
  PRODUCT = 'Producto' // Added for retail items
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  category: Category;
  imageUrl: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
  category: string;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  specialties: Category[];
  commissionRate?: number;
}

export interface Appointment {
  id: string;
  serviceId: string;
  stylistId: string;
  date: Date;
  status: 'confirmed' | 'pending' | 'completed';
  clientName?: string; // Added for admin view
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
  timestamp: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'service' | 'product';
  quantity: number;
}

export interface PrinterDevice {
  id: string;
  name: string;
  type: 'bluetooth' | 'wifi' | 'usb';
  address: string; // MAC or IP
  status: 'connected' | 'disconnected' | 'paired';
}
