"use client";

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitContactMessage } from '@/lib/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="lg:col-span-3 p-8 md:p-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Tinggalkan Pesan</h2>
      <p className="text-gray-500 mb-8">Isi formulir di bawah ini dan admin akan merespons pesan Anda secepatnya.</p>
      
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
          Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          Maaf, terjadi kesalahan. Silakan coba lagi.
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Nama Lengkap</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Masukkan nama Anda" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Nomor WhatsApp (WA)</label>
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="0812xxxx..." 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Subjek Pesan</label>
          <input 
            type="text" 
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder="Apa yang ingin Anda tanyakan?" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Detail Pesan</label>
          <textarea 
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Tuliskan pesan Anda secara detail..." 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all resize-none"
          ></textarea>
        </div>

        <Button 
          type="submit" 
          disabled={status === 'loading'}
          className="bg-[#00288E] hover:bg-[#001859] text-white px-8 py-6 rounded-xl font-bold text-lg w-full md:w-auto transition-transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'} <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </div>
  );
}
