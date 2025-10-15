import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SponsorsSection = () => {
  const sponsors = [
    {
      name: "h+h americas",
      type: "Title Sponsor",
      logo: "/lovable-uploads/3bd255e3-a72d-40f7-8ed5-1247212390a5.png",
      tier: "title"
    },
    {
      name: "Fiber+Fabric Craft Festival",
      type: "Presenting Sponsor",
      logo: "/lovable-uploads/d80dca82-3afa-455c-a057-33f1f6967df0.png",
      tier: "presenting"
    }
  ];

  return (
    <section className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Award className="w-6 h-6 text-primary" />
          <Badge variant="secondary" className="text-sm">Our Sponsors</Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Proudly Supported By
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Thank you to our amazing sponsors who make this contest possible
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.name} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center p-4">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {sponsor.tier === 'title' && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-primary rounded-full p-2 shadow-lg">
                        <Star className="w-4 h-4 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-1">{sponsor.name}</h3>
                  <Badge 
                    variant={sponsor.tier === 'title' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {sponsor.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          asChild
          variant="outline"
          className="group"
        >
          <a href="/sponsors">
            Learn More About Our Sponsors
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </div>
    </section>
  );
};