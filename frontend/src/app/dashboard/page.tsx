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
import { useAppContext } from '@/contexts/AppContext'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('problems')
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const {
    problems,
    ideas,
    validations,
    isLoading,
    error,
    loadProblems,
    generateIdeas,
    generateNewIdea,
    validateIdea,
    createValidation,
    clearError
  } = useAppContext()

  // Function handlers
  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true)
    try {
      if (problems.length > 0) {
        await generateIdeas(problems, 'unbundle')
        console.log('Ideas generated successfully! Check the Ideas tab to see your new ideas.')
      } else {
        console.log('No problems available to generate ideas from. Please discover some problems first.')
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  const handleFilter = async () => {
    setIsFiltering(true)
    try {
      await loadProblems({ min_severity: 7.0 })
      console.log('Filter applied! Showing problems with severity score > 7.0')
    } catch (error) {
      console.error('Error applying filter:', error)
    } finally {
      setIsFiltering(false)
    }
  }

  const handleViewDetails = (problemId: string) => {
    console.log(`Viewing details for problem ${problemId}. This would open a detailed view with more information about the problem.`)
  }

  const handleGenerateNewIdea = async () => {
    setIsGeneratingIdeas(true)
    try {
      if (problems.length > 0) {
        const selectedProblem = problems[0] // Use the first problem as example
        await generateNewIdea('unbundle', selectedProblem)
        console.log('New idea generated! Check the Ideas tab to see your latest creation.')
      } else {
        console.log('No problems available. Please discover some problems first.')
      }
    } catch (error) {
      console.error('Error generating new idea:', error)
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  const handleValidate = async (ideaId: string) => {
    setIsValidating(true)
    try {
      const idea = ideas.find(i => i.id === ideaId)
      if (idea) {
        await validateIdea(idea)
        console.log(`Validation started for idea ${ideaId}. This would create a validation survey, set up a landing page, and start market research.`)
      }
    } catch (error) {
      console.error('Error starting validation:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleNewValidation = async () => {
    try {
      if (ideas.length > 0) {
        const selectedIdea = ideas[0] // Use the first idea as example
        await createValidation(selectedIdea, 'survey')
        console.log('Creating new validation project. This would open a wizard to select validation methods.')
      } else {
        console.log('No ideas available. Please generate some ideas first.')
      }
    } catch (error) {
      console.error('Error creating validation:', error)
    }
  }

  const handleCreateFirstValidation = async () => {
    try {
      if (ideas.length > 0) {
        const selectedIdea = ideas[0] // Use the first idea as example
        await createValidation(selectedIdea, 'landing_page')
        console.log('Setting up your first validation project. This would guide you through the validation process.')
      } else {
        console.log('No ideas available. Please generate some ideas first.')
      }
    } catch (error) {
      console.error('Error creating first validation:', error)
    }
  }

  const handleAccountClick = () => {
    console.log('Account settings would open here, including profile information, subscription details, and billing information.')
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Reset loading states when changing tabs
    setIsGeneratingIdeas(false)
    setIsFiltering(false)
    setIsValidating(false)
    clearError()
  }

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'problems':
        setActiveTab('problems')
        break
      case 'ideas':
        setActiveTab('ideas')
        break
      case 'validations':
        setActiveTab('validation')
        break
      case 'success':
        const successRate = ideas.length > 0 ? Math.round((ideas.filter(i => i.validation_score > 70).length / ideas.length) * 100) : 0
        console.log(`Success Rate: ${successRate}%. Start generating and validating ideas to see your success rate improve!`)
        break
    }
  }

  const handleProblemCardClick = (problemId: string) => {
    console.log(`Opening detailed view for problem ${problemId}. This would show full problem description, source links, and market analysis.`)
  }

  const handleIdeaCardClick = (ideaId: string) => {
    console.log(`Opening detailed view for idea ${ideaId}. This would show complete idea description, market analysis, and validation status.`)
  }

  const handleWelcomeClick = () => {
    console.log('Welcome to Cherzs! This dashboard helps you discover problems, generate ideas, and validate them with market research.')
  }

  const handleSectionHeaderClick = (section: string) => {
    switch (section) {
      case 'problems':
        console.log('Recent Problems section shows problems discovered from Reddit, Hacker News, G2, and other sources.')
        break
      case 'ideas':
        console.log('Generated Ideas section shows ideas created using various frameworks like Unbundle a Giant, Pick a Niche, etc.')
        break
      case 'validation':
        console.log('Validation Projects section helps you validate ideas through surveys, landing pages, and market research.')
        break
    }
  }

  // Calculate stats
  const stats = [
    { icon: Search, label: "Problems Found", value: problems.length.toString(), type: "problems" },
    { icon: Lightbulb, label: "Ideas Generated", value: ideas.length.toString(), type: "ideas" },
    { icon: BarChart3, label: "Validations", value: validations.length.toString(), type: "validations" },
    { icon: TrendingUp, label: "Success Rate", value: ideas.length > 0 ? `${Math.round((ideas.filter(i => i.validation_score > 70).length / ideas.length) * 100)}%` : "0%", type: "success" }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 h-16 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto h-full px-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-base">C</span>
              </div>
              <span className="text-xl font-bold text-white">Cherzs</span>
            </div>
            
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2" onClick={handleAccountClick}>
                <Users className="h-4 w-4 mr-2.5" />
                Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-10 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleWelcomeClick}>
            <h1 className="text-3xl font-bold text-white mb-3">
              Welcome back, Developer!
            </h1>
            <p className="text-gray-400 text-lg">
              Ready to discover your next SaaS idea? Let's find some problems to solve.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-300 hover:text-red-200 mt-2"
                onClick={clearError}
              >
                Dismiss
              </Button>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="border-gray-800 bg-gray-900/50 backdrop-blur-sm cursor-pointer hover:bg-gray-900/70 transition-all duration-200"
                onClick={() => handleStatClick(stat.type)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1.5 bg-gray-900 p-1.5 rounded-lg">
              {[
                { id: 'problems', icon: Search, label: 'Problem Radar' },
                { id: 'ideas', icon: Lightbulb, label: 'Idea Framework' },
                { id: 'validation', icon: BarChart3, label: 'Validation Toolkit' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gray-800 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'problems' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors" onClick={() => handleSectionHeaderClick('problems')}>
                  Recent Problems
                </h2>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2"
                    onClick={handleFilter}
                    disabled={isFiltering || isLoading}
                  >
                    <Filter className="h-4 w-4 mr-2.5" />
                    {isFiltering ? 'Filtering...' : 'Filter'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-white text-black hover:bg-gray-200 px-4 py-2"
                    onClick={handleGenerateIdeas}
                    disabled={isGeneratingIdeas || isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2.5" />
                    {isGeneratingIdeas ? 'Generating...' : 'Generate Ideas'}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="py-16 px-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading problems...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : problems.length === 0 ? (
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="py-16 px-6">
                    <div className="text-center max-w-md mx-auto">
                      <Search className="h-14 w-14 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-white mb-3">
                        No problems found yet
                      </h3>
                      <p className="text-gray-400 mb-8 leading-relaxed">
                        Start by discovering problems from Reddit, Hacker News, and other sources. 
                        Click "Generate Ideas" to begin your journey.
                      </p>
                      <Button 
                        className="bg-white text-black hover:bg-gray-200 px-6 py-2.5"
                        onClick={handleGenerateIdeas}
                        disabled={isGeneratingIdeas}
                      >
                        <Plus className="h-4 w-4 mr-2.5" />
                        {isGeneratingIdeas ? 'Generating...' : 'Start Discovering'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {problems.map((problem) => (
                    <Card key={problem.id} className="hover:shadow-md transition-shadow border-gray-800 bg-gray-900/50 backdrop-blur-sm cursor-pointer hover:bg-gray-900/70" onClick={() => handleProblemCardClick(problem.id)}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-8">
                            <h3 className="text-lg font-semibold text-white mb-3">
                              {problem.title}
                            </h3>
                            <p className="text-gray-400 mb-4 leading-relaxed">{problem.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                              <span className="flex items-center">Source: {problem.source}</span>
                              <span className="flex items-center">Category: {problem.category}</span>
                              <span className="flex items-center">Mentions: {problem.mention_count}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700 px-3 py-1">
                              Score: {problem.severity_score}/10
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-300 hover:text-white hover:bg-gray-800 w-full justify-center"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetails(problem.id)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2.5" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ideas' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors" onClick={() => handleSectionHeaderClick('ideas')}>
                  Generated Ideas
                </h2>
                <Button 
                  size="sm" 
                  className="bg-white text-black hover:bg-gray-200 px-4 py-2"
                  onClick={handleGenerateNewIdea}
                  disabled={isGeneratingIdeas || isLoading}
                >
                  <Plus className="h-4 w-4 mr-2.5" />
                  {isGeneratingIdeas ? 'Generating...' : 'Generate New Idea'}
                </Button>
              </div>

              {isLoading ? (
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="py-16 px-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading ideas...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : ideas.length === 0 ? (
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="py-16 px-6">
                    <div className="text-center max-w-md mx-auto">
                      <Lightbulb className="h-14 w-14 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-white mb-3">
                        No ideas generated yet
                      </h3>
                      <p className="text-gray-400 mb-8 leading-relaxed">
                        Generate your first idea using proven frameworks like "Unbundle a Giant" 
                        or "Pick a Niche". Start with a problem and let AI help you create solutions.
                      </p>
                      <Button 
                        className="bg-white text-black hover:bg-gray-200 px-6 py-2.5"
                        onClick={handleGenerateNewIdea}
                        disabled={isGeneratingIdeas}
                      >
                        <Plus className="h-4 w-4 mr-2.5" />
                        {isGeneratingIdeas ? 'Generating...' : 'Generate First Idea'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {ideas.map((idea) => (
                    <Card key={idea.id} className="hover:shadow-md transition-shadow border-gray-800 bg-gray-900/50 backdrop-blur-sm cursor-pointer hover:bg-gray-900/70" onClick={() => handleIdeaCardClick(idea.id)}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-8">
                            <h3 className="text-lg font-semibold text-white mb-3">
                              {idea.title}
                            </h3>
                            <p className="text-gray-400 mb-4 leading-relaxed">{idea.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                              <span className="flex items-center">Framework: {idea.framework_type}</span>
                              <span className="flex items-center">Market: {idea.market_size}</span>
                              <span className="flex items-center">Competition: {idea.competition_level}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700 px-3 py-1">
                              Score: {idea.validation_score}/100
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-300 hover:text-white hover:bg-gray-800 w-full justify-center"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleValidate(idea.id)
                              }}
                              disabled={isValidating}
                            >
                              <ArrowRight className="h-4 w-4 mr-2.5" />
                              {isValidating ? 'Validating...' : 'Validate'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'validation' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors" onClick={() => handleSectionHeaderClick('validation')}>
                  Validation Projects
                </h2>
                <Button 
                  size="sm" 
                  className="bg-white text-black hover:bg-gray-200 px-4 py-2"
                  onClick={handleNewValidation}
                >
                  <Plus className="h-4 w-4 mr-2.5" />
                  New Validation
                </Button>
              </div>

              {isLoading ? (
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="py-16 px-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading validations...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : validations.length === 0 ? (
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="py-16 px-6">
                    <div className="text-center max-w-md mx-auto">
                      <BarChart3 className="h-14 w-14 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-white mb-3">
                        No validation projects yet
                      </h3>
                      <p className="text-gray-400 mb-8 leading-relaxed">
                        Start validating your ideas with surveys, landing pages, and market research.
                      </p>
                      <Button 
                        className="bg-white text-black hover:bg-gray-200 px-6 py-2.5"
                        onClick={handleCreateFirstValidation}
                      >
                        <Plus className="h-4 w-4 mr-2.5" />
                        Create First Validation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {validations.map((validation) => (
                    <Card key={validation.id} className="hover:shadow-md transition-shadow border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-8">
                            <h3 className="text-lg font-semibold text-white mb-3">
                              {validation.validation_type} Validation
                            </h3>
                            <p className="text-gray-400 mb-4 leading-relaxed">
                              Validation project for idea {validation.idea_id}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                              <span className="flex items-center">Type: {validation.validation_type}</span>
                              <span className="flex items-center">Status: {validation.status}</span>
                              <span className="flex items-center">Created: {new Date(validation.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700 px-3 py-1">
                              {validation.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 