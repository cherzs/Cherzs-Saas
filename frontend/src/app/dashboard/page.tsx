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
  Eye
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
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "No simple CRM for small agencies",
      description: "Existing CRMs are either too complex or too expensive for small marketing agencies",
      source: "hackernews",
      category: "productivity",
      severity_score: 7.8,
      mention_count: 15,
      created_at: "2024-01-14T15:20:00Z"
    },
    {
      id: 3,
      title: "Invoice generation takes too long",
      description: "Small businesses spend hours creating and sending invoices manually",
      source: "g2",
      category: "finance",
      severity_score: 6.9,
      mention_count: 8,
      created_at: "2024-01-13T09:45:00Z"
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
      validation_score: 75
    },
    {
      id: 2,
      title: "Agency CRM",
      description: "CRM specifically designed for small marketing agencies",
      framework_type: "niche",
      market_size: "Small but loyal",
      competition_level: "low",
      validation_score: 82
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Cherzs</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Developer! 👋
          </h1>
          <p className="text-gray-600">
            Ready to discover your next SaaS idea? Let's find some problems to solve.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Problems Found</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ideas Generated</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Validations</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">76%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('problems')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'problems'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Problem Radar
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ideas'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lightbulb className="h-4 w-4 inline mr-2" />
              Idea Framework
            </button>
            <button
              onClick={() => setActiveTab('validation')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'validation'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Problems</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Ideas
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {mockProblems.map((problem) => (
                <Card key={problem.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {problem.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{problem.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Source: {problem.source}</span>
                          <span>Category: {problem.category}</span>
                          <span>Mentions: {problem.mention_count}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="secondary">
                          Score: {problem.severity_score}/10
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generated Ideas</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Generate New Idea
              </Button>
            </div>

            <div className="grid gap-6">
              {mockIdeas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {idea.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{idea.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Framework: {idea.framework_type}</span>
                          <span>Market: {idea.market_size}</span>
                          <span>Competition: {idea.competition_level}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="secondary">
                          Score: {idea.validation_score}/100
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4 mr-2" />
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Validation Projects</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Validation
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No validation projects yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start validating your ideas with surveys, landing pages, and market research.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
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