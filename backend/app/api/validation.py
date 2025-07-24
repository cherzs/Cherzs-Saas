from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Dict, Optional
from app.services.validation_toolkit import ValidationToolkitService
from app.core.config import settings
import uuid
from datetime import datetime

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
        # Create survey using validation service
        survey = await validation_service.create_survey(survey_type, idea, custom_questions)
        
        # Add metadata
        survey_with_metadata = {
            "id": str(uuid.uuid4()),
            "idea_id": idea.get("id", "unknown"),
            "validation_type": "survey",
            "status": "active",
            "survey_type": survey_type,
            "created_at": datetime.now().isoformat(),
            "survey_data": survey
        }
        
        return {
            "success": True,
            "data": survey_with_metadata
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/surveys/templates")
async def get_survey_templates():
    """Get available survey templates"""
    try:
        templates = await validation_service.get_survey_templates()
        return {
            "success": True,
            "data": templates
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/landing-pages/create")
async def create_landing_page(
    template_type: str = Body(..., description="Landing page template to use"),
    idea: Dict = Body(..., description="Idea to create landing page for"),
    custom_content: Optional[Dict] = Body(None, description="Custom content to override defaults")
):
    """Create a landing page for validation"""
    try:
        # Create landing page using validation service
        landing_page = await validation_service.create_landing_page(template_type, idea, custom_content)
        
        # Deploy landing page to serverless storage
        deployment_result = await validation_service.deploy_landing_page(landing_page, idea)
        
        # Add metadata
        landing_page_with_metadata = {
            "id": str(uuid.uuid4()),
            "idea_id": idea.get("id", "unknown"),
            "validation_type": "landing_page",
            "status": "active",
            "template_type": template_type,
            "created_at": datetime.now().isoformat(),
            "landing_page_data": landing_page,
            "deployment": deployment_result
        }
        
        return {
            "success": True,
            "data": landing_page_with_metadata
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/landing-pages/templates")
async def get_landing_page_templates():
    """Get available landing page templates"""
    try:
        templates = await validation_service.get_landing_page_templates()
        return {
            "success": True,
            "data": templates
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/market-signals")
async def get_market_signals(idea: Dict = Body(..., description="Idea to analyze")):
    """Get market signals for an idea"""
    try:
        market_signals = await validation_service.get_market_signals(idea)
        return {
            "success": True,
            "data": market_signals
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/keyword-analysis")
async def analyze_keywords(idea: Dict = Body(..., description="Idea to analyze")):
    """Analyze keywords for an idea"""
    try:
        keyword_analysis = await validation_service.analyze_keywords(idea)
        return {
            "success": True,
            "data": keyword_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validation-plan")
async def generate_validation_plan(idea: Dict = Body(..., description="Idea to create plan for")):
    """Generate a validation plan for an idea"""
    try:
        validation_plan = await validation_service.generate_validation_plan(idea)
        return {
            "success": True,
            "data": validation_plan
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/track-conversion")
async def track_conversion(
    landing_page_id: str = Body(..., description="Landing page ID"),
    event_type: str = Body(..., description="Type of conversion event"),
    data: Optional[Dict] = Body(None, description="Additional event data")
):
    """Track conversion events from landing pages"""
    try:
        # Track conversion event
        tracking_result = await validation_service.track_conversion(landing_page_id, event_type, data)
        
        return {
            "success": True,
            "data": {
                "landing_page_id": landing_page_id,
                "event_type": event_type,
                "tracked_at": datetime.now().isoformat(),
                "tracking_result": tracking_result
            }
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
        validation_report = await validation_service.generate_validation_report(
            idea, survey_results, landing_page_metrics
        )
        
        return {
            "success": True,
            "data": validation_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/{landing_page_id}")
async def get_landing_page_metrics(landing_page_id: str):
    """Get metrics for a specific landing page"""
    try:
        metrics = await validation_service.get_landing_page_metrics(landing_page_id)
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
        results = await validation_service.get_survey_results(survey_id)
        return {
            "success": True,
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/surveys/submit-response")
async def submit_survey_response(
    survey_id: str = Body(..., description="Survey ID"),
    responses: Dict = Body(..., description="Survey responses"),
    respondent_info: Optional[Dict] = Body(None, description="Respondent information")
):
    """Submit survey response and calculate metrics"""
    try:
        # Process survey response
        processed_response = await validation_service.process_survey_response(
            survey_id, responses, respondent_info
        )
        
        # Calculate updated metrics
        updated_metrics = await validation_service.calculate_survey_metrics(survey_id)
        
        # Update validation results in database
        await validation_service.update_validation_results(survey_id, updated_metrics)
        
        return {
            "success": True,
            "data": {
                "survey_id": survey_id,
                "response_processed": True,
                "updated_metrics": updated_metrics
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/surveys/{survey_id}/metrics")
async def get_survey_metrics(survey_id: str):
    """Get real-time survey metrics"""
    try:
        metrics = await validation_service.get_survey_metrics(survey_id)
        return {
            "success": True,
            "data": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/surveys/{survey_id}/export")
async def export_survey_data(
    survey_id: str,
    format: str = Body("csv", description="Export format (csv, json, excel)")
):
    """Export survey data and results"""
    try:
        export_data = await validation_service.export_survey_data(survey_id, format)
        return {
            "success": True,
            "data": export_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 