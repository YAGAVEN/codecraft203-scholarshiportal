import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  Award, 
  Bell, 
  TrendingUp, 
  ArrowRight, 
  Search, 
  Target, 
  Zap, 
  CheckCircle,
  Sparkles,
  Globe,
  Users,
  DollarSign,
  Clock,
  BarChart3,
  Shield
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Scholarship Track</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/scholarships" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Browse Scholarships
              </Link>
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                India&apos;s Smart Scholarship Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Your Perfect{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Scholarship
                </span>{' '}
                Match
              </h1>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl">
                Connect with thousands of scholarships tailored to your profile. Track applications, get instant matches, and turn your academic dreams into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="gap-2">
                  <Link href="/signup">
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/scholarships">
                    Explore Scholarships
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Scholarships</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">₹500Cr+</div>
                  <div className="text-sm text-muted-foreground">Awarded</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative hidden lg:block">
              <div className="relative w-full rounded-2xl bg-card/50 backdrop-blur-sm border p-6 shadow-2xl">
                <div className="space-y-4">
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">Chevening Scholarship</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">99% Match</Badge>
                          <span>•</span>
                          <Globe className="h-3 w-3" />
                          <span>UK</span>
                          <span>•</span>
                          <DollarSign className="h-3 w-3" />
                          <span>£30,000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">Fulbright Program</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">95% Match</Badge>
                          <span>•</span>
                          <Globe className="h-3 w-3" />
                          <span>USA</span>
                          <span>•</span>
                          <DollarSign className="h-3 w-3" />
                          <span>$50,000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">DAAD Scholarship</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">92% Match</Badge>
                          <span>•</span>
                          <Globe className="h-3 w-3" />
                          <span>Germany</span>
                          <span>•</span>
                          <DollarSign className="h-3 w-3" />
                          <span>€1,200/mo</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <Sparkles className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Students Choose{' '}
              <span className="text-primary">Scholarship Track</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The complete scholarship discovery and application platform built for Indian students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Smart Matching Algorithm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  AI-powered matching based on your course, category, economic background, and academic profile for the best scholarship fit.
                </p>
              </CardContent>
            </Card>

            <Card className="group border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Application Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Monitor every application status from submission to acceptance. Get real-time updates and never miss important deadlines.
                </p>
              </CardContent>
            </Card>

            <Card className="group border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Instant Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Get timely alerts for new matching scholarships, application updates, deadlines, and important announcements.
                </p>
              </CardContent>
            </Card>

            <Card className="group border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Readiness Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Know exactly where you stand with our comprehensive readiness calculator. Get personalized recommendations to improve your chances.
                </p>
              </CardContent>
            </Card>

            <Card className="group border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-lg">Complete Profile System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Build a comprehensive profile once and get matched to hundreds of relevant scholarships automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="group border hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-lg">One-Click Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Apply to multiple scholarships instantly with your saved profile. Track all applications in one centralized dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <Target className="h-3 w-3 mr-1" />
              Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-primary-foreground shadow-lg">
                  1
                </div>
                <CardTitle className="text-xl">Create Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sign up and complete your profile with academic details, interests, and background
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-white shadow-lg">
                  2
                </div>
                <CardTitle className="text-xl">Get Matched</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI algorithm finds scholarships that perfectly match your profile and goals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-white shadow-lg">
                  3
                </div>
                <CardTitle className="text-xl">Apply & Track</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Apply with one click and track all your applications until you get awarded
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <CardHeader className="relative text-center pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                Making Education Accessible for Everyone
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Join thousands of students who found their perfect scholarship
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Award className="h-8 w-8 text-yellow-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">1,000+</div>
                  <div className="text-primary-foreground/80 text-sm">Active Scholarships</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Users className="h-8 w-8 text-yellow-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">50,000+</div>
                  <div className="text-primary-foreground/80 text-sm">Students Helped</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <DollarSign className="h-8 w-8 text-yellow-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">₹500Cr+</div>
                  <div className="text-primary-foreground/80 text-sm">Amount Awarded</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <BarChart3 className="h-8 w-8 text-yellow-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">95%</div>
                  <div className="text-primary-foreground/80 text-sm">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                <Badge className="mb-2" variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Get Started Today
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Ready to Start Your Scholarship Journey?
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  Create your free account today and get matched with scholarships worth lakhs of rupees
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="gap-2">
                    <Link href="/signup">
                      Create Free Account <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/scholarships">
                      Browse Scholarships
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Instant Access</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">Scholarship Track</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Empowering students to achieve their academic dreams through smart scholarship matching.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/scholarships" className="hover:text-foreground transition-colors">Browse Scholarships</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Providers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Register as Provider</Link></li>
                <li><Link href="/provider/scholarships" className="hover:text-foreground transition-colors">Manage Scholarships</Link></li>
                <li><Link href="/provider/applications" className="hover:text-foreground transition-colors">Review Applications</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Security & Trust</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>Secure & Encrypted</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>Verified Scholarships</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>50K+ Happy Students</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Scholarship Track Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
