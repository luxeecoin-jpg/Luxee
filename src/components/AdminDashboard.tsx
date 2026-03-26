"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AdminDashboardSkeleton, AdminProductsTableSkeleton, AdminOrdersTableSkeleton } from '@/components/Skeletons';
import { 
  Plus, 
  Trash2, 
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
import Link from 'next/link';

// We'll define these types here or in a separate file
interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  section: string;
  badges: string[];
  tag: string;
  description: string;
  sizes: string[];
}

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description?: string | null;
  image: string;
  mobileImage?: string;
  ctaText: string;
  order?: number;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  items: any;
  totalPrice: number;
  status: string;
  paymentId: string;
  createdAt: Date;
}

const CATEGORIES = ['HIM', 'HER', 'GIFTING'];
const SECTIONS = ['BESTSELLERS', 'NEW ARRIVALS'];
const SIZES = ['15 ML', '30 ML', '50 ML', '100 ML'];

type AdminTab = 'dashboard' | 'products' | 'hero' | 'orders';

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
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export function AdminDashboard({ 
  initialProducts, 
  initialHero, 
  initialOrders,
  userEmail 
}: { 
  initialProducts: any[], 
  initialHero: any, 
  initialOrders: any[],
  userEmail: string 
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHero?.slides || []);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product> & { sizes?: string[] }>({});
  const [isAdding, setIsAdding] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('ALL');
  const [showPreview, setShowPreview] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState(SIZES);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Simplified update functions using fetch (Server Actions would be better, but let's stick to fetch for now or implement actions later)
  // Actually I'll use inline fetch to a new api route /api/admin
  
  const handleUpdate = async (type: string, data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ type, data }),
      });
      const result = await res.json();
      if (result.success) {
        // Refresh data or update local state
        router.refresh(); 
        setLoading(false);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    return false;
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const success = await handleUpdate('UPDATE_ORDER_STATUS', { id: orderId, status: newStatus });
    if (success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const saveHeroChanges = async () => {
    // Validation
    if (heroSlides.length === 0) {
      alert("Please add at least one slide.");
      return;
    }
    for (let i = 0; i < heroSlides.length; i++) {
       const s = heroSlides[i];
       if (!s.image) {
          alert(`Slide ${i + 1} is missing the Desktop Image! This is mandatory.`);
          setActiveSlideIdx(i);
          return;
       }
    }

    await handleUpdate('UPDATE_HERO', { slides: heroSlides });
    alert("Hero Slider updated!");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleUpdate('ADD_PRODUCT', editForm);
    if (success) {
      setIsAdding(false);
      setEditForm({});
      router.refresh();
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const success = await handleUpdate('UPDATE_PRODUCT', { id: editingId, ...editForm });
    if (success) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete product?")) return;
    const success = await handleUpdate('DELETE_PRODUCT', { id });
    if (success) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // UI state-only functions
  const updateSlideField = (idx: number, field: keyof HeroSlide, value: string) => {
    const s = [...heroSlides];
    s[idx] = { ...s[idx], [field]: value };
    setHeroSlides(s);
  };

  const addNewSlide = () => {
    const s: HeroSlide = { id: Date.now().toString(), title: "", subtitle: "", image: "", ctaText: "" };
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

  const stats = {
    revenue: orders.reduce((acc, o) => acc + o.totalPrice, 0),
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
    totalProducts: products.length,
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchFilter = productFilter === 'ALL' || p.section === productFilter;
    return matchSearch && matchFilter;
  });

  const filteredOrders = orders.filter(o => 
    (orderFilter === 'ALL' || o.status.toLowerCase() === orderFilter.toLowerCase()) &&
    (o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
    (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.customerEmail || '').toLowerCase().includes(orderSearch.toLowerCase()))
  ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'hero', label: 'Hero Slider', icon: Layout },
  ];

  const discountPercent = editForm.oldPrice && editForm.price && editForm.oldPrice > editForm.price
    ? Math.round(((editForm.oldPrice - editForm.price) / editForm.oldPrice) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex w-full">
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
          <p className="text-[11px] font-semibold text-black/60 mt-1">{userEmail}</p>
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

      <div className="flex-1 lg:ml-60 p-4 md:p-8 pb-24 lg:pb-8">
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
                  <p className="text-3xl font-black text-[#1a1a1a] mt-3">{stats.totalProducts}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/" target="_blank" className="bg-white p-6 rounded-2xl border border-black/[0.04] text-left hover:border-black/10 transition-all flex items-center justify-between group">
                <div>
                    <h3 className="text-sm font-black text-[#1a1a1a] mb-1 uppercase tracking-tight">View Store</h3>
                    <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">See your store as customers see it</p>
                </div>
                <ArrowRight className="w-5 h-5 text-black/10 group-hover:text-black transition-all" />
              </Link>
              <button onClick={() => setActiveTab('orders')} className="bg-white p-6 rounded-2xl border border-black/[0.04] text-left hover:border-black/10 transition-all flex items-center justify-between group">
                <div>
                    <h3 className="text-sm font-black text-[#1a1a1a] mb-1 uppercase tracking-tight">Manage Orders</h3>
                    <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{stats.activeOrders} active orders to process</p>
                </div>
                <ArrowRight className="w-5 h-5 text-black/10 group-hover:text-black transition-all" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                  <h1 className="text-2xl font-serif text-[#1a1a1a]">Customer Orders</h1>
                  <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mt-1">Manage sales and tracking</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                    <button 
                      key={status} 
                      onClick={() => setOrderFilter(status)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${orderFilter === status ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10 hover:bg-black/5 hover:text-black'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="flex-1 w-full relative">
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
                                        <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">{o.paymentId}</p>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-xs font-black tracking-tight">{o.customerName}</p>
                                        <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">{o.customerPhone}</p>
                                    </td>
                                    <td className="p-6 font-bold text-[10px] text-black/40 uppercase tracking-widest">
                                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
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
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-serif text-[#1a1a1a]">Products</h1>
              <button onClick={() => { setIsAdding(true); setEditForm({ sizes: ['50 ML'], category: 'HIM', section: 'BESTSELLERS' }); setShowPreview(false); }} className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
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
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        {s.image ? (
                          <img src={s.image} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-black/20 text-[9px] font-bold">IMG</div>
                        )}
                        <span className="text-[11px] font-semibold">Slide {i + 1}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeSlide(i); }} className={`p-1.5 rounded transition-all ${activeSlideIdx === i ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-red-400 hover:text-red-500 hover:bg-red-50'}`}><Trash2 className="w-4 h-4 shadow-sm" /></button>
                    </div>
                  ))}
                </div>
                <div className="xl:col-span-2 bg-white rounded-xl border border-black/[0.04] p-6">
                  <h3 className="text-sm font-bold mb-6">Slide {activeSlideIdx + 1} Settings</h3>
                  <div className="space-y-5">
                    {/* Desktop Image */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">Desktop Image *</label>
                        <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Reco: 1920x1080px (16:9)</span>
                      </div>
                      <div className="flex gap-3">
                        <input className="flex-1 bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={heroSlides[activeSlideIdx]?.image || ''} onChange={e => updateSlideField(activeSlideIdx, 'image', e.target.value)} placeholder="Image URL or upload" />
                        <label className="bg-black/[0.04] hover:bg-black/[0.08] px-4 py-3 rounded-xl cursor-pointer flex items-center gap-2 text-[10px] font-semibold transition-colors">
                          <Upload className="w-4 h-4" /> Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleSlideImageUpload(activeSlideIdx, 'image', e.target.files[0]); }} />
                        </label>
                      </div>
                      {heroSlides[activeSlideIdx]?.image && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-black/[0.04] bg-[#fafafa]">
                          <img src={heroSlides[activeSlideIdx].image} alt="Desktop preview" className="w-full h-32 object-cover" />
                          <p className="text-[8px] font-bold text-black/20 uppercase tracking-widest text-center py-1">Desktop Preview</p>
                        </div>
                      )}
                    </div>

                    {/* Mobile Image */}
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-1">
                        <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block">
                          Mobile Image <span className="text-black/20 normal-case">(portrait/vertical for phones)</span>
                        </label>
                        <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Reco: 1080x1920px (9:16)</span>
                      </div>
                      <div className="flex gap-3">
                        <input className="flex-1 bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={heroSlides[activeSlideIdx]?.mobileImage || ''} onChange={e => updateSlideField(activeSlideIdx, 'mobileImage', e.target.value)} placeholder="Mobile image URL or upload" />
                        <label className="bg-black/[0.04] hover:bg-black/[0.08] px-4 py-3 rounded-xl cursor-pointer flex items-center gap-2 text-[10px] font-semibold transition-colors">
                          <Upload className="w-4 h-4" /> Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleSlideImageUpload(activeSlideIdx, 'mobileImage', e.target.files[0]); }} />
                        </label>
                      </div>
                      {heroSlides[activeSlideIdx]?.mobileImage && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-black/[0.04] bg-[#fafafa] max-w-[200px]">
                          <img src={heroSlides[activeSlideIdx].mobileImage} alt="Mobile preview" className="w-full h-48 object-cover" />
                          <p className="text-[8px] font-bold text-black/20 uppercase tracking-widest text-center py-1">Mobile Preview</p>
                        </div>
                      )}
                      {!heroSlides[activeSlideIdx]?.mobileImage && (
                        <p className="text-[9px] text-orange-500 font-medium mt-2">⚠ No mobile image set — desktop image will be used (may appear zoomed-in on phones)</p>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Title (Optional)</label>
                        <input className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={heroSlides[activeSlideIdx]?.title || ''} onChange={e => updateSlideField(activeSlideIdx, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Subtitle (Optional)</label>
                        <input className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={heroSlides[activeSlideIdx]?.subtitle || ''} onChange={e => updateSlideField(activeSlideIdx, 'subtitle', e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Description (Optional)</label>
                      <textarea rows={2} className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none resize-none" value={heroSlides[activeSlideIdx]?.description || ''} onChange={e => updateSlideField(activeSlideIdx, 'description', e.target.value)} placeholder="A breath of oceanic freshness..." />
                    </div>

                    {/* CTA Text */}
                    <div>
                      <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Button Text (Optional)</label>
                      <input className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none" value={heroSlides[activeSlideIdx]?.ctaText || ''} onChange={e => updateSlideField(activeSlideIdx, 'ctaText', e.target.value)} placeholder="e.g. Shop Now" />
                    </div>
                  </div>
                  <button onClick={saveHeroChanges} className="mt-6 bg-black text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider">Save Slider</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal implementatons for Add/Edit and Order details would go here as per original... */}
         {/* (Re-adding the modals for completeness) */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
             {/* ... Product Form ... */}
             <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
                <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X className="w-6 h-6" /></button>
                <h2 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                 <form onSubmit={editingId ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleAdd} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest block mb-2 px-1">Product Name *</label>
                        <input required className="w-full p-4 bg-black/5 rounded-xl outline-none text-sm font-bold" placeholder="e.g. Saphir Marin" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest block mb-2 px-1">Category *</label>
                        <select required className="w-full p-4 bg-black/5 rounded-xl outline-none text-sm font-bold appearance-none" value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                          <option value="">Select Category</option>
                          <option value="HIM">HIM</option>
                          <option value="HER">HER</option>
                          <option value="DEALS">DEALS</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest block mb-2 px-1">Section *</label>
                        <select required className="w-full p-4 bg-black/5 rounded-xl outline-none text-sm font-bold appearance-none" value={editForm.section || ''} onChange={e => setEditForm({...editForm, section: e.target.value})}>
                          <option value="">Select Section</option>
                          <option value="BESTSELLERS">BESTSELLERS</option>
                          <option value="NEW ARRIVALS">NEW ARRIVALS</option>
                          <option value="CRAZY DEALS">CRAZY DEALS</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest block mb-2 px-1">Tag (Optional)</label>
                        <input className="w-full p-4 bg-black/5 rounded-xl outline-none text-sm font-bold" placeholder="e.g. New Arrival" value={editForm.tag || ''} onChange={e => setEditForm({...editForm, tag: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest block mb-2 px-1">Price (₹) *</label>
                         <input required type="number" min="1" step="any" className="w-full p-4 bg-black/5 rounded-xl outline-none text-sm font-bold" placeholder="New Selling Price" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} />
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest block mb-2 px-1">Old Price (Optional)</label>
                         <input type="number" className="w-full p-4 bg-black/5 rounded-xl outline-none text-sm font-bold" placeholder="Original Price" value={editForm.oldPrice || ''} onChange={e => setEditForm({...editForm, oldPrice: Number(e.target.value)})} />
                       </div>
                    </div>
                    {editForm.oldPrice && editForm.price && editForm.oldPrice > editForm.price && (
                      <div className="px-1 flex items-center gap-3">
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {Math.round(((editForm.oldPrice - editForm.price) / editForm.oldPrice) * 100)}% OFF
                        </span>
                        <span className="text-[10px] font-semibold text-black/40">
                          Displays as: <span className="line-through">₹{editForm.oldPrice}</span> <span className="text-black">₹{editForm.price}</span>
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Product Image *</label>
                        <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Reco: 1080x1080px (Square)</span>
                      </div>
                      <div className="flex gap-3">
                        <input required className="flex-1 p-4 bg-black/5 rounded-xl outline-none text-sm font-bold" placeholder="Image URL or upload" value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} />
                        <label className="bg-black/[0.06] hover:bg-black/[0.12] px-5 py-4 rounded-xl cursor-pointer flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0">
                          <Upload className="w-4 h-4" /> Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                        </label>
                      </div>
                      {editForm.image && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-black/[0.04] bg-[#fafafa] max-w-[200px]">
                          <img src={editForm.image} alt="Product preview" className="w-full h-32 object-contain p-2" />
                          <p className="text-[8px] font-bold text-black/20 uppercase tracking-widest text-center py-1">Image Preview</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest block mb-2 px-1">Description *</label>
                      <textarea required rows={3} className="w-full p-4 bg-black/5 rounded-xl outline-none text-sm font-bold resize-none" placeholder="Product details..." value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                    </div>

                    <button type="submit" className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:shadow-black/20 transition-all">
                      {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                 </form>
             </div>
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] max-w-4xl w-full p-10 relative overflow-y-auto max-h-[90vh]">
               <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 p-3 bg-black/5 rounded-2xl hover:bg-black hover:text-white transition-all"><X className="w-6 h-6" /></button>
               <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Order #{selectedOrder.id.slice(-8).toUpperCase()}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">Customer Info</h3>
                    <p className="font-bold">{selectedOrder.customerName}</p>
                    <p className="text-black/60">{selectedOrder.customerEmail}</p>
                    <p className="text-black/60 mb-6">{selectedOrder.customerPhone}</p>
                    
                    {selectedOrder.shippingAddress && (
                      <div className="mb-8 bg-black/5 p-4 rounded-2xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Delivery Address</h3>
                        <p className="text-sm font-semibold">{selectedOrder.customerName}</p>
                        <p className="text-xs text-black/60 mt-1 leading-relaxed">
                          {(selectedOrder.shippingAddress as any).apartment}, {(selectedOrder.shippingAddress as any).street}<br />
                          {(selectedOrder.shippingAddress as any).city}, {(selectedOrder.shippingAddress as any).state} - {(selectedOrder.shippingAddress as any).pincode}
                        </p>
                      </div>
                    )}
                    
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase border transition-all ${selectedOrder.status === s ? 'bg-black text-white border-black' : 'hover:bg-black/5 border-black/10'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">Items Summary</h3>
                    <div className="space-y-3">
                       {selectedOrder.items.map((item: any, i: number) => (
                         <div key={i} className="flex justify-between items-center text-xs font-bold border-b border-black/5 pb-2">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                         </div>
                       ))}
                       <div className="pt-4 flex justify-between text-xl font-black">
                         <span>TOTAL</span>
                         <span>₹{selectedOrder.totalPrice}</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[200] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
        </div>
      )}
    </main>
  );
}
