import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  url: string;
  description: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const ShareButton = ({ 
  title, 
  url, 
  description, 
  variant = 'default',
  size = 'default',
  className = ''
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied! 📋",
        description: "Share link has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={`group ${className}`}
        >
          <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {navigator.share && (
          <DropdownMenuItem 
            onClick={handleNativeShare}
            className="cursor-pointer"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share via...
          </DropdownMenuItem>
        )}

        <DropdownMenuItem 
          onClick={() => handleShare('facebook')}
          className="cursor-pointer hover:bg-blue-50 group"
        >
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
          </div>
          <span className="group-hover:text-blue-600">Share on Facebook</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleShare('twitter')}
          className="cursor-pointer hover:bg-sky-50 group"
        >
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-sm"></div>
          </div>
          <span className="group-hover:text-sky-600">Share on X (Twitter)</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleShare('linkedin')}
          className="cursor-pointer hover:bg-blue-50 group"
        >
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
          </div>
          <span className="group-hover:text-blue-700">Share on LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={handleCopyLink}
          className="cursor-pointer hover:bg-slate-50 group"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">Link Copied!</span>
            </>
          ) : (
            <>
              <Link className="mr-2 h-4 w-4 group-hover:text-slate-700" />
              <span className="group-hover:text-slate-700">Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
