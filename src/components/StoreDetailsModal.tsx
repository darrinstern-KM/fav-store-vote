import { X, MapPin, Star, Clock, Mail, Globe, Phone, Navigation, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShareButton } from './ShareButton';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  shopEmail?: string;
  shopHours?: string;
  votes: number;
  rating: number;
  category: string;
  testimonials?: string[];
}

interface StoreDetailsModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (store: Store) => void;
}

export const StoreDetailsModal = ({ store, isOpen, onClose, onVote }: StoreDetailsModalProps) => {
  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white rounded-t-3xl p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="pr-12">
            <Badge className="bg-white/20 text-white border-white/30 mb-3">
              {store.category}
            </Badge>
            <h2 className="text-3xl font-bold mb-2">{store.name}</h2>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <span>{store.city}, {store.state} {store.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-600">Total Votes</span>
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {store.votes.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="text-sm font-medium text-slate-600">Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {store.rating.toFixed(1)}
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(store.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Store Information
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-600">Address</div>
                  <div className="text-slate-800">
                    {store.address}<br />
                    {store.city}, {store.state} {store.zipCode}
                  </div>
                </div>
              </div>

              {store.shopHours && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                  <Clock className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-600">Hours</div>
                    <div className="text-slate-800">{store.shopHours}</div>
                  </div>
                </div>
              )}

              {store.shopEmail && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                  <Mail className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-600">Email</div>
                    <a 
                      href={`mailto:${store.shopEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {store.shopEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {store.testimonials && store.testimonials.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Customer Reviews
              </h3>
              <div className="space-y-3">
                {store.testimonials.slice(0, 3).map((testimonial, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 italic">"{testimonial}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-slate-200">
            <Button
              onClick={() => {
                onVote(store);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap className="h-5 w-5 mr-2" />
              Vote for {store.name}
            </Button>

            <div className="flex gap-3">
              <ShareButton 
                title={`Vote for ${store.name} in Craft Retail Champions!`}
                url={`${window.location.origin}?store=${store.id}`}
                description={`Help ${store.name} win! They have ${store.votes} votes and a ${store.rating} star rating.`}
                variant="outline"
                className="flex-1"
              />
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${store.name} ${store.address} ${store.city} ${store.state} ${store.zipCode}`
                  )}`;
                  window.open(mapsUrl, '_blank');
                }}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
            <p className="text-sm text-slate-700 text-center">
              💡 <span className="font-semibold">Support local craft retail!</span> Your vote helps {store.name} gain recognition and grow their community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
