from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Optional
from app.services.idea_framework import IdeaFrameworkService
from app.core.config import settings

router = APIRouter(prefix="/ideas", tags=["ideas"])

# Initialize service
idea_framework_service = IdeaFrameworkService()

@router.get("/frameworks")
async def get_available_frameworks():
    """Get available idea generation frameworks"""
    try:
        frameworks = idea_framework_service.get_available_frameworks()
        return {
            "success": True,
            "data": frameworks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_idea(
    framework_type: str = Body(..., description="Framework type to use"),
    problem: Dict = Body(..., description="Problem to solve"),
    industry: Optional[str] = Body(None, description="Target industry")
):
    """Generate an idea using a specific framework"""
    try:
        idea = await idea_framework_service.generate_idea_with_framework(
            framework_type, problem, industry
        )
        
        return {
            "success": True,
            "data": idea,
            "framework_used": framework_type
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-competition")
async def analyze_competition(idea: Dict = Body(..., description="Idea to analyze")):
    """Analyze competition for an idea"""
    try:
        analysis = await idea_framework_service.analyze_competition(idea)
        
        return {
            "success": True,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/estimate-market-size")
async def estimate_market_size(idea: Dict = Body(..., description="Idea to analyze")):
    """Estimate market size for an idea"""
    try:
        market_data = await idea_framework_service.estimate_market_size(idea)
        
        return {
            "success": True,
            "data": market_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/examples/{framework_type}")
async def get_framework_examples(framework_type: str):
    """Get examples for a specific framework"""
    try:
        frameworks = idea_framework_service.get_available_frameworks()
        
        if framework_type not in frameworks:
            raise HTTPException(status_code=404, detail="Framework not found")
        
        framework = frameworks[framework_type]
        
        return {
            "success": True,
            "data": {
                "framework": framework,
                "examples": framework.get("examples", [])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-generate")
async def batch_generate_ideas(
    problems: List[Dict] = Body(..., description="List of problems"),
    framework_type: str = Body(..., description="Framework to use for all ideas"),
    industry: Optional[str] = Body(None, description="Target industry")
):
    """Generate multiple ideas for a list of problems"""
    try:
        ideas = []
        
        for problem in problems:
            idea = await idea_framework_service.generate_idea_with_framework(
                framework_type, problem, industry
            )
            ideas.append(idea)
        
        return {
            "success": True,
            "data": ideas,
            "count": len(ideas),
            "framework_used": framework_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/industries")
async def get_available_industries():
    """Get list of available industries for niche targeting"""
    industries = [
        "real-estate",
        "healthcare", 
        "education",
        "finance",
        "legal",
        "restaurant",
        "fitness",
        "e-commerce",
        "marketing",
        "consulting",
        "manufacturing",
        "retail",
        "technology",
        "non-profit",
        "government"
    ]
    
    return {
        "success": True,
        "data": industries
    }

@router.post("/validate-idea")
async def validate_idea(idea: Dict = Body(..., description="Idea to validate")):
    """Validate an idea using multiple criteria"""
    try:
        # Get competition analysis
        competition = await idea_framework_service.analyze_competition(idea)
        
        # Get market size estimation
        market_size = await idea_framework_service.estimate_market_size(idea)
        
        # Calculate validation score
        validation_score = 0
        
        # Score based on competition level
        competition_level = competition.get("market_saturation", "Medium")
        if competition_level == "Low":
            validation_score += 30
        elif competition_level == "Medium":
            validation_score += 20
        else:
            validation_score += 10
        
        # Score based on market size
        market_range = market_size.get("obtainable_market", "$5M - $20M")
        if "B" in market_range:
            validation_score += 30
        elif "M" in market_range and "50M" in market_range:
            validation_score += 25
        elif "M" in market_range:
            validation_score += 20
        else:
            validation_score += 10
        
        # Score based on idea complexity
        tech_stack = idea.get("tech_stack", [])
        if len(tech_stack) <= 3:
            validation_score += 20  # Simple to implement
        elif len(tech_stack) <= 5:
            validation_score += 15  # Moderate complexity
        else:
            validation_score += 10  # Complex implementation
        
        # Score based on monetization model
        monetization = idea.get("monetization_model", "")
        if "subscription" in monetization.lower():
            validation_score += 20  # Recurring revenue
        elif "usage" in monetization.lower():
            validation_score += 15  # Usage-based
        else:
            validation_score += 10  # One-time or other
        
        validation_score = min(100, validation_score)
        
        return {
            "success": True,
            "data": {
                "idea": idea,
                "competition_analysis": competition,
                "market_size": market_size,
                "validation_score": validation_score,
                "recommendations": _generate_validation_recommendations(validation_score)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _generate_validation_recommendations(score: int) -> List[str]:
    """Generate recommendations based on validation score"""
    recommendations = []
    
    if score >= 80:
        recommendations.extend([
            "Strong idea with high potential",
            "Consider building MVP",
            "Start market research and user interviews"
        ])
    elif score >= 60:
        recommendations.extend([
            "Good idea with potential",
            "Refine value proposition",
            "Conduct more market research"
        ])
    elif score >= 40:
        recommendations.extend([
            "Moderate potential",
            "Consider pivoting or refining",
            "Focus on unique differentiation"
        ])
    else:
        recommendations.extend([
            "Low validation score",
            "Consider different approach or market",
            "Conduct more research before proceeding"
        ])
    
    return recommendations 