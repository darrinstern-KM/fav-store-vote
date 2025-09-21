import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Award, Star } from 'lucide-react';

const Sponsors = () => {
  useEffect(() => {
    document.title = 'Sponsors – Craft Retail Champions';
    const desc = 'Meet our sponsors supporting the Craft Retail Champions contest. h+h americas and Fiber+Fabric Craft Festival.';
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
    canonical.href = window.location.origin + '/sponsors';
  }, []);

  const sponsors = [
    {
      name: "h+h americas",
      type: "Title Sponsor",
      description: "Leading trade fair organizer for the international handicraft and hobby industry. h+h americas brings together creative communities and innovative businesses.",
      website: "https://www.hh-americas.com",
      logo: "/lovable-uploads/3bd255e3-a72d-40f7-8ed5-1247212390a5.png",
      tier: "title"
    },
    {
      name: "Fiber+Fabric Craft Festival",
      type: "Presenting Sponsor",
      description: "Premier craft festival celebrating fiber arts, quilting, and fabric crafts. Connecting makers with inspiration and quality materials.",
      website: "https://www.fiberfabric.com",
      logo: "/lovable-uploads/d80dca82-3afa-455c-a057-33f1f6967df0.png", 
      tier: "presenting"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} onLogout={() => {}} />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Award className="w-8 h-8 text-primary" />
            <Badge variant="secondary" className="text-sm">Contest Sponsors</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Amazing Sponsors
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're proud to partner with industry leaders who share our passion for supporting 
            the craft retail community and celebrating creativity in commerce.
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid gap-8 md:gap-12 max-w-4xl mx-auto">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.name} className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`}
                      className="w-32 h-32 object-contain rounded-lg bg-muted p-4"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <h2 className="text-2xl font-bold">{sponsor.name}</h2>
                      {sponsor.tier === 'title' && (
                        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                          <Star className="w-3 h-3 mr-1" />
                          {sponsor.type}
                        </Badge>
                      )}
                      {sponsor.tier === 'presenting' && (
                        <Badge variant="secondary">
                          {sponsor.type}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {sponsor.description}
                    </p>

                    <a 
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-muted/50 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Interested in Sponsoring?</h3>
          <p className="text-muted-foreground mb-6">
            Join us in celebrating and supporting the craft retail community. 
            Contact us to learn about sponsorship opportunities.
          </p>
          <a 
            href="mailto:sponsors@craftretailchampions.com"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            <span>Contact Us</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;