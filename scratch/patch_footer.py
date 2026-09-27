import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_str = '{/* Simple Footer */}'
end_str = '</footer>'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_str)
    
    new_footer = """{/* Modern Footer */}
        <footer className="bg-slate-950 text-slate-300 py-16 px-4 border-t-4 border-[#00288E] relative overflow-hidden">
          {/* Decorative background gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand Col */}
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-white mb-4">Tangerang<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Kost</span></h2>
                <p className="text-slate-400 leading-relaxed font-light">
                  Platform direktori kost nomor satu di Kabupaten Tangerang. Temukan hunian nyaman, aman, dan strategis dengan mudah hanya dalam genggaman.
                </p>
                <div className="flex gap-4 pt-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 transition-all shadow-lg"><span className="font-bold text-sm">fb</span></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:text-white hover:scale-110 transition-all shadow-lg"><span className="font-bold text-sm">ig</span></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-400 hover:text-white hover:scale-110 transition-all shadow-lg"><span className="font-bold text-sm">tw</span></a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Pintasan Cepat</h3>
                <ul className="space-y-3 font-medium text-slate-400">
                  <li><Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Beranda</Link></li>
                  <li><Link href="/search" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Cari Kos Terdekat</Link></li>
                  <li><Link href="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Tentang Kami</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Hubungi Admin</Link></li>
                </ul>
              </div>

              {/* For Owners */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Untuk Pemilik Kos</h3>
                <ul className="space-y-3 font-medium text-slate-400">
                  <li><Link href="/register" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Daftar Menjadi Mitra</Link></li>
                  <li><Link href="/login" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Login Owner Dashboard</Link></li>
                  <li><Link href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Syarat & Ketentuan</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Kontak Kami</h3>
                <ul className="space-y-4 font-medium text-slate-400">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Jl. Raya Pemda Tigaraksa, Kabupaten Tangerang, Banten 15720</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>+62 812-3456-7890</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>halo@tangerangkost.com</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-500 text-sm font-medium">
                &copy; {new Date().getFullYear()} TangerangKost. Seluruh hak cipta dilindungi.
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-white transition-colors">Syarat Penggunaan</a>
              </div>
            </div>
          </div>
        </footer>"""
    
    content = content[:start_idx] + new_footer + content[end_idx:]
    with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH BOUNDARIES")
