import { useEffect } from 'react';
import { VoteApp } from '@/components/VoteApp';

const Index = () => {
  useEffect(() => {
    document.title = 'Craft Retail Champions – Vote for Top Craft Retailers';
    const desc = 'Celebrate creativity and commerce. Vote for your favorite craft retailers nationwide.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + '/';
  }, []);

  return <VoteApp />;
};

export default Index;
