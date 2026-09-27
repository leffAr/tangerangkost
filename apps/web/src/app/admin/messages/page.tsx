"use client";

import { useEffect, useState } from 'react';
import { Mail, CheckCircle, MailOpen, Phone, X, Calendar, User, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getContactMessages, markContactMessageRead, deleteContactMessage } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await markContactMessageRead(id);
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      toast.error("Gagal menandai pesan");
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    
    const toastId = toast.loading('Menghapus pesan...');
    try {
      await deleteContactMessage(id);
      toast.success('Pesan berhasil dihapus', { id: toastId });
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (error) {
      toast.error("Gagal menghapus pesan", { id: toastId });
    }
  };

  const handleOpenMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleMarkRead(msg.id);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kotak Masuk</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Kelola pesan dari pengunjung website</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat pesan...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Kotak Masuk Kosong</h3>
          <p className="text-gray-500">Belum ada pesan yang masuk dari pengunjung.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 md:p-6 transition-all cursor-pointer hover:bg-gray-50 group relative ${msg.isRead ? 'bg-white' : 'bg-blue-50/40'}`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.isRead ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-br from-[#00288E] to-blue-600 text-white'}`}>
                    {msg.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0 pr-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1.5 gap-1">
                      <h3 className={`font-bold truncate ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{msg.name}</h3>
                      <span className={`text-xs shrink-0 font-medium ${msg.isRead ? 'text-gray-400' : 'text-blue-600'}`}>{new Date(msg.createdAt).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    {msg.subject && <p className={`text-sm mb-1.5 truncate ${msg.isRead ? 'text-gray-600 font-medium' : 'text-gray-800 font-semibold'}`}>{msg.subject}</p>}
                    <p className={`text-sm truncate ${msg.isRead ? 'text-gray-500' : 'text-gray-600'}`}>{msg.message}</p>
                  </div>
                </div>
                
                {/* Modern Delete Button on Hover */}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(msg.id); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-gray-400 hover:text-white hover:bg-red-500 hover:shadow-md hover:shadow-red-500/20 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-0 scale-90 group-hover:scale-100"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(msg.id); }}
                  className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-red-500 bg-red-50 rounded-xl shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modern Detail Pesan Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMessage(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all scale-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="font-bold text-xl text-gray-900 tracking-tight">Detail Pesan</h2>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(selectedMessage.id); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Hapus">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedMessage(null)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50/50">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 text-[#00288E] rounded-full flex items-center justify-center shrink-0 ring-4 ring-white shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-lg truncate">{selectedMessage.name}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> <span className="font-medium">{selectedMessage.phone}</span></span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {new Date(selectedMessage.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {selectedMessage.subject && (
                  <h3 className="font-bold text-gray-900 text-lg mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-[#00288E] rounded-full"></div>
                    {selectedMessage.subject}
                  </h3>
                )}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base font-medium">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-white flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedMessage(null)} className="rounded-xl px-6 font-semibold hover:bg-gray-50 border-gray-200">
                Tutup
              </Button>
              <a href={`https://wa.me/${selectedMessage.phone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#25D366] hover:bg-[#1ebd5b] text-white rounded-xl px-6 font-bold shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5">
                  <Phone className="w-4 h-4 mr-2" /> Balas via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modern Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmId(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all scale-100 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Pesan?</h2>
            <p className="text-gray-500 mb-8">
              Pesan ini akan dihapus secara permanen dan tidak dapat dikembalikan lagi.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 rounded-xl font-bold py-6 border-gray-200 hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button 
                onClick={executeDelete} 
                className="flex-1 rounded-xl font-bold py-6 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
              >
                Ya, Hapus!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
