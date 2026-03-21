import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const initialProducts = [
  // HIM - Bestsellers
  { name: "Sundarban 50ml EDP", price: 1499, oldPrice: 2199, rating: 5, reviews: 8, image: "/product_him_1.png", category: "HIM", section: "BESTSELLERS", tag: "New Arrival", badges: ["Green", "Earthy"], description: "A rich earthy fragrance inspired by the wild mangroves. Perfect for the adventurous man.", notes: ["WOODY", "MUSK"] },
  { name: "Maritime EDP", price: 799, oldPrice: 1499, rating: 4, reviews: 5, image: "/product_him_2.png", category: "HIM", section: "BESTSELLERS", tag: "Best Seller", badges: ["Woody", "Aquatic"], description: "A fresh aquatic scent that captures the spirit of the open sea.", notes: ["AQUATIC", "CITRUSY"] },
  
  // HER - Bestsellers
  { name: "Alaya EDP", price: 799, oldPrice: 1499, rating: 5, reviews: 1, image: "/product_her_1.png", category: "HER", section: "BESTSELLERS", tag: "New Arrival", badges: ["Musky", "Citrus"], description: "A delicate musky fragrance with bright citrus notes for the modern woman.", notes: ["MUSK", "CITRUSY"] },
  { name: "Promise EDP", price: 799, oldPrice: 1499, rating: 4, reviews: 1, image: "/product_her_2.png", category: "HER", section: "BESTSELLERS", tag: "Best Seller", badges: ["Woody", "Earthy"], description: "An earthy, grounding scent that embodies warmth and sophistication.", notes: ["WOODY", "ROSE"] },

  // NEW ARRIVALS
  { name: "Desert Rose", price: 1800, oldPrice: 2400, rating: 5, reviews: 12, image: "/product_her_1.png", category: "HER", section: "NEW ARRIVALS", tag: "Premium", badges: ["Floral", "Warm"], description: "A luxurious floral bouquet with warm undertones.", notes: ["ROSE", "SPICY"] },
  { name: "Midnight Oud", price: 2100, oldPrice: 2800, rating: 5, reviews: 15, image: "/product_him_1.png", category: "HIM", section: "NEW ARRIVALS", tag: "Elite", badges: ["Smoky", "Intense"], description: "An intense oud fragrance for the man who commands attention.", notes: ["WOODY", "SPICY"] },

  // CRAZY DEALS
  { name: "Combo Pack: Night & Day", price: 1200, oldPrice: 2500, rating: 5, reviews: 20, image: "/product_him_2.png", category: "DEALS", section: "CRAZY DEALS", tag: "60% OFF", badges: ["Bundle", "Savings"], description: "Two premium fragrances at an unbeatable price.", notes: ["WOODY", "AQUATIC"] },
  { name: "Travel Set Pro", price: 499, oldPrice: 1200, rating: 4, reviews: 10, image: "/product_her_2.png", category: "DEALS", section: "CRAZY DEALS", tag: "Flash Sale", badges: ["Portable", "Gift"], description: "Perfect travel-sized fragrances for on-the-go luxury.", notes: ["MUSK", "CITRUSY"] },
];

export const seedDatabase = async () => {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, 'products', d.id));
    }

    for (const product of initialProducts) {
      await addDoc(productsCol, product);
    }
    
    alert("Database seeded successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
