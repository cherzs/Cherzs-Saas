from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Dict, Optional
from app.services.validation_toolkit import ValidationToolkitService
from app.core.config import settings
import uuid
from datetime import datetime

router = APIRouter(prefix="/validation", tags=["validation"])

# Initialize service
validation_service = ValidationToolkitService()

# Mock data for development
MOCK_VALIDATIONS = [
    {
        "id": "1",
        "idea_id": "1",
        "validation_type": "survey",
        "status": "completed",
        "results": {
            "total_responses": 45,
            "completion_rate": 0.85,
            "avg_willingness_to_pay": 3.8,
            "problem_frequency": 4.2
        },
        "created_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": "2",
        "idea_id": "2",
        "validation_type": "landing_page",
        "status": "active",
        "results": {
            "total_visitors": 120,
            "email_signups": 18,
            "conversion_rate": 0.15,
            "bounce_rate": 0.35
        },
        "created_at": "2024-01-14T15:45:00Z"
    },
    {
        "id": "3",
        "idea_id": "3",
        "validation_type": "market_research",
        "status": "pending",
        "results": {
            "competitor_analysis": "In progress",
            "market_size_estimate": "Pending",
            "trend_analysis": "Pending"
        },
        "created_at": "2024-01-13T09:20:00Z"
    }
]

@router.post("/surveys/create")
async def create_survey(
    survey_type: str = Body(..., description="Type of survey to create"),
    idea: Dict = Body(..., description="Idea to validate"),
    custom_questions: Optional[List[Dict]] = Body(None, description="Custom questions to add")
):
    """Create a validation survey"""
    try:
        # Create a new validation entry
        new_validation = {
            "id": str(uuid.uuid4()),
            "idea_id": idea.get("id", "unknown"),
            "validation_type": "survey",
            "status": "active",
            "results": {
                "total_responses": 0,
                "completion_rate": 0.0,
                "avg_willingness_to_pay": 0,
                "problem_frequency": 0
            },
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": new_validation
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
        # Create a new validation entry
        new_validation = {
            "id": str(uuid.uuid4()),
            "idea_id": idea.get("id", "unknown"),
            "validation_type": "landing_page",
            "status": "active",
            "results": {
                "total_visitors": 0,
                "email_signups": 0,
                "conversion_rate": 0.0,
                "bounce_rate": 0.0
            },
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": new_validation
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
        # Find validation in mock data
        validation = next((v for v in MOCK_VALIDATIONS if v["id"] == landing_page_id), None)
        
        if not validation:
            raise HTTPException(status_code=404, detail="Landing page not found")
        
        metrics = {
            "landing_page_id": landing_page_id,
            "total_visitors": validation["results"].get("total_visitors", 0),
            "unique_visitors": validation["results"].get("total_visitors", 0),
            "email_signups": validation["results"].get("email_signups", 0),
            "conversion_rate": validation["results"].get("conversion_rate", 0.0),
            "bounce_rate": validation["results"].get("bounce_rate", 0.0),
            "avg_time_on_page": 120,
            "traffic_sources": {
                "direct": 40,
                "social": 30,
                "search": 20,
                "referral": 10
            },
            "events": []
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
        # Find validation in mock data
        validation = next((v for v in MOCK_VALIDATIONS if v["id"] == survey_id), None)
        
        if not validation:
            raise HTTPException(status_code=404, detail="Survey not found")
        
        results = {
            "survey_id": survey_id,
            "total_responses": validation["results"].get("total_responses", 0),
            "completion_rate": validation["results"].get("completion_rate", 0.0),
            "avg_completion_time": 180,
            "responses": [],
            "insights": [
                "Most users find the problem significant",
                "Willingness to pay is moderate to high",
                "Users prefer simple, affordable solutions"
            ]
        }
        
        return {
            "success": True,
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 