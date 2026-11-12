import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'csr_umkm_cart';
const PEMESAN_STORAGE_KEY = 'csr_pemesan_info';

export function CartProvider({ children }) {
  // State isi keranjang (Disimpan di localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State data pemesan pengiriman
  const [pemesanInfo, setPemesanInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(PEMESAN_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : { nama: '', no_wa: '', alamat: '', catatan: '' };
    } catch {
      return { nama: '', no_wa: '', alamat: '', catatan: '' };
    }
  });

  // State drawer buka/tutup
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync ke localStorage saat cart berubah
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Gagal menyimpan keranjang ke localStorage:', e);
    }
  }, [cartItems]);

  // Sync ke localStorage saat data pemesan berubah
  useEffect(() => {
    try {
      localStorage.setItem(PEMESAN_STORAGE_KEY, JSON.stringify(pemesanInfo));
    } catch (e) {
      console.warn('Gagal menyimpan data pemesan ke localStorage:', e);
    }
  }, [pemesanInfo]);

  /**
   * Tambah item ke keranjang
   */
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Update kuantitas
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      }

      // Tambah item baru
      const newItem = {
        id: product.id,
        nama_produk: product.nama_produk,
        slug: product.slug,
        harga: product.harga,
        satuan: product.satuan || 'per Pcs',
        foto_produk: product.foto_produk,
        kelompok_id: product.kelompok?.id || product.kelompok_umkm_id,
        kelompok_nama: product.kelompok?.nama_kelompok || 'UMKM Binaan',
        kelompok_wa: product.kelompok?.nomor_wa || '',
        kelompok_kecamatan: product.kelompok?.kecamatan || '',
        quantity: Math.max(1, qty),
      };

      return [...prevItems, newItem];
    });

    // Otomatis buka drawer saat pertama kali menambah
    setIsDrawerOpen(true);
  };

  /**
   * Ubah kuantitas produk
   */
  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  /**
   * Hapus item dari keranjang
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  /**
   * Kosongkan seluruh keranjang
   */
  const clearCart = () => {
    if (window.confirm('Kosongkan semua barang dari keranjang belanja?')) {
      setCartItems([]);
    }
  };

  /**
   * Update data input pemesan
   */
  const updatePemesanInfo = (field, value) => {
    setPemesanInfo((prev) => ({ ...prev, [field]: value }));
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Perhitungan total item dan harga
  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.harga * item.quantity, 0),
    [cartItems]
  );

  // Pengelompokan produk per kelompok UMKM (Multi-vendor grouping)
  const groupedItems = useMemo(() => {
    const map = {};
    cartItems.forEach((item) => {
      const kId = item.kelompok_id || 0;
      if (!map[kId]) {
        map[kId] = {
          kelompok_id: kId,
          kelompok_nama: item.kelompok_nama || 'UMKM Binaan',
          kelompok_wa: item.kelompok_wa || '',
          kelompok_kecamatan: item.kelompok_kecamatan || '',
          items: [],
          subtotal: 0,
        };
      }
      map[kId].items.push(item);
      map[kId].subtotal += item.harga * item.quantity;
    });
    return Object.values(map);
  }, [cartItems]);

  const value = {
    cartItems,
    pemesanInfo,
    isDrawerOpen,
    totalItems,
    totalPrice,
    groupedItems,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    updatePemesanInfo,
    openDrawer,
    closeDrawer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
}

export default CartContext;

