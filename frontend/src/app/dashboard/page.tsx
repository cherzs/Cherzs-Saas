'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Lightbulb, 
  BarChart3, 
  TrendingUp,
  Users,
  Target,
  ArrowRight,
  Plus,
  Filter,
  Eye,
  ChevronRight,
  Clock,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('problems')

  const mockProblems = [
    {
      id: 1,
      title: "Email marketing automation is too complex",
      description: "Users find it difficult to set up automated email sequences in existing tools",
      source: "reddit",
      category: "marketing",
      severity_score: 8.5,
      mention_count: 23,
      created_at: "2024-01-15T10:30:00Z",
      trend: "up"
    },
    {
      id: 2,
      title: "No simple CRM for small agencies",
      description: "Existing CRMs are either too complex or too expensive for small marketing agencies",
      source: "hackernews",
      category: "productivity",
      severity_score: 7.8,
      mention_count: 15,
      created_at: "2024-01-14T15:20:00Z",
      trend: "stable"
    },
    {
      id: 3,
      title: "Invoice generation takes too long",
      description: "Small businesses spend hours creating and sending invoices manually",
      source: "g2",
      category: "finance",
      severity_score: 6.9,
      mention_count: 8,
      created_at: "2024-01-13T09:45:00Z",
      trend: "down"
    }
  ]

  const mockIdeas = [
    {
      id: 1,
      title: "Simplified Email Automation Tool",
      description: "Drag-and-drop email automation for non-technical users",
      framework_type: "unbundle",
      market_size: "Medium",
      competition_level: "medium",
      validation_score: 75,
      potential_revenue: "$2.4M"
    },
    {
      id: 2,
      title: "Agency CRM",
      description: "CRM specifically designed for small marketing agencies",
      framework_type: "niche",
      market_size: "Small but loyal",
      competition_level: "low",
      validation_score: 82,
      potential_revenue: "$1.8M"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cherzs
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <Users className="h-4 w-4 mr-2" />
                Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Developer!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to discover your next SaaS idea? Let's find some problems to solve.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Problems Found</p>
                    <p className="text-3xl font-bold text-white">1,247</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Ideas Generated</p>
                    <p className="text-3xl font-bold text-white">89</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Validations</p>
                    <p className="text-3xl font-bold text-white">23</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +15%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Success Rate</p>
                    <p className="text-3xl font-bold text-white">76%</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +5%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('problems')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'problems'
                  ? 'bg-white text-black shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Problem Radar
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'ideas'
                  ? 'bg-white text-black shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Lightbulb className="h-4 w-4 inline mr-2" />
              Idea Framework
            </button>
            <button
              onClick={() => setActiveTab('validation')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'validation'
                  ? 'bg-white text-black shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Validation Toolkit
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'problems' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Recent Problems</h2>
                <p className="text-gray-400">Discover trending problems in your target market</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Ideas
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {mockProblems.map((problem, index) => (
                <Card key={problem.id} className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
                            {problem.category}
                          </Badge>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            2 hours ago
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3 leading-tight">
                          {problem.title}
                        </h3>
                        <p className="text-gray-400 mb-4 text-lg leading-relaxed">{problem.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                            Source: {problem.source}
                          </span>
                          <span className="flex items-center">
                            <Zap className="h-4 w-4 mr-2" />
                            Mentions: {problem.mention_count}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-4 ml-6">
                        <div className="text-right">
                          <Badge variant="secondary" className={`text-lg px-4 py-2 ${
                            problem.severity_score >= 8 ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30' :
                            problem.severity_score >= 6 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30' :
                            'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
                          }`}>
                            {problem.severity_score}/10
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Severity Score</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                          <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                          View Details
                          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Generated Ideas</h2>
                <p className="text-gray-400">AI-powered ideas based on your problem analysis</p>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Generate New Idea
              </Button>
            </div>

            <div className="grid gap-6">
              {mockIdeas.map((idea) => (
                <Card key={idea.id} className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                            {idea.framework_type}
                          </Badge>
                          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                            {idea.potential_revenue}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3 leading-tight">
                          {idea.title}
                        </h3>
                        <p className="text-gray-400 mb-4 text-lg leading-relaxed">{idea.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Market: {idea.market_size}</span>
                          <span>Competition: {idea.competition_level}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-4 ml-6">
                        <div className="text-right">
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 text-lg px-4 py-2">
                            {idea.validation_score}/100
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Validation Score</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                          <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                          Validate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Validation Projects</h2>
                <p className="text-gray-400">Test your ideas with real market data</p>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                New Validation
              </Button>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-12">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    No validation projects yet
                  </h3>
                  <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                    Start validating your ideas with surveys, landing pages, and market research to ensure product-market fit.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-200 px-8 py-3">
                    <Plus className="h-5 w-5 mr-2" />
                    Create First Validation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 