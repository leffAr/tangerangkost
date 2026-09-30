'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Shield, User, Store, Edit3, X, Save, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => {
      await api.patch(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      toast.success('Role pengguna berhasil diubah');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Gagal mengubah role')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: { name: string, email: string, password?: string } }) => {
      await api.patch(`/admin/users/${id}`, data);
    },
    onSuccess: () => {
      toast.success('Profil pengguna berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(null);
    },
    onError: () => toast.error('Gagal memperbarui profil pengguna')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      toast.success('Pengguna berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Gagal menghapus pengguna')
  });

  const handleRoleChange = (id: string, newRole: string) => {
    if (confirm(`Yakin ingin mengubah role menjadi ${newRole}?`)) {
      roleMutation.mutate({ id, role: newRole });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Peringatan: Yakin ingin MENGHAPUS PERMANEN pengguna ${name}? Seluruh datanya (kost, transaksi, review) akan ikut terhapus.`)) {
      deleteMutation.mutate(id);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, password: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateMutation.mutate({ id: editingUser.id, data: editForm });
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {users?.map((user: any) => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              
              {/* Header: Info & Role */}
              <div className="flex justify-between items-start mb-4">
                <div className="overflow-hidden flex-1 mr-2">
                  <h3 className="font-bold text-gray-900 truncate" title={user.name}>{user.name}</h3>
                  <p className="text-sm text-gray-500 truncate" title={user.email}>{user.email}</p>
                    {user.phone && user.role === 'OWNER' && (
                      <a 
                        href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2 py-1 rounded-md w-fit transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Chat via WA ({user.phone})
                      </a>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant="outline" className={`shrink-0 ${
                    user.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' : 
                    user.role === 'OWNER' ? 'bg-blue-50 text-[#00288E] border-blue-200' : 
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                    {user.role === 'OWNER' && <Store className="w-3 h-3 mr-1" />}
                    {user.role === 'USER' && <User className="w-3 h-3 mr-1" />}
                    {user.role}
                  </Badge>
                  <button 
                    onClick={() => openEditModal(user)}
                    className="text-xs font-medium text-[#00288E] bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded flex items-center transition-colors"
                  >
                    <Edit3 className="w-3 h-3 mr-1" /> Edit Profil
                  </button>
                </div>
              </div>

              {/* Actions: Edit Role & Delete */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex-1">
                  <select 
                    className="w-full border border-gray-300 rounded-lg text-sm p-2 bg-white focus:ring-2 focus:ring-[#00288E] focus:outline-none"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="USER">USER (Pencari)</option>
                    <option value="OWNER">OWNER (Pemilik)</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <button 
                  onClick={() => handleDelete(user.id, user.name)}
                  className="flex items-center justify-center p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                  title="Hapus Pengguna"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {users?.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white border rounded-xl shadow-sm">
              Tidak ada pengguna terdaftar.
            </div>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Edit Profil Pengguna</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Baru (Opsional)</label>
                  <input 
                    type="text" 
                    value={editForm.password}
                    onChange={e => setEditForm({...editForm, password: e.target.value})}
                    placeholder="Kosongkan jika tidak ingin mengubah sandi"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:outline-none text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 text-white bg-[#00288E] hover:bg-[#001859] rounded-lg font-medium flex items-center transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Menyimpan...' : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
