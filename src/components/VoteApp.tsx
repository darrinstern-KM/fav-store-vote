import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon, Trophy, Star, MapPin, Clock } from 'lucide-react';
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
import { NearbyStores } from './NearbyStores';
import { Header } from './Header';
import { useToast } from '@/hooks/use-toast';
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

interface User {
  email: string;
  zipCode: string;
  isAdmin?: boolean;
}

const VoteApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showStoreDetailsModal, setShowStoreDetailsModal] = useState(false);
  const [selectedStoreForDetails, setSelectedStoreForDetails] = useState<Store | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedState, setSelectedState] = useState('all');
  const [activeTab, setActiveTab] = useState('national');
  const { toast } = useToast();

  // Load approved stores from Supabase - excluding sensitive business owner info
  const mapRowToStore = (row: any): Store => ({
    id: row.ShopID,
    shopId: row.ShopID ?? undefined,
    name: row.shop_name ?? 'Unknown Store',
    address: row.shop_addr_1 ?? row.shop_addr_1_m ?? '',
    city: row.shop_city ?? row.shop_city_m ?? '',
    state: row.shop_state ?? row.shop_state_m ?? '',
    zipCode: row.shop_zip ?? row.shop_zip_m ?? '',
    shopEmail: undefined, // Hidden for security
    shopOwner: undefined, // Hidden for security
    shopHours: row.shop_hours ?? undefined,
    votes: row.votes_count ?? 0,
    rating: Number(row.rating ?? 0),
    testimonials: [],
    category: formatMerchandise(row.shop_mdse),
    approved: row.approved ?? false,
  });

  const { data: stores = [], isLoading: isStoresLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      // Only select non-sensitive fields for public display
      const { data, error } = await supabase
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
      toast({
        title: "Please log in to vote",
        description: "You need to be logged in to vote for stores.",
      });
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
      <Header user={user} onLogout={handleLogout} onAuthSuccess={handleAuthSuccess} />

      {/* Hero Section with Background Image */}
      <section 
        className="relative py-24 px-4 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('/src/assets/hero-craft-retail.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto max-w-5xl relative z-10">
          <Trophy className="mx-auto mb-8 h-20 w-20 text-winner-gold animate-pulse" />
          <h1 className="mb-6 text-6xl md:text-7xl font-bold font-playfair leading-tight">
            Craft Retail Champions
          </h1>
          <p className="mb-4 text-2xl font-playfair font-medium">Vote for the Best in Craft Retail!</p>
          <p className="mb-12 text-xl max-w-4xl mx-auto leading-relaxed">
            Craft Your Passion, Celebrate Creativity! Cast your vote for the craft stores that inspire and supply our community. 
            From local gems to online favorites, your vote helps crown the 2025 Craft Retail Champions. 
            Join thousands of crafters, share your favorites, and discover top shops!
          </p>

          {/* Contest Timer and Share */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/20 px-8 py-4 backdrop-blur-sm text-lg font-semibold">
              <Clock className="h-6 w-6" />
              <span>Contest ends in {timeLeft} days</span>
            </div>
            <ShareButton 
              title="Craft Retail Champions – Vote Now"
              url={window.location.href}
              description="Celebrate top craft retailers nationwide. Cast your vote in the Craft Retail Champions!"
              variant="ghost"
            />
          </div>

          {/* Search Section */}
          <div className="mx-auto max-w-2xl bg-white/10 backdrop-blur-sm rounded-2xl p-8" data-search-section>
            <StoreSearch 
              onStoreSelect={(store) => handleVote(store)}
              onAddNewStore={() => {
                if (!user) {
                  toast({
                    title: "Please log in to add stores",
                    description: "You need to be logged in to add new stores.",
                  });
                }
              }}
              onStoreClick={handleStoreClick}
            />
          </div>
        </div>
      </section>

      {/* Sponsor Branding - moved below hero */}
      <section className="py-12 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg font-semibold mb-8 text-foreground">Craft Retail Champions is owned and managed by:</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/3bd255e3-a72d-40f7-8ed5-1247212390a5.png" alt="h+h americas" className="h-16 w-auto" />
            </div>
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/d80dca82-3afa-455c-a057-33f1f6967df0.png" alt="Fiber+Fabric Craft Festival" className="h-16 w-auto" />
            </div>
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/3bd255e3-a72d-40f7-8ed5-1247212390a5.png" alt="Koelnmesse" className="h-16 w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Local Stores Near You */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground font-playfair">
              <MapPin className="inline h-8 w-8 mr-2 text-vote-primary" />
              Local Stores Near You
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Support your local craft retailers! Vote for nearby stores or help us grow our directory.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button 
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Please log in to add stores",
                      description: "You need to be logged in to add new stores.",
                    });
                  }
                }}
                variant="outline"
                className="bg-white/80 hover:bg-white"
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Add Missing Store
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't see your favorite local store? Help us add it!
              </p>
            </div>
          </div>
          
          <NearbyStores
            onStoreSelect={(store) => handleVote(store)}
            onStoreClick={handleStoreClick}
          />
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

      {/* Winner Benefits & Voter Lottery */}
      <section className="py-16 px-4 bg-gradient-hero text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold font-playfair">What's At Stake</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Winning stores gain incredible exposure and voters get a chance to win amazing prizes
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Winner Benefits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-winner-gold rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Store Winners Get</h3>
              </div>
              <div className="space-y-4 text-lg">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-winner-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Featured promotion across our trade show network</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-winner-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Marketing materials and press release templates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-winner-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Champion badge and certificate for display</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-winner-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Social media spotlight and community recognition</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-winner-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Exclusive winner networking opportunities</p>
                </div>
              </div>
            </div>

            {/* Voter Lottery */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-vote-primary rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Voters Enter to Win</h3>
              </div>
              <div className="space-y-4 text-lg">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-vote-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>$500 craft store shopping spree (Grand Prize)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-vote-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Exclusive craft supply bundles from sponsors</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-vote-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Free trade show passes and workshop access</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-vote-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <p>Premium crafting tools and equipment</p>
                </div>
                <div className="bg-winner-gold/20 rounded-lg p-4 mt-6">
                  <p className="text-sm font-semibold">
                    🎲 Every vote = 1 lottery entry. More votes = better chances!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg opacity-90 mb-6">
              Ready to make a difference in the craft retail community?
            </p>
            <Button 
              size="lg" 
              className="bg-white text-vote-primary hover:bg-white/90 text-lg px-8 py-3"
              onClick={() => {
                const searchSection = document.querySelector('[data-search-section]');
                searchSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Voting Now
            </Button>
          </div>
        </div>
      </section>

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