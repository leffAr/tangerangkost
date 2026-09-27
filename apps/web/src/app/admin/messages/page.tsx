"use client";

import { useEffect, useState } from 'react';
import { Mail, CheckCircle, MailOpen, Phone, X, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getContactMessages, markContactMessageRead } from '@/lib/api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

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
      alert("Gagal menandai pesan");
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
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada pesan yang masuk.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 md:p-6 transition-all cursor-pointer hover:bg-gray-50 ${msg.isRead ? 'bg-white' : 'bg-blue-50/50'}`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-[#00288E]'}`}>
                    {msg.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
                      <h3 className={`font-semibold truncate ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{msg.name}</h3>
                      <span className="text-xs text-gray-400 shrink-0">{new Date(msg.createdAt).toLocaleString('id-ID')}</span>
                    </div>
                    {msg.subject && <p className="text-sm font-medium text-gray-800 mb-1 truncate">{msg.subject}</p>}
                    <p className="text-gray-500 text-sm truncate">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal / Dialog Detail Pesan */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}>
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-lg text-gray-800">Detail Pesan</h2>
              <button onClick={() => setSelectedMessage(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-blue-50 text-[#00288E] rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedMessage.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedMessage.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(selectedMessage.createdAt).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                {selectedMessage.subject && (
                  <h3 className="font-bold text-gray-900 mb-3 pb-3 border-b border-gray-200">{selectedMessage.subject}</h3>
                )}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <a href={`https://wa.me/${selectedMessage.phone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#25D366] hover:bg-[#1ebd5b] text-white">
                  <Phone className="w-4 h-4 mr-2" /> Balas via WhatsApp
                </Button>
              </a>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
