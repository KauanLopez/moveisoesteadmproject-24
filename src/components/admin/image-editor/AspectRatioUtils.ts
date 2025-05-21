
export const getAspectRatio = (section: string, devicePreview: 'desktop' | 'tablet' | 'mobile'): number => {
  // Updated aspect ratios to match exactly the front-end display
  const baseRatios: Record<string, number> = {
    'projects': 16/9, // Widescreen for projects
    'products': 4/3,  // Updated for products to match the front-end display
    'manager': 4/5,   // Updated ratio for manager section
  };
  
  // Adjust aspect ratio based on device
  switch(devicePreview) {
    case 'mobile':
      // Adjusted mobile ratios
      if (section === 'products') {
        return 1; // Square-ish for products on mobile
      }
      return baseRatios[section] ? Math.min(baseRatios[section] * 0.8, 1) : 9/16;
    case 'tablet':
      return baseRatios[section] || 4/3;
    default:
      return baseRatios[section] || 16/9;
  }
};

export const getPreviewHeight = (section: string, devicePreview: 'desktop' | 'tablet' | 'mobile'): string => {
  const baseHeights: Record<string, string> = {
    'projects': 'h-64',  // Default for projects
    'products': 'h-64',  // Updated for products
    'manager': 'h-96',   // Taller for manager to match front-end
  };
  
  // Adjust height based on device
  switch(devicePreview) {
    case 'mobile':
      return section === 'products' ? 'h-80' : 'h-96';
    case 'tablet':
      return section === 'products' ? 'h-72' : 'h-80';
    default:
      return baseHeights[section] || 'h-64';
  }
};
