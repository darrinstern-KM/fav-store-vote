import { useState } from 'react';
import { X, Store, MapPin, Mail, Clock, Tag, Loader2, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddStoreModal = ({ isOpen, onClose, onSuccess }: AddStoreModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    hours: '',
    category: '',
    website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('stores')
        .insert({
          ShopID: crypto.randomUUID(),
          shop_name: formData.name,
          shop_addr_1: formData.address,
          shop_city: formData.city,
          shop_state: formData.state,
          shop_zip: formData.zipCode,
          shop_email: formData.email || null,
          shop_phone_1: formData.phone || null,
          shop_hours: formData.hours || null,
          shop_mdse: formData.category || null,
          shop_website: formData.website || null,
          approved: false,
        });

      if (error) throw error;

      setStep('success');

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setTimeout(() => {
          setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            email: '',
            phone: '',
            hours: '',
            category: '',
            website: '',
          });
          setStep('form');
        }, 300);
      }, 2500);

    } catch (error: any) {
      console.error('Add store error:', error);
      toast({
        title: "Error adding store",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {step === 'success' ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Store Submitted!
            </h3>
            <p className="text-lg text-slate-600 mb-2">
              Thank you for adding <span className="font-bold">{formData.name}</span>!
            </p>
            <p className="text-sm text-slate-500">
              We'll review your submission and notify you once it's approved.
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white rounded-t-3xl p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Add Your Store</h2>
                  <p className="text-white/80 text-sm">Get listed and start receiving votes!</p>
                </div>
              </div>
            </div>

            <div className="mx-6 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <p className="font-semibold mb-1">📝 Submission Review</p>
                  <p className="text-xs">
                    All new stores are reviewed before appearing on the site. 
                    This usually takes 24-48 hours. We'll email you once approved!
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="e.g., Crafty Corner Supplies"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                    className="pl-12 h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    required
                    className="pl-12 h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Chicago"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    required
                    className="h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="IL"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value.toUpperCase())}
                    required
                    maxLength={2}
                    className="h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="60062"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    required
                    maxLength={5}
                    className="h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="store@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-12 h-12 border-2 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Phone <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Category <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="e.g., Fabric, Yarn, General"
                      value={formData.category}
                      onChange={(e) => updateFormData('category', e.target.value)}
                      className="pl-12 h-12 border-2 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Website <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="h-12 border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Store Hours <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Textarea
                    placeholder="e.g., Mon-Fri: 9am-6pm, Sat: 10am-5pm, Sun: Closed"
                    value={formData.hours}
                    onChange={(e) => updateFormData('hours', e.target.value)}
                    className="pl-12 min-h-20 border-2 focus:border-blue-500 rounded-xl resize-none"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-800 mb-1">
                      🎉 Benefits of Being Listed
                    </p>
                    <ul className="text-slate-600 space-y-1 text-xs">
                      <li>✓ Get discovered by thousands of craft enthusiasts</li>
                      <li>✓ Receive votes and customer reviews</li>
                      <li>✓ Compete for Champion recognition</li>
                      <li>✓ Access free marketing materials</li>
                    </ul>
                  </div>
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
                    Submitting Store...
                  </>
                ) : (
                  <>
                    <Store className="h-5 w-5 mr-2" />
                    Submit Store for Approval
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-slate-500">
                By submitting, you confirm that you are authorized to add this store. 
                All submissions are reviewed before publication.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
