from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Dict, Optional
from app.services.problem_radar import ProblemRadarService
from app.core.config import settings

router = APIRouter(prefix="/problems", tags=["problems"])

# Initialize service
problem_radar_service = ProblemRadarService()

# Mock data for development
MOCK_PROBLEMS = [
    {
        "id": "1",
        "title": "Email marketing automation is too complex",
        "description": "Small businesses struggle with setting up email marketing automation. The current tools are either too complex or too expensive for small teams.",
        "source": "reddit",
        "source_url": "https://reddit.com/r/SaaS/comments/example",
        "category": "marketing",
        "severity_score": 8.5,
        "mention_count": 15,
        "keywords": ["email", "marketing", "automation", "complex", "small business"],
        "created_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": "2", 
        "title": "Project management tools don't work for remote teams",
        "description": "Existing project management tools don't account for the unique challenges of remote work. Teams need better collaboration features and time tracking.",
        "source": "hackernews",
        "source_url": "https://news.ycombinator.com/item?id=example",
        "category": "productivity",
        "severity_score": 7.8,
        "mention_count": 23,
        "keywords": ["project management", "remote", "collaboration", "time tracking"],
        "created_at": "2024-01-14T15:45:00Z"
    },
    {
        "id": "3",
        "title": "Customer support software is too expensive for startups",
        "description": "Startups need customer support tools but can't afford the enterprise pricing of existing solutions. There's a gap in the market for affordable, simple support software.",
        "source": "g2",
        "source_url": "https://www.g2.com/categories/customer-support",
        "category": "customer-support",
        "severity_score": 9.2,
        "mention_count": 31,
        "keywords": ["customer support", "startup", "expensive", "affordable", "simple"],
        "created_at": "2024-01-13T09:20:00Z"
    },
    {
        "id": "4",
        "title": "Analytics dashboards are overwhelming for non-technical users",
        "description": "Business users need analytics but find current dashboards too complex. They need simple, actionable insights without the technical complexity.",
        "source": "reddit",
        "source_url": "https://reddit.com/r/Entrepreneur/comments/example",
        "category": "analytics",
        "severity_score": 7.5,
        "mention_count": 12,
        "keywords": ["analytics", "dashboard", "simple", "business", "insights"],
        "created_at": "2024-01-12T14:15:00Z"
    },
    {
        "id": "5",
        "title": "Invoice generation takes too much manual work",
        "description": "Small businesses spend hours manually creating invoices. They need automated invoice generation that integrates with their existing tools.",
        "source": "hackernews",
        "source_url": "https://news.ycombinator.com/item?id=example2",
        "category": "finance",
        "severity_score": 8.0,
        "mention_count": 18,
        "keywords": ["invoice", "automation", "manual work", "small business", "integration"],
        "created_at": "2024-01-11T11:30:00Z"
    }
]

@router.get("/")
async def get_problems(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_severity: Optional[float] = Query(None, description="Minimum severity score (0-10)"),
    keywords: Optional[str] = Query(None, description="Filter by keywords"),
    limit: int = Query(20, description="Number of problems to return")
):
    """Get aggregated problems from various sources"""
    try:
        # For now, return mock data
        problems = MOCK_PROBLEMS.copy()
        
        # Apply filters
        if category:
            problems = [p for p in problems if p["category"] == category]
        
        if min_severity:
            problems = [p for p in problems if p["severity_score"] >= min_severity]
        
        if keywords:
            keyword_filter = keywords.lower()
            problems = [p for p in problems 
                      if any(kw.lower() in keyword_filter for kw in p["keywords"])]
        
        # Apply limit
        problems = problems[:limit]
        
        return {
            "success": True,
            "data": problems,
            "count": len(problems),
            "filters_applied": {
                "category": category,
                "min_severity": min_severity,
                "keywords": keywords
            }
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
        # Return mock trending problems
        trending = [p for p in MOCK_PROBLEMS if p["severity_score"] >= 7.0 and p["mention_count"] >= 5]
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
        # Find the problem in mock data
        problem = next((p for p in MOCK_PROBLEMS if p["id"] == problem_id), None)
        
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")
        
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
        # Simple text search in mock data
        matching_problems = [
            p for p in MOCK_PROBLEMS 
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