import { Download, Share2, Trophy, Megaphone, Image, FileText, Sparkles, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const StorePromotion = () => {
  const promotionTools = [
    {
      icon: Image,
      title: 'Social Media Graphics',
      description: 'Ready-to-post graphics for Instagram, Facebook, and Twitter',
      action: 'Download Graphics',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: FileText,
      title: 'Email Templates',
      description: 'Pre-written email templates to engage your customers',
      action: 'Get Templates',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Megaphone,
      title: 'In-Store Materials',
      description: 'Printable posters, flyers, and table tents',
      action: 'Download PDFs',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Trophy,
      title: 'Winner Badge',
      description: 'Display your achievement with our official badge',
      action: 'Get Badge',
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  const promotionTips = [
    'Post daily voting reminders on social media',
    'Add voting link to email signatures',
    'Create in-store QR codes for easy voting',
    'Offer small incentives for customer votes',
    'Share progress updates regularly',
    'Engage with your community online',
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/30 to-orange-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Megaphone className="h-4 w-4" />
            For Store Owners
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Get More Votes with Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Free Tools</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Supercharge your campaign with professionally designed marketing materials. 
            Everything you need to engage customers and climb the leaderboard!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {promotionTools.map((tool, index) => (
            <Card 
              key={index}
              className="group border-2 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <tool.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">Free</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{tool.description}</p>
                <Button 
                  className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 text-white font-semibold shadow-md hover:shadow-lg transition-all`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {tool.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl">Pro Tips to Win</CardTitle>
              </div>
              <p className="text-sm text-slate-600">
                Proven strategies from our top-performing stores
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promotionTips.map((tip, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 group hover:bg-white rounded-lg p-2 transition-colors"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-slate-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl">Success Story</CardTitle>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 w-fit">
                2024 Winner
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-purple-100">
                  <p className="text-slate-700 italic mb-3">
                    "Using the promotional toolkit increased our votes by 300%! 
                    The social media graphics and email templates made it so easy 
                    to engage our customers. Winning has brought incredible exposure to our store."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-slate-800">Sarah Johnson</div>
                      <div className="text-xs text-slate-500">Creative Crafts Co. - Chicago, IL</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Impact After Winning</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">+45%</div>
                      <div className="text-xs text-slate-600">Store Traffic</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">+60%</div>
                      <div className="text-xs text-slate-600">Social Followers</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              Ready to Win?
            </h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Download our complete marketing toolkit and start driving votes today. 
              It's free, easy to use, and proven to work!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 font-bold text-lg px-8 py-4 shadow-2xl hover:shadow-white/25 transition-all"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Full Toolkit
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-4"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Campaign
              </Button>
            </div>

            <p className="text-sm mt-6 text-white/80">
              📧 Questions? Email us at <a href="mailto:support@craftretailchampions.com" className="underline font-semibold">support@craftretailchampions.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
