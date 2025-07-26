import { useState } from 'react';
import { MapPin, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStoreModal = ({ isOpen, onClose }: AddStoreModalProps) => {
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeName || !address || !city || !state || !zipCode) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to add store
    setTimeout(() => {
      toast({
        title: "Store added successfully!",
        description: `${storeName} has been added to our database and you can now vote for it.`,
      });
      
      // Reset form
      setStoreName('');
      setAddress('');
      setCity('');
      setState('');
      setZipCode('');
      setCategory('');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Store className="h-6 w-6 text-vote-primary" />
            Add New Store
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Don't see your favorite store? Add it to our database so others can vote for it too! 
              All submissions are reviewed before being added.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="store-name" className="text-base font-semibold">
                Store Name *
              </Label>
              <Input
                id="store-name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Best Buy, Target, Local Coffee Shop..."
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Store Category (optional)
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Electronics, Clothing, Grocery, etc."
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base font-semibold">
                Street Address *
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="store-city" className="text-base font-semibold">
                  City *
                </Label>
                <Input
                  id="store-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Springfield"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-state" className="text-base font-semibold">
                  State *
                </Label>
                <Input
                  id="store-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="IL"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-zip" className="text-base font-semibold">
                  ZIP Code *
                </Label>
                <Input
                  id="store-zip"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="62701"
                  required
                />
              </div>
            </div>

            {/* Preview */}
            {storeName && address && city && state && (
              <div className="bg-vote-primary/10 p-4 rounded-lg border border-vote-primary/20">
                <h3 className="font-semibold text-vote-primary mb-2">Preview:</h3>
                <div className="space-y-1">
                  <div className="font-medium">{storeName}</div>
                  {category && <div className="text-sm text-muted-foreground">{category}</div>}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {address}, {city}, {state} {zipCode}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-vote hover:shadow-vote"
              >
                {isSubmitting ? 'Adding Store...' : 'Add Store'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};