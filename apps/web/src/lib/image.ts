export function getImageUrl(url: string | null | undefined): string {
  if (!url) return 'https://placehold.co/600x400?text=No+Image';
  
  // If it's a local render upload
  if (url.startsWith('/')) {
    return `https://tangerangkost.onrender.com${url}`;
  }
  
  // If it's an ImgBB url (or any external http URL), route it through our proxy to bypass ISP blocks
  if (url.startsWith('http')) {
    // Optionally only proxy ImgBB
    if (url.includes('i.ibb.co')) {
      return `/api/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  }

  return url;
}
