const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-vote-primary rounded"></div>
              <span className="text-xl font-bold">Craft Retail Champions</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Celebrating creativity and commerce. Vote for your favorite craft retailers nationwide and help recognize excellence in the craft retail industry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/" 
                  className="text-muted-foreground hover:text-vote-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/';
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="text-muted-foreground hover:text-vote-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/about';
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="/sponsors" 
                  className="text-muted-foreground hover:text-vote-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/sponsors';
                  }}
                >
                  Sponsors
                </a>
              </li>
              <li>
                <a 
                  href="/media-kit" 
                  className="text-muted-foreground hover:text-vote-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/media-kit';
                  }}
                >
                  Media Kit
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-muted-foreground hover:text-vote-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/contact';
                  }}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: info@koelnmesse.com</p>
              <p>Phone: +1 (773) 326-9920</p>
              <p>
                8770 West Bryn Mawr Avenue<br />
                Suite 1300<br />
                Chicago, Illinois 60631, USA
              </p>
            </div>
          </div>

          {/* Owned & Managed By */}
          <div>
            <h3 className="font-semibold mb-4">Owned & Managed by</h3>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/3bd255e3-a72d-40f7-8ed5-1247212390a5.png" 
                alt="Koelnmesse Logo" 
                className="h-8"
              />
              <div>
                <p className="text-sm font-medium">Koelnmesse Inc.</p>
                <p className="text-xs text-muted-foreground">Global Trade Fair Organizer</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm">Industry Partner</h4>
              <img 
                src="/lovable-uploads/d80dca82-3afa-455c-a057-33f1f6967df0.png" 
                alt="AFCI Logo" 
                className="h-6"
              />
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>
                © Copyright 2024 | Koelnmesse Inc. | All Rights Reserved. The Fiber+Fabric Craft Festival & h+h americas logo is a registered trademark of Koelnmesse Inc.
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-vote-primary transition-colors">Legal Notice</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-vote-primary transition-colors">Security and Data Protection</a>
            <span className="text-muted-foreground">|</span>
            <a 
              href="/cookie-notice" 
              className="text-muted-foreground hover:text-vote-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/cookie-notice';
              }}
            >
              Cookie Notice
            </a>
            <span className="text-muted-foreground">|</span>
            <a 
              href="/sitemap" 
              className="text-muted-foreground hover:text-vote-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/sitemap';
              }}
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };