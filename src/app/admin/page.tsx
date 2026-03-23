"use client";

import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useProducts, Product } from '@/hooks/useProducts';
import { useHeroConfig, HeroSlide } from '@/hooks/useHeroConfig';
import { collection, query, orderBy, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Loader2, 
  Layout, 
  BarChart3, 
  Package, 
  Zap, 
  Search, 
  Edit3, 
  Upload, 
  Eye, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Ban,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  User as UserIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { seedDatabase } from '@/lib/seed';
import Link from 'next/link';

const CATEGORIES = ['HIM', 'HER', 'GIFTING'];
const SECTIONS = ['BESTSELLERS', 'NEW ARRIVALS'];
const SIZES = ['15 ML', '30 ML', '50 ML', '100 ML'];

type AdminTab = 'dashboard' | 'products' | 'hero' | 'orders';

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    apartment: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: any[];
  totalPrice: number;
  status: string;
  paymentId: string;
  createdAt: any;
}

// Compress image and convert to base64 data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.8 quality to minimize payload size
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function AdminPage() {
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { config: hero, loading: heroLoading, updateHero } = useHeroConfig();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product> & { sizes?: string[] }>({});
  const [isAdding, setIsAdding] = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('ALL');
  const [showPreview, setShowPreview] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState(SIZES);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearch, setOrderSearch] = useState('');

  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u?.email === 'admin@gmail.com') setIsAdmin(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (hero?.slides) setHeroSlides(hero.slides);
  }, [hero]);

  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'dashboard') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setOrdersLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status");
    }
  };

  const updateSlideField = (idx: number, field: keyof HeroSlide, value: string) => {
    const s = [...heroSlides];
    s[idx] = { ...s[idx], [field]: value };
    setHeroSlides(s);
  };

  const addNewSlide = () => {
    const s: HeroSlide = { id: Date.now().toString(), title: "", subtitle: "", image: "/summer_hero.png", ctaText: "", mobileImage: "/summer_hero.png" };
    setHeroSlides([...heroSlides, s]);
    setActiveSlideIdx(heroSlides.length);
  };

  const removeSlide = (idx: number) => {
    const s = heroSlides.filter((_, i) => i !== idx);
    setHeroSlides(s);
    if (activeSlideIdx >= s.length) setActiveSlideIdx(Math.max(0, s.length - 1));
  };

  const handleSlideImageUpload = async (idx: number, field: 'image' | 'mobileImage', file: File) => {
    const dataUrl = await fileToDataUrl(file);
    updateSlideField(idx, field, dataUrl);
  };

  const saveHeroChanges = async () => {
    await updateHero({ slides: heroSlides });
    alert("Hero Slider updated!");
  };

  const handleImageUpload = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    setEditForm({ ...editForm, image: dataUrl });
  };

  const toggleSize = (size: string) => {
    const current = editForm.sizes || [];
    if (current.includes(size)) {
      setEditForm({ ...editForm, sizes: current.filter(s => s !== size) });
    } else {
      setEditForm({ ...editForm, sizes: [...current, size] });
    }
  };

  const removeAvailableSize = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Remove from available sizes
    setAvailableSizes(availableSizes.filter(s => s !== size));
    // Also unselect it if it was selected
    if ((editForm.sizes || []).includes(size)) {
      setEditForm({ ...editForm, sizes: (editForm.sizes || []).filter(s => s !== size) });
    }
  };

  const handleAddCustomSize = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!customSize.trim()) return;
    const value = customSize.trim().toUpperCase();
    if (!availableSizes.includes(value)) {
      setAvailableSizes([...availableSizes, value]);
    }
    if (!(editForm.sizes || []).includes(value)) {
      setEditForm({ ...editForm, sizes: [...(editForm.sizes || []), value] });
    }
    setCustomSize('');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const discountedPrice = Number(editForm.price) || 0;
    const originalPrice = Number(editForm.oldPrice) || discountedPrice;
    await addProduct({
      name: editForm.name || "New Product",
      price: discountedPrice,
      oldPrice: originalPrice,
      rating: 5, reviews: 0,
      image: editForm.image || "/product_him_1.png",
      category: editForm.category || "HIM",
      section: (editForm.section as any) || "BESTSELLERS",
      badges: editForm.badges || [],
      tag: editForm.tag || "",
      description: editForm.description || "",
      sizes: editForm.sizes || [],
    });
    setIsAdding(false);
    setEditForm({});
    setShowPreview(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await updateProduct(editingId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchFilter = productFilter === 'ALL' || p.section === productFilter;
    return matchSearch && matchFilter;
  });

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const stats = {
    total: products.length,
    bestsellers: products.filter(p => p.section === 'BESTSELLERS').length,
    newArrivals: products.filter(p => p.section === 'NEW ARRIVALS').length,
    totalOrders: orders.length,
    revenue: orders.reduce((acc, o) => acc + o.totalPrice, 0),
    activeOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed': return Clock;
      case 'processing': return Zap;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle2;
      case 'cancelled': return Ban;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-amber-600 bg-amber-50';
      case 'shipped': return 'text-purple-600 bg-purple-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-black/40 bg-black/5';
    }
  };

  if (authLoading || (productsLoading && activeTab === 'products') || (heroLoading && activeTab === 'hero') || (ordersLoading && activeTab === 'orders')) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-6 h-6 text-black/20" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#fafafa]">
        <h1 className="text-3xl font-serif text-[#1a1a1a] mb-3">Admin Access Required</h1>
        <p className="text-sm text-black/30 max-w-xs mb-8">Please login with the admin account.</p>
        <button onClick={() => router.push('/login')} className="bg-black text-white px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em]">Go to Login</button>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'hero', label: 'Hero Slider', icon: Layout },
  ];

  // Discount calculation
  const discountPercent = editForm.oldPrice && editForm.price && editForm.oldPrice > editForm.price
    ? Math.round(((editForm.oldPrice - editForm.price) / editForm.oldPrice) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-black/[0.04] min-h-screen p-6 hidden lg:flex flex-col fixed left-0 top-0 h-full">
        <Link href="/" className="text-xl font-black tracking-[0.3em] font-serif mb-10 block">LUXEE</Link>
        <nav className="flex-1 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all text-left ${activeTab === t.id ? 'bg-black text-white' : 'text-black/40 hover:text-black hover:bg-black/[0.03]'}`}>
              <t.icon className="w-4 h-4" />{t.label}
              {t.id === 'orders' && stats.activeOrders > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{stats.activeOrders}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-black/5">
          <p className="text-[9px] text-black/20 font-medium uppercase tracking-wider">Logged in as</p>
          <p className="text-[11px] font-semibold text-black/60 mt-1">{user?.email}</p>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 flex z-50">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-3 flex flex-col items-center gap-1 text-[8px] font-bold uppercase tracking-wider ${activeTab === t.id ? 'text-black' : 'text-black/25'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-60 p-4 md:p-8 pb-24 lg:pb-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-[#1a1a1a] mb-8">Dashboard</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-black/[0.04] shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600">Total Revenue</span>
                  <p className="text-3xl font-black text-[#1a1a1a] mt-3">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-black/[0.04] shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-orange-600">Total Orders</span>
                  <p className="text-3xl font-black text-[#1a1a1a] mt-3">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-black/[0.04] shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-600">Active Orders</span>
                  <p className="text-3xl font-black text-[#1a1a1a] mt-3">{stats.activeOrders}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-black/[0.04] shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-green-50 text-green-600">Products</span>
                  <p className="text-3xl font-black text-[#1a1a1a] mt-3">{stats.total}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => { if(confirm("Are you sure? This will add sample products.")) seedDatabase(); }} className="bg-white p-6 rounded-2xl border border-black/[0.04] text-left hover:border-black/10 transition-all flex items-center justify-between group">
                <div>
                    <h3 className="text-sm font-black text-[#1a1a1a] mb-1 uppercase tracking-tight">Seed Database</h3>
                    <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">Reset products with sample data</p>
                </div>
                <ArrowRight className="w-5 h-5 text-black/10 group-hover:text-black transition-all" />
              </button>
              <Link href="/" target="_blank" className="bg-white p-6 rounded-2xl border border-black/[0.04] text-left hover:border-black/10 transition-all flex items-center justify-between group">
                <div>
                    <h3 className="text-sm font-black text-[#1a1a1a] mb-1 uppercase tracking-tight">View Store</h3>
                    <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">See your store as customers see it</p>
                </div>
                <ArrowRight className="w-5 h-5 text-black/10 group-hover:text-black transition-all" />
              </Link>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                  <h1 className="text-2xl font-serif text-[#1a1a1a]">Customer Orders</h1>
                  <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mt-1">Manage sales and tracking</p>
              </div>
              <div className="flex items-center gap-3">
                  <button onClick={fetchOrders} className="p-2.5 bg-white border border-black/5 rounded-xl text-black/40 hover:text-black transition-colors">
                      <Zap className="w-4 h-4" />
                  </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input 
                        type="text" 
                        placeholder="Search ID, Name or Email..." 
                        value={orderSearch} 
                        onChange={e => setOrderSearch(e.target.value)} 
                        className="w-full bg-white border border-black/[0.06] rounded-2xl pl-12 pr-4 py-4 text-sm font-bold shadow-sm outline-none focus:border-black/20 transition-all" 
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-black/[0.04] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] font-black uppercase tracking-widest text-black/30 border-b border-black/[0.03]">
                                <th className="p-6">Order ID</th>
                                <th className="p-6">Customer</th>
                                <th className="p-6">Date</th>
                                <th className="p-6 text-right">Amount</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.02]">
                            {filteredOrders.map(o => (
                                <tr key={o.id} className="hover:bg-[#fafafa] transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>
                                    <td className="p-6">
                                        <p className="text-xs font-black uppercase tracking-tight">#{o.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">{o.paymentId === 'COD' ? 'COD' : 'RAZORPAY'}</p>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-xs font-black tracking-tight">{o.customerName}</p>
                                        <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">{o.customerPhone}</p>
                                    </td>
                                    <td className="p-6 font-bold text-[10px] text-black/40 uppercase tracking-widest">
                                        {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString('en-IN') : 'Just now'}
                                    </td>
                                    <td className="p-6 text-right font-black text-xs">₹{o.totalPrice}</td>
                                    <td className="p-6">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="p-2 bg-black/[0.02] hover:bg-black hover:text-white rounded-xl transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div className="p-20 text-center">
                        <ShoppingBag className="w-12 h-12 text-black/5 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">No orders matching your search</p>
                    </div>
                )}
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-serif text-[#1a1a1a]">Products</h1>
              <button onClick={() => { setIsAdding(true); setEditForm({ sizes: ['50 ML'] }); setShowPreview(false); }} className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input type="text" placeholder="Search products..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full bg-white border border-black/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none" />
              </div>
              <select value={productFilter} onChange={e => setProductFilter(e.target.value)} className="bg-white border border-black/[0.06] rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider outline-none">
                <option value="ALL">All Sections</option>
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-bold uppercase tracking-wider text-black/30 border-b border-black/[0.04]">
                      <th className="p-4">Image</th><th className="p-4">Product</th><th className="p-4">Section</th><th className="p-4 text-right">Price</th><th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.03]">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="p-4"><div className="w-12 h-12 bg-[#fafafa] rounded-lg border border-black/[0.04] p-1"><img src={p.image} className="w-full h-full object-contain" /></div></td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-[#1a1a1a]">{p.name}</p>
                          <div className="flex gap-1 mt-1"><span className="text-[8px] font-semibold bg-black/5 px-1.5 py-0.5 rounded">{p.category}</span>{p.tag && <span className="text-[8px] font-semibold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">{p.tag}</span>}</div>
                        </td>
                        <td className="p-4"><span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${p.section === 'BESTSELLERS' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>{p.section}</span></td>
                        <td className="p-4 text-right"><p className="text-sm font-bold">₹{p.price}</p>{p.oldPrice > p.price && <p className="text-[10px] text-black/20 line-through">₹{p.oldPrice}</p>}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setEditingId(p.id); setEditForm(p); setIsAdding(true); setShowPreview(false); }} className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => { if(confirm("Delete product?")) deleteProduct(p.id); }} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && <div className="p-12 text-center text-sm text-black/20">No products found</div>}
            </div>
          </div>
        )}

        {/* Hero Slider */}
        {activeTab === 'hero' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-serif text-[#1a1a1a]">Hero Slider</h1>
              <button onClick={addNewSlide} className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2"><Plus className="w-4 h-4" /> Add Slide</button>
            </div>
            {heroSlides.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="space-y-2">
                  {heroSlides.map((s, i) => (
                    <div key={s.id} onClick={() => setActiveSlideIdx(i)} className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between group transition-all ${activeSlideIdx === i ? 'bg-black text-white border-black' : 'bg-white border-black/[0.04] hover:border-black/10'}`}>
                      <div className="flex items-center gap-3">
                        <img src={s.image} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-[11px] font-semibold">Slide {i + 1}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeSlide(i); }} className={`p-1.5 rounded transition-all ${activeSlideIdx === i ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-red-400 hover:text-red-500 hover:bg-red-50'}`}><Trash2 className="w-4 h-4 md:w-3.5 md:h-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="xl:col-span-2 bg-white rounded-xl border border-black/[0.04] p-6">
                  <h3 className="text-sm font-bold mb-6">Slide {activeSlideIdx + 1} Settings</h3>
                  <div className="space-y-5">
                    {/* Desktop Image */}
                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Desktop Image</label>
                      <div className="flex gap-3">
                        <input className="flex-1 bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={heroSlides[activeSlideIdx]?.image || ''} onChange={e => updateSlideField(activeSlideIdx, 'image', e.target.value)} placeholder="Image URL or upload" />
                        <label className="bg-black/[0.04] hover:bg-black/[0.08] px-4 py-3 rounded-xl cursor-pointer flex items-center gap-2 text-[10px] font-semibold transition-colors">
                          <Upload className="w-4 h-4" /> Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleSlideImageUpload(activeSlideIdx, 'image', e.target.files[0]); }} />
                        </label>
                      </div>
                    </div>
                    {/* Mobile Image */}
                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Mobile Image</label>
                      <div className="flex gap-3">
                        <input className="flex-1 bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={heroSlides[activeSlideIdx]?.mobileImage || ''} onChange={e => updateSlideField(activeSlideIdx, 'mobileImage', e.target.value)} placeholder="Falls back to desktop" />
                        <label className="bg-black/[0.04] hover:bg-black/[0.08] px-4 py-3 rounded-xl cursor-pointer flex items-center gap-2 text-[10px] font-semibold transition-colors">
                          <Upload className="w-4 h-4" /> Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleSlideImageUpload(activeSlideIdx, 'mobileImage', e.target.files[0]); }} />
                        </label>
                      </div>
                    </div>
                    {/* Preview */}
                    <div className="flex gap-4 pt-2">
                      {['Desktop', 'Mobile'].map((label, idx) => (
                        <div key={label} className="flex-1">
                          <p className="text-[9px] font-semibold text-black/25 uppercase tracking-wider mb-2">{label} Preview</p>
                          <div className={`bg-[#fafafa] rounded-xl border border-black/[0.04] overflow-hidden ${idx === 0 ? 'aspect-[16/7]' : 'aspect-[9/14]'}`}>
                            <img src={idx === 0 ? heroSlides[activeSlideIdx]?.image : (heroSlides[activeSlideIdx]?.mobileImage || heroSlides[activeSlideIdx]?.image)} className="w-full h-full object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={saveHeroChanges} className="mt-6 bg-black text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-black/90 transition-all">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}


        {/* Add / Edit Product Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-black/[0.04] sticky top-0 bg-white z-10 rounded-t-2xl">
                <h2 className="text-xl font-serif">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowPreview(!showPreview)} className={`p-2 rounded-lg transition-colors ${showPreview ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'}`}><Eye className="w-4 h-4" /></button>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); setEditForm({}); setShowPreview(false); }} className="p-2 hover:bg-black/5 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className={`${showPreview ? 'grid grid-cols-1 md:grid-cols-2' : ''}`}>
                <form onSubmit={editingId ? (e) => { e.preventDefault(); handleSaveEdit(); setIsAdding(false); } : handleAdd} className="p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Product Name</label>
                    <input className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Section */}
                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Section</label>
                      <select className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none font-bold" value={editForm.section || 'BESTSELLERS'} onChange={e => setEditForm({...editForm, section: e.target.value as any})}>
                        {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    {/* Category (Dropdown) */}
                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Category</label>
                      <select className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none font-bold" value={editForm.category || 'HIM'} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-[#fafafa] rounded-xl p-4 border border-black/[0.04] space-y-3">
                    <h4 className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Pricing & Discount</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Original Price (₹)</label>
                        <input type="number" className="w-full bg-white border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none font-bold" placeholder="2499" value={editForm.oldPrice || ''} onChange={e => setEditForm({...editForm, oldPrice: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Discounted Price (₹)</label>
                        <input type="number" className="w-full bg-white border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none font-bold" placeholder="1499" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} required />
                      </div>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{discountPercent}% OFF</span>
                        <span className="text-[10px] text-black/30">Customer saves ₹{(editForm.oldPrice || 0) - (editForm.price || 0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Product Image</label>
                    <div className="flex gap-3">
                      <input className="flex-1 bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none font-bold" placeholder="URL or upload from device" value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} />
                      <label className="bg-black/[0.04] hover:bg-black/[0.08] px-4 py-3 rounded-xl cursor-pointer flex items-center gap-2 text-[10px] font-semibold transition-colors whitespace-nowrap">
                        <Upload className="w-4 h-4" /> Upload
                        <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                      </label>
                    </div>
                    {editForm.image && (
                      <div className="mt-3 w-20 h-20 bg-[#fafafa] rounded-xl border border-black/[0.04] p-2"><img src={editForm.image} className="w-full h-full object-contain" /></div>
                    )}
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Available Sizes</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {availableSizes.map(size => {
                        const isSelected = (editForm.sizes || []).includes(size);
                        const isCustom = !SIZES.includes(size);
                        return (
                          <div key={size} className={`flex items-center rounded-lg border transition-all overflow-hidden ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10 hover:border-black/20'}`}>
                            <button type="button" onClick={() => toggleSize(size)} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex-1 text-left">
                              {size}
                            </button>
                            {isCustom && (
                              <button type="button" onClick={(e) => removeAvailableSize(size, e)} className={`p-2 transition-colors ${isSelected ? 'hover:bg-white/20 text-white/70 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-red-500'}`}>
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. 200 ML or 5 GM" 
                        value={customSize} 
                        onChange={e => setCustomSize(e.target.value)} 
                        className="flex-1 bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-2.5 text-sm outline-none font-bold" 
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSize();
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={handleAddCustomSize}
                        className="bg-black/5 hover:bg-black/10 text-black px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                      >
                        Add Custom Size
                      </button>
                    </div>
                  </div>


                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Tag</label>
                      <input className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none font-bold" placeholder="New Arrival" value={editForm.tag || ''} onChange={e => setEditForm({...editForm, tag: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Description</label>
                      <input className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none font-bold" placeholder="Optional" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-black/90 transition-all mt-2">
                    {editingId ? 'Save Changes' : 'Add Product'}
                  </button>
                </form>

                {/* Live Preview */}
                {showPreview && (
                  <div className="p-6 border-l border-black/[0.04] bg-[#fafafa]">
                    <h3 className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-4">Live Preview</h3>
                    <div className="bg-white p-5 rounded-2xl border border-black/[0.04] max-w-xs mx-auto shadow-sm">
                      <div className="relative">
                        {editForm.tag && <span className="absolute top-2 left-2 bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded-md uppercase">{editForm.tag}</span>}
                        {discountPercent > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-md">-{discountPercent}%</span>}
                        <div className="aspect-square bg-[#fafafa] rounded-xl mb-4 flex items-center justify-center p-8">
                          {editForm.image ? <img src={editForm.image} className="w-full h-full object-contain" /> : <div className="text-black/10 text-sm">No Image</div>}
                        </div>
                      </div>
                      <span className="text-[9px] font-semibold text-black/30 uppercase tracking-wider">{editForm.category || 'HIM'}</span>
                      <h3 className="text-sm font-bold text-[#1a1a1a] mt-0.5">{editForm.name || 'Product Name'}</h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-bold">₹{editForm.price || 0}</span>
                        {editForm.oldPrice && editForm.oldPrice > (editForm.price || 0) && <span className="text-[11px] text-black/25 line-through">₹{editForm.oldPrice}</span>}
                      </div>
                      {(editForm.sizes || []).length > 0 && (
                        <div className="flex gap-1.5 mt-3">{(editForm.sizes || []).map(s => <span key={s} className="text-[8px] font-bold bg-black/5 px-2 py-1 rounded">{s}</span>)}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                    <div className="p-8 md:p-12">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Order Details</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Order #{selectedOrder.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-3 bg-black/5 hover:bg-black hover:text-white rounded-2xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Left: Customer & Address */}
                            <div className="space-y-8">
                                <div className="bg-[#fafafa] p-8 rounded-[2rem] border border-black/[0.03]">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-6 flex items-center gap-2 font-black"><UserIcon className="w-3 h-3" /> Customer Info</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Mail className="w-4 h-4 text-black/20" /></div>
                                            <div>
                                                <p className="text-xs font-black tracking-tight">{selectedOrder.customerName}</p>
                                                <p className="text-[10px] font-bold text-black/40 tracking-wider font-bold mb-1">{selectedOrder.customerEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Phone className="w-4 h-4 text-black/20" /></div>
                                            <p className="text-xs font-black tracking-tight">{selectedOrder.customerPhone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#fafafa] p-8 rounded-[2rem] border border-black/[0.03]">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-6 flex items-center gap-2 font-black"><MapPin className="w-3 h-3" /> Shipping Address</h3>
                                    <p className="text-xs font-bold text-black/60 leading-relaxed uppercase tracking-widest">
                                        {selectedOrder.shippingAddress.apartment}<br />
                                        {selectedOrder.shippingAddress.street}<br />
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                                        PIN: {selectedOrder.shippingAddress.pincode}
                                    </p>
                                </div>

                                <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl shadow-black/20">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Payment & Status</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-white/40 mb-2">Update Order Status</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                    <button 
                                                        key={s} 
                                                        onClick={() => updateOrderStatus(selectedOrder.id, s)}
                                                        className={`text-[8px] font-black uppercase tracking-widest py-2.5 rounded-xl border transition-all ${selectedOrder.status === s ? 'bg-white text-black border-white shadow-xl shadow-white/10' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Amount</p>
                                            <p className="text-2xl font-black">₹{selectedOrder.totalPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Items */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-6 flex items-center gap-2 font-black"><ShoppingBag className="w-3 h-3" /> Items List</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-[#fafafa] rounded-2xl border border-black/[0.03]">
                                            <div className="w-14 h-14 bg-white rounded-xl p-2 border border-black/[0.03] flex-shrink-0">
                                                <img src={item.image} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black uppercase tracking-tight">{item.name}</p>
                                                <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest mt-0.5">{item.size} × {item.quantity}</p>
                                            </div>
                                            <p className="text-xs font-black">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                                        <CreditCard className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-900/40 mb-1">Payment ID</p>
                                        <p className="text-[10px] font-black text-blue-900 break-all">{selectedOrder.paymentId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
