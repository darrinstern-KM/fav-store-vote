import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, TrendingUp, Zap, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { formatMerchandise } from '@/lib/utils';

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
}

export const NearbyStores = ({ onVoteClick, userZipCode }: NearbyStoresProps) => {
  const onStoreSelect = onVoteClick;
  const onStoreClick = onVoteClick;
  const { data: topStores = [], isLoading } = useQuery({
    queryKey: ['nearbyStores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('approved', true)
        .order('votes_count', { ascending: false })
        .limit(6);

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

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/10 backdrop-blur-sm border-white/20">
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
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Trending Stores</h3>
            <p className="text-sm text-white/70">Vote for your favorites!</p>
          </div>
        </div>
        <Badge className="bg-white/20 text-white border-white/30">
          <TrendingUp className="h-3 w-3 mr-1" />
          Top 6
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topStores.map((store, index) => (
          <Card 
            key={store.id}
            className="group bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
            onClick={() => onStoreClick(store)}
          >
            {index < 3 && (
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
              </div>
            )}

            <CardHeader className="relative pb-3">
              <CardTitle className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors pr-8">
                {store.name}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-white/70">
                <MapPin className="h-3 w-3" />
                {store.city}, {store.state}
              </div>
              <Badge variant="secondary" className="text-xs mt-2 bg-white/20 text-white border-white/30 w-fit">
                {store.category}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-white">{store.rating.toFixed(1)}</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {store.votes.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/70">votes</div>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStoreSelect(store);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                <Zap className="h-4 w-4 mr-2" />
                Vote Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-white/80 mb-3">
          Want to see more stores in your area?
        </p>
        <Button
          variant="outline"
          className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
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
