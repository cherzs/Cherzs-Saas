from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Dict, Optional
from app.services.validation_toolkit import ValidationToolkitService
from app.core.config import settings

router = APIRouter(prefix="/validation", tags=["validation"])

# Initialize service
validation_service = ValidationToolkitService()

@router.post("/surveys/create")
async def create_survey(
    survey_type: str = Body(..., description="Type of survey to create"),
    idea: Dict = Body(..., description="Idea to validate"),
    custom_questions: Optional[List[Dict]] = Body(None, description="Custom questions to add")
):
    """Create a validation survey"""
    try:
        survey = await validation_service.create_survey(survey_type, idea, custom_questions)
        
        return {
            "success": True,
            "data": survey
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/surveys/templates")
async def get_survey_templates():
    """Get available survey templates"""
    templates = {
        "problem_validation": {
            "name": "Problem Validation Survey",
            "description": "Validate if the problem you're solving is real and painful",
            "questions_count": 4,
            "estimated_time": "2-3 minutes"
        },
        "solution_validation": {
            "name": "Solution Validation Survey", 
            "description": "Validate if your solution addresses the problem effectively",
            "questions_count": 4,
            "estimated_time": "3-4 minutes"
        }
    }
    
    return {
        "success": True,
        "data": templates
    }

@router.post("/landing-pages/create")
async def create_landing_page(
    template_type: str = Body(..., description="Landing page template to use"),
    idea: Dict = Body(..., description="Idea to create landing page for"),
    custom_content: Optional[Dict] = Body(None, description="Custom content to override defaults")
):
    """Create a landing page for idea validation"""
    try:
        landing_page = await validation_service.create_landing_page(template_type, idea, custom_content)
        
        return {
            "success": True,
            "data": landing_page
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/landing-pages/templates")
async def get_landing_page_templates():
    """Get available landing page templates"""
    templates = {
        "coming_soon": {
            "name": "Coming Soon",
            "description": "Simple coming soon page to collect email signups",
            "best_for": "Early validation and building waitlist"
        },
        "problem_solution": {
            "name": "Problem-Solution",
            "description": "Focus on the problem and how you solve it",
            "best_for": "Validating problem-solution fit"
        },
        "feature_focused": {
            "name": "Feature-Focused",
            "description": "Highlight key features and benefits",
            "best_for": "Validating feature demand"
        }
    }
    
    return {
        "success": True,
        "data": templates
    }

@router.post("/market-signals")
async def get_market_signals(idea: Dict = Body(..., description="Idea to analyze")):
    """Get market signals for an idea"""
    try:
        signals = await validation_service.get_market_signals(idea)
        
        return {
            "success": True,
            "data": signals
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/keyword-analysis")
async def analyze_keywords(idea: Dict = Body(..., description="Idea to analyze")):
    """Analyze keywords for SEO and marketing"""
    try:
        analysis = await validation_service.analyze_keywords(idea)
        
        return {
            "success": True,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validation-plan")
async def generate_validation_plan(idea: Dict = Body(..., description="Idea to create plan for")):
    """Generate a comprehensive validation plan"""
    try:
        plan = await validation_service.generate_validation_plan(idea)
        
        return {
            "success": True,
            "data": plan
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/track-conversion")
async def track_conversion(
    landing_page_id: str = Body(..., description="Landing page ID"),
    event_type: str = Body(..., description="Type of conversion event"),
    data: Optional[Dict] = Body(None, description="Additional event data")
):
    """Track conversion metrics for landing pages"""
    try:
        event = await validation_service.track_conversion_metrics(landing_page_id, event_type, data)
        
        return {
            "success": True,
            "data": event
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-report")
async def generate_validation_report(
    idea: Dict = Body(..., description="Idea to generate report for"),
    survey_results: Optional[List[Dict]] = Body(None, description="Survey results"),
    landing_page_metrics: Optional[Dict] = Body(None, description="Landing page metrics")
):
    """Generate a comprehensive validation report"""
    try:
        report = await validation_service.generate_validation_report(idea, survey_results, landing_page_metrics)
        
        return {
            "success": True,
            "data": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/{landing_page_id}")
async def get_landing_page_metrics(landing_page_id: str):
    """Get metrics for a specific landing page"""
    try:
        # In a real implementation, this would fetch from database
        # For now, return mock data
        metrics = {
            "landing_page_id": landing_page_id,
            "total_visitors": 150,
            "unique_visitors": 120,
            "email_signups": 25,
            "conversion_rate": 0.167,
            "bounce_rate": 0.35,
            "avg_time_on_page": 120,
            "traffic_sources": {
                "direct": 40,
                "social": 30,
                "search": 20,
                "referral": 10
            },
            "events": [
                {
                    "type": "page_view",
                    "count": 150,
                    "timestamp": "2024-01-15T10:30:00Z"
                },
                {
                    "type": "email_signup",
                    "count": 25,
                    "timestamp": "2024-01-15T10:30:00Z"
                }
            ]
        }
        
        return {
            "success": True,
            "data": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/survey-results/{survey_id}")
async def get_survey_results(survey_id: str):
    """Get results for a specific survey"""
    try:
        # In a real implementation, this would fetch from database
        # For now, return mock data
        results = {
            "survey_id": survey_id,
            "total_responses": 45,
            "completion_rate": 0.89,
            "avg_completion_time": 180,
            "responses": [
                {
                    "question_id": "problem_frequency",
                    "question": "How often do you face this problem?",
                    "responses": {
                        "Never": 2,
                        "Rarely": 5,
                        "Sometimes": 12,
                        "Often": 18,
                        "Daily": 8
                    }
                },
                {
                    "question_id": "willingness_to_pay",
                    "question": "Would you pay for a solution to this problem?",
                    "responses": {
                        "No": 3,
                        "Maybe": 8,
                        "Yes": 15,
                        "Definitely": 12,
                        "Already paying": 7
                    }
                }
            ],
            "insights": [
                "85% of respondents face this problem at least sometimes",
                "76% are willing to pay for a solution",
                "Average willingness to pay: $25/month"
            ]
        }
        
        return {
            "success": True,
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 