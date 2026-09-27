import codecs

file_path = 'apps/web/src/app/kos/[slug]/page.tsx'
with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

target = """<CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Bagikan pengalaman Anda</h3>"""

replacement = """<CardContent className="p-6">
                {!isMounted ? (
                  <div className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
                ) : !isLoggedIn ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 mb-2">Ingin membagikan pengalaman Anda?</h3>
                    <p className="text-gray-500 mb-4 text-sm">Silakan masuk ke akun Anda terlebih dahulu untuk memberikan ulasan dan rating pada kost ini.</p>
                    <Link href="/login">
                      <Button className="bg-[#00288E] hover:bg-[#001859] text-white rounded-xl">Masuk ke Akun</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 mb-4">Bagikan pengalaman Anda</h3>"""

if target in content:
    content = content.replace(target, replacement)
    
    target_end = """</Button>
                </div>
              </CardContent>"""
    
    replacement_end = """</Button>
                </div>
                  </>
                )}
              </CardContent>"""
    
    content = content.replace(target_end, replacement_end)
    
    with codecs.open(file_path, 'w', 'utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    print('NOT FOUND')
