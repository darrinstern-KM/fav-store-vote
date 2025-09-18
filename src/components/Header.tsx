import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { AddStoreModal } from '@/components/AddStoreModal';
import { Home, Building, Info, Award, UserPlus, LogIn } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onAuthSuccess?: (user: any) => void;
}

export const Header = ({ user, onLogout, onAuthSuccess }: HeaderProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Award className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Craft Retail Champions</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/') ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/sponsors" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/sponsors') ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Sponsors</span>
              </Link>

              <Link 
                to="/media-kit" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/media-kit') ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Media Kit</span>
              </Link>
              
              <Link 
                to="/about" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/about') ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddStoreModal(true)}
                className="hidden sm:flex items-center space-x-1"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Store</span>
              </Button>

              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          onAuthSuccess?.(user);
          setShowAuthModal(false);
        }}
      />
      
      <AddStoreModal 
        isOpen={showAddStoreModal} 
        onClose={() => setShowAddStoreModal(false)}
        user={user}
      />
    </>
  );
};