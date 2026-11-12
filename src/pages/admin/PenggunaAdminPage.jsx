import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';

export default function PenggunaAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat pengguna admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormState({
      name: '',
      email: '',
      password: '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (users.length <= 1) {
      alert('Tidak dapat menghapus akun admin terakhir!');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus akses akun admin ini?')) return;
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminService.createUser(formState);
      if (res.success) {
        setModalOpen(false);
        loadData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Gagal menambah admin: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kelola Pengguna Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen akun superadmin dan pengelola konten CMS CSR Pemetaan 360
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Tambah Admin Baru</span>
        </button>
      </div>

      {/* Tabel Admin */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span className="text-sm">Memuat data pengguna...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Pengguna</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role Akses</th>
                  <th className="py-3.5 px-4">Terdaftar</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#00529C] flex items-center justify-center font-bold text-xs">
                          {item.name ? item.name.substring(0, 2).toUpperCase() : 'AD'}
                        </div>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {item.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#00529C]">
                        Super Admin
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {users.length > 1 && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Akun"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Admin */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-md"
        title="Tambah Akun Admin Baru"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              placeholder="Contoh: Admin Officer CSR"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              placeholder="admin@pertamina.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kata Sandi (Password) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formState.password}
              onChange={(e) => setFormState({ ...formState, password: e.target.value })}
              placeholder="Minimal 6 karakter"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Tambah Admin'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

