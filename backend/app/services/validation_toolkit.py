import json
import requests
from typing import List, Dict, Optional
from datetime import datetime
from app.core.config import settings

class ValidationToolkitService:
    def __init__(self):
        self.survey_templates = {
            "problem_validation": {
                "title": "Problem Validation Survey",
                "questions": [
                    {
                        "id": "problem_frequency",
                        "type": "scale",
                        "question": "How often do you face this problem?",
                        "options": ["Never", "Rarely", "Sometimes", "Often", "Daily"]
                    },
                    {
                        "id": "problem_impact",
                        "type": "scale",
                        "question": "How much does this problem impact your work?",
                        "options": ["No impact", "Minor", "Moderate", "Significant", "Critical"]
                    },
                    {
                        "id": "current_solution",
                        "type": "text",
                        "question": "How do you currently solve this problem?"
                    },
                    {
                        "id": "willingness_to_pay",
                        "type": "scale",
                        "question": "Would you pay for a solution to this problem?",
                        "options": ["No", "Maybe", "Yes", "Definitely", "Already paying"]
                    }
                ]
            },
            "solution_validation": {
                "title": "Solution Validation Survey",
                "questions": [
                    {
                        "id": "solution_interest",
                        "type": "scale",
                        "question": "How interested are you in this solution?",
                        "options": ["Not interested", "Somewhat", "Interested", "Very interested", "Must have"]
                    },
                    {
                        "id": "feature_priority",
                        "type": "multi_select",
                        "question": "Which features are most important to you?",
                        "options": ["Easy to use", "Affordable", "Fast", "Integrations", "Support"]
                    },
                    {
                        "id": "pricing_expectation",
                        "type": "text",
                        "question": "What would you expect to pay for this solution?"
                    },
                    {
                        "id": "timeline",
                        "type": "scale",
                        "question": "When would you need this solution?",
                        "options": ["No rush", "Within 6 months", "Within 3 months", "Within 1 month", "Immediately"]
                    }
                ]
            }
        }
        
        self.landing_page_templates = {
            "coming_soon": {
                "title": "Coming Soon",
                "description": "We're building something amazing. Be the first to know when we launch.",
                "features": [
                    "Early access to beta",
                    "Exclusive pricing",
                    "Priority support"
                ]
            },
            "problem_solution": {
                "title": "Problem-Solution",
                "description": "We understand your pain. Here's how we're solving it.",
                "features": [
                    "Clear problem statement",
                    "Solution overview",
                    "Benefits and outcomes"
                ]
            },
            "feature_focused": {
                "title": "Feature-Focused",
                "description": "Discover the key features that will transform your workflow.",
                "features": [
                    "Feature highlights",
                    "Use cases",
                    "Integration possibilities"
                ]
            }
        }
    
    async def create_survey(self, survey_type: str, idea: Dict, custom_questions: List[Dict] = None) -> Dict:
        """Create a validation survey"""
        if survey_type not in self.survey_templates:
            raise ValueError(f"Unknown survey type: {survey_type}")
        
        template = self.survey_templates[survey_type]
        
        survey = {
            "id": f"survey_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "type": survey_type,
            "title": template["title"],
            "idea_title": idea.get("title", ""),
            "idea_description": idea.get("description", ""),
            "questions": template["questions"].copy(),
            "created_at": datetime.now().isoformat(),
            "status": "active"
        }
        
        # Add custom questions if provided
        if custom_questions:
            survey["questions"].extend(custom_questions)
        
        return survey
    
    async def create_landing_page(self, template_type: str, idea: Dict, custom_content: Dict = None) -> Dict:
        """Create a landing page for idea validation"""
        if template_type not in self.landing_page_templates:
            raise ValueError(f"Unknown template type: {template_type}")
        
        template = self.landing_page_templates[template_type]
        
        # Generate content based on idea
        content = {
            "title": idea.get("title", template["title"]),
            "description": idea.get("description", template["description"]),
            "features": idea.get("key_features", template["features"]),
            "target_audience": idea.get("target_audience", ""),
            "monetization_model": idea.get("monetization_model", ""),
            "cta_text": "Get Early Access",
            "cta_url": "#waitlist"
        }
        
        # Override with custom content if provided
        if custom_content:
            content.update(custom_content)
        
        landing_page = {
            "id": f"landing_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "template_type": template_type,
            "idea_id": idea.get("id"),
            "content": content,
            "created_at": datetime.now().isoformat(),
            "status": "draft"
        }
        
        return landing_page
    
    async def get_market_signals(self, idea: Dict) -> Dict:
        """Get market signals for an idea"""
        # TODO: Implement actual market research
        # This would integrate with Google Trends, SEMrush, etc.
        keywords = idea.get("keywords", [])
        title = idea.get("title", "")
        
        # Return empty market research data
        market_data = {
            "search_volume": {
                "monthly_searches": "0 - 100",
                "trend": "stable",
                "seasonality": "stable"
            },
            "competition": {
                "competitor_count": "0-5",
                "competition_level": "low",
                "top_competitors": []
            },
            "advertising": {
                "cpc_range": "$0.50 - $1.50",
                "ad_competition": "low",
                "suggested_budget": "$100 - $500/month"
            },
            "trends": {
                "google_trends_score": 0,
                "trend_direction": "stable",
                "seasonal_peaks": []
            }
        }
        
        return market_data
    
    async def analyze_keywords(self, idea: Dict) -> Dict:
        """Analyze keywords for SEO and marketing"""
        keywords = idea.get("keywords", [])
        title = idea.get("title", "")
        
        # Simulate keyword analysis
        keyword_analysis = {
            "primary_keywords": keywords[:3],
            "long_tail_keywords": [
                f"best {kw} solution" for kw in keywords[:2]
            ],
            "competitor_keywords": [
                "alternative to",
                "vs competitor",
                "reviews"
            ],
            "search_intent": {
                "informational": ["how to", "what is", "guide"],
                "commercial": ["best", "top", "review"],
                "transactional": ["buy", "pricing", "demo"]
            }
        }
        
        return keyword_analysis
    
    async def generate_validation_plan(self, idea: Dict) -> Dict:
        """Generate a comprehensive validation plan"""
        plan = {
            "phase_1": {
                "title": "Problem Validation",
                "duration": "1-2 weeks",
                "activities": [
                    "Create problem validation survey",
                    "Share in relevant communities",
                    "Interview potential users",
                    "Analyze survey responses"
                ],
                "success_metrics": [
                    "50+ survey responses",
                    "70%+ report problem as significant",
                    "60%+ willing to pay for solution"
                ]
            },
            "phase_2": {
                "title": "Solution Validation",
                "duration": "2-3 weeks",
                "activities": [
                    "Create landing page",
                    "Build MVP/prototype",
                    "Get user feedback",
                    "Iterate based on feedback"
                ],
                "success_metrics": [
                    "100+ landing page visitors",
                    "20+ email signups",
                    "5+ user interviews"
                ]
            },
            "phase_3": {
                "title": "Market Validation",
                "duration": "3-4 weeks",
                "activities": [
                    "Analyze market signals",
                    "Research competitors",
                    "Estimate market size",
                    "Define pricing strategy"
                ],
                "success_metrics": [
                    "Clear market opportunity",
                    "Competitive advantage identified",
                    "Pricing strategy validated"
                ]
            }
        }
        
        return plan
    
    async def track_conversion_metrics(self, landing_page_id: str, event_type: str, data: Dict = None) -> Dict:
        """Track conversion metrics for landing pages"""
        event = {
            "landing_page_id": landing_page_id,
            "event_type": event_type,
            "timestamp": datetime.now().isoformat(),
            "data": data or {}
        }
        
        # In production, this would be stored in a database
        # For now, we'll return the event
        return event
    
    async def generate_validation_report(self, idea: Dict, survey_results: List[Dict] = None, 
                                       landing_page_metrics: Dict = None) -> Dict:
        """Generate a comprehensive validation report"""
        report = {
            "idea_summary": {
                "title": idea.get("title"),
                "description": idea.get("description"),
                "target_audience": idea.get("target_audience"),
                "monetization_model": idea.get("monetization_model")
            },
            "validation_score": self._calculate_validation_score(survey_results, landing_page_metrics),
            "recommendations": self._generate_recommendations(survey_results, landing_page_metrics),
            "next_steps": self._suggest_next_steps(survey_results, landing_page_metrics),
            "generated_at": datetime.now().isoformat()
        }
        
        return report
    
    def _calculate_validation_score(self, survey_results: List[Dict] = None, 
                                  landing_page_metrics: Dict = None) -> float:
        """Calculate overall validation score (0-100)"""
        score = 50  # Base score
        
        if survey_results:
            # Analyze survey responses
            positive_responses = sum(1 for result in survey_results 
                                  if result.get("willingness_to_pay", 0) >= 3)
            score += (positive_responses / len(survey_results)) * 25 if survey_results else 0
        
        if landing_page_metrics:
            # Analyze landing page performance
            conversion_rate = landing_page_metrics.get("conversion_rate", 0)
            score += min(conversion_rate * 100, 25)
        
        return min(100, max(0, score))
    
    def _generate_recommendations(self, survey_results: List[Dict] = None, 
                                landing_page_metrics: Dict = None) -> List[str]:
        """Generate recommendations based on validation results"""
        recommendations = []
        
        if survey_results:
            avg_willingness = sum(r.get("willingness_to_pay", 0) for r in survey_results) / len(survey_results)
            if avg_willingness < 3:
                recommendations.append("Consider adjusting pricing or value proposition")
            if avg_willingness >= 4:
                recommendations.append("Strong market demand - proceed with development")
        
        if landing_page_metrics:
            conversion_rate = landing_page_metrics.get("conversion_rate", 0)
            if conversion_rate < 0.05:
                recommendations.append("Improve landing page copy and design")
            if conversion_rate > 0.15:
                recommendations.append("Excellent conversion rate - scale marketing efforts")
        
        return recommendations
    
    def _suggest_next_steps(self, survey_results: List[Dict] = None, 
                           landing_page_metrics: Dict = None) -> List[str]:
        """Suggest next steps based on validation results"""
        next_steps = []
        
        validation_score = self._calculate_validation_score(survey_results, landing_page_metrics)
        
        if validation_score >= 80:
            next_steps.extend([
                "Build MVP",
                "Set up development team",
                "Create detailed business plan"
            ])
        elif validation_score >= 60:
            next_steps.extend([
                "Iterate on idea based on feedback",
                "Conduct more user interviews",
                "Refine value proposition"
            ])
        else:
            next_steps.extend([
                "Pivot or refine the idea",
                "Conduct more market research",
                "Consider different target audience"
            ])
        
        return next_steps 