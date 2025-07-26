import { useState } from 'react';
import { SearchIcon, Trophy, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StoreSearch } from './StoreSearch';
import { VoteModal } from './VoteModal';
import { AddStoreModal } from './AddStoreModal';

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
}

const VoteApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);

  // Mock data for demonstration
  const topStores: Store[] = [
    {
      id: '1',
      name: 'Downtown Electronics',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      votes: 1247,
      rating: 4.8,
      testimonials: ['Amazing service!', 'Best prices in town']
    },
    {
      id: '2',
      name: 'Fashion Forward',
      address: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      votes: 1156,
      rating: 4.7,
      testimonials: ['Great selection', 'Friendly staff']
    },
    {
      id: '3',
      name: 'Corner Pharmacy',
      address: '789 Pine St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703',
      votes: 1089,
      rating: 4.9,
      testimonials: ['Always helpful', 'Quick service']
    }
  ];

  const contestEndDate = new Date('2024-08-15');
  const timeLeft = Math.max(0, Math.ceil((contestEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleVote = (store: Store) => {
    setSelectedStore(store);
    setShowVoteModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <Trophy className="mx-auto mb-6 h-16 w-16 text-winner-gold" />
          <h1 className="mb-4 text-5xl font-bold">Vote for Your Favorite Store</h1>
          <p className="mb-8 text-xl opacity-90">
            Help us discover the best retail stores in your community. Vote now and share your experience!
          </p>
          
          {/* Contest Timer */}
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 backdrop-blur-sm">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Contest ends in {timeLeft} days</span>
          </div>

          {/* Search Section */}
          <div className="mx-auto max-w-2xl">
            <StoreSearch 
              onStoreSelect={(store) => handleVote(store)}
              onAddNewStore={() => setShowAddStoreModal(true)}
            />
          </div>
        </div>
      </section>

      {/* Current Leaders */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Current Leaders</h2>
            <p className="text-xl text-muted-foreground">
              These stores are leading the vote count in their communities
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topStores.map((store, index) => (
              <Card 
                key={store.id} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-vote ${
                  index === 0 ? 'animate-winner-glow border-winner-gold bg-gradient-winner' : ''
                }`}
                onClick={() => handleVote(store)}
              >
                <CardHeader className="relative">
                  {index === 0 && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-winner-gold text-winner-gold-foreground">
                      👑 Leading
                    </Badge>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className={`text-xl ${index === 0 ? 'text-white' : ''}`}>
                        {store.name}
                      </CardTitle>
                      <div className={`flex items-center gap-1 text-sm ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                        <MapPin className="h-4 w-4" />
                        {store.city}, {store.state}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${index === 0 ? 'text-white' : 'text-vote-primary'}`}>
                        {store.votes}
                      </div>
                      <div className={`text-sm ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                        votes
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(store.rating)
                              ? 'fill-winner-gold text-winner-gold'
                              : index === 0 ? 'text-white/40' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${index === 0 ? 'text-white' : ''}`}>
                      {store.rating}
                    </span>
                  </div>
                  <Button 
                    className={`w-full transition-all group-hover:animate-vote-pulse ${
                      index === 0 
                        ? 'bg-white text-winner-gold hover:bg-white/90' 
                        : 'bg-gradient-vote hover:shadow-vote'
                    }`}
                  >
                    Vote Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-secondary py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-4xl font-bold text-foreground">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-vote text-white">
                <SearchIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">1. Search</h3>
              <p className="text-muted-foreground">
                Find your favorite store by searching ZIP code, city, or store name
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-vote text-white">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">2. Vote</h3>
              <p className="text-muted-foreground">
                Cast your vote and share a testimonial about your experience
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-winner text-white">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">3. Win</h3>
              <p className="text-muted-foreground">
                Top stores get recognition and marketing opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <VoteModal
        store={selectedStore}
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
      />
      
      <AddStoreModal
        isOpen={showAddStoreModal}
        onClose={() => setShowAddStoreModal(false)}
      />
    </div>
  );
};

export default VoteApp;