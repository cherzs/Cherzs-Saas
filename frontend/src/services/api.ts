const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface Problem {
  id: string;
  title: string;
  description: string;
  source: string;
  source_url: string;
  category: string;
  severity_score: number;
  mention_count: number;
  keywords: string[];
  created_at: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  problem_id: string;
  framework_type: string;
  market_size: string;
  competition_level: string;
  monetization_model: string;
  tech_stack: string[];
  validation_score: number;
  created_at: string;
}

export interface Validation {
  id: string;
  idea_id: string;
  validation_type: string;
  status: string;
  results: any;
  created_at: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Problems API
  async getProblems(filters?: {
    category?: string;
    min_severity?: number;
    keywords?: string;
    limit?: number;
  }): Promise<{ success: boolean; data: Problem[]; count: number }> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.min_severity) params.append('min_severity', filters.min_severity.toString());
    if (filters?.keywords) params.append('keywords', filters.keywords);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return this.request(`/api/v1/problems?${params.toString()}`);
  }

  async getProblemDetails(problemId: string): Promise<{ success: boolean; data: Problem }> {
    return this.request(`/api/v1/problems/${problemId}`);
  }

  async searchProblems(query: string, limit: number = 20): Promise<{ success: boolean; data: Problem[]; count: number }> {
    return this.request(`/api/v1/problems/search`, {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    });
  }

  async getProblemCategories(): Promise<{ success: boolean; data: string[] }> {
    return this.request(`/api/v1/problems/categories`);
  }

  async getProblemSources(): Promise<{ success: boolean; data: any[] }> {
    return this.request(`/api/v1/problems/sources`);
  }

  async getTrendingProblems(): Promise<{ success: boolean; data: Problem[]; count: number }> {
    return this.request(`/api/v1/problems/trending`);
  }

  // Ideas API
  async generateIdea(frameworkType: string, problem: any, industry?: string): Promise<{ success: boolean; data: Idea; framework_used: string }> {
    return this.request(`/api/v1/ideas/generate`, {
      method: 'POST',
      body: JSON.stringify({ framework_type: frameworkType, problem, industry }),
    });
  }

  async batchGenerateIdeas(problems: any[], frameworkType: string, industry?: string): Promise<{ success: boolean; data: Idea[]; count: number; framework_used: string }> {
    return this.request(`/api/v1/ideas/batch-generate`, {
      method: 'POST',
      body: JSON.stringify({ problems, framework_type: frameworkType, industry }),
    });
  }

  async validateIdea(idea: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/ideas/validate-idea`, {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async getAvailableFrameworks(): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/ideas/frameworks`);
  }

  async analyzeCompetition(idea: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/ideas/analyze-competition`, {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async estimateMarketSize(idea: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/ideas/estimate-market-size`, {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async getFrameworkExamples(frameworkType: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/ideas/examples/${frameworkType}`);
  }

  async getAvailableIndustries(): Promise<{ success: boolean; data: string[] }> {
    return this.request(`/api/v1/ideas/industries`);
  }

  // Validation API
  async createSurvey(surveyType: string, idea: any, customQuestions?: any[]): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/surveys/create`, {
      method: 'POST',
      body: JSON.stringify({ survey_type: surveyType, idea, custom_questions: customQuestions }),
    });
  }

  async createLandingPage(templateType: string, idea: any, customContent?: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/landing-pages/create`, {
      method: 'POST',
      body: JSON.stringify({ template_type: templateType, idea, custom_content: customContent }),
    });
  }

  async getMarketSignals(idea: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/market-signals`, {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async generateValidationPlan(idea: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/validation-plan`, {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async getSurveyTemplates(): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/surveys/templates`);
  }

  async getLandingPageTemplates(): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/landing-pages/templates`);
  }

  async analyzeKeywords(idea: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/keyword-analysis`, {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async trackConversion(landingPageId: string, eventType: string, data?: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/track-conversion`, {
      method: 'POST',
      body: JSON.stringify({ landing_page_id: landingPageId, event_type: eventType, data }),
    });
  }

  async generateValidationReport(idea: any, surveyResults?: any[], landingPageMetrics?: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/generate-report`, {
      method: 'POST',
      body: JSON.stringify({ idea, survey_results: surveyResults, landing_page_metrics: landingPageMetrics }),
    });
  }

  async getLandingPageMetrics(landingPageId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/metrics/${landingPageId}`);
  }

  async getSurveyResults(surveyId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/validation/survey-results/${surveyId}`);
  }

  // Auth API
  async login(email: string, password: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, username: string, password: string, fullName: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, username, password, full_name: fullName }),
    });
  }

  async getCurrentUser(token: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(token: string, updates: { full_name?: string; username?: string }): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/v1/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
  }
}

export const apiService = new ApiService(); 