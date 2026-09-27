import { Mail, Phone, MapPin, MessageSquare, Clock, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Hubungi Kami - TangerangKost',
  description: 'Pusat bantuan dan layanan pelanggan TangerangKost.',
};

async function getContactSettings() {
  try {
    const res = await fetch('http://192.168.137.1:3000/api/v1/settings/contact', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (error) {
    return {
      whatsapp: '6281234567890',
      email: 'bantuan@tangerangkost.com',
      address: 'Jl. Raya Serpong No. 88, Kelapa Dua, Kabupaten Tangerang, Banten 15810'
    };
  }
}

export default async function ContactPage() {
  const settings = await getContactSettings();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop" 
            alt="Contact Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00288E]/95 to-[#001859]/90"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-blue-100 backdrop-blur-md border border-white/20 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MessageSquare className="w-4 h-4" /> Pusat Bantuan
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Hubungi Tim Kami
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Ada pertanyaan, keluhan, atau ingin bekerja sama? Kami siap mendengarkan dan membantu Anda kapan saja.
          </p>
        </div>
      </section>

      {/* Floating Contact Cards */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 shadow-sm">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp Admin</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed flex-1">
              Respons cepat untuk kendala teknis atau pertanyaan seputar pemesanan kost.
            </p>
            <Link href={`https://wa.me/${settings.whatsapp}?text=Halo%20Admin%20TangerangKost...`} target="_blank" className="w-full">
              <Button className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-green-500/20">
                Chat Sekarang
              </Button>
            </Link>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 duration-300 delay-100">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#00288E] shadow-sm">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Layanan</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed flex-1">
              Untuk penawaran kerja sama bisnis, keluhan resmi, atau bantuan akun.
            </p>
            <Link href={`mailto:${settings.email}`} className="w-full">
              <Button className="w-full bg-[#00288E] hover:bg-[#001859] text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-blue-900/20">
                Kirim Email
              </Button>
            </Link>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 duration-300 delay-200">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 shadow-sm">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Alamat Kantor</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed flex-1">
              {settings.address}
            </p>
            <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 font-bold h-12 rounded-xl transition-all">
              Lihat di Maps
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content: Form & Info */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            {/* Form Section */}
            <div className="lg:col-span-3 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tinggalkan Pesan</h2>
              <p className="text-gray-500 mb-8">Isi formulir di bawah ini dan kami akan membalas via email secepatnya.</p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">Nama Lengkap</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama Anda" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">Alamat Email</label>
                    <input 
                      type="email" 
                      placeholder="email@contoh.com" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Subjek Pesan</label>
                  <input 
                    type="text" 
                    placeholder="Apa yang ingin Anda tanyakan?" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Detail Pesan</label>
                  <textarea 
                    rows={5}
                    placeholder="Tuliskan pesan Anda secara detail..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all resize-none"
                  ></textarea>
                </div>

                <Button type="button" className="bg-[#00288E] hover:bg-[#001859] text-white px-8 py-6 rounded-xl font-bold text-lg w-full md:w-auto transition-transform hover:-translate-y-1">
                  Kirim Pesan <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>

            {/* Side Info Section */}
            <div className="lg:col-span-2 bg-gray-900 text-white p-8 md:p-12 relative overflow-hidden">
              {/* Decorative background blur */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00288E] rounded-full blur-3xl opacity-50"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-8">Informasi Operasional</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Jam Kerja Admin</p>
                        <p className="text-gray-400 text-sm">Senin - Jumat: 08.00 - 17.00 WIB</p>
                        <p className="text-gray-400 text-sm">Sabtu: 09.00 - 14.00 WIB</p>
                        <p className="text-gray-400 text-sm">Minggu & Libur Nasional: Tutup</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Media Sosial</p>
                        <div className="flex gap-4 mt-2">
                          <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                          <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                          <a href="#" className="text-gray-400 hover:text-white transition-colors">TikTok</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-sm text-gray-300 italic">
                    "TangerangKost berkomitmen penuh memberikan pelayanan terbaik. Segala bentuk kritik dan saran Anda sangat berharga bagi perkembangan platform kami."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
