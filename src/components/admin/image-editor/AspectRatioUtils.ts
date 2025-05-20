
export const getAspectRatio = (section: string, devicePreview: 'desktop' | 'tablet' | 'mobile'): number => {
  // Base aspect ratios for different sections
  const baseRatios: Record<string, number> = {
    'projects': 16/9, // Widescreen for projects
    'products': 3/4,  // Portrait for products
    'manager': 1,     // Square for manager
  };
  
  // Adjust aspect ratio based on device
  switch(devicePreview) {
    case 'mobile':
      // Mobile typically has taller aspect ratios
      return baseRatios[section] ? Math.min(baseRatios[section] * 0.6, 1) : 9/16;
    case 'tablet':
      // Tablet is somewhere between desktop and mobile
      return baseRatios[section] || 4/3;
    default:
      // Desktop uses the base ratio
      return baseRatios[section] || 16/9;
  }
};

export const getPreviewHeight = (section: string, devicePreview: 'desktop' | 'tablet' | 'mobile'): string => {
  const baseHeights: Record<string, string> = {
    'projects': 'h-64',  // Taller for projects
    'products': 'h-80',  // Medium for products
    'manager': 'h-96',   // Square-ish for manager
  };
  
  // Adjust height based on device
  switch(devicePreview) {
    case 'mobile':
      return 'h-96'; // Taller preview for mobile
    case 'tablet':
      return 'h-80'; // Medium height for tablet
    default:
      return baseHeights[section] || 'h-64';
  }
};
