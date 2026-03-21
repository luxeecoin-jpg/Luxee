import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  mobileImage?: string;
}

export interface HeroConfig {
  slides: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "1",
    title: "Ethereal Essence",
    subtitle: "Nilesh® Premium Collection",
    image: "/summer_hero.png",
    ctaText: "Explore Collection",
    mobileImage: "/summer_hero.png"
  },
  {
    id: "2",
    title: "Sun-Kissed Fragrances",
    subtitle: "Limited Summer Edition",
    image: "/summer_hero_1.png",
    ctaText: "Shop Summer",
    mobileImage: "/summer_hero_1.png"
  },
  {
    id: "3",
    title: "Pure Luxury",
    subtitle: "Artisanal Perfumery",
    image: "/summer_hero_2.png",
    ctaText: "Discover More",
    mobileImage: "/summer_hero_2.png"
  }
];

export const useHeroConfig = () => {
  const [config, setConfig] = useState<HeroConfig>({ slides: DEFAULT_SLIDES });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'siteConfig', 'hero_v2'), 
      (snapshot) => {
        if (snapshot.exists()) {
          setConfig(snapshot.data() as HeroConfig);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Error (HeroConfig):", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const updateHero = async (newConfig: HeroConfig) => {
    await setDoc(doc(db, 'siteConfig', 'hero_v2'), newConfig);
  };

  return { config, loading, updateHero };
};
