with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 transition-all shadow-lg"><span className="font-bold text-sm">fb</span></a>\n                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:text-white hover:scale-110 transition-all shadow-lg"><span className="font-bold text-sm">ig</span></a>\n                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-400 hover:text-white hover:scale-110 transition-all shadow-lg"><span className="font-bold text-sm">tw</span></a>'

replacement = """{contactSettings?.instagram && (
                    <a href={contactSettings.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:scale-110 transition-all shadow-lg text-slate-300">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                  )}
                  {contactSettings?.tiktok && (
                    <a href={contactSettings.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all shadow-lg text-slate-300">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                    </a>
                  )}
                  {contactSettings?.whatsapp && (
                    <a href={`https://wa.me/${contactSettings.whatsapp.replace(/\\D/g,'')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white hover:scale-110 transition-all shadow-lg text-slate-300">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </a>
                  )}"""

# If spaces don't match, string replacement fails. I'll use regex carefully.
import re
target_regex = r'<a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 transition-all shadow-lg"><span className="font-bold text-sm">fb</span></a>.*?<span className="font-bold text-sm">tw</span></a>'

def repl(m):
    return replacement

content = re.sub(target_regex, repl, content, flags=re.DOTALL)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
