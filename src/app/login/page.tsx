'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, UserCircle, Building2, Shield } from 'lucide-react';

// Demo account credentials - Using real users from database
const DEMO_ACCOUNTS = {
  student: {
    email: 'pritcy026@rmkcet.ac.in',
    password: 'Student@123', // Update this with actual password
    icon: UserCircle,
    label: 'Student',
    description: 'Discover & apply for scholarships',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  provider: {
    email: 'yagaad118@rmkcet.ac.in',
    password: 'Provider@123', // Update this with actual password
    icon: Building2,
    label: 'Provider',
    description: 'Manage scholarships & applicants',
    color: 'bg-green-500 hover:bg-green-600',
  },
  admin: {
    email: 'prittoprogrammer@gmail.com',
    password: 'Admin@123', // Update this with actual password
    icon: Shield,
    label: 'Admin',
    description: 'Oversee platform & moderate',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const quickFillForm = (role: 'student' | 'provider' | 'admin') => {
    const account = DEMO_ACCOUNTS[role];
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'provider' | 'admin') => {
    setLoading(true);
    setError(null);

    const account = DEMO_ACCOUNTS[role];

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Demo account not found. Please set up demo accounts first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">Scholarship Track</CardTitle>
          </div>
          <CardDescription>
            Sign in to your account or try a demo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Accounts Section */}
          {showDemoAccounts && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">🎮 Try Demo Accounts</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDemoAccounts(false)}
                  className="text-xs"
                >
                  Hide
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-4 text-center">
                Click below to explore different role features instantly
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(DEMO_ACCOUNTS).map(([role, account]) => {
                  const Icon = account.icon;
                  return (
                    <div key={role} className="flex flex-col space-y-2 w-full">

                      <Button
                        variant="outline"
                        className={`h-auto flex flex-col items-center justify-center p-4 space-y-3 hover:shadow-md transition-all w-full min-h-[160px] overflow-hidden ${loading ? 'opacity-50' : ''}`}
                        onClick={() => handleDemoLogin(role as 'student' | 'provider' | 'admin')}
                        disabled={loading}
                      >
                        <div className="flex flex-col items-center gap-2 w-full">
                          <div className={`p-3 rounded-lg ${account.color} text-white flex-shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-semibold text-center text-sm whitespace-nowrap">{account.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center leading-relaxed break-words w-full max-w-full overflow-hidden">
                          {account.description}
                        </p>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs hover:bg-muted"
                        onClick={() => quickFillForm(role as 'student' | 'provider' | 'admin')}
                        disabled={loading}
                      >
                        📝 Fill Form Only
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!showDemoAccounts && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDemoAccounts(true)}
              className="mb-4 w-full"
            >
              Show Demo Accounts
            </Button>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign in with credentials
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in with Email'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
