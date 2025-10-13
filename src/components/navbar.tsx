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
  BarChart3
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/types/database.types';
import { Bell, Check } from 'lucide-react';
import { useRef } from 'react';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      setUnreadCount((data.notifications || []).filter((n: Notification) => !n.is_read).length || 0);
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
        { href: '/provider/scholarships', label: 'My Scholarships', icon: FileText },
        { href: '/provider/applications', label: 'Applications', icon: Users },
        { href: '/profile', label: 'Profile', icon: User },
      ];
    }

    if (userProfile?.role === 'admin') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/profile', label: 'Profile', icon: User },
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
            
            {/* Notifications - Only for Students and Providers */}
            {userProfile && userProfile.role !== 'admin' && (
              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowNotif((s) => !s);
                    if (!showNotif) fetchNotifications();
                  }}
                  title="Notifications"
                  className="relative"
                >
                  <Bell className={`h-5 w-5 transition-all ${showNotif ? 'text-primary' : ''}`} />
                  {/* Badge for unread count */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>

                {showNotif && (
                  <div className="absolute right-0 mt-2 w-96 bg-card border rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-4 py-3 border-b bg-muted/50 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-base">
                            {userProfile.role === 'provider' ? 'Application Updates' : 'Notifications'}
                          </span>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setShowNotif(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                          <div className="rounded-full bg-muted p-4 mb-3">
                            <Bell className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {userProfile.role === 'provider' 
                              ? 'No application updates yet'
                              : 'No notifications yet'
                            }
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {userProfile.role === 'provider'
                              ? 'You&apos;ll be notified when students apply to your scholarships'
                              : 'We&apos;ll notify you when something arrives'
                            }
                          </p>
                        </div>
                      ) : (
                      <div className="divide-y">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 transition-colors hover:bg-muted/50 ${
                              !n.is_read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon/Status indicator */}
                              <div className={`mt-0.5 flex-shrink-0 rounded-full p-2 ${
                                !n.is_read ? 'bg-primary/10' : 'bg-muted'
                              }`}>
                                <Bell className={`h-4 w-4 ${
                                  !n.is_read ? 'text-primary' : 'text-muted-foreground'
                                }`} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className={`text-sm ${
                                      !n.is_read ? 'font-medium' : 'text-muted-foreground'
                                    }`}>
                                      {n.title || 'Notification'}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                      {n.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                      <span>
                                        {(() => {
                                          const date = new Date(n.created_at);
                                          const now = new Date();
                                          const diffMs = now.getTime() - date.getTime();
                                          const diffMins = Math.floor(diffMs / 60000);
                                          const diffHours = Math.floor(diffMins / 60);
                                          const diffDays = Math.floor(diffHours / 24);
                                          
                                          if (diffMins < 1) return 'Just now';
                                          if (diffMins < 60) return `${diffMins}m ago`;
                                          if (diffHours < 24) return `${diffHours}h ago`;
                                          if (diffDays < 7) return `${diffDays}d ago`;
                                          return date.toLocaleDateString();
                                        })()}
                                      </span>
                                    </p>
                                  </div>

                                  {/* Mark as read button */}
                                  {!n.is_read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 flex-shrink-0"
                                      onClick={() => markAsRead(n.id)}
                                      title="Mark as read"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer - Mark all as read */}
                  {notifications.length > 0 && unreadCount > 0 && (
                    <div className="px-4 py-2 border-t bg-muted/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={() => {
                          notifications.forEach((n) => {
                            if (!n.is_read) markAsRead(n.id);
                          });
                        }}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark all as read
                      </Button>
                    </div>
                  )}
                </div>
              )}
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
