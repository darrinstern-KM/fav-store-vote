import { MessageSquare, Send, Smartphone, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';

export const SMSVotingGuide = () => {
  const steps = [
    {
      number: '1',
      icon: Smartphone,
      title: 'Open Messages',
      description: 'Open your phone\'s messaging app',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      number: '2',
      icon: MessageSquare,
      title: 'Text VOTE',
      description: 'Send "VOTE [Store Name]" to (555) 123-4567',
      color: 'from-purple-500 to-pink-600',
    },
    {
      number: '3',
      icon: Send,
      title: 'Get Confirmation',
      description: 'Receive instant confirmation of your vote',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-tr from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            <Smartphone className="h-4 w-4" />
            New Feature!
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Vote by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Text Message</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Can't access the website? No problem! Vote for your favorite stores right from your phone with SMS voting.
          </p>
        </div>

        <Card className="border-2 border-purple-200 shadow-2xl mb-12 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600"></div>
          
          <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 pb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">How SMS Voting Works</CardTitle>
                <p className="text-slate-600">Quick, easy, and works on any phone</p>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 text-sm px-4 py-2">
                <Zap className="h-3 w-3 mr-1" />
                Instant
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 -z-10"></div>
                  )}
                  
                  <div className="text-center group">
                    <div className="relative mb-4 mx-auto w-24 h-24">
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300`}></div>
                      <div className={`relative bg-gradient-to-r ${step.color} rounded-2xl w-full h-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-800 text-sm shadow-lg border-2 border-purple-200">
                        {step.number}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-300 text-sm mb-2">Example Text Message:</div>
                  <div className="bg-slate-700 rounded-xl p-4 font-mono text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-400 text-xs">To:</span>
                      <span className="font-semibold">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">Message:</span>
                      <span className="font-semibold">VOTE Michaels Chicago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">No App Required</div>
                  <div className="text-xs text-slate-600">Works on any phone with SMS</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">Instant Confirmation</div>
                  <div className="text-xs text-slate-600">Get a reply within seconds</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">Vote Anywhere</div>
                  <div className="text-xs text-slate-600">No internet connection needed</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">Secure & Private</div>
                  <div className="text-xs text-slate-600">Your number stays confidential</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-sm text-slate-700">
                <span className="font-semibold">💡 Pro Tip:</span> You can vote for multiple stores! 
                Just send a separate text message for each store you want to support.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-purple-200 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Vote by SMS</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-600 mb-4 text-sm">
                Perfect for on-the-go voting or if you prefer texting
              </p>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold">
                <MessageSquare className="h-4 w-4 mr-2" />
                Text Now: (555) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaWhatsapp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Vote by WhatsApp</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-600 mb-4 text-sm">
                Use your favorite messaging app to vote
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                onClick={() => window.open('https://wa.me/15551234567?text=VOTE%20', '_blank')}
              >
                <FaWhatsapp className="h-5 w-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Vote Online</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-600 mb-4 text-sm">
                Browse stores, read reviews, and cast multiple votes
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold"
                onClick={() => {
                  const searchSection = document.querySelector('[data-search-section]');
                  searchSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Vote Online Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
