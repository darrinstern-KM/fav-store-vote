import { useEffect } from 'react';
import VoteApp from '@/components/VoteApp';

const Index = () => {
  useEffect(() => {
    document.title = 'Store Voting – Find and Vote Top Local Stores';
    const desc = 'Vote for your favorite local stores. Discover leaders by state and nationwide.';
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
