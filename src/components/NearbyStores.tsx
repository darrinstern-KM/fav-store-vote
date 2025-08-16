import { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface Store {
  id: string;
  shopId?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  shopEmail?: string;
  shopOwner?: string;
  shopHours?: string;
  votes: number;
  rating: number;
  testimonials: string[];
  category: string;
  approved: boolean;
}

interface NearbyStoresProps {
  onStoreSelect: (store: Store) => void;
  onStoreClick?: (store: Store) => void;
}

export const NearbyStores = ({ onStoreSelect, onStoreClick }: NearbyStoresProps) => {
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<{ zip?: string; city?: string; state?: string }>({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasRequested, setHasRequested] = useState(false);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Using a free geocoding service - you might want to use Google Maps API for better results
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      return {
        zip: data.postcode,
        city: data.city,
        state: data.principalSubdivision
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  };

  const fetchNearbyStores = async (zipCode: string) => {
    if (!zipCode) return;
    
    setIsLoadingStores(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('approved', true)
        .eq('shop_zip', zipCode)
        .limit(6);

      if (error) throw error;

      const stores: Store[] = (data || []).map(store => ({
        id: store.id,
        shopId: store.shop_id ?? undefined,
        name: store.shop_name || 'Unknown Store',
        address: store.shop_addr_1 || store.shop_addr_1_m || '',
        city: store.shop_city || store.shop_city_m || '',
        state: store.shop_state || store.shop_state_m || '',
        zipCode: store.shop_zip || store.shop_zip_m || '',
        shopEmail: store.shop_email ?? undefined,
        shopOwner: store.shop_owner ?? undefined,
        shopHours: store.shop_hours ?? undefined,
        votes: store.votes_count || 0,
        rating: Number(store.rating || 0),
        testimonials: [],
        category: store.shop_mdse || 'Retail',
        approved: store.approved ?? false
      }));

      setNearbyStores(stores);
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const requestLocation = () => {
    setHasRequested(true);
    setIsLoadingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          
          if (locationData) {
            setUserLocation(locationData);
            await fetchNearbyStores(locationData.zip);
          } else {
            setError('Could not determine your ZIP code from location');
          }
        } catch (error) {
          setError('Failed to process your location');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };

  if (!hasRequested) {
    return (
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground font-playfair">Stores Near You</h2>
              <p className="text-lg text-muted-foreground">
                Discover craft retailers in your area
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={requestLocation}
                disabled={isLoadingLocation}
                className="bg-gradient-vote text-white px-8 py-3 text-lg"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Find Stores Near Me
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We'll use your device's location to show craft stores in your ZIP code area
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground font-playfair mb-3">Stores Near You</h2>
          {userLocation.city && userLocation.state && (
            <div className="flex items-center justify-center gap-1 text-lg text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{userLocation.city}, {userLocation.state} {userLocation.zip}</span>
            </div>
          )}
        </div>

        {error && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingStores && (
          <div className="text-center text-muted-foreground">
            <p>Finding stores in your area...</p>
          </div>
        )}

        {nearbyStores.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nearbyStores.map((store) => (
              <Card key={store.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle 
                        className="text-lg cursor-pointer hover:underline line-clamp-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStoreClick?.(store);
                        }}
                      >
                        {store.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{store.address}</span>
                      </div>
                      <Badge variant="outline" className="text-xs mt-2 w-fit">
                        {store.category}
                      </Badge>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-xl font-bold text-vote-primary">
                        {store.votes}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        votes
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(store.rating)
                              ? 'fill-winner-gold text-winner-gold'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">
                        {store.rating.toFixed(1)}
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-gradient-vote"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStoreSelect(store);
                      }}
                    >
                      Vote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {nearbyStores.length === 0 && !isLoadingStores && !error && hasRequested && (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No stores found in your ZIP code area yet.</p>
            <p className="text-sm text-muted-foreground">
              Help grow our directory by adding stores in your area!
            </p>
          </div>
        )}

        {!isLoadingLocation && hasRequested && (
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={requestLocation}
              disabled={isLoadingLocation}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Update Location
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};