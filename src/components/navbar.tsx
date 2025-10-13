'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  User, 
  LogOut,
  GraduationCap,
  Moon,
  Sun,
  FileText,
  Users,
  Shield,
  Building2,
  UserCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/types/database.types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);

  useEffect(() => {
    setMounted(true);
    
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(profile);
      }
    };
    
    fetchUserProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Role-based navigation items
  const getNavItems = () => {
    if (userProfile?.role === 'provider') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/scholarships', label: 'My Scholarships', icon: FileText },
        { href: '/applications', label: 'Applications', icon: Users },
        { href: '/profile', label: 'Profile', icon: User },
      ];
    }

    if (userProfile?.role === 'admin') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/scholarships', label: 'Scholarships', icon: FileText },
        { href: '/users', label: 'Users', icon: Users },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/settings', label: 'Settings', icon: Settings },
      ];
    }

    // Default student navigation
    return [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/scholarships', label: 'Scholarships', icon: BookOpen },
      { href: '/applied', label: 'Applied', icon: CheckSquare },
      { href: '/profile', label: 'Profile', icon: User },
    ];
  };

  const getRoleBadge = () => {
    const role = userProfile?.role || 'student';
    const badges = {
      student: { label: '🧑‍🎓 Student', variant: 'default' as const, icon: UserCircle, color: 'bg-blue-500' },
      provider: { label: '🏫 Provider', variant: 'secondary' as const, icon: Building2, color: 'bg-green-500' },
      admin: { label: '👨‍💼 Admin', variant: 'outline' as const, icon: Shield, color: 'bg-purple-500' },
    };
    return badges[role];
  };

  const navItems = getNavItems();
  const roleBadge = getRoleBadge();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Scholarship Track</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Badge */}
            {userProfile && (
              <div className="hidden md:flex items-center">
                <Badge variant={roleBadge.variant} className="gap-1 px-3 py-1">
                  <roleBadge.icon className="h-3 w-3" />
                  {roleBadge.label}
                </Badge>
              </div>
            )}
            
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            
            {/* Logout Button */}
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
