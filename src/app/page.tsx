import Link from "next/link";
import { ArrowRightIcon, MagnifyingGlassIcon, BriefcaseIcon, UserGroupIcon, ChartBarIcon, EyeIcon, HeartIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-400">Cherzs SaaS</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/browse"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Browse Ideas
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Post an Idea
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              SaaS Ideas
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Browse 63,956 SaaS ideas from 7,280 developers. Filter the best remote SaaS projects by category, location, and skills.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SaaS ideas..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Post Your Idea
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/browse"
                className="bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                Browse Ideas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "AI/ML", "Fintech", "E-commerce", "Healthcare", "Education", "Productivity",
              "Social", "Gaming", "Real Estate", "Travel", "Food", "Fitness"
            ].map((category) => (
              <button
                key={category}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ideas Grid */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Featured SaaS Ideas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Customer Support",
                author: "John Developer",
                description: "Automated customer support system using AI to handle common queries and escalate complex issues.",
                tags: ["AI", "Customer Support", "SaaS"],
                views: 1240,
                likes: 89,
                posted: "2d"
              },
              {
                title: "Blockchain Payment Gateway",
                author: "Sarah Crypto",
                description: "Secure payment processing platform leveraging blockchain technology for transparent transactions.",
                tags: ["Blockchain", "Payments", "Fintech"],
                views: 2156,
                likes: 156,
                posted: "1d"
              },
              {
                title: "Healthcare Analytics Platform",
                author: "Mike HealthTech",
                description: "Comprehensive analytics dashboard for healthcare providers to track patient outcomes and optimize care.",
                tags: ["Healthcare", "Analytics", "Data"],
                views: 892,
                likes: 67,
                posted: "3d"
              },
              {
                title: "E-learning Management System",
                author: "Lisa EduTech",
                description: "Complete learning management system with course creation, student tracking, and assessment tools.",
                tags: ["Education", "LMS", "SaaS"],
                views: 1567,
                likes: 134,
                posted: "5d"
              },
              {
                title: "Real Estate CRM",
                author: "Alex PropTech",
                description: "Customer relationship management system specifically designed for real estate professionals.",
                tags: ["Real Estate", "CRM", "Sales"],
                views: 743,
                likes: 45,
                posted: "1w"
              },
              {
                title: "Fitness Tracking App",
                author: "David FitTech",
                description: "Comprehensive fitness tracking application with workout plans, nutrition tracking, and progress analytics.",
                tags: ["Fitness", "Mobile", "Health"],
                views: 1987,
                likes: 178,
                posted: "4d"
              }
            ].map((idea, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-blue-400 text-sm mb-2">by {idea.author}</p>
                  </div>
                  <span className="text-gray-400 text-xs">{idea.posted}</span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {idea.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{idea.views.toLocaleString()} views</span>
                  <span className="mx-2">•</span>
                  <HeartIcon className="h-4 w-4 mr-1" />
                  <span>{idea.likes} likes</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              View All Ideas
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">63,956</div>
              <div className="text-gray-300">SaaS Ideas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">7,280</div>
              <div className="text-gray-300">Developers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">$2.1M</div>
              <div className="text-gray-300">Total Funding</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Three simple steps to get your SaaS idea noticed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Create Your Profile
              </h3>
              <p className="text-gray-300">
                Sign up as a developer and build your portfolio
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Share Your Ideas
              </h3>
              <p className="text-gray-300">
                Upload screenshots and describe your SaaS vision
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Get Funded
              </h3>
              <p className="text-gray-300">
                Connect with investors and bring your idea to life
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Share Your Ideas?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building the future of SaaS
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started Today
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Cherzs SaaS</h3>
              <p className="text-gray-400">
                Where great SaaS ideas come to life
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse Ideas</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Post an Idea</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cherzs SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
