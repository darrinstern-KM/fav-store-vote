import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Heart, Users, Trophy, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    document.title = 'About the Contest – Craft Retail Champions';
    const desc = 'Learn about Craft Retail Champions contest celebrating top craft retailers nationwide. Presented by h+h americas and Fiber+Fabric Craft Festival.';
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
    canonical.href = window.location.origin + '/about';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <Badge variant="secondary" className="text-sm">About the Contest</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Craft Retail Champions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Celebrating creativity and commerce by recognizing the best craft retailers 
            who inspire makers and support creative communities nationwide.
          </p>
        </div>

        {/* Contest Overview */}
        <div className="grid gap-8 lg:gap-12 mb-16">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-4">What is Craft Retail Champions?</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Craft Retail Champions is a nationwide contest that celebrates the best craft retailers 
                    across America. From local yarn shops to quilting stores, from fabric boutiques to 
                    general craft retailers – we're honoring the businesses that keep creativity alive 
                    in our communities.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    This initiative recognizes stores that go above and beyond to support makers, 
                    offer quality products, provide excellent customer service, and foster creative 
                    communities through classes, events, and inspiration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Nominate & Discover</h3>
                <p className="text-muted-foreground">
                  Find your favorite craft retailers or add new ones to our directory. 
                  Every maker's voice matters in building our community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Vote & Support</h3>
                <p className="text-muted-foreground">
                  Cast your vote for retailers that have made a difference in your 
                  creative journey. Share why they deserve recognition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Celebrate Winners</h3>
                <p className="text-muted-foreground">
                  Join us in celebrating the winners and recognizing all the amazing 
                  retailers who make our craft community thrive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contest Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Contest Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Quilting', 'Yarn', 'Needlepoint', 'Weaving', 'Spinning', 'Cross-Stitch', 'Hand Embroidery', 'Machine Embroidery', 'Machines'].map((category) => (
              <Card key={category} className="text-center">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">{category}</Badge>
                  <p className="text-sm text-muted-foreground">
                    Retailers specializing in {category.toLowerCase()} supplies and expertise
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contest Timeline */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Contest Timeline</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                <div>
                  <h3 className="font-semibold">Nomination Phase</h3>
                  <p className="text-muted-foreground">Submit and discover craft retailers nationwide</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                <div>
                  <h3 className="font-semibold">Voting Period</h3>
                  <p className="text-muted-foreground">Community voting to select the champions</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                <div>
                  <h3 className="font-semibold">Winner Announcement</h3>
                  <p className="text-muted-foreground">Celebrate our Craft Retail Champions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center bg-muted/50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Participate?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of makers in celebrating the craft retailers who make our 
            creative communities possible. Your vote helps recognize excellence in craft retail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">Start Voting</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/sponsors">Meet Our Sponsors</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;