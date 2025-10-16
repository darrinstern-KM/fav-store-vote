import { useState } from 'react';
import { X, Star, Send, CheckCircle, Loader2, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Store {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface VoteModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  user: { email: string; zipCode: string } | null;
}

export const VoteModal = ({ store, isOpen, onClose, user }: VoteModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [testimonial, setTestimonial] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !store) return null;

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to vote.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Authentication required",
          description: "Please sign in to vote.",
          variant: "destructive",
        });
        return;
      }

      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          user_id: authUser.id,
          store_id: store.id,
          voter_email: user.email,
          rating,
          comment: testimonial.trim() || null,
          voting_method: 'web',
        });

      if (voteError) throw voteError;

      setIsSuccess(true);
      
      toast({
        title: "Vote submitted! 🎉",
        description: `Thank you for voting for ${store.name}! You've been entered into the prize draw.`,
      });

      setTimeout(() => {
        setIsSuccess(false);
        setRating(0);
        setTestimonial('');
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Vote error:', error);
      toast({
        title: "Error submitting vote",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        {isSuccess ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Vote Submitted!
            </h3>
            <p className="text-lg text-slate-600 mb-2">
              Thank you for voting for <span className="font-bold">{store.name}</span>!
            </p>
            <p className="text-sm text-slate-500">
              🎁 You've been entered into the prize draw!
            </p>
          </div>
        ) : (
          <>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-3xl p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Vote for Store</h2>
                  <p className="text-white/80 text-sm">Your support matters!</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                <h3 className="font-bold text-xl text-slate-800 mb-1">{store.name}</h3>
                <p className="text-sm text-slate-600">
                  {store.city}, {store.state}
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Rate Your Experience <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transform transition-all duration-200 hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-12 w-12 transition-all ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400 scale-110'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm font-medium text-slate-600 animate-in fade-in">
                    {rating === 5 && "⭐ Excellent!"}
                    {rating === 4 && "😊 Great!"}
                    {rating === 3 && "👍 Good"}
                    {rating === 2 && "😕 Could be better"}
                    {rating === 1 && "👎 Needs improvement"}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Share Your Experience <span className="text-slate-400">(Optional)</span>
                </label>
                <Textarea
                  placeholder="Tell us what you love about this store... (This helps other crafters discover great shops!)"
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  className="min-h-32 resize-none border-2 focus:border-blue-500 rounded-xl"
                  maxLength={500}
                />
                <p className="text-xs text-slate-500 text-right">
                  {testimonial.length}/500 characters
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-800 mb-1">
                      🎁 Every vote enters you to win!
                    </p>
                    <p className="text-slate-600">
                      You'll be automatically entered into our prize draw for a $500 shopping spree and other amazing prizes!
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting Vote...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Vote & Enter to Win
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-slate-500">
                By voting, you agree to our terms and conditions. One vote per store per user.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
