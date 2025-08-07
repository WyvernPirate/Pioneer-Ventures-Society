import type { MerchItem } from "@/firebase/merchService";

export const dummyMerchData: MerchItem[] = [
  {
    id: "1",
    name: "PVS Golf T-Shirt",
    description: "Look sharp on and off the course with this premium PVS golf t-shirt.",
    price: 25.0,
    imageUrl: "https://placehold.co/600x400/27ae60/ffffff?text=PVS+Golf+Shirt",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isPublished: true,
  },
  {
    id: "2",
    name: "PVS Coffee Mug",
    description: "Start your day with a dose of innovation. Perfect for your morning coffee or tea.",
    price: 12.0,
    imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=PVS+Mug",
    sizes: ["11oz", "15oz"],
    isPublished: true,
  },
  {
    id: "3",
    name: "PVS Innovator Cap",
    description: "A sleek and modern cap to complete your look. Adjustable strap for a perfect fit.",
    price: 15.0,
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=PVS+Cap",
    sizes: ["One Size"],
    isPublished: true,
  },
];