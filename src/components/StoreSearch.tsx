import { useState, useEffect } from 'react';
import { Search, MapPin, Plus, Loader2, Store, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
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

interface StoreSearchProps {
  onStoreSelect: (store: Store) => void;
  onAddNewStore: () => void;
  onStoreClick: (store: Store) => void;
}

export const StoreSearch = ({ onStoreSelect, onAddNewStore, onStoreClick }: StoreSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['storeSearch', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('approved', true)
        .or(`shop_name.ilike.%${debouncedSearch}%,shop_city.ilike.%${debouncedSearch}%,shop_state.ilike.%${debouncedSearch}%,shop_zip.ilike.%${debouncedSearch}%`)
        .order('votes_count', { ascending: false })
        .limit(10);

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
    enabled: debouncedSearch.length >= 2,
  });

  return (
    <div className="relative w-full">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by store name, city, or ZIP code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="pl-12 pr-4 py-6 text-lg bg-white border-2 border-slate-200 focus:border-blue-500 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300"
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
          )}
        </div>

        {!searchTerm && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            <span className="text-xs text-white/70">Try searching:</span>
            {['Chicago', 'New York', '60062', 'Michaels'].map((hint) => (
              <button
                key={hint}
                onClick={() => setSearchTerm(hint)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs text-white font-medium transition-all duration-200 hover:scale-105"
              >
                {hint}
              </button>
            ))}
          </div>
        )}
      </div>

      {searchTerm.length >= 2 && (searchResults.length > 0 || !isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2">
          {searchResults.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Found {searchResults.length} store{searchResults.length !== 1 ? 's' : ''}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Sorted by votes
                  </Badge>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {searchResults.map((store, index) => (
                  <div
                    key={store.id}
                    className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group"
                    onClick={() => onStoreSelect(store)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {index < 3 && (
                            <span className="text-xs font-bold">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                          <h4 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {store.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {store.city}, {store.state} {store.zipCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {store.category}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            ⭐ {store.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {store.votes}
                        </div>
                        <div className="text-xs text-slate-500">votes</div>
                        <Button
                          size="sm"
                          className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs px-3 py-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStoreSelect(store);
                          }}
                        >
                          Vote Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 bg-slate-50 p-4">
                <button
                  onClick={onAddNewStore}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-2 px-4 rounded-lg hover:bg-white"
                >
                  <Plus className="h-4 w-4" />
                  Don't see your store? Add it here
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Store className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-2">No stores found</p>
              <p className="text-sm text-slate-500 mb-4">
                Try a different search term or add your store
              </p>
              <Button
                onClick={onAddNewStore}
                variant="outline"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your Store
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
