import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    const handleNearestSearch = () => {
      setIsDetecting(true);
      
      const fallbackToIP = async () => {
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data.latitude && data.longitude) {
            router.push(`/search?lat=${data.latitude}&lng=${data.longitude}`);
          } else {
            setIsDetecting(false);
            alert("Gagal mendeteksi lokasi via jaringan.");
          }
        } catch (e) {
          setIsDetecting(false);
          alert("Akses GPS diblokir oleh browser (karena bukan HTTPS) dan deteksi IP juga gagal.");
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
          // Fallback if blocked by HTTP or denied
          console.warn("GPS failed, falling back to IP:", error);
          fallbackToIP();
        },
        { timeout: 5000 }
      );
    };"""

content = re.sub(
    r'    const handleNearestSearch = \(\) => \{.*?\}\);\n    \};',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Location Patched!")
