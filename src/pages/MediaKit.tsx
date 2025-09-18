import { useEffect } from 'react';
import { Download, Image, FileText, Share, Camera, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MediaKit = () => {
  useEffect(() => {
    document.title = 'Media Kit – Craft Retail Champions';
    const desc = 'Download promotional materials for the Craft Retail Champions competition. Social media assets, in-store materials, and marketing resources for craft retailers.';
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
      category: 'Social Media Assets',
      icon: Share,
      items: [
        { name: 'Instagram Story Template', type: 'PNG', size: '1080x1920', description: 'Ready-to-use story template for Instagram' },
        { name: 'Facebook Post Template', type: 'PNG', size: '1200x630', description: 'Eye-catching Facebook post design' },
        { name: 'Twitter Header', type: 'PNG', size: '1500x500', description: 'Professional Twitter header image' },
        { name: 'Profile Picture Badge', type: 'PNG', size: '400x400', description: 'Add to your profile picture' },
      ]
    },
    {
      category: 'In-Store Materials',
      icon: Camera,
      items: [
        { name: 'Window Cling', type: 'PDF', size: '8.5x11', description: 'High-resolution window display' },
        { name: 'Counter Tent Card', type: 'PDF', size: '4x6', description: 'Folded tent card for checkout counter' },
        { name: 'Vote Here Poster', type: 'PDF', size: '11x17', description: 'Large format poster for store display' },
        { name: 'QR Code Generator', type: 'PDF', size: 'Various', description: 'Custom QR codes linking to your store' },
      ]
    },
    {
      category: 'Digital Marketing',
      icon: Megaphone,
      items: [
        { name: 'Email Signature', type: 'HTML', size: 'Responsive', description: 'Professional email signature template' },
        { name: 'Website Banner', type: 'PNG', size: '1200x300', description: 'Add to your website header' },
        { name: 'Newsletter Template', type: 'HTML', size: 'Responsive', description: 'Email newsletter design' },
        { name: 'Press Release Template', type: 'DOC', size: 'Letter', description: 'Ready-to-send press release' },
      ]
    },
    {
      category: 'Brand Guidelines',
      icon: FileText,
      items: [
        { name: 'Logo Package', type: 'ZIP', size: 'Various', description: 'Official logos in multiple formats' },
        { name: 'Color Palette', type: 'PDF', size: 'Letter', description: 'Official brand colors and usage guidelines' },
        { name: 'Typography Guide', type: 'PDF', size: 'Letter', description: 'Font specifications and usage' },
        { name: 'Brand Guidelines', type: 'PDF', size: 'Letter', description: 'Complete brand usage documentation' },
      ]
    },
  ];

  const downloadAsset = (assetName: string) => {
    // Placeholder for download functionality
    console.log(`Downloading ${assetName}`);
    // In a real implementation, this would trigger a file download
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <Megaphone className="mx-auto mb-6 h-16 w-16 text-winner-gold" />
          <h1 className="mb-4 text-5xl font-bold font-playfair">Media Kit</h1>
          <p className="mb-8 text-xl opacity-90">
            Download promotional materials to help promote your participation in Craft Retail Champions. 
            All assets are free to use for participating retailers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Free Download
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Commercial Use OK
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Multiple Formats
            </Badge>
          </div>
        </div>
      </section>

      {/* Quick Download Section */}
      <section className="py-12 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-foreground">Quick Downloads</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              className="h-16 text-lg bg-gradient-vote hover:shadow-vote"
              onClick={() => downloadAsset('Complete Media Kit')}
            >
              <Download className="mr-2 h-5 w-5" />
              Complete Media Kit (ZIP)
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg"
              onClick={() => downloadAsset('Social Media Pack')}
            >
              <Share className="mr-2 h-5 w-5" />
              Social Media Pack
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg"
              onClick={() => downloadAsset('In-Store Materials')}
            >
              <Camera className="mr-2 h-5 w-5" />
              In-Store Materials
            </Button>
          </div>
        </div>
      </section>

      {/* Asset Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground font-playfair">Marketing Assets</h2>
            <p className="text-xl text-muted-foreground">
              Professional marketing materials designed to help you promote your store
            </p>
          </div>

          <div className="space-y-12">
            {mediaAssets.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <div key={categoryIndex}>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-vote text-white">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{category.category}</h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="group hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <Badge variant="outline">{item.size}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {item.description}
                          </p>
                          <Button 
                            className="w-full group-hover:bg-gradient-vote group-hover:text-white transition-all"
                            variant="outline"
                            onClick={() => downloadAsset(item.name)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="mb-4 text-3xl font-bold text-foreground font-playfair">Usage Guidelines</h2>
            <p className="text-lg text-muted-foreground">
              Please follow these guidelines when using our marketing materials
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-success">✓ Allowed Uses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• Promote your store's participation in the competition</p>
                <p>• Share on social media platforms</p>
                <p>• Display in your physical store</p>
                <p>• Include in newsletters and email marketing</p>
                <p>• Add to your website</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">✗ Restrictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
    </div>
  );
};

export default MediaKit;