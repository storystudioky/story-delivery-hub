import { ChevronDown, CreditCard, LogOut, Menu, Settings, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { WorkspaceSwitcherCompact } from '@/components/spark/WorkspaceSwitcherCompact';
import sparkLogo from '@/assets/spark-logo.png';
const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Services', href: '/services' },
  { label: 'Files', href: '/files' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Support', href: '/support' },
];

// Helper to determine if a nav link should be active
const isNavLinkActive = (linkHref: string, currentPath: string): boolean => {
  // Dashboard is active for dashboard and all service workflow routes
  if (linkHref === '/dashboard') {
    const dashboardRoutes = [
      '/dashboard',
      '/brand-strategy',
      '/content-calendar',
      '/interview-preview',
      '/interview',
      '/onboarding',
      '/visual-identity-form',
      '/interview-summary-review',
      '/draft-generation',
      '/draft',
      '/packaging',
      '/test',
    ];
    return dashboardRoutes.some(route => 
      currentPath === route || currentPath.startsWith(route + '/')
    );
  }
  
  // For other links, use startsWith matching
  return currentPath === linkHref || currentPath.startsWith(linkHref + '/');
};

export function SparkHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isSuperAdmin } = useSuperAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    navigate(href);
  };

  const userInitials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-stroke-weak">
      <div className="flex h-14 sm:h-16 md:h-[72px] items-center px-3 sm:px-6 lg:px-8 gap-2">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle className="text-left text-2xl font-bold tracking-tight">SPARK</SheetTitle>
            </SheetHeader>
            <div className="mt-6 px-2">
              <WorkspaceSwitcher />
            </div>
            <nav className="flex flex-col gap-2 mt-6">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(link.href, location.pathname);
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      'flex items-center min-h-[44px] px-4 py-3 text-base font-normal rounded-lg transition-colors text-left',
                      isActive 
                        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                        : 'text-strong hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </button>
                );
              })}
              {isSuperAdmin && (
                <button
                  onClick={() => handleNavClick('/admin')}
                  className={cn(
                    'flex items-center min-h-[44px] px-4 py-3 text-base font-normal rounded-lg transition-colors text-left',
                    location.pathname.startsWith('/admin')
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-strong hover:bg-muted'
                  )}
                >
                  Admin
                </button>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo + Nav Section */}
        <div className="flex items-center gap-4 md:gap-12 flex-1 min-w-0">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center h-8 sm:h-10 md:h-12 shrink-0">
            <img src={sparkLogo} alt="Sparktoria" className="h-8 sm:h-10 md:h-12 w-auto" />
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center flex-1">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(link.href, location.pathname);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn("h-[72px] px-4 flex items-center text-base font-normal leading-6 text-strong transition-all duration-300 hover:text-primary border-b-4 border-transparent", isActive && "border-primary")}
                >
                  {link.label}
                </Link>
              );
            })}
            {isSuperAdmin && (
              <Link
                to="/admin"
                className={cn(
                  'h-[72px] px-4 flex items-center text-base font-normal leading-6 text-strong transition-colors hover:text-primary',
                  location.pathname.startsWith('/admin') && 'border-b-4 border-primary'
                )}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side: Workspace Switcher + Notifications + User */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Workspace Switcher - Desktop */}
          <div className="hidden md:block">
            <WorkspaceSwitcherCompact />
          </div>

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-4 py-2 h-11 min-w-[44px] hover:bg-transparent rounded-lg">
                <Avatar className="h-8 w-8 border border-stroke-weak">
                  <AvatarImage src="" alt="My Account" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-normal text-strong">My Account</span>
                <ChevronDown className="hidden sm:block h-6 w-6 text-icon-neutral opacity-45" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/team')}>
                <Users className="mr-2 h-4 w-4" />
                Team Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/workspace-settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
