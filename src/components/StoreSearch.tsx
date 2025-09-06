import { useState } from 'react';
import { Search, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { formatMerchandise } from '@/lib/utils';

interface Store {
  id: string;
  shopId?: string; // Internal use only - not displayed
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  shopEmail?: string; // Display on profile
  shopOwner?: string; // Internal use only - not displayed
  shopHours?: string; // Display on profile
  votes: number;
  rating: number;
  testimonials: string[];
  category: string;
  approved: boolean;
}

interface StoreSearchProps {
  onStoreSelect: (store: Store) => void;
  onAddNewStore: () => void;
  onStoreClick?: (store: Store) => void;
}

export const StoreSearch = ({ onStoreSelect, onAddNewStore, onStoreClick }: StoreSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) return;
    
    setIsSearching(true);
    try {
      let query = supabase
        .from('stores')
        .select('*')
        .eq('approved', true);

      // Check if search term is a 5-digit zip code for exact matching
      const isZipCode = /^\d{5}$/.test(term);
      
      if (isZipCode) {
        // Exact match for ZIP codes
        query = query.eq('shop_zip', term);
      } else {
        // Use text search for other terms
        query = query.or(`shop_name.ilike.%${term}%,shop_city.ilike.%${term}%,shop_state.ilike.%${term}%,shop_zip.ilike.%${term}%`);
      }

      const { data, error } = await query.limit(25);

      if (error) throw error;

      const results = (data ?? []).map((row: any): Store => ({
        id: row.id,
        shopId: row.shop_id ?? undefined,
        name: row.shop_name ?? 'Unknown Store',
        address: row.shop_addr_1 ?? row.shop_addr_1_m ?? '',
        city: row.shop_city ?? row.shop_city_m ?? '',
        state: row.shop_state ?? row.shop_state_m ?? '',
        zipCode: row.shop_zip ?? row.shop_zip_m ?? '',
        shopEmail: row.shop_email ?? undefined,
        shopOwner: row.shop_owner ?? undefined,
        shopHours: row.shop_hours ?? undefined,
        votes: row.votes_count ?? 0,
        rating: Number(row.rating ?? 0),
        testimonials: [],
        category: formatMerchandise(row.shop_mdse),
        approved: row.approved ?? false,
      }));

      setSearchResults(results);
    } catch (e) {
      console.error('Search error', e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Enter ZIP code, city, or store name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 py-6 text-lg text-foreground bg-white/90 backdrop-blur-sm border-white/20"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="px-8 py-6 bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm"
        >
          {isSearching ? 'Searching…' : 'Search'}
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Found Stores:</h3>
          {searchResults.map((store) => (
            <Card key={store.id} className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 
                      className="font-semibold text-lg cursor-pointer hover:underline"
                      onClick={() => onStoreClick?.(store)}
                    >
                      {store.name}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {store.address}, {store.city}, {store.state} {store.zipCode}
                    </div>
                    <div className="text-sm text-vote-primary font-medium mt-1">
                      {store.votes} votes
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-vote"
                    onClick={() => onStoreSelect(store)}
                  >
                    Vote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Store Option */}
          <Card className="bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all cursor-pointer border-dashed border-2" onClick={onAddNewStore}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Plus className="h-5 w-5" />
                <span>Don't see your store? Add it here</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state messages */}
      {searchResults.length === 0 && !isSearching && searchTerm && (
        <div className="text-center text-white/80 space-y-4">
          <p>No stores found matching "{searchTerm}"</p>
          <Card className="bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all cursor-pointer border-dashed border-2 mx-auto max-w-md" onClick={onAddNewStore}>
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Plus className="h-5 w-5" />
                <span>Add this store to the directory</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No search yet message */}
      {searchResults.length === 0 && !isSearching && !searchTerm && (
        <div className="text-center text-white/80">
          <p>Enter a ZIP code, city, or store name to find stores in your area</p>
        </div>
      )}
    </div>
  );
};