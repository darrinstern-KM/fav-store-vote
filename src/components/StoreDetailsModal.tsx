import { MapPin, Star, ExternalLink, Users, MessageSquare, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  votes: number;
  rating: number;
  testimonials: string[];
  category: string;
  approved: boolean;
}

interface StoreDetailsModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (store: Store) => void;
}

export const StoreDetailsModal = ({ store, isOpen, onClose, onVote }: StoreDetailsModalProps) => {
  if (!store) return null;

  const fullAddress = `${store.address}, ${store.city}, ${store.state} ${store.zipCode}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(fullAddress)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{store.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Store Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-vote-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{store.address}</p>
                      <p className="text-muted-foreground">{store.city}, {store.state} {store.zipCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-sm">
                      {store.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-vote-primary" />
                      <span className="font-semibold text-vote-primary">{store.votes}</span>
                      <span className="text-muted-foreground">votes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(store.rating)
                              ? 'fill-winner-gold text-winner-gold'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{store.rating}</span>
                    <span className="text-muted-foreground">rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            {store.testimonials.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-vote-primary" />
                    <h3 className="font-semibold">Customer Testimonials</h3>
                  </div>
                  <div className="space-y-3">
                    {store.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-secondary/50 p-3 rounded-lg">
                        <p className="text-sm italic">"{testimonial}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-vote" 
                size="lg"
                onClick={() => onVote(store)}
              >
                Vote for {store.name}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(googleMapsUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Google Maps
              </Button>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-vote-primary" />
              Store Location
            </h3>
            
            {/* Google Maps Embed - Note: Requires API key */}
            <div className="bg-secondary/20 border rounded-lg p-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Interactive map view requires Google Maps API configuration
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.open(googleMapsUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>

            {/* Store Stats */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Contest Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Votes</span>
                    <span className="font-semibold text-vote-primary">{store.votes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Customer Rating</span>
                    <span className="font-semibold">{store.rating}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Testimonials</span>
                    <span className="font-semibold">{store.testimonials.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={store.approved ? "default" : "secondary"}>
                      {store.approved ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};