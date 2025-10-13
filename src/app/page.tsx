import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Award, Bell, TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Scholarship Track Portal
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
            Your intelligent companion for discovering, tracking, and applying to scholarships tailored to your profile
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-muted-foreground">
              AI-powered algorithm matches you with scholarships based on your profile, course, and background
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
            <p className="text-muted-foreground">
              Get notified about deadlines, new scholarships, and application status updates
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Readiness Score</h3>
            <p className="text-muted-foreground">
              Track your application readiness with our intelligent scoring system
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
            <p className="text-muted-foreground">
              Manage all your scholarship applications in one centralized dashboard
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-primary/5 dark:bg-primary/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find your perfect scholarship?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students already using Scholarship Track Portal
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Scholarship Track Portal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Scholarship Track Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
