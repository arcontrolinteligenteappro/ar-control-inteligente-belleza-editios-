import { Category, Service, Stylist, Product } from './types';

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte Moderno Fade',
    description: 'Degradado perfecto con navaja y tijera.',
    price: 25.00,
    durationMin: 45,
    category: Category.BARBER,
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 's2',
    name: 'Manicura Gel Premium',
    description: 'Limpieza profunda, diseño personalizado y acabado duradero.',
    price: 35.00,
    durationMin: 60,
    category: Category.NAILS,
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 's3',
    name: 'Balayage & Tono',
    description: 'Técnica de coloración a mano alzada para un look natural.',
    price: 120.00,
    durationMin: 180,
    category: Category.HAIR,
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 's4',
    name: 'Limpieza Facial Profunda',
    description: 'Extracción de impurezas, mascarilla hidratante y masaje.',
    price: 50.00,
    durationMin: 50,
    category: Category.SPA,
    imageUrl: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: 's5',
    name: 'Afeitado Clásico',
    description: 'Toallas calientes, aceites esenciales y navaja libre.',
    price: 20.00,
    durationMin: 30,
    category: Category.BARBER,
    imageUrl: 'https://picsum.photos/400/300?random=5'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    code: '750100',
    name: 'Cera Mate fijación fuerte',
    cost: 8.00,
    price: 15.00,
    stock: 24,
    category: 'Estilizado'
  },
  {
    id: 'p2',
    code: '750101',
    name: 'Shampoo Matizador Violeta',
    cost: 12.00,
    price: 28.00,
    stock: 10,
    category: 'Cuidado'
  },
  {
    id: 'p3',
    code: '750102',
    name: 'Aceite para Barba 30ml',
    cost: 10.00,
    price: 22.00,
    stock: 15,
    category: 'Barba'
  }
];

export const STYLISTS: Stylist[] = [
  {
    id: 'st1',
    name: 'Carlos Ruiz',
    role: 'Master Barber',
    avatarUrl: 'https://picsum.photos/100/100?random=10',
    rating: 4.9,
    specialties: [Category.BARBER],
    commissionRate: 0.40
  },
  {
    id: 'st2',
    name: 'Ana García',
    role: 'Nail Artist',
    avatarUrl: 'https://picsum.photos/100/100?random=11',
    rating: 4.8,
    specialties: [Category.NAILS],
    commissionRate: 0.35
  },
  {
    id: 'st3',
    name: 'Sofia Marco',
    role: 'Estilista Senior',
    avatarUrl: 'https://picsum.photos/100/100?random=12',
    rating: 5.0,
    specialties: [Category.HAIR, Category.MAKEUP],
    commissionRate: 0.45
  }
];

export const APP_NAME = "GlamourFlow";
