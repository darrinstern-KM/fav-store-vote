import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from './Header';
import { StoreSearch } from './StoreSearch';
import { NearbyStores } from './NearbyStores';
import { Footer } from './Footer';
import { AdminPanel } from './AdminPanel';
import { VoteModal } from './VoteModal';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Store {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface User {
  email: string;
  zipCode: string;
  isAdmin?: boolean;
}

export const VoteApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const userLocation = useGeolocation();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, zip_code')
          .eq('id', session.user.id)
          .single();

        // Check if user is admin
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (profile) {
          setUser({
            email: profile.email || session.user.email || '',
            zipCode: profile.zip_code || '',
            isAdmin: !!roleData
          });
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, zip_code')
          .eq('id', session.user.id)
          .single();

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (profile) {
          setUser({
            email: profile.email || session.user.email || '',
            zipCode: profile.zip_code || '',
            isAdmin: !!roleData
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleVoteClick = (store: Store) => {
    setSelectedStore(store);
    setIsVoteModalOpen(true);
  };

  // Show admin panel if user is admin (UI-only check - actual security enforced by RLS)
  if (user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header user={user} onLogout={handleLogout} onAuthSuccess={handleAuthSuccess} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <AdminPanel />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header user={user} onLogout={handleLogout} onAuthSuccess={handleAuthSuccess} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Vote for Your Favorite Craft & Retail Stores
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Support local businesses and enter to win amazing prizes! Every vote counts toward the $500 grand prize draw.
            </p>
          </div>

          <StoreSearch onVoteClick={handleVoteClick} />
          <NearbyStores 
            onVoteClick={handleVoteClick} 
            userZipCode={user?.zipCode}
            userLocation={userLocation.latitude && userLocation.longitude ? {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            } : null}
          />
        </div>
      </main>

      <Footer />

      <VoteModal
        store={selectedStore}
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        user={user}
      />
    </div>
  );
};
