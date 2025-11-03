import { useState } from 'react';
import { X, Mail, MapPin, Loader2, Lock, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { email: string; zipCode: string; isAdmin?: boolean }) => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'input' | 'success'>('input');
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup' && (!zipCode || zipCode.length < 5)) {
      toast({
        title: "Invalid ZIP code",
        description: "Please enter a valid 5-digit ZIP code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              zip_code: zipCode
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          
          setStep('success');
          
          setTimeout(() => {
            // Fetch user data after successful signup
            const userData = {
              email: email.toLowerCase(),
              zipCode: zipCode,
              isAdmin: false
            };
            onSuccess(userData);
            onClose();
            
            setTimeout(() => {
              setEmail('');
              setPassword('');
              setZipCode('');
              setStep('input');
            }, 300);
          }, 1500);
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password
        });

        if (error) throw error;

        if (data.user) {
          // Check if user has admin role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle();

          // Get profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('zip_code')
            .eq('id', data.user.id)
            .single();

          const userData = {
            email: data.user.email || email.toLowerCase(),
            zipCode: profile?.zip_code || '',
            isAdmin: !!roleData
          };

          setStep('success');
          
          setTimeout(() => {
            onSuccess(userData);
            onClose();
            
            setTimeout(() => {
              setEmail('');
              setPassword('');
              setZipCode('');
              setStep('input');
            }, 300);
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please verify your email before signing in.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "This email is already registered. Try signing in instead.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {step === 'success' ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Welcome!
            </h3>
            <p className="text-lg text-slate-600">
              You're all set to start voting!
            </p>
          </div>
        ) : (
          <>
            <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {mode === 'signup' ? 'Create Account' : 'Sign In to Vote'}
                </h2>
                <p className="text-white/90">
                  {mode === 'signup' ? 'Join thousands of craft enthusiasts!' : 'Welcome back!'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-start gap-3 text-sm">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-slate-700">
                    <p className="font-semibold mb-1">Why sign in?</p>
                    <ul className="space-y-1 text-xs">
                      <li>✓ Vote for your favorite stores</li>
                      <li>✓ Enter to win a $500 shopping spree</li>
                      <li>✓ Track your voting history</li>
                      <li>✓ Get exclusive updates</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  We'll only use this to verify your votes
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-12 h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                </p>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="12345"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      required={mode === 'signup'}
                      maxLength={5}
                      className="pl-12 h-12 border-2 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Helps us show you local stores
                  </p>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <Lock className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <span className="font-semibold">Your privacy matters.</span> We never share your information. 
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    {mode === 'signup' ? 'Create Account & Start Voting' : 'Sign In & Start Voting'}
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {mode === 'signup' 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
