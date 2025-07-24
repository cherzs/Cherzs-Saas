from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Dict, Optional
from app.services.problem_radar import ProblemRadarService
from app.core.config import settings

router = APIRouter(prefix="/problems", tags=["problems"])

# Initialize service
problem_radar_service = ProblemRadarService()

@router.get("/")
async def get_problems(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_severity: Optional[float] = Query(None, description="Minimum severity score (0-10)"),
    keywords: Optional[str] = Query(None, description="Filter by keywords"),
    limit: int = Query(20, description="Number of problems to return")
):
    """Get aggregated problems from various sources"""
    try:
        filters = {}
        if category:
            filters["category"] = category
        if min_severity:
            filters["min_severity"] = min_severity
        if keywords:
            filters["keywords"] = keywords
        
        problems = await problem_radar_service.aggregate_problems(filters)
        
        # Apply limit
        problems = problems[:limit]
        
        return {
            "success": True,
            "data": problems,
            "count": len(problems),
            "filters_applied": filters
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_problem_categories():
    """Get available problem categories"""
    categories = [
        "e-commerce",
        "real-estate", 
        "healthcare",
        "education",
        "marketing",
        "finance",
        "productivity",
        "developer-tools",
        "general"
    ]
    
    return {
        "success": True,
        "data": categories
    }

@router.get("/sources")
async def get_problem_sources():
    """Get available problem sources"""
    sources = [
        {
            "name": "Reddit",
            "description": "Community discussions and pain points",
            "subreddits": ["SaaS", "Entrepreneur", "startups", "webdev", "programming"]
        },
        {
            "name": "Hacker News",
            "description": "Tech community discussions and Show HN posts",
            "url": "https://news.ycombinator.com"
        },
        {
            "name": "G2 Reviews",
            "description": "Negative reviews from SaaS review platform",
            "categories": ["project-management", "crm", "marketing-automation", "analytics"]
        }
    ]
    
    return {
        "success": True,
        "data": sources
    }

@router.get("/trending")
async def get_trending_problems():
    """Get trending problems (high severity, recent mentions)"""
    try:
        problems = await problem_radar_service.aggregate_problems()
        
        # Filter for trending problems (high severity and recent)
        trending = [
            p for p in problems 
            if p["severity_score"] >= 7.0 and p["mention_count"] >= 5
        ]
        
        # Sort by trending score (severity * mentions)
        trending.sort(key=lambda x: x["severity_score"] * x["mention_count"], reverse=True)
        
        return {
            "success": True,
            "data": trending[:10],
            "count": len(trending[:10])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{problem_id}")
async def get_problem_details(problem_id: str):
    """Get detailed information about a specific problem"""
    try:
        # In a real implementation, this would fetch from database
        # For now, return a mock response
        problem = {
            "id": problem_id,
            "title": "Sample Problem",
            "description": "This is a sample problem description",
            "source": "reddit",
            "source_url": "https://reddit.com/r/SaaS",
            "category": "e-commerce",
            "severity_score": 8.5,
            "mention_count": 15,
            "keywords": ["payment", "checkout", "ecommerce"],
            "created_at": "2024-01-15T10:30:00Z",
            "related_problems": [],
            "potential_solutions": []
        }
        
        return {
            "success": True,
            "data": problem
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search")
async def search_problems(query: str, limit: int = 20):
    """Search problems by text query"""
    try:
        # In a real implementation, this would use full-text search
        # For now, return mock data
        problems = await problem_radar_service.aggregate_problems()
        
        # Simple text search
        matching_problems = [
            p for p in problems 
            if query.lower() in p["title"].lower() or query.lower() in p["description"].lower()
        ]
        
        return {
            "success": True,
            "data": matching_problems[:limit],
            "query": query,
            "count": len(matching_problems[:limit])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 