# All Remaining Component Code

Copy each section below into the corresponding file in your project.

---

## 2️⃣ Header.tsx

```typescript
import { useState } from 'react';
import { Trophy, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user: { email: string; zipCode: string; isAdmin?: boolean } | null;
  onLogout: () => void;
  onAuthSuccess: (userData: { email: string; zipCode: string; isAdmin?: boolean }) => void;
}

export const Header = ({ user, onLogout, onAuthSuccess }: HeaderProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent hidden sm:block">
                Craft Retail Champions
              </span>
              <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent sm:hidden">
                CRC
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-6">
              <a 
                href="/about" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 hover:underline underline-offset-4"
              >
                About
              </a>
              <a 
                href="/sponsors" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 hover:underline underline-offset-4"
              >
                Sponsors
              </a>
              <a 
                href="/media-kit" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 hover:underline underline-offset-4"
              >
                Media Kit
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="hidden md:flex items-center gap-2 hover:bg-slate-100"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {user.email.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled className="text-xs text-slate-500">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="text-xs text-slate-500">
                      ZIP: {user.zipCode}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:flex bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Sign In to Vote
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 animate-in slide-in-from-top-2">
              <nav className="flex flex-col gap-4">
                <a 
                  href="/about" 
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors px-2 py-1 hover:bg-slate-50 rounded"
                >
                  About
                </a>
                <a 
                  href="/sponsors" 
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors px-2 py-1 hover:bg-slate-50 rounded"
                >
                  Sponsors
                </a>
                <a 
                  href="/media-kit" 
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors px-2 py-1 hover:bg-slate-50 rounded"
                >
                  Media Kit
                </a>
                
                {user ? (
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="px-2 py-1 text-sm text-slate-600">
                      <div className="font-medium">{user.email}</div>
                      <div className="text-xs">ZIP: {user.zipCode}</div>
                    </div>
                    <Button
                      onClick={onLogout}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setShowAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Sign In to Vote
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onAuthSuccess}
      />
    </>
  );
};
```

---

Due to character limits, I'll need to provide the remaining components in the next message. Would you like me to continue with components 3-11?
