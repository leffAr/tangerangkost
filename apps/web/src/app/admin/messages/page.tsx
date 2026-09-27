"use client";

import { useEffect, useState } from 'react';
import { Mail, CheckCircle, MailOpen, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getContactMessages, markContactMessageRead } from '@/lib/api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleMarkRead = async (id: string) => {
    try {
      await markContactMessageRead(id);
      fetchMessages();
    } catch (error) {
      alert("Gagal menandai pesan");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kotak Masuk</h1>
          <p className="text-gray-500 mt-1">Kelola pesan dari pengunjung website</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Memuat pesan...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada pesan yang masuk.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-6 transition-colors ${msg.isRead ? 'bg-white' : 'bg-blue-50/50'}`}>
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-[#00288E]'}`}>
                    {msg.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{msg.name}</h3>
                      <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3 gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{msg.phone}</span>
                    </div>
                    {msg.subject && <p className="text-sm font-medium text-gray-800 mb-2">Subjek: {msg.subject}</p>}
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{msg.message}</p>
                    
                    {!msg.isRead && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => handleMarkRead(msg.id)}
                          variant="outline" 
                          size="sm"
                          className="text-[#00288E] border-[#00288E] hover:bg-blue-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Tandai Sudah Dibaca
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
