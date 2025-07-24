'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService, Problem, Idea, Validation } from '@/services/api'

interface AppContextType {
  // State
  problems: Problem[]
  ideas: Idea[]
  validations: Validation[]
  isLoading: boolean
  error: string | null
  
  // Actions
  loadProblems: (filters?: any) => Promise<void>
  loadTrendingProblems: () => Promise<void>
  getProblemCategories: () => Promise<string[]>
  getProblemSources: () => Promise<any[]>
  generateIdeas: (problems: Problem[], frameworkType: string, industry?: string) => Promise<void>
  generateNewIdea: (frameworkType: string, problem: any, industry?: string) => Promise<void>
  validateIdea: (idea: any) => Promise<void>
  analyzeCompetition: (idea: any) => Promise<any>
  estimateMarketSize: (idea: any) => Promise<any>
  getAvailableFrameworks: () => Promise<any>
  getAvailableIndustries: () => Promise<string[]>
  createValidation: (idea: any, validationType: string) => Promise<void>
  getSurveyTemplates: () => Promise<any>
  getLandingPageTemplates: () => Promise<any>
  analyzeKeywords: (idea: any) => Promise<any>
  getMarketSignals: (idea: any) => Promise<any>
  generateValidationReport: (idea: any, surveyResults?: any[], landingPageMetrics?: any) => Promise<any>
  getLandingPageMetrics: (landingPageId: string) => Promise<any>
  getSurveyResults: (surveyId: string) => Promise<any>
  clearError: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [validations, setValidations] = useState<Validation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const loadProblems = async (filters?: any) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.getProblems(filters)
      if (response.success) {
        setProblems(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load problems')
      console.error('Error loading problems:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingProblems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.getTrendingProblems()
      if (response.success) {
        setProblems(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trending problems')
      console.error('Error loading trending problems:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getProblemCategories = async (): Promise<string[]> => {
    try {
      const response = await apiService.getProblemCategories()
      if (response.success) {
        return response.data
      }
      return []
    } catch (err) {
      console.error('Error getting problem categories:', err)
      return []
    }
  }

  const getProblemSources = async (): Promise<any[]> => {
    try {
      const response = await apiService.getProblemSources()
      if (response.success) {
        return response.data
      }
      return []
    } catch (err) {
      console.error('Error getting problem sources:', err)
      return []
    }
  }

  const generateIdeas = async (problems: Problem[], frameworkType: string, industry?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.batchGenerateIdeas(problems, frameworkType, industry)
      if (response.success) {
        setIdeas(prev => [...prev, ...response.data])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ideas')
      console.error('Error generating ideas:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewIdea = async (frameworkType: string, problem: any, industry?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.generateIdea(frameworkType, problem, industry)
      if (response.success) {
        setIdeas(prev => [...prev, response.data])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate new idea')
      console.error('Error generating new idea:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const validateIdea = async (idea: any) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.validateIdea(idea)
      if (response.success) {
        // Update the idea with validation results
        setIdeas(prev => prev.map(i => 
          i.id === idea.id ? { ...i, validation_score: response.data.validation_score } : i
        ))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate idea')
      console.error('Error validating idea:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeCompetition = async (idea: any) => {
    try {
      const response = await apiService.analyzeCompetition(idea)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error analyzing competition:', err)
      return null
    }
  }

  const estimateMarketSize = async (idea: any) => {
    try {
      const response = await apiService.estimateMarketSize(idea)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error estimating market size:', err)
      return null
    }
  }

  const getAvailableFrameworks = async () => {
    try {
      const response = await apiService.getAvailableFrameworks()
      if (response.success) {
        return response.data
      }
      return {}
    } catch (err) {
      console.error('Error getting available frameworks:', err)
      return {}
    }
  }

  const getAvailableIndustries = async (): Promise<string[]> => {
    try {
      const response = await apiService.getAvailableIndustries()
      if (response.success) {
        return response.data
      }
      return []
    } catch (err) {
      console.error('Error getting available industries:', err)
      return []
    }
  }

  const createValidation = async (idea: any, validationType: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      let response
      if (validationType === 'survey') {
        response = await apiService.createSurvey('problem_validation', idea)
      } else if (validationType === 'landing_page') {
        response = await apiService.createLandingPage('coming_soon', idea)
      } else {
        response = await apiService.generateValidationPlan(idea)
      }
      
      if (response.success) {
        setValidations(prev => [...prev, response.data])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create validation')
      console.error('Error creating validation:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getSurveyTemplates = async () => {
    try {
      const response = await apiService.getSurveyTemplates()
      if (response.success) {
        return response.data
      }
      return {}
    } catch (err) {
      console.error('Error getting survey templates:', err)
      return {}
    }
  }

  const getLandingPageTemplates = async () => {
    try {
      const response = await apiService.getLandingPageTemplates()
      if (response.success) {
        return response.data
      }
      return {}
    } catch (err) {
      console.error('Error getting landing page templates:', err)
      return {}
    }
  }

  const analyzeKeywords = async (idea: any) => {
    try {
      const response = await apiService.analyzeKeywords(idea)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error analyzing keywords:', err)
      return null
    }
  }

  const getMarketSignals = async (idea: any) => {
    try {
      const response = await apiService.getMarketSignals(idea)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error getting market signals:', err)
      return null
    }
  }

  const generateValidationReport = async (idea: any, surveyResults?: any[], landingPageMetrics?: any) => {
    try {
      const response = await apiService.generateValidationReport(idea, surveyResults, landingPageMetrics)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error generating validation report:', err)
      return null
    }
  }

  const getLandingPageMetrics = async (landingPageId: string) => {
    try {
      const response = await apiService.getLandingPageMetrics(landingPageId)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error getting landing page metrics:', err)
      return null
    }
  }

  const getSurveyResults = async (surveyId: string) => {
    try {
      const response = await apiService.getSurveyResults(surveyId)
      if (response.success) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Error getting survey results:', err)
      return null
    }
  }

  // Load initial data
  useEffect(() => {
    loadProblems()
  }, [])

  const value: AppContextType = {
    problems,
    ideas,
    validations,
    isLoading,
    error,
    loadProblems,
    loadTrendingProblems,
    getProblemCategories,
    getProblemSources,
    generateIdeas,
    generateNewIdea,
    validateIdea,
    analyzeCompetition,
    estimateMarketSize,
    getAvailableFrameworks,
    getAvailableIndustries,
    createValidation,
    getSurveyTemplates,
    getLandingPageTemplates,
    analyzeKeywords,
    getMarketSignals,
    generateValidationReport,
    getLandingPageMetrics,
    getSurveyResults,
    clearError,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
} 