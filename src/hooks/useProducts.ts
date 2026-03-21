import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  tag?: string;
  badges: string[];
  category: string;
  section: 'BESTSELLERS' | 'NEW ARRIVALS' | 'CRAZY DEALS';
  description?: string;
  notes?: string[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const prods = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(prods);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Error (Products):", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), product);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), updates);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  return { products, loading, addProduct, updateProduct, deleteProduct };
};
