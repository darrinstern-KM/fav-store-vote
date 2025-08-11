import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon, Trophy, Star, MapPin, Clock, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StoreSearch } from './StoreSearch';
import { VoteModal } from './VoteModal';
import { AddStoreModal } from './AddStoreModal';
import { AuthModal } from './AuthModal';
import { SMSVotingGuide } from './SMSVotingGuide';
import { AdminPanel } from './AdminPanel';
import { ShareButton } from './ShareButton';
import { StorePromotion } from './StorePromotion';
import { StoreDetailsModal } from './StoreDetailsModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

interface User {
  email: string;
  zipCode: string;
  isAdmin?: boolean;
}

const VoteApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showStoreDetailsModal, setShowStoreDetailsModal] = useState(false);
  const [selectedStoreForDetails, setSelectedStoreForDetails] = useState<Store | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedState, setSelectedState] = useState('all');
  const [activeTab, setActiveTab] = useState('national');
  const { toast } = useToast();

  // Load approved stores from Supabase
  const mapRowToStore = (row: any): Store => ({
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
    category: row.shop_mdse ?? 'Retail',
    approved: row.approved ?? false,
  });

  const { data: stores = [], isLoading: isStoresLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('approved', true)
        .order('votes_count', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRowToStore);
    },
    staleTime: 60_000,
  });

  const states = Array.from(new Set(stores.map(s => s.state).filter(Boolean))).sort();
  
  const getTopStores = () => {
    const list = activeTab === 'state' && selectedState !== 'all'
      ? stores.filter(store => store.state === selectedState)
      : stores;
    return list.slice(0, 10);
  };

  const contestEndDate = new Date('2024-08-15');
  const timeLeft = Math.max(0, Math.ceil((contestEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleVote = (store: Store) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedStore(store);
    setShowVoteModal(true);
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStoreForDetails(store);
    setShowStoreDetailsModal(true);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged out successfully",
    });
  };

  // Show admin panel if user is admin
  if (user?.isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b px-4 py-4">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-vote-primary" />
            <span className="text-xl font-bold font-playfair">Craft Retail Champions</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Login to Vote
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <Trophy className="mx-auto mb-6 h-16 w-16 text-winner-gold" />
          <h1 className="mb-3 text-5xl font-bold font-playfair">Craft Retail Champions</h1>
          <p className="mb-2 text-lg opacity-90 font-playfair">Where Creative & Business Meet</p>
          <p className="mb-6 text-xl opacity-90">Craft Your Passion, Celebrate Creativity! Vote for the shops that power our community.</p>
          
          {/* Sponsor Branding */}
          <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p className="text-sm opacity-80 mb-4">This competition is proudly supported by:</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/3bd255e3-a72d-40f7-8ed5-1247212390a5.png" alt="h+h americas" className="h-12 w-auto" />
              </div>
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/d80dca82-3afa-455c-a057-33f1f6967df0.png" alt="Fiber+Fabric Craft Festival" className="h-12 w-auto" />
              </div>
              <div className="text-white/90 font-semibold text-lg">
                Koelnmesse Inc.
              </div>
            </div>
          </div>
          
          {/* Contest Timer and Share */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 backdrop-blur-sm">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Contest ends in {timeLeft} days</span>
            </div>
            <ShareButton 
              title="Craft Retail Champions – Vote Now"
              url={window.location.href}
              description="Celebrate top craft retailers nationwide. Cast your vote in the Craft Retail Champions!"
              variant="ghost"
            />
          </div>

          {/* Search Section */}
          <div className="mx-auto max-w-2xl">
            <StoreSearch 
              onStoreSelect={(store) => handleVote(store)}
              onAddNewStore={() => user ? setShowAddStoreModal(true) : setShowAuthModal(true)}
              onStoreClick={handleStoreClick}
            />
          </div>
        </div>
      </section>

      {/* Current Leaders */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground font-playfair">Current Leaders</h2>
            <p className="text-xl text-muted-foreground">
              These stores are leading the vote count in their communities
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="national">Top 10 National</TabsTrigger>
              <TabsTrigger value="state">Winners by State</TabsTrigger>
            </TabsList>
            
            <TabsContent value="state" className="mt-6">
              <div className="flex justify-center mb-6">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getTopStores().map((store, index) => (
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
                    <CardTitle 
                      className={`text-xl cursor-pointer hover:underline ${index === 0 ? 'text-white' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStoreClick(store);
                      }}
                    >
                      {store.name}
                    </CardTitle>
                      <div className={`flex items-center gap-1 text-sm ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                        <MapPin className="h-4 w-4" />
                        {store.city}, {store.state}
                      </div>
                      <Badge variant={index === 0 ? "secondary" : "outline"} className={`text-xs mt-1 ${index === 0 ? 'bg-white/20 text-white' : ''}`}>
                        {store.category}
                      </Badge>
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
                  <div className="space-y-2">
                    <Button 
                      className={`w-full transition-all group-hover:animate-vote-pulse ${
                        index === 0 
                          ? 'bg-white text-winner-gold hover:bg-white/90' 
                          : 'bg-gradient-vote hover:shadow-vote'
                      }`}
                    >
                      Vote Now
                    </Button>
            <ShareButton 
              title={`Craft Retail Champions – Vote for ${store.name}`}
              url={`${window.location.origin}?store=${store.id}`}
              description={`Help ${store.name} climb the Craft Retail Champions leaderboard. They have ${store.votes} votes in ${store.city}, ${store.state}.`}
              variant="ghost"
              size="sm"
            />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Promotion Toolkit */}
      <StorePromotion />

      {/* SMS Voting Guide */}
      <SMSVotingGuide />

      {/* How it Works */}
      <section className="bg-secondary py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-4xl font-bold text-foreground font-playfair">How It Works</h2>
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
        user={user}
      />
      
      <AddStoreModal
        isOpen={showAddStoreModal}
        onClose={() => setShowAddStoreModal(false)}
        user={user}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <StoreDetailsModal
        store={selectedStoreForDetails}
        isOpen={showStoreDetailsModal}
        onClose={() => setShowStoreDetailsModal(false)}
        onVote={handleVote}
      />
    </div>
  );
};

export default VoteApp;