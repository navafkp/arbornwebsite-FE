export type Size = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL";

export type ProductTag = "new" | "bestseller" | "premium" | "limited";

export interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

export interface Category {
  slug: string;
  name: string;
  image: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  fabric: string;
  sizes: Size[];
  colors: ColorVariant[];
  shortDescription: string;
  description: string;
  careInstructions: string[];
  shippingInfo: string;
  tags: ProductTag[];
  inStock: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface Address {
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size: Size;
}

export type OrderStatus =
  | "Delivered"
  | "Shipped"
  | "Processing"
  | "Cancelled"
  // Temporary status until real payment + order tracking exists: set when a
  // customer taps "Order on WhatsApp" but hasn't confirmed the order yet.
  | "contacted_whatsapp";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  rewardPoints: number;
  rewardLevel: string;
  totalOrders: number;
  memberSince: string;
}
