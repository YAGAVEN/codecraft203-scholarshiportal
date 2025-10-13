import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Bell, TrendingUp, ArrowRight, Search, Target, Zap, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🎓 India&apos;s Smartest Scholarship Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Your Perfect <span className="text-yellow-300">Scholarship</span> Match
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-50 max-w-2xl">
                Connect with thousands of scholarships tailored to your profile. Track applications, get instant matches, and turn your academic dreams into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/signup">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                  <Link href="/scholarships">
                    Explore Scholarships
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-3xl font-bold text-yellow-300">1000+</div>
                  <div className="text-sm text-blue-100">Scholarships</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">50K+</div>
                  <div className="text-sm text-blue-100">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">₹500Cr+</div>
                  <div className="text-sm text-blue-100">Awarded</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative hidden lg:block">
              <div className="relative w-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Chevening Scholarship</div>
                      <div className="text-sm text-gray-600">99% Match • UK • £30,000</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Fulbright Program</div>
                      <div className="text-sm text-gray-600">95% Match • USA • $50,000</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">DAAD Scholarship</div>
                      <div className="text-sm text-gray-600">92% Match • Germany • €1,200/mo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Students Choose <span className="text-blue-600">Scholarship Track</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The complete scholarship discovery and application platform built for Indian students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-6 rounded-xl border bg-card hover:shadow-xl transition-all hover:scale-105 hover:border-blue-400">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching Algorithm</h3>
              <p className="text-muted-foreground">
                AI-powered matching based on your course, category, economic background, and academic profile for the best scholarship fit.
              </p>
            </div>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-xl transition-all hover:scale-105 hover:border-green-400">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Tracker</h3>
              <p className="text-muted-foreground">
                Monitor every application status from submission to acceptance. Get real-time updates and never miss important deadlines.
              </p>
            </div>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-xl transition-all hover:scale-105 hover:border-purple-400">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bell className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Notifications</h3>
              <p className="text-muted-foreground">
                Get timely alerts for new matching scholarships, application updates, deadlines, and important announcements.
              </p>
            </div>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-xl transition-all hover:scale-105 hover:border-yellow-400">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Readiness Score</h3>
              <p className="text-muted-foreground">
                Know exactly where you stand with our comprehensive readiness calculator. Get personalized recommendations to improve your chances.
              </p>
            </div>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-xl transition-all hover:scale-105 hover:border-indigo-400">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Profile System</h3>
              <p className="text-muted-foreground">
                Build a comprehensive profile once and get matched to hundreds of relevant scholarships automatically.
              </p>
            </div>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-xl transition-all hover:scale-105 hover:border-red-400">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">One-Click Applications</h3>
              <p className="text-muted-foreground">
                Apply to multiple scholarships instantly with your saved profile. Track all applications in one centralized dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-muted-foreground">
                Sign up and complete your profile with academic details, interests, and background
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-muted-foreground">
                Our AI algorithm finds scholarships that perfectly match your profile and goals
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply & Track</h3>
              <p className="text-muted-foreground">
                Apply with one click and track all your applications until you get awarded
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Making Education Accessible for Everyone
              </h2>
              <p className="text-blue-100 text-lg">
                Join thousands of students who found their perfect scholarship
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">1,000+</div>
                <div className="text-blue-100">Active Scholarships</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">50,000+</div>
                <div className="text-blue-100">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">₹500Cr+</div>
                <div className="text-blue-100">Amount Awarded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Your Scholarship Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Create your free account today and get matched with scholarships worth lakhs of rupees
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/signup">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/scholarships">
                  Browse Scholarships
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
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
