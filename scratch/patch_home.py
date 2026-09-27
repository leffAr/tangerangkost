import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the static BACKGROUND_IMAGES array
content = re.sub(r'const BACKGROUND_IMAGES = \[.*?\];', '', content, flags=re.DOTALL)

# Add useQuery for hero slides inside the Home component
query_addition = """
  const { data: heroSlidesData } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      const res = await api.get('/settings/hero');
      return res.data.slides || [];
    }
  });
  
  const BACKGROUND_IMAGES = heroSlidesData && heroSlidesData.length > 0 
    ? heroSlidesData 
    : [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1e50bb3b37?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop"
      ];
"""

content = content.replace('const [searchQuery, setSearchQuery] = useState(\'\');', 'const [searchQuery, setSearchQuery] = useState(\'\');\n' + query_addition)

# Also fix the img tag to use localhost prefix if it's an uploaded image
img_tag_replace = """<img src={img.startsWith('http') ? img : `http://192.168.137.1:3000${img}`} alt={`Slide ${index}`} className="w-full h-full object-cover" />"""
content = content.replace('<img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />', img_tag_replace)

# Also fix the dependency array of useEffect to include BACKGROUND_IMAGES.length so it updates if they load late
effect_replace = """    useEffect(() => {
      if (!BACKGROUND_IMAGES || BACKGROUND_IMAGES.length === 0) return;
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [BACKGROUND_IMAGES.length]);"""

content = re.sub(r'    useEffect\(\(\) => \{\n      const timer = setInterval\(\(\) => \{\n        setCurrentSlide\(\(prev\) => \(prev \+ 1\) % BACKGROUND_IMAGES\.length\);\n      \}, 5000\);\n      return \(\) => clearInterval\(timer\);\n    \}, \[\]\);', effect_replace, content)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Home Patched!")
