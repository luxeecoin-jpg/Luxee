import prisma from './prisma';
import { unstable_cache } from 'next/cache';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number; // Review count
  image: string;
  images: string[];
  tag: string | null;
  badges: string[];
  category: string;
  section: string;
  description: string | null;
  notes: string[];
  sizes: string[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string | null;
  image: string;
  ctaText: string;
  mobileImage: string | null;
}

export interface HeroConfig {
  slides: HeroSlide[];
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: number;
  productId: string;
}

// --- Cached Server-Side Data Fetchers (PostgreSQL + Prisma) ---

// Fetch all products (cached for 5 minutes)
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      console.log('Fetching products from PostgreSQL...');
      const products = await prisma.product.findMany({
        orderBy: { name: 'asc' },
      });
      console.log(`Fetched ${products.length} products.`);
      return products as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  ['products-list'],
  { revalidate: 300, tags: ['products'] }
);

// Fetch hero config (cached for 5 minutes)
export const getHeroConfig = unstable_cache(
  async (): Promise<HeroConfig> => {
    try {
      console.log('Fetching hero config from PostgreSQL...');
      const slides = await prisma.heroSlide.findMany({
        orderBy: { order: 'asc' },
      });
      
      if (slides.length > 0) {
        console.log('Hero slides found.');
        return { slides: slides as unknown as HeroSlide[] };
      }
      
      console.warn('No hero slides found in database.');
      return { slides: [] };
    } catch (error) {
      console.error('Error fetching hero config:', error);
      return { slides: [] };
    }
  },
  ['hero-config-data'],
  { revalidate: 300, tags: ['hero'] }
);

// Fetch reviews (cached for 5 minutes)
export const getReviews = unstable_cache(
  async (productId?: string): Promise<Review[]> => {
    try {
      console.log(`Fetching reviews for ${productId || 'general'} from PostgreSQL...`);
      const reviews = await prisma.review.findMany({
        where: productId ? { productId } : {},
        orderBy: { createdAt: 'desc' },
      });
      
      console.log(`Fetched ${reviews.length} reviews.`);
      return reviews.map((r: any) => ({
        ...r,
        createdAt: r.createdAt.getTime(),
      })) as Review[];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },
  ['reviews-data'],
  { revalidate: 300, tags: ['reviews'] }
);

// Fetch a single product by ID (cached for 5 minutes)
export const getProductById = unstable_cache(
  async (id: string): Promise<Product | null> => {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      return product as Product | null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  },
  ['product-by-id'],
  { revalidate: 300, tags: ['products'] }
);

// Fetch related products by category, excluding a given product ID (cached for 5 minutes)
export const getRelatedProducts = unstable_cache(
  async (category: string, excludeId: string, limit: number = 4): Promise<Product[]> => {
    try {
      const products = await prisma.product.findMany({
        where: {
          category,
          id: { not: excludeId },
        },
        take: limit,
      });
      return products as Product[];
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  },
  ['related-products'],
  { revalidate: 300, tags: ['products'] }
);

/**
 * Performance Optimization Note: 
 * We use unstable_cache for ISR (Incremental Static Regeneration) equivalent in Next.js 15.
 * This ensures data is pre-fetched and served nearly instantly to the user.
 */
