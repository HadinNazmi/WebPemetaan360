import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    cartItems,
    pemesanInfo,
    isDrawerOpen,
    totalItems,
    totalPrice,
    groupedItems,
    updateQty,
    removeFromCart,
    clearCart,
    updatePemesanInfo,
    closeDrawer,
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleOrderWhatsApp = (group) => {
    // Validasi data pemesan
    if (!pemesanInfo.nama.trim() || !pemesanInfo.no_wa.trim() || !pemesanInfo.alamat.trim()) {
      alert('Harap lengkapi Nama Lengkap, Nomor WhatsApp, dan Alamat Pengiriman Anda terlebih dahulu.');
      return;
    }

    // Format nomor WhatsApp kelompok
    let cleanPhone = (group.kelompok_wa || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    if (!cleanPhone) {
      alert(`Nomor WhatsApp untuk ${group.kelompok_nama} belum terdaftar.`);
      return;
    }

    // Rangkai rincian barang
    const itemsText = group.items
      .map(
        (it) =>
          `• ${it.nama_produk} (${it.quantity}x ${it.satuan || ''}) - Rp ${(
            it.harga * it.quantity
          ).toLocaleString('id-ID')}`
      )
      .join('\n');

    // Susun template pesan WhatsApp
    const message = `Halo *${group.kelompok_nama}*, saya ingin memesan produk binaan CSR Pertamina Patra Niaga Dumai:

📦 *Daftar Pesanan:*
${itemsText}

💰 *Subtotal UMKM ini:* Rp ${group.subtotal.toLocaleString('id-ID')}

👤 *Data Pemesan untuk Pengiriman:*
• *Nama Pemesan:* ${pemesanInfo.nama.trim()}
• *No. WhatsApp:* ${pemesanInfo.no_wa.trim()}
• *Alamat Pengiriman:* ${pemesanInfo.alamat.trim()}
• *Catatan Tambahan:* ${pemesanInfo.catatan ? pemesanInfo.catatan.trim() : '-'}

Mohon konfirmasi ketersediaan barang dan ongkos kirimnya. Terima kasih!`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="cart-overlay" onClick={closeDrawer}>
      <div className="cart-drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Drawer */}
        <div className="cart-header">
          <div className="cart-header-title-box">
            <div className="cart-header-icon-box">
              <span className="material-symbols-outlined text-[20px]">
                shopping_bag
              </span>
            </div>
            <div className="cart-header-texts">
              <h2>Keranjang Belanja</h2>
              <p>{totalItems} item dipilih</p>
            </div>
          </div>
          <div className="cart-header-actions">
            {cartItems.length > 0 && (
              <button
                type="button"
                className="cart-btn-clear"
                onClick={clearCart}
              >
                Kosongkan
              </button>
            )}
            <button
              type="button"
              className="cart-btn-close"
              onClick={closeDrawer}
              aria-label="Tutup keranjang"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Body Drawer */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <span className="material-symbols-outlined cart-empty-icon">
                shopping_cart
              </span>
              <p className="font-semibold text-slate-700 text-sm">
                Keranjang belanja Anda masih kosong
              </p>
              <span className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Jelajahi Katalog Produk UMKM dan klik "Tambah" untuk mulai memesan.
              </span>
            </div>
          ) : (
            <>
              {/* Daftar Kelompok UMKM */}
              {groupedItems.map((group) => (
                <div key={group.kelompok_id} className="cart-group-card">
                  {/* Header Kelompok */}
                  <div className="cart-group-header">
                    <span className="cart-group-nama">
                      {group.kelompok_nama}
                    </span>
                    <span className="cart-group-kecamatan">
                      {group.kelompok_kecamatan}
                    </span>
                  </div>

                  {/* Daftar Item Kelompok Ini */}
                  <div className="cart-items-list">
                    {group.items.map((item) => (
                      <div key={item.id} className="cart-item-row">
                        <img
                          src={
                            item.foto_produk ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={item.nama_produk}
                          className="cart-item-img"
                        />
                        <div className="cart-item-info">
                          <h4 className="cart-item-nama">{item.nama_produk}</h4>
                          <div className="cart-item-price-unit">
                            Rp {item.harga.toLocaleString('id-ID')}{' '}
                            <span>/{item.satuan}</span>
                          </div>
                          <div className="cart-item-stepper-row">
                            <div className="cart-stepper">
                              <button
                                type="button"
                                className="cart-stepper-btn"
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="cart-stepper-qty">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="cart-stepper-btn"
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="cart-item-btn-remove"
                              onClick={() => removeFromCart(item.id)}
                              title="Hapus produk ini"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete_outline
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="cart-item-subtotal">
                          Rp {(item.harga * item.quantity).toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal Kelompok */}
                  <div className="cart-group-subtotal-row">
                    <span>Subtotal UMKM ini:</span>
                    <span>Rp {group.subtotal.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Tombol Pesan WhatsApp ke UMKM Ini */}
                  <button
                    type="button"
                    className="cart-btn-order-wa"
                    onClick={() => handleOrderWhatsApp(group)}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chat
                    </span>
                    <span>Pesan ke {group.kelompok_nama}</span>
                  </button>
                </div>
              ))}

              {/* Form Data Pemesan untuk Pengiriman */}
              <div className="cart-delivery-card">
                <div className="cart-delivery-header">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  <span>Data Pemesan untuk Pengiriman</span>
                </div>

                <div className="cart-form-group">
                  <label className="cart-form-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    className="cart-form-input"
                    placeholder="Contoh: Budi Santoso"
                    value={pemesanInfo.nama}
                    onChange={(e) => updatePemesanInfo('nama', e.target.value)}
                    required
                  />
                </div>

                <div className="cart-form-group">
                  <label className="cart-form-label">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    className="cart-form-input"
                    placeholder="Contoh: 081234567890"
                    value={pemesanInfo.no_wa}
                    onChange={(e) => updatePemesanInfo('no_wa', e.target.value)}
                    required
                  />
                </div>

                <div className="cart-form-group">
                  <label className="cart-form-label">Alamat Lengkap Pengiriman *</label>
                  <textarea
                    className="cart-form-textarea"
                    placeholder="Jalan, No Rumah, Kelurahan, Kecamatan, Kota"
                    value={pemesanInfo.alamat}
                    onChange={(e) => updatePemesanInfo('alamat', e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="cart-form-group" style={{ marginBottom: 0 }}>
                  <label className="cart-form-label">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    className="cart-form-input"
                    placeholder="Contoh: Packing kayu / varian pedas sedang"
                    value={pemesanInfo.catatan}
                    onChange={(e) => updatePemesanInfo('catatan', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Drawer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer-total-row">
              <span className="cart-footer-total-label">Total Keseluruhan</span>
              <span className="cart-footer-total-nominal">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            {groupedItems.length > 1 && (
              <div className="cart-warning-multivendor">
                <span className="material-symbols-outlined">info</span>
                <span>
                  Pesanan berasal dari <strong>{groupedItems.length} UMKM berbeda</strong>. Gunakan tombol hijau di atas kartu masing-masing UMKM untuk mengirim pesan ke penjualnya.
                </span>
              </div>
            )}

            <p className="cart-footer-disclaimer">
              Transaksi langsung ke nomor resmi WhatsApp UMKM Binaan CSR Pertamina Patra Niaga Dumai
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

