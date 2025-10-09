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
