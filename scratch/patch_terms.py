import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state
target_state = r'const \[isDetecting, setIsDetecting\] = useState\(false\);'
replacement_state = """const [isDetecting, setIsDetecting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);"""
content = re.sub(target_state, replacement_state, content)

# 2. Change link to button
target_link = r'<li><Link href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Syarat & Ketentuan</Link></li>'
replacement_link = '<li><button onClick={() => setShowTermsModal(true)} className="hover:text-blue-400 transition-colors flex items-center gap-2 outline-none"><ArrowRight className="w-4 h-4"/> Syarat & Ketentuan</button></li>'
content = content.replace(target_link, replacement_link)

# 3. Add Modal at the end, right before the last closing div
target_modal = r'</footer>\s*</div>\s*\);\s*\}'
replacement_modal = """</footer>

      {/* Syarat & Ketentuan Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#00288E] text-white rounded-t-2xl">
              <h2 className="text-xl font-bold">Syarat & Ketentuan Pemilik Kos</h2>
              <button onClick={() => setShowTermsModal(false)} className="text-white hover:text-gray-200 bg-white/20 px-3 py-1 text-sm rounded-full transition-colors outline-none font-medium">Tutup</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5 text-gray-700">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">1. Tanggung Jawab Informasi</h3>
                <p className="leading-relaxed">Pemilik wajib memberikan informasi, foto, dan harga kost yang sesuai dengan kondisi sebenarnya. Penipuan informasi akan mengakibatkan akun diblokir permanen dari sistem TangerangKost.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 mt-2">2. Transaksi & Pembayaran</h3>
                <p className="leading-relaxed">TangerangKost hanya bertindak sebagai platform direktori/perantara informasi. Seluruh transaksi pembayaran (DP, Lunas, Bulanan) dilakukan secara langsung antara penyewa dan pemilik kost. TangerangKost tidak bertanggung jawab atas kerugian finansial yang terjadi.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 mt-2">3. Kebersihan & Keamanan</h3>
                <p className="leading-relaxed">Pemilik bertanggung jawab penuh untuk menjaga keamanan properti serta kenyamanan lingkungan kost. Pemilik berhak membuat peraturan internal (jam malam, tamu, larangan merokok, dll) yang harus disepakati oleh penyewa di awal.</p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 mt-2">4. Hak Akses & Penghapusan</h3>
                <p className="leading-relaxed">Tim admin TangerangKost berhak penuh untuk menghapus atau menyembunyikan iklan kost jika terdapat laporan penipuan beruntun, konten tidak pantas, atau kost yang sudah tidak beroperasi tanpa pemberitahuan sebelumnya.</p>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-2xl">
              <button onClick={() => setShowTermsModal(false)} className="px-6 py-2.5 bg-[#00288E] text-white font-bold rounded-xl hover:bg-[#001859] transition-colors shadow-md outline-none">Saya Mengerti</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""

content = re.sub(target_modal, replacement_modal, content)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
