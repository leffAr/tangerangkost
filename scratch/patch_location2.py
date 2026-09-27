import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    const handleNearestSearch = () => {
      setIsDetecting(true);
      
      const simulateLocation = () => {
        setIsDetecting(false);
        alert("GPS dan Jaringan diblokir. Menggunakan lokasi simulasi (Pusat Tangerang) untuk keperluan testing.");
        router.push(`/search?lat=-6.178306&lng=106.631889`);
      };

      const fallbackToIP = async () => {
        try {
          const res = await fetch('http://ip-api.com/json/');
          const data = await res.json();
          if (data.lat && data.lon) {
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
          console.warn("GPS failed, falling back to IP:", error);
          fallbackToIP();
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    };"""

content = re.sub(
    r'    const handleNearestSearch = \(\) => \{.*?(?:console\.warn\("GPS failed.*?fallbackToIP\(\);\n        \},\n        \{ timeout: 5000 \}\n      \);\n    \};)',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Location 2 Patched!")
