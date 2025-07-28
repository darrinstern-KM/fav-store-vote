import { useState } from 'react';
import { Search, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface StoreSearchProps {
  onStoreSelect: (store: Store) => void;
  onAddNewStore: () => void;
  onStoreClick?: (store: Store) => void;
}

export const StoreSearch = ({ onStoreSelect, onAddNewStore, onStoreClick }: StoreSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults: Store[] = [
        {
          id: '1',
          name: 'Target',
          address: '123 Commerce Blvd',
          city: 'Springfield',
          state: 'IL',
          zipCode: searchTerm,
          votes: 245,
          rating: 4.2,
          testimonials: [],
          category: 'Retail',
          approved: true
        },
        {
          id: '2',
          name: 'Best Buy',
          address: '456 Electronics Way',
          city: 'Springfield',
          state: 'IL',
          zipCode: searchTerm,
          votes: 187,
          rating: 4.1,
          testimonials: [],
          category: 'Electronics',
          approved: true
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
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
            className="pl-10 py-6 text-lg bg-white/90 backdrop-blur-sm border-white/20"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="px-8 py-6 bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm"
        >
          {isSearching ? 'Searching...' : 'Search'}
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

      {/* No search yet message */}
      {searchResults.length === 0 && !isSearching && (
        <div className="text-center text-white/80">
          <p>Enter a ZIP code, city, or store name to find stores in your area</p>
        </div>
      )}
    </div>
  );
};