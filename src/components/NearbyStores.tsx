import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, TrendingUp, Zap, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { formatMerchandise } from '@/lib/utils';
import { calculateDistance, geocodeAddress } from '@/lib/distance';
import { useState, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  votes: number;
  rating: number;
  category: string;
}

interface NearbyStoresProps {
  onVoteClick: (store: Store) => void;
  userZipCode?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

export const NearbyStores = ({ onVoteClick, userZipCode, userLocation }: NearbyStoresProps) => {
  const onStoreSelect = onVoteClick;
  const onStoreClick = onVoteClick;
  const [sortedStores, setSortedStores] = useState<Store[]>([]);
  
  // Reverse geocode user location to get state for better filtering
  const [userState, setUserState] = useState<string | null>(null);
  
  useEffect(() => {
    if (userLocation) {
      // Reverse geocode to get state
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.latitude}&lon=${userLocation.longitude}`,
        { headers: { 'User-Agent': 'CraftRetailChampions/1.0' } }
      )
        .then(res => res.json())
        .then(data => {
          if (data.address?.state) {
            setUserState(data.address.state);
          }
        })
        .catch(console.error);
    }
  }, [userLocation]);

  const { data: topStores = [], isLoading } = useQuery({
    queryKey: ['nearbyStores', userState],
    queryFn: async () => {
      let query = supabase
        .from('stores_public')
        .select('ShopID, shop_name, shop_addr_1, shop_addr_2, shop_city, shop_state, shop_zip, shop_website, shop_hours, shop_mdse, approved, votes_count, rating, created_at, updated_at');

      // If we have the user's state, fetch stores from that state first
      if (userState) {
        query = query.ilike('shop_state', `%${userState}%`);
      }
      
      const { data, error } = await query
        .order('votes_count', { ascending: false })
        .limit(100); // Fetch more stores for better distance sorting

      if (error) throw error;

      return (data || []).map((row: any) => ({
        id: row.ShopID,
        name: row.shop_name ?? 'Unknown Store',
        address: row.shop_addr_1 ?? '',
        city: row.shop_city ?? '',
        state: row.shop_state ?? '',
        zipCode: row.shop_zip ?? '',
        votes: row.votes_count ?? 0,
        rating: Number(row.rating ?? 0),
        category: formatMerchandise(row.shop_mdse),
      }));
    },
  });

  // Sort stores by distance when user location is available
  useEffect(() => {
    if (!topStores || topStores.length === 0) {
      setSortedStores([]);
      return;
    }

    if (!userLocation) {
      setSortedStores(topStores.slice(0, 6));
      return;
    }

    const sortByDistance = async () => {
      const storesWithDistance = await Promise.all(
        topStores.map(async (store) => {
          const coords = await geocodeAddress(
            store.city || '',
            store.state || '',
            store.zipCode || ''
          );
          
          if (coords) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              coords.lat,
              coords.lng
            );
            return { ...store, distance };
          }
          return { ...store, distance: Infinity };
        })
      );

      const sorted = storesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6);
      
      setSortedStores(sorted);
    };

    sortByDistance();
  }, [topStores, userLocation]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-card backdrop-blur-sm border-border">
            <CardHeader className="h-32"></CardHeader>
            <CardContent className="h-20"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Navigation className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {userLocation ? 'Stores Near You' : 'Trending Stores'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userLocation ? 'Based on your location' : 'Vote for your favorites!'}
            </p>
          </div>
        </div>
        <Badge className="bg-secondary text-secondary-foreground border-border">
          <TrendingUp className="h-3 w-3 mr-1" />
          Top 6
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedStores.map((store, index) => (
          <Card 
            key={store.id}
            className="group bg-card backdrop-blur-lg border border-border hover:bg-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
            onClick={() => onStoreClick(store)}
          >
            {index < 3 && (
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-slate-900">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
              </div>
            )}

            <CardHeader className="relative pb-3">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-vote-primary transition-colors pr-8">
                {store.name}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {store.city}, {store.state}
              </div>
              <Badge variant="secondary" className="text-xs mt-2 w-fit">
                {store.category}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-foreground">{store.rating.toFixed(1)}</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {store.votes.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">votes</div>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStoreSelect(store);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                <Zap className="h-4 w-4 mr-2" />
                Vote Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-foreground mb-3">
          Want to see more stores in your area?
        </p>
        <Button
          variant="outline"
          className="border-2 transition-all duration-300"
          onClick={() => {
            const searchSection = document.querySelector('[data-search-section]');
            searchSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Search All Stores
        </Button>
      </div>
    </div>
  );
};
