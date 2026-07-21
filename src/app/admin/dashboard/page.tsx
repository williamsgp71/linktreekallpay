'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Link as LinkIcon,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ShoppingBag,
  Globe,
  Sparkles,
  Send,
  Share2,
  MousePointerClick,
  TrendingUp,
  X,
  Compass,
  Star,
  Heart,
  Zap,
  Lock,
} from 'lucide-react';

interface Product {
  id: string;
  titleEn: string;
  titleEs: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
  badgeTextEn: string | null;
  badgeTextEs: string | null;
  position: number;
  active: boolean;
  clicks: number;
}

interface LinkItem {
  id: string;
  titleEn: string;
  titleEs: string;
  url: string;
  icon: string;
  position: number;
  active: boolean;
  clicks: number;
}

interface BrandProfile {
  id?: string;
  title: string;
  bioEn: string;
  bioEs: string;
  logoUrl: string;
  whatsappNumber: string;
  whatsappDefaultMsgEn: string;
  whatsappDefaultMsgEs: string;
  bannerTextEn: string;
  bannerTextEs: string;
  promoCode: string;
  showBanner: boolean;
}

const ICON_OPTIONS = [
  'MessageCircle',
  'ShoppingBag',
  'Globe',
  'Sparkles',
  'Send',
  'Share2',
  'Compass',
  'Star',
  'Heart',
  'Zap',
  'Link',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'links' | 'brand' | 'analytics'>('products');

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [brand, setBrand] = useState<BrandProfile>({
    title: '',
    bioEn: '',
    bioEs: '',
    logoUrl: '',
    whatsappNumber: '',
    whatsappDefaultMsgEn: '',
    whatsappDefaultMsgEs: '',
    bannerTextEn: '',
    bannerTextEs: '',
    promoCode: '',
    showBanner: true,
  });

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    titleEn: '',
    titleEs: '',
    price: '',
    imageUrl: '',
    buyUrl: '',
    badgeTextEn: '',
    badgeTextEs: '',
    active: true,
  });

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [linkForm, setLinkForm] = useState({
    titleEn: '',
    titleEs: '',
    url: '',
    icon: 'Link',
    active: true,
  });

  const [savingBrand, setSavingBrand] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch initial data
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [resProd, resLinks, resBrand] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/links'),
        fetch('/api/admin/brand'),
      ]);

      if (resProd.ok) setProducts(await resProd.json());
      if (resLinks.ok) setLinks(await resLinks.json());
      if (resBrand.ok) setBrand(await resBrand.json());
    } catch {
      showToast('error', 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Helper for dynamic icon rendering
  const renderIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'MessageCircle': return <MessageCircle {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Send': return <Send {...props} />;
      case 'Share2': return <Share2 {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Star': return <Star {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return <LinkIcon {...props} />;
    }
  };

  // --- PRODUCT HANDLERS ---
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        titleEn: product.titleEn || '',
        titleEs: product.titleEs || '',
        price: product.price.toString(),
        imageUrl: product.imageUrl,
        buyUrl: product.buyUrl,
        badgeTextEn: product.badgeTextEn || '',
        badgeTextEs: product.badgeTextEs || '',
        active: product.active,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        titleEn: '',
        titleEs: '',
        price: '',
        imageUrl: '',
        buyUrl: '',
        badgeTextEn: '',
        badgeTextEs: '',
        active: true,
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productForm,
            price: parseFloat(productForm.price),
          }),
        });
        if (!res.ok) throw new Error('Error al actualizar el producto');
        showToast('success', 'Producto actualizado con éxito');
      } else {
        // POST create
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productForm,
            price: parseFloat(productForm.price),
          }),
        });
        if (!res.ok) throw new Error('Error al crear el producto');
        showToast('success', 'Producto creado con éxito');
      }
      setProductModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error guardando el producto';
      showToast('error', msg);
    }
  };

  const handleToggleProductActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product.active }),
      });
      if (!res.ok) throw new Error();
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
      );
      showToast('success', `Producto ${!product.active ? 'activado' : 'desactivado'}`);
    } catch {
      showToast('error', 'No se pudo cambiar el estado del producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('success', 'Producto eliminado');
    } catch {
      showToast('error', 'Error al eliminar el producto');
    }
  };

  const handleReorderProduct = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const currentProd = products[index];
    const targetProd = products[targetIndex];

    try {
      await Promise.all([
        fetch(`/api/admin/products/${currentProd.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: targetProd.position }),
        }),
        fetch(`/api/admin/products/${targetProd.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: currentProd.position }),
        }),
      ]);

      fetchData();
    } catch {
      showToast('error', 'Error al reordenar productos');
    }
  };

  // --- LINK HANDLERS ---
  const openLinkModal = (link?: LinkItem) => {
    if (link) {
      setEditingLink(link);
      setLinkForm({
        titleEn: link.titleEn || '',
        titleEs: link.titleEs || '',
        url: link.url,
        icon: link.icon,
        active: link.active,
      });
    } else {
      setEditingLink(null);
      setLinkForm({
        titleEn: '',
        titleEs: '',
        url: '',
        icon: 'Link',
        active: true,
      });
    }
    setLinkModalOpen(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        // PUT update
        const res = await fetch(`/api/admin/links/${editingLink.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkForm),
        });
        if (!res.ok) throw new Error('Error al actualizar el enlace');
        showToast('success', 'Enlace actualizado con éxito');
      } else {
        // POST create
        const res = await fetch('/api/admin/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkForm),
        });
        if (!res.ok) throw new Error('Error al crear el enlace');
        showToast('success', 'Enlace creado con éxito');
      }
      setLinkModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error guardando el enlace';
      showToast('error', msg);
    }
  };

  const handleToggleLinkActive = async (link: LinkItem) => {
    try {
      const res = await fetch(`/api/admin/links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !link.active }),
      });
      if (!res.ok) throw new Error();
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, active: !l.active } : l))
      );
      showToast('success', `Enlace ${!link.active ? 'activado' : 'desactivado'}`);
    } catch {
      showToast('error', 'No se pudo cambiar el estado del enlace');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este enlace?')) return;
    try {
      const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setLinks((prev) => prev.filter((l) => l.id !== id));
      showToast('success', 'Enlace eliminado');
    } catch {
      showToast('error', 'Error al eliminar el enlace');
    }
  };

  const handleReorderLink = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const currentLink = links[index];
    const targetLink = links[targetIndex];

    try {
      await Promise.all([
        fetch(`/api/admin/links/${currentLink.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: targetLink.position }),
        }),
        fetch(`/api/admin/links/${targetLink.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: currentLink.position }),
        }),
      ]);

      fetchData();
    } catch {
      showToast('error', 'Error al reordenar enlaces');
    }
  };

  // --- BRAND HANDLER ---
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBrand(true);
    try {
      const res = await fetch('/api/admin/brand', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });

      if (!res.ok) throw new Error('Error al actualizar la configuración');
      const updated = await res.json();
      setBrand(updated);
      showToast('success', 'Configuración de marca guardada');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error guardando la configuración';
      showToast('error', msg);
    } finally {
      setSavingBrand(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'Las nuevas contraseñas no coinciden');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      showToast('success', data.message || 'Contraseña actualizada correctamente');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      showToast('error', msg);
    } finally {
      setChangingPassword(false);
    }
  };

  // Analytics Calculations
  const totalProductClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const totalLinkClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const topProduct = products.length > 0 ? [...products].sort((a, b) => b.clicks - a.clicks)[0] : null;
  const topLink = links.length > 0 ? [...links].sort((a, b) => b.clicks - a.clicks)[0] : null;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
              : 'bg-red-950/90 border-red-500 text-red-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-[#161E2E]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              K
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight">
                Kallpay <span className="text-emerald-400">Admin</span>
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">Panel de Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 border border-gray-700 transition"
            >
              <span>Ver sitio público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="h-6 w-[1px] bg-gray-800 hidden sm:block" />

            <div className="text-xs text-gray-400 hidden md:block">
              Hola, <span className="text-white font-semibold">Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-800 pb-4 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-black/20 font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition whitespace-nowrap ${
              activeTab === 'links'
                ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Enlaces</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-black/20 font-bold">
              {links.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition whitespace-nowrap ${
              activeTab === 'brand'
                ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configuración de Marca</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analíticas</span>
          </button>
        </div>

        {/* Tab 1: PRODUCTOS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Catálogo de Productos</h2>
                <p className="text-sm text-gray-400">
                  Gestiona la visibilidad, precios, enlaces y orden de tus productos
                </p>
              </div>
              <button
                onClick={() => openProductModal()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-400">Cargando productos...</div>
            ) : products.length === 0 ? (
              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-12 text-center">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white">No hay productos en el catálogo</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Crea tu primer producto para mostrarlo en tu bio link.
                </p>
                <button
                  onClick={() => openProductModal()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm"
                >
                  Crear Producto
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`bg-[#161E2E] border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition ${
                      product.active ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {/* Position control */}
                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorderProduct(idx, 'up')}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === products.length - 1}
                          onClick={() => handleReorderProduct(idx, 'down')}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Image */}
                      <img
                        src={product.imageUrl}
                        alt={product.titleEn}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-700 bg-gray-900"
                      />

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">
                            {product.titleEn}{' '}
                            <span className="text-xs text-gray-400 font-normal">({product.titleEs})</span>
                          </h3>
                          {(product.badgeTextEn || product.badgeTextEs) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {product.badgeTextEn || product.badgeTextEs}
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
                          ${product.price.toLocaleString()} COP
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                          {product.buyUrl}
                        </p>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-800">
                      {/* Click Badge */}
                      <div className="px-3 py-1 rounded-lg bg-gray-900 border border-gray-800 flex items-center gap-1.5 text-xs text-gray-300">
                        <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold">{product.clicks || 0}</span>
                        <span className="text-gray-500">clics</span>
                      </div>

                      {/* Active toggle */}
                      <button
                        onClick={() => handleToggleProductActive(product)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                          product.active
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400'
                        }`}
                        title={product.active ? 'Desactivar' : 'Activar'}
                      >
                        {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span>{product.active ? 'Activo' : 'Oculto'}</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openProductModal(product)}
                        className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: ENLACES */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Enlaces Destacados</h2>
                <p className="text-sm text-gray-400">
                  Gestiona los accesos directos y redes sociales de tu Linktree
                </p>
              </div>
              <button
                onClick={() => openLinkModal()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Enlace</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-400">Cargando enlaces...</div>
            ) : links.length === 0 ? (
              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-12 text-center">
                <LinkIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white">No hay enlaces creados</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Agrega accesos a tus redes, WhatsApp o páginas web.
                </p>
                <button
                  onClick={() => openLinkModal()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm"
                >
                  Crear Enlace
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {links.map((link, idx) => (
                  <div
                    key={link.id}
                    className={`bg-[#161E2E] border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition ${
                      link.active ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {/* Position control */}
                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorderLink(idx, 'up')}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === links.length - 1}
                          onClick={() => handleReorderLink(idx, 'down')}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Icon preview */}
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        {renderIcon(link.icon)}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {link.titleEn}{' '}
                          <span className="text-xs text-gray-400 font-normal">({link.titleEs})</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate max-w-md mt-0.5">
                          {link.url}
                        </p>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-800">
                      {/* Click Badge */}
                      <div className="px-3 py-1 rounded-lg bg-gray-900 border border-gray-800 flex items-center gap-1.5 text-xs text-gray-300">
                        <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold">{link.clicks || 0}</span>
                        <span className="text-gray-500">clics</span>
                      </div>

                      {/* Active toggle */}
                      <button
                        onClick={() => handleToggleLinkActive(link)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                          link.active
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400'
                        }`}
                        title={link.active ? 'Desactivar' : 'Activar'}
                      >
                        {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span>{link.active ? 'Activo' : 'Oculto'}</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openLinkModal(link)}
                        className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: CONFIGURACIÓN DE MARCA */}
        {activeTab === 'brand' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Configuración de Marca</h2>
              <p className="text-sm text-gray-400">
                Personaliza la información pública, banners promocionales y botones de WhatsApp
              </p>
            </div>

            <form onSubmit={handleSaveBrand} className="bg-[#161E2E] border border-gray-800 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Título de la Marca
                  </label>
                  <input
                    type="text"
                    required
                    value={brand.title}
                    onChange={(e) => setBrand({ ...brand, title: e.target.value })}
                    placeholder="Ej. Kallpay Supplements"
                    className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    URL del Logo
                  </label>
                  <input
                    type="url"
                    required
                    value={brand.logoUrl}
                    onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Biografía (Inglés)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={brand.bioEn}
                    onChange={(e) => setBrand({ ...brand, bioEn: e.target.value })}
                    placeholder="High-performance sports nutrition..."
                    className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Biografía (Español)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={brand.bioEs}
                    onChange={(e) => setBrand({ ...brand, bioEs: e.target.value })}
                    placeholder="Nutrición deportiva y suplementación de alto rendimiento..."
                    className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Teléfono WhatsApp (Con código de país)
                  </label>
                  <input
                    type="text"
                    required
                    value={brand.whatsappNumber}
                    onChange={(e) => setBrand({ ...brand, whatsappNumber: e.target.value })}
                    placeholder="+573000000000"
                    className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                      Mensaje de WhatsApp (Inglés)
                    </label>
                    <input
                      type="text"
                      required
                      value={brand.whatsappDefaultMsgEn}
                      onChange={(e) => setBrand({ ...brand, whatsappDefaultMsgEn: e.target.value })}
                      placeholder="Hello! I would like more information..."
                      className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                      Mensaje de WhatsApp (Español)
                    </label>
                    <input
                      type="text"
                      required
                      value={brand.whatsappDefaultMsgEs}
                      onChange={(e) => setBrand({ ...brand, whatsappDefaultMsgEs: e.target.value })}
                      placeholder="¡Hola! Me gustaría más información..."
                      className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Banner Promocional</h4>
                    <p className="text-xs text-gray-400">
                      Muestra un aviso destacado en la parte superior del perfil
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brand.showBanner}
                      onChange={(e) => setBrand({ ...brand, showBanner: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                      Texto Banner (Inglés)
                    </label>
                    <input
                      type="text"
                      value={brand.bannerTextEn}
                      onChange={(e) => setBrand({ ...brand, bannerTextEn: e.target.value })}
                      placeholder="⚡ GET 10% OFF ON YOUR FIRST PURCHASE ⚡"
                      className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                      Texto Banner (Español)
                    </label>
                    <input
                      type="text"
                      value={brand.bannerTextEs}
                      onChange={(e) => setBrand({ ...brand, bannerTextEs: e.target.value })}
                      placeholder="⚡ OBTÉN 10% OFF EN TU PRIMERA COMPRA ⚡"
                      className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Código Promocional
                  </label>
                  <input
                    type="text"
                    value={brand.promoCode}
                    onChange={(e) => setBrand({ ...brand, promoCode: e.target.value })}
                    placeholder="KALLPAY10"
                    className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={savingBrand}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {savingBrand ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Guardar Cambios</span>
                  )}
                </button>
              </div>
            </form>

            {/* 
              Seguridad & Contraseña - OCULTO A PETICIÓN DEL USUARIO.
              Para cambiar la contraseña, utilice el script de terminal:
              npm run reset-password "nueva_contraseña"
            */}
          </div>
        )}

        {/* Tab 4: ANALÍTICAS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white">Analíticas de Rendimiento</h2>
              <p className="text-sm text-gray-400">
                Resumen del tráfico y clics recibidos en tus productos y enlaces
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase text-gray-400">Clics Productos</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">{totalProductClicks}</div>
                <p className="text-xs text-gray-500 mt-1">Interacciones en catálogo</p>
              </div>

              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase text-gray-400">Clics Enlaces</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">{totalLinkClicks}</div>
                <p className="text-xs text-gray-500 mt-1">Visitas a redes y accesos</p>
              </div>

              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase text-gray-400">Top Producto</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-lg font-bold text-white truncate">
                  {topProduct ? topProduct.titleEn : 'N/A'}
                </div>
                <p className="text-xs text-emerald-400 mt-1 font-semibold">
                  {topProduct ? `${topProduct.clicks} clics` : 'Sin datos'}
                </p>
              </div>

              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase text-gray-400">Top Enlace</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-lg font-bold text-white truncate">
                  {topLink ? topLink.titleEn : 'N/A'}
                </div>
                <p className="text-xs text-emerald-400 mt-1 font-semibold">
                  {topLink ? `${topLink.clicks} clics` : 'Sin datos'}
                </p>
              </div>
            </div>

            {/* Click Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Products Breakdown */}
              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <span>Desglose por Producto</span>
                </h3>

                {products.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay productos registrados</p>
                ) : (
                  <div className="space-y-4">
                    {products.map((prod) => {
                      const percentage = totalProductClicks > 0 ? (prod.clicks / totalProductClicks) * 100 : 0;
                      return (
                        <div key={prod.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-300">{prod.titleEn}</span>
                            <span className="text-emerald-400 font-bold">{prod.clicks} clics</span>
                          </div>
                          <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Links Breakdown */}
              <div className="bg-[#161E2E] border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-emerald-400" />
                  <span>Desglose por Enlace</span>
                </h3>

                {links.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay enlaces registrados</p>
                ) : (
                  <div className="space-y-4">
                    {links.map((lnk) => {
                      const percentage = totalLinkClicks > 0 ? (lnk.clicks / totalLinkClicks) * 100 : 0;
                      return (
                        <div key={lnk.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-300">{lnk.titleEn}</span>
                            <span className="text-emerald-400 font-bold">{lnk.clicks} clics</span>
                          </div>
                          <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161E2E] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Título (Inglés)
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.titleEn}
                    onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                    placeholder="Ej. Kallpay Whey Protein 1kg"
                    className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Título (Español)
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.titleEs}
                    onChange={(e) => setProductForm({ ...productForm, titleEs: e.target.value })}
                    placeholder="Ej. Proteína Whey Kallpay 1kg"
                    className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Badge (Inglés)
                  </label>
                  <input
                    type="text"
                    value={productForm.badgeTextEn}
                    onChange={(e) => setProductForm({ ...productForm, badgeTextEn: e.target.value })}
                    placeholder="Ej. Best Seller"
                    className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Badge (Español)
                  </label>
                  <input
                    type="text"
                    value={productForm.badgeTextEs}
                    onChange={(e) => setProductForm({ ...productForm, badgeTextEs: e.target.value })}
                    placeholder="Ej. Más vendido"
                    className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                  URL Imagen del Producto
                </label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                  URL de Compra / Checkout
                </label>
                <input
                  type="url"
                  required
                  value={productForm.buyUrl}
                  onChange={(e) => setProductForm({ ...productForm, buyUrl: e.target.value })}
                  placeholder="https://pay.kallpay.com/..."
                  className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prodActive"
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="prodActive" className="text-sm font-medium text-gray-200 cursor-pointer">
                  Producto activo y visible públicamente
                </label>
              </div>

              <div className="border-t border-gray-800 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 text-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LINK MODAL */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161E2E] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">
                {editingLink ? 'Editar Enlace' : 'Nuevo Enlace'}
              </h3>
              <button
                onClick={() => setLinkModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Título (Inglés)
                  </label>
                  <input
                    type="text"
                    required
                    value={linkForm.titleEn}
                    onChange={(e) => setLinkForm({ ...linkForm, titleEn: e.target.value })}
                    placeholder="Ej. Follow us on Instagram"
                    className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Título (Español)
                  </label>
                  <input
                    type="text"
                    required
                    value={linkForm.titleEs}
                    onChange={(e) => setLinkForm({ ...linkForm, titleEs: e.target.value })}
                    placeholder="Ej. Síguenos en Instagram"
                    className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                  URL Destino
                </label>
                <input
                  type="url"
                  required
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-2">
                  Seleccionar Icono
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setLinkForm({ ...linkForm, icon: iconName })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        linkForm.icon === iconName
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-[#0B0F17] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                      }`}
                    >
                      {renderIcon(iconName)}
                      <span className="text-[10px] truncate max-w-full">{iconName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="linkActive"
                  checked={linkForm.active}
                  onChange={(e) => setLinkForm({ ...linkForm, active: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="linkActive" className="text-sm font-medium text-gray-200 cursor-pointer">
                  Enlace activo y visible públicamente
                </label>
              </div>

              <div className="border-t border-gray-800 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 text-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
