import { useState } from 'react';
import { Share, Instagram, Facebook, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const ShareButton = ({ title, url, description = "", variant = "outline", size = "sm" }: ShareButtonProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't have direct URL sharing
    threads: `https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard"
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const handleInstagramShare = () => {
    toast({
      title: "Instagram sharing",
      description: "Copy the link and share it in your Instagram story or post!"
    });
    handleCopyLink();
  };

  const openShareLink = (platform: keyof typeof shareLinks) => {
    if (platform === 'instagram') {
      handleInstagramShare();
      return;
    }
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => openShareLink('facebook')} className="gap-2">
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink('instagram')} className="gap-2">
          <Instagram className="h-4 w-4 text-pink-600" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink('threads')} className="gap-2">
          <MessageCircle className="h-4 w-4 text-gray-800" />
          Threads
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink('reddit')} className="gap-2">
          <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">r</span>
          </div>
          Reddit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink('bluesky')} className="gap-2">
          <div className="h-4 w-4 rounded bg-sky-500 flex items-center justify-center">
            <span className="text-white text-xs">🦋</span>
          </div>
          Bluesky
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};