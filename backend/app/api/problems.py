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
        # Get real problems from problem radar service
        filters = {}
        if category:
            filters['category'] = category
        if min_severity:
            filters['min_severity'] = min_severity
        if keywords:
            filters['keywords'] = keywords
        
        problems = await problem_radar_service.aggregate_problems(filters)
        
        # Apply limit
        problems = problems[:limit]
        
        return {
            "success": True,
            "data": problems,
            "count": len(problems)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_problem_categories():
    """Get available problem categories"""
    try:
        # Get categories from real data
        problems = await problem_radar_service.aggregate_problems()
        categories = list(set(p.get('category', 'general') for p in problems))
        
        return {
            "success": True,
            "data": categories
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sources")
async def get_problem_sources():
    """Get available problem sources"""
    try:
        # Get sources from real data
        problems = await problem_radar_service.aggregate_problems()
        sources = list(set(p.get('source', 'unknown') for p in problems))
        
        return {
            "success": True,
            "data": sources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending")
async def get_trending_problems():
    """Get trending problems based on recent mentions and engagement"""
    try:
        # Get trending problems (sorted by mention count and recency)
        problems = await problem_radar_service.aggregate_problems()
        
        # Sort by mention count and recency
        trending_problems = sorted(
            problems, 
            key=lambda x: (x.get('mention_count', 0), x.get('created_at', '')), 
            reverse=True
        )[:10]
        
        return {
            "success": True,
            "data": trending_problems,
            "count": len(trending_problems)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{problem_id}")
async def get_problem_details(problem_id: str):
    """Get detailed information about a specific problem"""
    try:
        # Get problem details from real data
        problems = await problem_radar_service.aggregate_problems()
        problem = next((p for p in problems if p.get('id') == problem_id), None)
        
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")
        
        return {
            "success": True,
            "data": problem
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search")
async def search_problems(query: str, limit: int = 20):
    """Search problems using semantic search"""
    try:
        # Use semantic search if Pinecone is available
        if hasattr(problem_radar_service, 'search_similar_problems'):
            similar_problems = await problem_radar_service.search_similar_problems(query, limit)
            return {
                "success": True,
                "data": similar_problems,
                "count": len(similar_problems)
            }
        else:
            # Fallback to keyword search
            problems = await problem_radar_service.aggregate_problems()
            query_lower = query.lower()
            matching_problems = [
                p for p in problems 
                if query_lower in p.get('title', '').lower() or 
                   query_lower in p.get('description', '').lower() or
                   any(query_lower in kw.lower() for kw in p.get('keywords', []))
            ][:limit]
            
            return {
                "success": True,
                "data": matching_problems,
                "count": len(matching_problems)
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 