import Link from "next/link";
import { 
  ArrowRightIcon, 
  MagnifyingGlassIcon, 
  EyeIcon, 
  HeartIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  SparklesIcon,
  StarIcon,
  CheckIcon,
  UsersIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Enhanced Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <RocketLaunchIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cherzs SaaS</h1>
                <p className="text-xs text-gray-400">Ideas Marketplace</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/browse"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors relative group"
              >
                Browse Ideas
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></div>
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Get Started Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-8">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300">Trusted by 7,280+ developers worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Turn Your 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> SaaS Ideas</span>
              <br />Into Reality
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the largest community of SaaS innovators. Share your ideas, get feedback, find co-founders, and secure funding for your next breakthrough product.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search 63,956 SaaS ideas... (AI, Fintech, Healthcare)"
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 inline-flex items-center shadow-2xl"
              >
                <RocketLaunchIcon className="mr-2 h-5 w-5" />
                Start Sharing Ideas
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/browse"
                className="bg-gray-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold border border-gray-600 hover:bg-gray-700/50 transition-all"
              >
                Explore Ideas
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-gray-900"></div>
                  ))}
                </div>
                <span>Join 7,280+ developers</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From idea validation to funding, we provide the complete ecosystem for SaaS success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LightBulbIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Share & Validate Ideas
              </h3>
              <p className="text-gray-300 mb-6">
                Upload screenshots, get instant feedback, and validate your SaaS concepts with a community of experts
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Instant community feedback
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Market validation tools
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Screenshot galleries
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Find Your Dream Team
              </h3>
              <p className="text-gray-300 mb-6">
                Connect with co-founders, developers, and mentors who share your vision and passion
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Co-founder matching
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Expert mentorship
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Skill-based networking
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Track & Scale Success
              </h3>
              <p className="text-gray-300 mb-6">
                Monitor engagement, track funding opportunities, and scale your ideas into profitable businesses
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Real-time analytics
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Funding connections
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                  Growth tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories - Enhanced */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trending Categories</h2>
            <p className="text-gray-300">Explore ideas across the hottest SaaS markets</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "AI/ML", count: "2,341", growth: "+23%" },
              { name: "Fintech", count: "1,892", growth: "+18%" },
              { name: "Healthcare", count: "1,456", growth: "+31%" },
              { name: "Education", count: "1,203", growth: "+15%" },
              { name: "E-commerce", count: "987", growth: "+12%" },
              { name: "Productivity", count: "856", growth: "+27%" }
            ].map((category) => (
              <button
                key={category.name}
                className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white px-4 py-6 rounded-xl text-sm font-medium transition-all border border-gray-700 hover:border-gray-600 group"
              >
                <div className="text-lg font-semibold">{category.name}</div>
                <div className="text-gray-400 text-xs mt-1">{category.count} ideas</div>
                <div className="text-green-400 text-xs mt-1 group-hover:text-green-300">{category.growth}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ideas - Enhanced */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Ideas</h2>
              <p className="text-gray-300">Discover the most innovative SaaS concepts</p>
            </div>
            <Link
              href="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              View All
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Customer Support Platform",
                author: "Sarah Chen",
                description: "Automated customer support system that learns from interactions and provides personalized responses across multiple channels.",
                tags: ["AI", "Customer Support", "SaaS"],
                views: 2156,
                likes: 189,
                trending: true,
                funding: "$2.3M"
              },
              {
                title: "Blockchain Healthcare Records",
                author: "Mike Rodriguez",
                description: "Secure, decentralized platform for managing patient health records with full privacy control and interoperability.",
                tags: ["Blockchain", "Healthcare", "Privacy"],
                views: 1834,
                likes: 156,
                trending: false,
                funding: "$1.8M"
              },
              {
                title: "No-Code API Builder",
                author: "Emma Thompson",
                description: "Visual platform that allows non-technical users to create, test, and deploy APIs without writing a single line of code.",
                tags: ["No-Code", "API", "Developer Tools"],
                views: 3247,
                likes: 267,
                trending: true,
                funding: "$4.1M"
              }
            ].map((idea, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {idea.trending && (
                        <div className="flex items-center bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs font-medium mr-2">
                          <BoltIcon className="h-3 w-3 mr-1" />
                          Trending
                        </div>
                      )}
                      <div className="flex items-center bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        💰 {idea.funding} raised
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-blue-400 text-sm mb-3">by {idea.author}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {idea.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{idea.views.toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <HeartIcon className="h-4 w-4 mr-1" />
                  <span>{idea.likes}</span>
                  <span className="mx-2">•</span>
                  <span className="text-green-400">{((idea.likes / idea.views) * 100).toFixed(1)}% engagement</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-gray-600/50 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powering SaaS Innovation</h2>
            <p className="text-gray-300">Join thousands of entrepreneurs building the future</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "63,956", label: "SaaS Ideas Shared", icon: LightBulbIcon, color: "blue" },
              { number: "7,280", label: "Active Developers", icon: UsersIcon, color: "green" },
              { number: "$47.2M", label: "Total Funding Raised", icon: ChartBarIcon, color: "purple" },
              { number: "89%", label: "Success Rate", icon: ShieldCheckIcon, color: "orange" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SparklesIcon className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Turn Your Idea Into Reality?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of innovators and start building the next breakthrough SaaS product today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center shadow-2xl"
            >
              <RocketLaunchIcon className="mr-2 h-5 w-5" />
              Start Building Now
            </Link>
            <Link
              href="/browse"
              className="bg-blue-700/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold border border-blue-500 hover:bg-blue-700/70 transition-all"
            >
              Explore Ideas First
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <RocketLaunchIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Cherzs SaaS</h3>
                  <p className="text-xs text-gray-400">Ideas Marketplace</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The world's largest platform for SaaS innovation. Where great ideas meet great execution.
              </p>
              <div className="flex space-x-4">
                {/* Social Links */}
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-gray-400">𝕏</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-gray-400">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse Ideas</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Share Ideas</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Cherzs SaaS. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-sm text-gray-400">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Enterprise Security
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                All systems operational
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
