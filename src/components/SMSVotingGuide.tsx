import { Phone, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const SMSVotingGuide = () => {
  return (
    <section className="py-16 px-4 bg-secondary">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Vote Multiple Ways</h2>
          <p className="text-xl text-muted-foreground">
            Cast your vote through your preferred platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-6 w-6 text-vote-primary" />
                SMS Voting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background p-4 rounded-lg">
                <p className="font-semibold mb-2">Text to: (555) 123-VOTE</p>
                <p className="text-sm text-muted-foreground mb-3">Format:</p>
                <code className="bg-muted p-2 rounded text-sm block">
                  VOTE [Store Name] [ZIP Code] [Optional Comment]
                </code>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Example: VOTE "Main Street Cafe" 12345 Great coffee!</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-green-500" />
                WhatsApp Voting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background p-4 rounded-lg">
                <p className="font-semibold mb-2">Message: +1 (555) 123-VOTE</p>
                <p className="text-sm text-muted-foreground mb-3">Format:</p>
                <code className="bg-muted p-2 rounded text-sm block">
                  VOTE [Store Name] [ZIP Code] [Optional Comment]
                </code>
              </div>
              <Badge variant="secondary" className="text-xs">
                WhatsApp Business verified
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="h-6 w-6 text-pink-500" />
                Instagram DM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background p-4 rounded-lg">
                <p className="font-semibold mb-2">DM: @VoteYourStore</p>
                <p className="text-sm text-muted-foreground mb-3">Format:</p>
                <code className="bg-muted p-2 rounded text-sm block">
                  VOTE [Store Name] [ZIP Code] [Optional Comment]
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Twitter className="h-6 w-6 text-blue-500" />
                Twitter DM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background p-4 rounded-lg">
                <p className="font-semibold mb-2">DM: @VoteYourStore</p>
                <p className="text-sm text-muted-foreground mb-3">Format:</p>
                <code className="bg-muted p-2 rounded text-sm block">
                  VOTE [Store Name] [ZIP Code] [Optional Comment]
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-background p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Important Notes:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• One vote per phone number/account per contest period</li>
            <li>• Store names must match our database or will require admin approval</li>
            <li>• Comments are optional but encouraged</li>
            <li>• You'll receive a confirmation message after voting</li>
            <li>• Standard message rates may apply for SMS</li>
          </ul>
        </div>
      </div>
    </section>
  );
};