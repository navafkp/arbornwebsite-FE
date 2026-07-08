import type { Order, UserProfile } from "@/lib/types";
import { products } from "./products";

export const user: UserProfile = {
  name: "Aisha Menon",
  email: "aisha.menon@example.com",
  phone: "+91 98765 43210",
  avatar: "https://i.pravatar.cc/300?img=47",
  addresses: [
    {
      label: "Home",
      line1: "14, Palm Grove Apartments, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      isDefault: true,
    },
    {
      label: "Work",
      line1: "3rd Floor, Prestige Tech Park, Kadubeesanahalli",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      isDefault: false,
    },
  ],
  rewardPoints: 1280,
  rewardLevel: "Gold Member",
  totalOrders: 12,
  memberSince: "2024-02-14",
};

export const orders: Order[] = [
  {
    id: "AB-10559",
    date: "2026-07-05",
    status: "contacted_whatsapp",
    items: [
      {
        productId: products[9].id,
        name: products[9].name,
        image: products[9].colors[0].images[0],
        quantity: 1,
        price: products[9].price,
        size: "M",
      },
    ],
    total: products[9].price,
  },
  {
    id: "AB-10482",
    date: "2026-06-25",
    status: "Delivered",
    items: [
      {
        productId: products[0].id,
        name: products[0].name,
        image: products[0].colors[0].images[0],
        quantity: 1,
        price: products[0].price,
        size: "M",
      },
    ],
    total: products[0].price,
  },
  {
    id: "AB-10361",
    date: "2026-06-08",
    status: "Delivered",
    items: [
      {
        productId: products[4].id,
        name: products[4].name,
        image: products[4].colors[0].images[0],
        quantity: 2,
        price: products[4].price,
        size: "S",
      },
      {
        productId: products[8].id,
        name: products[8].name,
        image: products[8].colors[0].images[0],
        quantity: 1,
        price: products[8].price,
        size: "M",
      },
    ],
    total: products[4].price * 2 + products[8].price,
  },
  {
    id: "AB-10214",
    date: "2026-05-19",
    status: "Shipped",
    items: [
      {
        productId: products[16].id,
        name: products[16].name,
        image: products[16].colors[0].images[0],
        quantity: 1,
        price: products[16].price,
        size: "L",
      },
    ],
    total: products[16].price,
  },
  {
    id: "AB-10096",
    date: "2026-04-30",
    status: "Cancelled",
    items: [
      {
        productId: products[12].id,
        name: products[12].name,
        image: products[12].colors[0].images[0],
        quantity: 1,
        price: products[12].price,
        size: "M",
      },
    ],
    total: products[12].price,
  },
];
