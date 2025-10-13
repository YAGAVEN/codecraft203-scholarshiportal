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
import { Bell, Check } from 'lucide-react';
import { useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

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
    // fetch notifications
    fetchNotifications();
  }, [supabase]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount((data.notifications || []).filter((n: any) => !n.is_read).length || 0);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: id }),
      });
      if (res.ok) {
        setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (e) {
      console.error('Failed to mark as read', e);
    }
  };

  // close dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

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
            
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowNotif((s) => !s);
                  if (!showNotif) fetchNotifications();
                }}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {/* small unread dot when there are unread notifications */}
                {unreadCount > 0 && (
                  <span aria-hidden className="absolute -top-1 -right-1 inline-block w-2 h-2 rounded-full bg-red-600" />
                )}
              </Button>

              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-card border rounded shadow-lg z-50">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <strong>Notifications</strong>
                      <button className="text-sm text-muted-foreground" onClick={() => { setNotifications([]); setUnreadCount(0); setShowNotif(false); }}>Close</button>
                    </div>
                    <div className="max-h-64 overflow-auto space-y-2">
                      {notifications.length === 0 && (
                        <div className="text-sm text-muted-foreground">No notifications</div>
                      )}
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded flex items-start justify-between gap-2 ${n.is_read ? 'bg-muted/50' : 'bg-primary/10'}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              {/* unread dot per item */}
                              {!n.is_read && <span className="inline-block w-2 h-2 mt-1 rounded-full bg-blue-600" />}
                              <div className="text-sm">{n.message}</div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>
                          </div>
                          {/* show compact check button only for unread items */}
                          {!n.is_read && (
                            <button
                              aria-label="Mark as read"
                              className="p-1 rounded hover:bg-muted/70"
                              onClick={() => markAsRead(n.id)}
                            >
                              <Check className="h-4 w-4 text-blue-600" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
