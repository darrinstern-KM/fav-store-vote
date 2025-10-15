import { Check, X, Store, Users, MessageSquare, Upload, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ExcelImport } from './ExcelImport';
import { SponsorManagement } from './SponsorManagement';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PendingStore {
  ShopID: string;
  shop_name: string;
  shop_addr_1: string | null;
  shop_city: string | null;
  shop_state: string | null;
  shop_zip: string | null;
  shop_mdse: string | null;
  created_at: string;
}

interface VoteData {
  id: string;
  rating: number;
  comment: string | null;
  voting_method: string | null;
  created_at: string;
  voter_email: string | null;
  voter_phone: string | null;
  stores: {
    shop_name: string;
  } | null;
}

export const AdminPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending stores (unapproved)
  const { data: pendingStores = [], isLoading: isLoadingStores } = useQuery({
    queryKey: ['pendingStores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PendingStore[];
    }
  });

  // Fetch recent votes (admin only - RLS enforced)
  const { data: recentVotes = [], isLoading: isLoadingVotes } = useQuery({
    queryKey: ['recentVotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('votes')
        .select(`
          id,
          rating,
          comment,
          voting_method,
          created_at,
          voter_email,
          voter_phone,
          stores!inner(shop_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as VoteData[];
    }
  });

  // Mutation for approving/rejecting stores
  const approvalMutation = useMutation({
    mutationFn: async ({ storeId, approved }: { storeId: string; approved: boolean }) => {
      const { error } = await supabase
        .from('stores')
        .update({ approved })
        .eq('ShopID', storeId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pendingStores'] });
      toast({
        title: variables.approved ? 'Store Approved' : 'Store Rejected',
        description: variables.approved 
          ? 'The store has been approved and is now available for voting.'
          : 'The store submission has been rejected.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
        variant: 'destructive'
      });
      console.error('Approval error:', error);
    }
  });

  const handleStoreApproval = (storeId: string, approved: boolean) => {
    approvalMutation.mutate({ storeId, approved });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'sms': return '📱';
      case 'whatsapp': return '💬';
      case 'instagram': return '📷';
      case 'twitter': return '🐦';
      default: return '🌐';
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage store approvals and monitor voting activity</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            <Store className="h-4 w-4 mr-2" />
            Pending Stores ({pendingStores.length})
          </TabsTrigger>
          <TabsTrigger value="sponsors">
            <Award className="h-4 w-4 mr-2" />
            Sponsors
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Excel Import
          </TabsTrigger>
          <TabsTrigger value="votes">
            <Users className="h-4 w-4 mr-2" />
            Recent Votes ({recentVotes.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <MessageSquare className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {isLoadingStores ? (
            <p className="text-center text-muted-foreground py-8">Loading pending stores...</p>
          ) : pendingStores.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending stores to review</p>
          ) : (
            <div className="grid gap-4">
              {pendingStores.map((store) => (
                <Card key={store.ShopID}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{store.shop_name}</CardTitle>
                        <p className="text-muted-foreground">
                          {store.shop_addr_1}, {store.shop_city}, {store.shop_state} {store.shop_zip}
                        </p>
                        {store.shop_mdse && (
                          <Badge variant="secondary" className="mt-2">
                            {store.shop_mdse}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStoreApproval(store.ShopID, true)}
                          disabled={approvalMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStoreApproval(store.ShopID, false)}
                          disabled={approvalMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Submitted: {new Date(store.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sponsors">
          <SponsorManagement />
        </TabsContent>

        <TabsContent value="import">
          <ExcelImport />
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          {isLoadingVotes ? (
            <p className="text-center text-muted-foreground py-8">Loading recent votes...</p>
          ) : recentVotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No votes yet</p>
          ) : (
            <div className="grid gap-4">
              {recentVotes.map((vote) => (
                <Card key={vote.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{vote.stores?.shop_name || 'Unknown Store'}</span>
                          <Badge variant="outline" className="text-xs">
                            {getPlatformIcon(vote.voting_method || 'web')} {vote.voting_method || 'web'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Rating: {vote.rating}/5
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Voter: {vote.voter_email || vote.voter_phone || 'Anonymous'}
                        </p>
                        {vote.comment && (
                          <p className="text-sm bg-muted p-2 rounded italic">
                            "{vote.comment}"
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(vote.created_at).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,492</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Web Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,856</div>
                <p className="text-xs text-muted-foreground">53% of total votes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">SMS Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">982</div>
                <p className="text-xs text-muted-foreground">28% of total votes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">654</div>
                <p className="text-xs text-muted-foreground">19% of total votes</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};