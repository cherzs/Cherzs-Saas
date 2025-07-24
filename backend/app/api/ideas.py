from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Optional
from app.services.idea_framework import IdeaFrameworkService
from app.core.config import settings
import uuid
from datetime import datetime

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
        # Generate idea using the framework service
        generated_idea = await idea_framework_service.generate_idea_with_framework(
            framework_type, problem, industry
        )
        
        # Add metadata
        idea_with_metadata = {
            "id": str(uuid.uuid4()),
            "title": generated_idea.get("title", f"Generated {framework_type.title()} Solution"),
            "description": generated_idea.get("description", ""),
            "problem_id": problem.get("id", "unknown"),
            "framework_type": framework_type,
            "market_size": generated_idea.get("market_size", "To be determined"),
            "competition_level": generated_idea.get("competition_level", "medium"),
            "monetization_model": generated_idea.get("monetization_model", "Subscription-based SaaS"),
            "tech_stack": generated_idea.get("tech_stack", ["React", "Python FastAPI", "PostgreSQL", "AWS"]),
            "validation_score": 65,  # Default score, will be updated after validation
            "created_at": datetime.now().isoformat(),
            "target_audience": generated_idea.get("target_audience", ""),
            "key_features": generated_idea.get("key_features", [])
        }
        
        return {
            "success": True,
            "data": idea_with_metadata,
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
        competition_analysis = await idea_framework_service.analyze_competition(idea)
        return {
            "success": True,
            "data": competition_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/estimate-market-size")
async def estimate_market_size(idea: Dict = Body(..., description="Idea to analyze")):
    """Estimate market size for an idea"""
    try:
        market_estimate = await idea_framework_service.estimate_market_size(idea)
        return {
            "success": True,
            "data": market_estimate
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/examples/{framework_type}")
async def get_framework_examples(framework_type: str):
    """Get examples for a specific framework"""
    try:
        frameworks = idea_framework_service.get_available_frameworks()
        framework = frameworks.get(framework_type)
        
        if not framework:
            raise HTTPException(status_code=404, detail="Framework not found")
        
        return {
            "success": True,
            "data": {
                "framework_type": framework_type,
                "name": framework.get("name", ""),
                "description": framework.get("description", ""),
                "examples": framework.get("examples", [])
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-generate")
async def batch_generate_ideas(
    problems: List[Dict] = Body(..., description="List of problems"),
    framework_type: str = Body(..., description="Framework to use for all ideas"),
    industry: Optional[str] = Body(None, description="Target industry")
):
    """Generate multiple ideas from a list of problems"""
    try:
        generated_ideas = []
        
        for problem in problems:
            try:
                # Generate idea for each problem
                generated_idea = await idea_framework_service.generate_idea_with_framework(
                    framework_type, problem, industry
                )
                
                idea_with_metadata = {
                    "id": str(uuid.uuid4()),
                    "title": generated_idea.get("title", f"Generated {framework_type.title()} Solution"),
                    "description": generated_idea.get("description", ""),
                    "problem_id": problem.get("id", "unknown"),
                    "framework_type": framework_type,
                    "market_size": generated_idea.get("market_size", "To be determined"),
                    "competition_level": generated_idea.get("competition_level", "medium"),
                    "monetization_model": generated_idea.get("monetization_model", "Subscription-based SaaS"),
                    "tech_stack": generated_idea.get("tech_stack", ["React", "Python FastAPI", "PostgreSQL", "AWS"]),
                    "validation_score": 65,
                    "created_at": datetime.now().isoformat(),
                    "target_audience": generated_idea.get("target_audience", ""),
                    "key_features": generated_idea.get("key_features", [])
                }
                
                generated_ideas.append(idea_with_metadata)
                
            except Exception as e:
                print(f"Error generating idea for problem {problem.get('id', 'unknown')}: {e}")
                continue
        
        return {
            "success": True,
            "data": generated_ideas,
            "count": len(generated_ideas),
            "framework_used": framework_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/industries")
async def get_available_industries():
    """Get available industries for idea generation"""
    try:
        # Return common industries for SaaS ideas
        industries = [
            "e-commerce",
            "healthcare",
            "education",
            "finance",
            "real-estate",
            "marketing",
            "productivity",
            "developer-tools",
            "customer-support",
            "analytics",
            "automation",
            "collaboration",
            "security",
            "compliance",
            "general"
        ]
        
        return {
            "success": True,
            "data": industries
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate-idea")
async def validate_idea(idea: Dict = Body(..., description="Idea to validate")):
    """Validate an idea using various criteria"""
    try:
        # Perform idea validation
        validation_results = {
            "idea_id": idea.get("id", "unknown"),
            "validation_score": 0,
            "criteria": {
                "problem_validation": {
                    "score": 0,
                    "status": "pending",
                    "notes": "Problem validation pending"
                },
                "market_opportunity": {
                    "score": 0,
                    "status": "pending", 
                    "notes": "Market analysis pending"
                },
                "competition_analysis": {
                    "score": 0,
                    "status": "pending",
                    "notes": "Competition analysis pending"
                },
                "technical_feasibility": {
                    "score": 0,
                    "status": "pending",
                    "notes": "Technical assessment pending"
                }
            },
            "recommendations": [],
            "next_steps": [
                "Create validation survey",
                "Build landing page",
                "Conduct market research",
                "Analyze competition"
            ],
            "validated_at": datetime.now().isoformat()
        }
        
        # Calculate initial score based on idea quality
        if idea.get("description") and len(idea.get("description", "")) > 50:
            validation_results["validation_score"] += 20
        
        if idea.get("target_audience"):
            validation_results["validation_score"] += 20
        
        if idea.get("key_features") and len(idea.get("key_features", [])) > 0:
            validation_results["validation_score"] += 20
        
        if idea.get("monetization_model"):
            validation_results["validation_score"] += 20
        
        if idea.get("tech_stack") and len(idea.get("tech_stack", [])) > 0:
            validation_results["validation_score"] += 20
        
        # Add recommendations based on score
        if validation_results["validation_score"] >= 80:
            validation_results["recommendations"].append("Excellent idea! Ready for validation.")
        elif validation_results["validation_score"] >= 60:
            validation_results["recommendations"].append("Good potential. Focus on validation.")
        else:
            validation_results["recommendations"].append("Needs more development before validation.")
        
        return {
            "success": True,
            "data": validation_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 