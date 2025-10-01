import { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { voteSchema } from '@/lib/validation';

interface Store {
  id: string;
  shopId?: string;
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

interface User {
  email: string;
  zipCode: string;
  isAdmin?: boolean;
}

interface VoteModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const VoteModal = ({ store, isOpen, onClose, user }: VoteModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;

    try {
      // Validate input
      const validated = voteSchema.parse({
        rating,
        email,
        phone,
        city,
        state,
        testimonial,
        smsConsent: phone ? smsConsent : false,
      });

      if (phone && !smsConsent) {
        toast({
          title: "SMS consent required",
          description: "Please consent to SMS messages when providing a phone number",
          variant: "destructive"
        });
        return;
      }

      setIsSubmitting(true);

      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Authentication required",
          description: "Please log in to vote",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Insert vote
      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: authUser.id,
          store_id: store.shopId || store.id,
          rating: validated.rating,
          comment: validated.testimonial || null,
          voter_email: validated.email || null,
          voter_phone: validated.phone || null,
          voter_city: validated.city,
          voter_state: validated.state,
          sms_consent: validated.smsConsent,
          voting_method: 'web',
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already voted",
            description: "You have already voted for this store",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error submitting vote",
            description: error.message,
            variant: "destructive"
          });
        }
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Vote submitted successfully!",
        description: `Thank you for voting for ${store.name}`,
      });
      
      // Reset form
      setRating(0);
      setEmail('');
      setPhone('');
      setCity('');
      setState('');
      setTestimonial('');
      setSmsConsent(false);
      onClose();
    } catch (error: any) {
      toast({
        title: "Validation error",
        description: error.errors?.[0]?.message || "Please check your input",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Vote for {store.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Store Info */}
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{store.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {store.address}, {store.city}, {store.state} {store.zipCode}
            </div>
            <div className="text-sm text-vote-primary font-medium mt-1">
              Current votes: {store.votes}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Rate this store *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-winner-gold text-winner-gold'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Contact Information *</Label>
              <p className="text-sm text-muted-foreground">
                Provide either email or phone number (with SMS consent)
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    maxLength={255}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (SMS consent required)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    maxLength={20}
                  />
                  {phone && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sms-consent"
                        checked={smsConsent}
                        onChange={(e) => setSmsConsent(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="sms-consent" className="text-sm">
                        I consent to receive SMS messages
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Your Location *</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Springfield"
                    maxLength={100}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State (2 letters)</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="IL"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="space-y-2">
              <Label htmlFor="testimonial" className="text-base font-semibold">
                Share your experience (optional)
              </Label>
              <Textarea
                id="testimonial"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="Tell us why this store deserves your vote..."
                className="min-h-[100px]"
                maxLength={1000}
              />
            </div>

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
                {isSubmitting ? 'Submitting Vote...' : 'Submit Vote'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};