import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Lightbulb, 
  BarChart3, 
  Users, 
  Zap, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-white">Cherzs</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-900">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-black hover:bg-gray-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Find Your Next
            <span className="text-white">
              {" "}SaaS Idea
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover validated problems, generate ideas with proven frameworks, and validate your concepts with real market data. 
            Stop guessing, start building what people actually want.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-black hover:bg-gray-200">
                Start Discovering Ideas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Find Your Next SaaS Idea
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From problem discovery to market validation, we've got you covered with proven frameworks and real data.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Problem Radar</CardTitle>
              <CardDescription className="text-gray-400">
                Discover real problems from Reddit, Hacker News, and review platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Aggregated from 10+ sources
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Severity scoring system
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Category-based filtering
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Idea Framework Engine</CardTitle>
              <CardDescription className="text-gray-400">
                Generate ideas using proven frameworks like unbundling and niche targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  4 proven frameworks
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  AI-powered idea generation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Market size estimation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Validation Toolkit</CardTitle>
              <CardDescription className="text-gray-400">
                Validate your ideas with surveys, landing pages, and market research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Survey templates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Landing page builder
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Market signal analysis
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to find and validate your next SaaS idea
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Discover Problems</h3>
              <p className="text-gray-400">
                Browse validated problems from real users across Reddit, Hacker News, and review platforms. 
                Filter by category and severity to find the most promising opportunities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Generate Ideas</h3>
              <p className="text-gray-400">
                Use proven frameworks like "Unbundle a Giant" or "Pick a Niche" to generate 
                concrete SaaS ideas. Get market size estimates and competition analysis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Validate & Build</h3>
              <p className="text-gray-400">
                Create surveys and landing pages to validate your ideas with real users. 
                Get comprehensive reports with actionable next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Next SaaS Idea?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building successful SaaS products with validated ideas.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-black hover:bg-gray-200">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold">Cherzs</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for SaaS idea discovery and validation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Problem Radar</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Idea Framework</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Validation Toolkit</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cherzs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
