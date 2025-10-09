import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactUs = () => {
  useEffect(() => {
    document.title = 'Contact Us - Craft Retail Champions';
    const desc = 'Get in touch with the Craft Retail Champions team. Find our contact information, office hours, and location details.';
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
    canonical.href = window.location.origin + '/contact';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} onLogout={() => {}} onAuthSuccess={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about the Craft Retail Champions program? We'd love to hear from you. 
              Get in touch with our team for support, partnerships, or general inquiries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-muted-foreground">
                      8770 West Bryn Mawr Avenue<br />
                      Suite 1300<br />
                      Chicago, Illinois 60631<br />
                      USA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+1 (773) 326-9920</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@koelnmesse.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 5:00 PM CST<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Craft Retail Champions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Craft Retail Champions is an initiative by Koelnmesse Inc., celebrating the creativity 
                  and commerce of craft retailers across the United States. Our program recognizes and 
                  honors the best craft retail stores nationwide.
                </p>
                <p className="text-muted-foreground">
                  We are part of the global Koelnmesse network, organizing world-class trade fairs 
                  and events that connect businesses and communities in the crafts and creative industries.
                </p>
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Get Involved</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Vote for your favorite craft retailers</li>
                    <li>• Nominate stores in your community</li>
                    <li>• Partner with us as a sponsor</li>
                    <li>• Join our media network</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  For press releases, media partnerships, and interview requests.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please direct all media inquiries to our main contact email with "MEDIA" in the subject line.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sponsorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Interested in becoming a sponsor of Craft Retail Champions?
                </p>
                <p className="text-sm text-muted-foreground">
                  Contact us to learn about partnership opportunities and sponsorship packages.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Having trouble with the voting platform or need technical assistance?
                </p>
                <p className="text-sm text-muted-foreground">
                  Include "TECH SUPPORT" in your email subject line for faster response.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;