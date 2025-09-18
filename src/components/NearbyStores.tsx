import { useState, useEffect } from 'react';
import { MapPin, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatMerchandise } from '@/lib/utils';

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
  const [isLoading, setIsLoading] = useState(true);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      // Check if user is in US or Canada for this year's competition
      const allowedCountries = ['United States of America', 'Canada'];
      const userCountry = data.countryName;
      
      if (!allowedCountries.includes(userCountry)) {
        console.log(`Competition currently limited to US and Canada. User location: ${userCountry}`);
        return null; // Will fall back to national top stores
      }
      
      return {
        zip: data.postcode,
        city: data.city,
        state: data.principalSubdivision,
        country: userCountry
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  };

  const fetchTopStores = async (zipCode?: string) => {
    try {
      // Only select non-sensitive fields for public display
      let query = supabase
        .from('stores')
        .select(`
          "ShopID",
          shop_name,
          shop_addr_1,
          shop_addr_2,
          shop_city,
          shop_state,
          shop_zip,
          shop_addr_1_m,
          shop_addr_2_m,
          shop_city_m,
          shop_state_m,
          shop_zip_m,
          shop_hours,
          shop_mdse,
          shop_website,
          votes_count,
          rating,
          approved,
          created_at,
          updated_at
        `)
        .eq('approved', true)
        .order('votes_count', { ascending: false });

      if (zipCode) {
        // Try exact ZIP first
        let { data } = await query.eq('shop_zip', zipCode).limit(10);
        
        // If not enough results, try ZIP prefix (first 3 digits) for broader area
        if ((data || []).length < 6 && zipCode.length === 5) {
          const zipPrefix = zipCode.substring(0, 3);
          const { data: expandedData } = await supabase
            .from('stores')
            .select(`
              "ShopID",
              shop_name,
              shop_addr_1,
              shop_addr_2,
              shop_city,
              shop_state,
              shop_zip,
              shop_addr_1_m,
              shop_addr_2_m,
              shop_city_m,
              shop_state_m,
              shop_zip_m,
              shop_hours,
              shop_mdse,
              shop_website,
              votes_count,
              rating,
              approved,
              created_at,
              updated_at
            `)
            .eq('approved', true)
            .ilike('shop_zip', `${zipPrefix}%`)
            .order('votes_count', { ascending: false })
            .limit(10);
          data = expandedData;
        }
        
        if ((data || []).length > 0) {
          return data.slice(0, 8); // Show top 8 in area
        }
      }
      
      // Fallback to national top stores
      const { data } = await query.limit(8);
      return data || [];
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadStores = async () => {
      setIsLoading(true);
      
      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const locationData = await reverseGeocode(latitude, longitude);
              
              if (locationData && locationData.zip) {
                setUserLocation(locationData);
                const stores = await fetchTopStores(locationData.zip);
                const formattedStores = formatStores(stores);
                setNearbyStores(formattedStores);
              } else {
                // Fallback to national top stores
                const stores = await fetchTopStores();
                setNearbyStores(formatStores(stores));
              }
            } catch (error) {
              console.error('Location processing failed:', error);
              const stores = await fetchTopStores();
              setNearbyStores(formatStores(stores));
            } finally {
              setIsLoading(false);
            }
          },
          async () => {
            // Location denied or failed - show national top stores
            const stores = await fetchTopStores();
            setNearbyStores(formatStores(stores));
            setIsLoading(false);
          },
          { enableHighAccuracy: false, timeout: 3000, maximumAge: 600000 }
        );
      } else {
        // Geolocation not supported - show national top stores
        const stores = await fetchTopStores();
        setNearbyStores(formatStores(stores));
        setIsLoading(false);
      }
    };

    loadStores();
  }, []);

  const formatStores = (data: any[]): Store[] => {
    return data.map(store => ({
      id: store.ShopID,
      shopId: store.ShopID ?? undefined,
      name: store.shop_name || 'Unknown Store',
      address: store.shop_addr_1 || store.shop_addr_1_m || '',
      city: store.shop_city || store.shop_city_m || '',
      state: store.shop_state || store.shop_state_m || '',
      zipCode: store.shop_zip || store.shop_zip_m || '',
      shopEmail: undefined, // Hidden for security
      shopOwner: undefined, // Hidden for security
      shopHours: store.shop_hours ?? undefined,
      votes: store.votes_count || 0,
      rating: Number(store.rating || 0),
      testimonials: [],
      category: formatMerchandise(store.shop_mdse),
      approved: store.approved ?? false
    }));
  };

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-pulse space-y-3">
              <h2 className="text-3xl font-bold text-foreground font-playfair">Top Stores</h2>
              <p className="text-muted-foreground">Loading top-voted craft retailers...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-7 w-7 text-vote-primary" />
            <h2 className="text-3xl font-bold text-foreground font-playfair">
              {userLocation.city ? `Stores Near You - Vote for Your Favorite Today` : 'Top Stores - Vote for Your Favorite Today'}
            </h2>
          </div>
          {userLocation.city && userLocation.state && (
            <div className="flex items-center justify-center gap-1 text-lg text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{userLocation.city}, {userLocation.state} {userLocation.zip}</span>
            </div>
          )}
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {userLocation.city 
              ? 'These are the highest-voted craft retailers in your area'
              : 'Leading craft retailers based on community votes'
            }
          </p>
        </div>

        {nearbyStores.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {nearbyStores.map((store, index) => (
              <Card 
                key={store.id} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  index === 0 ? 'ring-2 ring-vote-primary/20' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle 
                        className="text-base cursor-pointer hover:underline line-clamp-2 leading-tight"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStoreClick?.(store);
                        }}
                      >
                        {store.name}
                      </CardTitle>
                      {index === 0 && (
                        <Badge className="bg-vote-primary/10 text-vote-primary text-xs px-2 py-1">
                          #1
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">{store.city}, {store.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {store.category}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-vote-primary">
                          {store.votes}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          votes
                        </div>
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
                      <span className="text-xs text-muted-foreground ml-1">
                        {store.rating > 0 ? store.rating.toFixed(1) : '—'}
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-gradient-vote text-xs px-3 py-1 h-7"
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

        {nearbyStores.length === 0 && (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No stores found in our directory yet.</p>
            <p className="text-sm text-muted-foreground">
              Help grow our directory by adding stores in your area!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};