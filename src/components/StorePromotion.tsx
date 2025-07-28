import { useState } from 'react';
import { QrCode, Download, Lightbulb, TrendingUp, Users, Share2, Copy, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export const StorePromotion = () => {
  const [storeName, setStoreName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getVotingUrl = (storeId: string) => {
    return `${window.location.origin}?vote=${storeId}`;
  };

  const generateQRCode = async (url: string) => {
    // Using a free QR code API
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Voting link has been copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const generateCustomGraphic = async () => {
    if (!storeName.trim()) {
      toast({
        title: "Store name required",
        description: "Please enter your store name to generate graphics",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const votingUrl = getVotingUrl(storeId || 'demo');
      const qrCodeUrl = await generateQRCode(votingUrl);
      
      // Note: In a real implementation, you would use Runware API
      // Since this is connected to Supabase, add your Runware API key in Supabase Edge Function Secrets
      toast({
        title: "Graphics ready!",
        description: "Your promotional materials have been generated. Add Runware API key in Supabase Edge Function Secrets for custom AI graphics.",
      });
      
      // Create a download link for the QR code
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${storeName}-qr-code.png`;
      link.click();
      
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate graphics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const promotionTips = [
    {
      icon: Users,
      title: "Engage Your Customers",
      description: "Ask customers to vote during checkout or when they're satisfied with service",
      tips: ["Display QR codes at checkout", "Train staff to mention the contest", "Offer small incentives for voting"]
    },
    {
      icon: Share2,
      title: "Social Media Strategy",
      description: "Leverage your social media presence to drive votes",
      tips: ["Post voting links in stories", "Share customer testimonials", "Create voting reminder posts"]
    },
    {
      icon: TrendingUp,
      title: "Timing Matters",
      description: "Strategic timing can boost your vote count",
      tips: ["Peak shopping hours", "After positive interactions", "During special events or sales"]
    }
  ];

  const graphicStyles = [
    { value: 'modern', label: 'Modern & Clean', description: 'Minimalist design with bold colors' },
    { value: 'vintage', label: 'Vintage Style', description: 'Classic look with retro elements' },
    { value: 'bold', label: 'Bold & Colorful', description: 'Eye-catching with vibrant colors' },
    { value: 'elegant', label: 'Elegant & Professional', description: 'Sophisticated business style' }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Store Promotion Toolkit</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to promote your store and drive more votes
          </p>
        </div>

        <Tabs defaultValue="tips" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="tips">Tips & Strategies</TabsTrigger>
            <TabsTrigger value="links">Custom Links</TabsTrigger>
            <TabsTrigger value="graphics">QR Graphics</TabsTrigger>
          </TabsList>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {promotionTips.map((tip, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-vote text-white">
                        <tip.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{tip.description}</p>
                    <div className="space-y-2">
                      {tip.tips.map((tipText, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-vote-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tipText}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-subtle border-vote-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-vote-primary" />
                  Pro Tips for Maximum Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">1</Badge>
                    <span className="text-sm">Display your current vote count to create urgency</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">2</Badge>
                    <span className="text-sm">Share testimonials from happy voters</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">3</Badge>
                    <span className="text-sm">Partner with local influencers for endorsements</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">4</Badge>
                    <span className="text-sm">Cross-promote with neighboring businesses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Your Custom Voting Link</CardTitle>
                <p className="text-muted-foreground">Create personalized links to drive votes to your store</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input
                      id="store-name"
                      placeholder="Your Amazing Store"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-id">Store ID (optional)</Label>
                    <Input
                      id="store-id"
                      placeholder="your-store-123"
                      value={storeId}
                      onChange={(e) => setStoreId(e.target.value)}
                    />
                  </div>
                </div>
                
                {storeName && (
                  <div className="space-y-3 p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold">Your Custom Voting Links:</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-background rounded border">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium">Direct Vote Link</p>
                          <p className="text-xs text-muted-foreground break-all">{getVotingUrl(storeId || 'demo')}</p>
                        </div>
                        <Button size="sm" onClick={() => handleCopyLink(getVotingUrl(storeId || 'demo'))}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-background rounded border">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium">Social Media Message</p>
                          <p className="text-xs text-muted-foreground">
                            "Vote for {storeName} in the Store Vote Contest! Help us win by casting your vote: {getVotingUrl(storeId || 'demo')}"
                          </p>
                        </div>
                        <Button size="sm" onClick={() => handleCopyLink(`Vote for ${storeName} in the Store Vote Contest! Help us win by casting your vote: ${getVotingUrl(storeId || 'demo')}`)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graphics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Generate Custom QR Code Graphics
                </CardTitle>
                <p className="text-muted-foreground">Create eye-catching promotional materials with QR codes for your store</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="graphic-store-name">Store Name</Label>
                    <Input
                      id="graphic-store-name"
                      placeholder="Your Amazing Store"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graphic-style">Design Style</Label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a style" />
                      </SelectTrigger>
                      <SelectContent>
                        {graphicStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            <div>
                              <div className="font-medium">{style.label}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-message">Custom Message (optional)</Label>
                  <Textarea
                    id="custom-message"
                    placeholder="Vote for us in the Store Contest! Scan to vote now!"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={generateCustomGraphic} 
                    disabled={isGenerating || !storeName.trim()}
                    className="bg-gradient-vote hover:shadow-vote"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Palette className="h-4 w-4 mr-2" />
                        Generate Graphics
                      </>
                    )}
                  </Button>
                  
                  {storeName && (
                    <Button variant="outline" onClick={async () => {
                      const qrUrl = await generateQRCode(getVotingUrl(storeId || 'demo'));
                      const link = document.createElement('a');
                      link.href = qrUrl;
                      link.download = `${storeName}-simple-qr.png`;
                      link.click();
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Simple QR Code
                    </Button>
                  )}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">For Custom AI Graphics:</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Add your Runware API key in Supabase Edge Function Secrets to generate custom AI-powered promotional graphics. 
                    Get your API key at <a href="https://runware.ai/" target="_blank" rel="noopener noreferrer" className="underline">runware.ai</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};