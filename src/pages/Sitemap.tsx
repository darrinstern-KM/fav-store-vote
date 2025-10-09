import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Sitemap = () => {
  useEffect(() => {
    document.title = 'Sitemap - Craft Retail Champions';
    const desc = 'Complete sitemap of Craft Retail Champions website navigation and content.';
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
    canonical.href = window.location.origin + '/sitemap';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} onLogout={() => {}} onAuthSuccess={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Sitemap</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Main Pages</h2>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-primary hover:text-primary/80 underline">
                      Home - Craft Retail Champions
                    </Link>
                  </li>
                  <li>
                    <Link to="/sponsors" className="text-primary hover:text-primary/80 underline">
                      Sponsors
                    </Link>
                  </li>
                  <li>
                    <Link to="/media-kit" className="text-primary hover:text-primary/80 underline">
                      Media Kit
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-primary hover:text-primary/80 underline">
                      About
                    </Link>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Legal & Information</h2>
                <ul className="space-y-2">
                  <li>
                    <Link to="/cookie-notice" className="text-primary hover:text-primary/80 underline">
                      Cookie Notice
                    </Link>
                  </li>
                  <li>
                    <Link to="/sitemap" className="text-primary hover:text-primary/80 underline">
                      Sitemap
                    </Link>
                  </li>
                </ul>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Features</h2>
                <ul className="space-y-2">
                  <li className="text-muted-foreground">Vote for Craft Retailers</li>
                  <li className="text-muted-foreground">Search Stores by Location</li>
                  <li className="text-muted-foreground">Add New Stores</li>
                  <li className="text-muted-foreground">View Store Details</li>
                  <li className="text-muted-foreground">SMS Voting Guide</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: info@koelnmesse.com</p>
                  <p>Phone: +1 (773) 326-9920</p>
                  <p>Address: 222 Merchandise Mart Plaza, Suite 470, Chicago, IL 60654</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sitemap;