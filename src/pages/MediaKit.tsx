import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Download, Image, FileText, Share, Camera, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MediaKit = () => {
  useEffect(() => {
    document.title = 'Media Kit – Craft Retail Champions';
    const desc = 'Download official logos, press materials, and brand assets for Craft Retail Champions coverage.';
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
    canonical.href = window.location.origin + '/media-kit';
  }, []);

  const mediaAssets = [
    {
      title: "Official Logo Package",
      description: "Primary logos in various formats and colors",
      type: "ZIP File",
      size: "2.4 MB",
      icon: Image
    },
    {
      title: "Press Release Template",
      description: "Official announcement template for media use",
      type: "DOCX",
      size: "156 KB",
      icon: FileText
    },
    {
      title: "High-Resolution Photos",
      description: "Event photos and promotional imagery",
      type: "ZIP File",
      size: "8.7 MB",
      icon: Camera
    },
    {
      title: "Social Media Kit",
      description: "Social media graphics and templates",
      type: "ZIP File",
      size: "3.2 MB",
      icon: Share
    }
  ];

  const handleDownload = (assetName: string) => {
    console.log(`Downloading ${assetName}`);
    // In a real implementation, this would trigger a file download
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} onLogout={() => {}} />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <Megaphone className="mx-auto mb-6 h-16 w-16 text-winner-gold" />
          <h1 className="mb-4 text-5xl font-bold font-playfair">Media Kit</h1>
          <p className="text-xl mb-8 text-white/90">
            Download official brand assets, press materials, and promotional content for Craft Retail Champions
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Press Resources Available
          </Badge>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-vote-primary">2,500+</div>
              <div className="text-muted-foreground">Participating Stores</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-vote-primary">50+</div>
              <div className="text-muted-foreground">States Represented</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-vote-primary">100K+</div>
              <div className="text-muted-foreground">Votes Cast</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-vote-primary">25+</div>
              <div className="text-muted-foreground">Media Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Download Media Assets</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access our complete collection of logos, press materials, and promotional content. 
              All assets are free to use for editorial and promotional purposes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mediaAssets.map((asset, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <asset.icon className="h-8 w-8 text-vote-primary" />
                      <div>
                        <CardTitle className="text-lg">{asset.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {asset.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{asset.type}</span>
                      <span>•</span>
                      <span>{asset.size}</span>
                    </div>
                    <Button 
                      onClick={() => handleDownload(asset.title)}
                      className="bg-vote-primary hover:bg-vote-primary/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Press Contact</h2>
            <p className="text-muted-foreground">
              For interviews, additional materials, or press inquiries
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Media Relations</h3>
                  <p className="text-muted-foreground">Koelnmesse Inc.</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Email:</strong> press@koelnmesse.com</p>
                  <p><strong>Phone:</strong> +1 (773) 326-9920</p>
                  <p><strong>Direct Line:</strong> +1 (773) 326-9925</p>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    For immediate assistance, please include "CRAFT RETAIL CHAMPIONS" in your subject line
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Usage Guidelines</h2>
            <p className="text-muted-foreground">
              Please follow these guidelines when using our brand assets
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  ✓ Permitted Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Editorial coverage and news articles</p>
                <p>• Social media posts about the contest</p>
                <p>• Educational and informational content</p>
                <p>• Partner promotional materials</p>
                <p>• Event listings and calendars</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  ✗ Prohibited Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Do not modify logos or brand elements</p>
                <p>• Do not use for competing events</p>
                <p>• Do not resell or redistribute materials</p>
                <p>• Do not claim ownership of designs</p>
                <p>• Do not use after competition ends</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MediaKit;