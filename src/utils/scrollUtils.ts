
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

export const handleHashNavigation = (hash: string) => {
  if (hash.startsWith('#')) {
    const sectionId = hash.substring(1);
    // Small delay to ensure the page has loaded
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
  }
};
