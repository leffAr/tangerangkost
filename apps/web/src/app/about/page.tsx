import { Building2, ShieldCheck, MapPin, Users, Target, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Tentang Kami - TangerangKost',
  description: 'Mengenal lebih jauh tentang platform pencarian kost terbaik di Tangerang.',
};

async function getAboutImage() {
  try {
    const res = await fetch('https://tangerangkost.onrender.com/api/v1/settings/about', {
      next: { revalidate: 0 }
    });
    const data = await res.json();
    return data.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop';
  } catch (error) {
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop';
  }
}

export default async function AboutPage() {
  const dynamicImageUrl = await getAboutImage();
  const finalImageUrl = dynamicImageUrl.startsWith('http') ? dynamicImageUrl : `https://tangerangkost.onrender.com${dynamicImageUrl}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00288E]/90 via-[#001859]/80 to-[#001859]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            Membawa Kemudahan <br/> <span className="text-blue-400">Pencarian Kost</span> ke Tingkat Selanjutnya.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            TangerangKost hadir sebagai jembatan terpercaya antara pencari hunian dan pemilik properti di seluruh wilayah Kabupaten dan Kota Tangerang.
          </p>
        </div>
      </section>

      {/* Story & Vision Section (Split Layout) */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-white aspect-video md:aspect-auto h-full">
                <img 
                  src={finalImageUrl} 
                  alt="Visi TangerangKost" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply blur-3xl opacity-70 z-0 hidden md:block"></div>
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply blur-3xl opacity-70 z-0 hidden md:block"></div>
              
              {/* Floating Badge */}
              <div className="absolute right-2 -bottom-6 md:-right-6 md:-bottom-6 bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-2xl z-20 flex items-center gap-4 border border-gray-100 animate-in zoom-in duration-1000 delay-300 scale-90 md:scale-100 origin-bottom-right">
                <div className="w-12 h-12 bg-blue-50 text-[#00288E] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">5,000+</p>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Penyewa Terbantu</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#00288E] font-semibold text-sm mb-6">
                <Target className="w-4 h-4" /> Cerita Kami
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Berawal dari Kesulitan Mencari Tempat Tinggal</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Mencari kost yang nyaman, aman, dan sesuai anggaran di daerah baru seringkali memakan waktu dan energi. Banyaknya informasi yang simpang siur serta biaya perantara yang mahal menjadi kendala utama.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Dari sanalah <strong className="text-[#00288E]">TangerangKost</strong> lahir. Kami membangun platform direktori pintar yang mempertemukan Anda langsung dengan pemilik kos tanpa perantara, memastikan transparansi penuh dan kemudahan transaksi.
              </p>
              
              <Link href="/search">
                <Button className="bg-[#00288E] hover:bg-[#001859] text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1">
                  Mulai Cari Kost <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Keunggulan */}
      <section className="py-24 px-4 bg-white relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Nilai Utama Kami</h2>
            <p className="text-gray-500 text-lg">Prinsip yang kami pegang teguh untuk memberikan pelayanan dan pengalaman terbaik bagi setiap pengguna.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:bg-[#00288E] transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-[#00288E]/10 group-hover:bg-white text-[#00288E] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#00288E] transition-colors">Fokus Regional Tangerang</h3>
              <p className="text-gray-600 leading-relaxed">
                Menyajikan basis data properti paling spesifik dan ter-update khusus untuk area Kabupaten, Kota, hingga Tangerang Selatan.
              </p>
            </div>

            {/* Value 2 */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:bg-[#00288E] transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-[#00288E]/10 group-hover:bg-white text-[#00288E] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#00288E] transition-colors">Verifikasi Ketat</h3>
              <p className="text-gray-600 leading-relaxed">
                Tim admin memastikan validitas setiap pemilik kost dan properti untuk meminimalisir risiko penipuan bagi para pencari hunian.
              </p>
            </div>

            {/* Value 3 */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:bg-[#00288E] transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-[#00288E]/10 group-hover:bg-white text-[#00288E] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#00288E] transition-colors">Tanpa Biaya Admin</h3>
              <p className="text-gray-600 leading-relaxed">
                Kami tidak memungut komisi dari penyewa. Semua kesepakatan harga dan transaksi dilakukan secara mandiri dan transparan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#00288E] to-[#001859] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Siap Menemukan Kost Impianmu?</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
              Bergabunglah dengan ribuan pencari kos lainnya. Jika Anda pemilik properti, pasarkan kamar Anda sekarang juga dan jangkau lebih banyak penyewa!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/search">
                <Button className="w-full sm:w-auto bg-white text-[#00288E] hover:bg-gray-100 px-8 py-6 rounded-xl font-bold text-lg transition-transform hover:-translate-y-1">
                  Mulai Mencari Kost
                </Button>
              </Link>
              <Link href="/register?role=OWNER">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 bg-transparent px-8 py-6 rounded-xl font-bold text-lg transition-transform hover:-translate-y-1">
                  Pasang Iklan Properti
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
