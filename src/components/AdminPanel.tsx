import { useState } from 'react';
import { Check, X, Store, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface PendingStore {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  submittedBy: string;
  submittedAt: string;
}

interface VoteData {
  id: string;
  storeName: string;
  voterEmail: string;
  platform: 'web' | 'sms' | 'whatsapp' | 'instagram' | 'twitter';
  comment?: string;
  timestamp: string;
}

export const AdminPanel = () => {
  const { toast } = useToast();
  const [pendingStores] = useState<PendingStore[]>([
    {
      id: '1',
      name: 'New Coffee Shop',
      address: '123 New St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      category: 'Food & Beverage',
      submittedBy: 'user@example.com',
      submittedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Tech Repair Plus',
      address: '456 Tech Ave',
      city: 'Springfield', 
      state: 'IL',
      zipCode: '62702',
      category: 'Electronics',
      submittedBy: 'admin@example.com',
      submittedAt: '2024-01-14T15:45:00Z'
    }
  ]);

  const [recentVotes] = useState<VoteData[]>([
    {
      id: '1',
      storeName: 'Downtown Electronics',
      voterEmail: 'voter1@example.com',
      platform: 'web',
      comment: 'Great service and prices!',
      timestamp: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      storeName: 'Fashion Forward',
      voterEmail: '+1234567890',
      platform: 'sms',
      comment: 'Love their new collection',
      timestamp: '2024-01-15T14:25:00Z'
    },
    {
      id: '3',
      storeName: 'Corner Pharmacy',
      voterEmail: '@user_instagram',
      platform: 'instagram',
      timestamp: '2024-01-15T14:20:00Z'
    }
  ]);

  const handleStoreApproval = (storeId: string, approved: boolean) => {
    toast({
      title: approved ? 'Store Approved' : 'Store Rejected',
      description: approved 
        ? 'The store has been approved and is now available for voting.'
        : 'The store submission has been rejected.',
    });
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
          <div className="grid gap-4">
            {pendingStores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{store.name}</CardTitle>
                      <p className="text-muted-foreground">
                        {store.address}, {store.city}, {store.state} {store.zipCode}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {store.category}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStoreApproval(store.id, true)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStoreApproval(store.id, false)}
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
                    <p>Submitted by: {store.submittedBy}</p>
                    <p>Date: {new Date(store.submittedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          <div className="grid gap-4">
            {recentVotes.map((vote) => (
              <Card key={vote.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{vote.storeName}</span>
                        <Badge variant="outline" className="text-xs">
                          {getPlatformIcon(vote.platform)} {vote.platform}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Voter: {vote.voterEmail}
                      </p>
                      {vote.comment && (
                        <p className="text-sm bg-muted p-2 rounded italic">
                          "{vote.comment}"
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(vote.timestamp).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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