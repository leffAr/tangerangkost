import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useQuery for hero slides inside the Home component
query_addition = """
  const { data: heroSlidesData } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      try {
        const res = await api.get('/settings/hero');
        return res.data.slides || [];
      } catch (e) {
        return [];
      }
    }
  });
  
  const BACKGROUND_IMAGES: string[] = heroSlidesData && heroSlidesData.length > 0 
    ? heroSlidesData 
    : [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1e50bb3b37?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop"
      ];
"""

content = content.replace('const [location, setLocation] = useState(\'\');', 'const [location, setLocation] = useState(\'\');\n' + query_addition)

# Fix map parameters to explicitly type them to satisfy TS
content = re.sub(r'\{BACKGROUND_IMAGES\.map\(\(img, index\) =>', '{BACKGROUND_IMAGES.map((img: string, index: number) =>', content)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
