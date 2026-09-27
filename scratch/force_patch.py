import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const handleNearestSearch = () => {
      setIsDetecting(true);
      if (!navigator.geolocation) {
        alert("Browser Anda tidak mendukung fitur lokasi.");
        setIsDetecting(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          router.push(`/search?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
        },
        (error) => {
          setIsDetecting(false);
          alert("Gagal mendapatkan lokasi. Pastikan Anda telah memberikan izin akses lokasi.");
        }
      );
    };"""

replacement = """    const handleNearestSearch = () => {
      setIsDetecting(true);
      
      const simulateLocation = () => {
        setIsDetecting(false);
        alert("Sistem mengaktifkan lokasi simulasi (Pusat Tangerang) karena akses GPS sebenarnya diblokir oleh browser (karena tidak menggunakan HTTPS).");
        router.push(`/search?lat=-6.178306&lng=106.631889`);
      };

      const fallbackToIP = async () => {
        try {
          const res = await fetch('http://ip-api.com/json/');
          const data = await res.json();
          if (data.lat && data.lon) {
            setIsDetecting(false);
            router.push(`/search?lat=${data.lat}&lng=${data.lon}`);
          } else {
            simulateLocation();
          }
        } catch (e) {
          simulateLocation();
        }
      };

      if (!navigator.geolocation) {
        fallbackToIP();
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          router.push(`/search?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
        },
        (error) => {
          fallbackToIP();
        },
        { timeout: 3000, enableHighAccuracy: false }
      );
    };"""

if target in content:
    content = content.replace(target, replacement)
    with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH TARGET")
