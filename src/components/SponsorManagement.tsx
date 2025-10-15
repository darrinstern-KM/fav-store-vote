import { useState } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Sponsor {
  id: string;
  name: string;
  type: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  tier: 'title' | 'presenting' | 'supporting' | 'partner';
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface SponsorFormData {
  name: string;
  type: string;
  description: string;
  website: string;
  logo_url: string;
  tier: 'title' | 'presenting' | 'supporting' | 'partner';
  display_order: number;
  active: boolean;
}

export const SponsorManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState<SponsorFormData>({
    name: '',
    type: '',
    description: '',
    website: '',
    logo_url: '',
    tier: 'supporting',
    display_order: 0,
    active: true,
  });

  // Fetch all sponsors (admins can see all)
  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['sponsors-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Sponsor[];
    }
  });

  // Create/Update sponsor mutation
  const saveMutation = useMutation({
    mutationFn: async (data: SponsorFormData) => {
      if (editingSponsor) {
        const { error } = await supabase
          .from('sponsors')
          .update(data)
          .eq('id', editingSponsor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sponsors')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors-admin'] });
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast({
        title: editingSponsor ? 'Sponsor Updated' : 'Sponsor Added',
        description: editingSponsor 
          ? 'The sponsor has been updated successfully.'
          : 'The new sponsor has been added successfully.',
      });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save sponsor. Please try again.',
        variant: 'destructive'
      });
      console.error('Save error:', error);
    }
  });

  // Delete sponsor mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors-admin'] });
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast({
        title: 'Sponsor Deleted',
        description: 'The sponsor has been removed successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete sponsor. Please try again.',
        variant: 'destructive'
      });
      console.error('Delete error:', error);
    }
  });

  const handleOpenDialog = (sponsor?: Sponsor) => {
    if (sponsor) {
      setEditingSponsor(sponsor);
      setFormData({
        name: sponsor.name,
        type: sponsor.type,
        description: sponsor.description || '',
        website: sponsor.website || '',
        logo_url: sponsor.logo_url || '',
        tier: sponsor.tier,
        display_order: sponsor.display_order,
        active: sponsor.active,
      });
    } else {
      setEditingSponsor(null);
      setFormData({
        name: '',
        type: '',
        description: '',
        website: '',
        logo_url: '',
        tier: 'supporting',
        display_order: sponsors.length + 1,
        active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSponsor(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      deleteMutation.mutate(id);
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'title': return 'default';
      case 'presenting': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sponsor Management</h2>
          <p className="text-muted-foreground">Add and manage contest sponsors</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sponsor
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Loading sponsors...</p>
      ) : sponsors.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No sponsors yet</p>
      ) : (
        <div className="grid gap-4">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {sponsor.logo_url && (
                      <img 
                        src={sponsor.logo_url} 
                        alt={sponsor.name}
                        className="w-16 h-16 object-contain rounded bg-muted p-2"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{sponsor.name}</CardTitle>
                        <Badge variant={getTierBadgeVariant(sponsor.tier)}>
                          {sponsor.tier}
                        </Badge>
                        {!sponsor.active && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{sponsor.type}</p>
                      {sponsor.website && (
                        <a 
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {sponsor.website}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog(sponsor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(sponsor.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {sponsor.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
            </DialogTitle>
            <DialogDescription>
              {editingSponsor 
                ? 'Update the sponsor information below.'
                : 'Add a new sponsor to the contest.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sponsor Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Sponsor Type *</Label>
              <Input
                id="type"
                placeholder="e.g., Title Sponsor, Presenting Sponsor"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Tier *</Label>
              <Select
                value={formData.tier}
                onValueChange={(value: any) => setFormData({ ...formData, tier: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="presenting">Presenting</SelectItem>
                  <SelectItem value="supporting">Supporting</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                placeholder="/lovable-uploads/..."
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Upload logo to project files and paste the path here
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Active (visible to public)</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingSponsor ? 'Update' : 'Add'} Sponsor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};