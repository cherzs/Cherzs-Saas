import openai
from typing import List, Dict, Optional
from app.core.config import settings

class IdeaFrameworkService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        
        self.frameworks = {
            "unbundle": {
                "name": "Unbundle a Giant",
                "description": "Take one feature from a large product and make it better",
                "examples": [
                    "Email marketing tool from HubSpot",
                    "Analytics dashboard from Google Analytics",
                    "Payment processing from Stripe"
                ]
            },
            "niche": {
                "name": "Pick a Niche",
                "description": "Apply existing business models to specific industries",
                "examples": [
                    "CRM for yoga studios",
                    "Project management for law firms",
                    "Inventory management for bakeries"
                ]
            },
            "api": {
                "name": "API as a Service",
                "description": "Simplify complex processes through APIs",
                "examples": [
                    "Identity verification API",
                    "Address validation API",
                    "Document processing API"
                ]
            },
            "automation": {
                "name": "Automation Tool",
                "description": "Automate repetitive tasks in specific workflows",
                "examples": [
                    "Social media scheduling",
                    "Invoice generation",
                    "Customer support automation"
                ]
            }
        }
    
    async def generate_idea_with_framework(self, framework_type: str, problem: Dict, industry: str = None) -> Dict:
        """Generate an idea using a specific framework"""
        if framework_type not in self.frameworks:
            raise ValueError(f"Unknown framework: {framework_type}")
        
        framework = self.frameworks[framework_type]
        
        if self.openai_client:
            return await self._generate_with_ai(framework_type, problem, industry)
        else:
            return self._generate_manually(framework_type, problem, industry)
    
    async def _generate_with_ai(self, framework_type: str, problem: Dict, industry: str = None) -> Dict:
        """Generate idea using OpenAI"""
        prompt = f"""
        Problem: {problem['title']}
        Description: {problem['description']}
        Industry: {industry or 'general'}
        Framework: {self.frameworks[framework_type]['name']}
        
        Generate a SaaS idea that solves this problem using the {framework_type} framework.
        
        Return a JSON object with:
        - title: The idea title
        - description: Detailed description
        - target_audience: Who would use this
        - monetization_model: How to make money
        - tech_stack: Recommended technology stack
        - market_size: Estimated market size
        - competition_level: low/medium/high
        - key_features: List of main features
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            
            # Parse the response (simplified)
            content = response.choices[0].message.content
            return self._parse_ai_response(content, framework_type, problem)
            
        except Exception as e:
            print(f"Error generating with AI: {e}")
            return self._generate_manually(framework_type, problem, industry)
    
    def _generate_manually(self, framework_type: str, problem: Dict, industry: str = None) -> Dict:
        """Generate idea manually using templates"""
        if framework_type == "unbundle":
            return self._generate_unbundle_idea(problem, industry)
        elif framework_type == "niche":
            return self._generate_niche_idea(problem, industry)
        elif framework_type == "api":
            return self._generate_api_idea(problem, industry)
        elif framework_type == "automation":
            return self._generate_automation_idea(problem, industry)
        else:
            return self._generate_generic_idea(problem, industry)

    def _generate_unbundle_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate idea using 'Unbundle a Giant' framework"""
        problem_title = problem.get("title", "")
        problem_desc = problem.get("description", "")
        
        # Extract key problem words
        problem_words = problem_title.lower().split()[:3]
        
        idea = {
            "title": f"Simple{problem_words[0].title()} - {problem_words[0].title()} for Small Teams",
            "description": f"A simplified {problem_words[0]} platform designed specifically for small businesses. Focuses on ease of use and affordability while providing essential features.",
            "target_audience": "Small businesses and startups",
            "monetization_model": "Subscription-based with tiered pricing",
            "tech_stack": ["React", "Node.js", "PostgreSQL", "AWS"],
            "market_size": "Medium (niche but growing)",
            "competition_level": "medium",
            "key_features": [
                "Easy setup and onboarding",
                "Essential features only",
                "Affordable pricing",
                "Great customer support"
            ]
        }
        
        return idea

    def _generate_niche_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate idea using 'Pick a Niche' framework"""
        problem_title = problem.get("title", "")
        industry = industry or "general"
        
        idea = {
            "title": f"{industry.title()}Flow - {problem_title.split()[0].title()} for {industry.title()}",
            "description": f"{problem_title.split()[0].title()} tool built specifically for {industry} businesses with industry-specific features and workflows.",
            "target_audience": f"{industry.title()} businesses and professionals",
            "monetization_model": "Monthly subscription per user",
            "tech_stack": ["React", "Python FastAPI", "PostgreSQL", "Stripe"],
            "market_size": "Small but loyal",
            "competition_level": "low",
            "key_features": [
                f"{industry.title()}-specific features",
                "Industry templates",
                "Compliance features",
                "Industry integrations"
            ]
        }
        
        return idea

    def _generate_api_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate idea using 'API as a Service' framework"""
        problem_title = problem.get("title", "")
        
        idea = {
            "title": f"{problem_title.split()[0].title()}API - {problem_title.split()[0].title()} as a Service",
            "description": f"Simple API that provides {problem_title.split()[0]} functionality. Easy to integrate and use for developers.",
            "target_audience": "Developers and technical teams",
            "monetization_model": "Usage-based pricing",
            "tech_stack": ["Python FastAPI", "Redis", "PostgreSQL", "Docker"],
            "market_size": "Medium (developer tools)",
            "competition_level": "medium",
            "key_features": [
                "RESTful API",
                "Comprehensive documentation",
                "Multiple SDKs",
                "Usage analytics"
            ]
        }
        
        return idea

    def _generate_automation_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate idea using 'Automation Tool' framework"""
        problem_title = problem.get("title", "")
        
        idea = {
            "title": f"Auto{problem_title.split()[0].title()} - {problem_title.split()[0].title()} Automation",
            "description": f"Automate {problem_title.split()[0]} tasks and workflows. Save time and reduce manual work.",
            "target_audience": "Businesses and professionals",
            "monetization_model": "Subscription-based SaaS",
            "tech_stack": ["React", "Python", "PostgreSQL", "Zapier API"],
            "market_size": "Large and growing",
            "competition_level": "high",
            "key_features": [
                "Workflow automation",
                "Integration capabilities",
                "Scheduling and triggers",
                "Analytics and reporting"
            ]
        }
        
        return idea

    def _generate_generic_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate generic idea when framework is not recognized"""
        problem_title = problem.get("title", "")
        
        idea = {
            "title": f"Smart{problem_title.split()[0].title()} - {problem_title.split()[0].title()} Solution",
            "description": f"Intelligent solution for {problem_title.lower()}. Uses modern technology to solve the problem effectively.",
            "target_audience": "General business users",
            "monetization_model": "Subscription-based",
            "tech_stack": ["React", "Python FastAPI", "PostgreSQL", "AWS"],
            "market_size": "To be determined",
            "competition_level": "medium",
            "key_features": [
                "Modern interface",
                "Cloud-based",
                "Mobile responsive",
                "24/7 support"
            ]
        }
        
        return idea
    
    def _parse_ai_response(self, content: str, framework_type: str, problem: Dict) -> Dict:
        """Parse AI response and extract idea details"""
        try:
            # Simple parsing - in production you'd use more sophisticated parsing
            lines = content.split('\n')
            idea = {
                "title": f"AI Generated {framework_type.title()} Solution",
                "description": f"AI-generated solution for: {problem.get('title', 'Unknown problem')}",
                "target_audience": "Business users",
                "monetization_model": "Subscription-based SaaS",
                "tech_stack": ["React", "Python FastAPI", "PostgreSQL", "AWS"],
                "market_size": "To be determined",
                "competition_level": "medium",
                "key_features": [
                    "AI-powered solution",
                    "Modern interface",
                    "Cloud-based",
                    "Scalable architecture"
                ]
            }
            
            # Try to extract more details from AI response
            for line in lines:
                line = line.strip()
                if line.startswith("title:"):
                    idea["title"] = line.replace("title:", "").strip()
                elif line.startswith("description:"):
                    idea["description"] = line.replace("description:", "").strip()
                elif line.startswith("target_audience:"):
                    idea["target_audience"] = line.replace("target_audience:", "").strip()
                elif line.startswith("monetization_model:"):
                    idea["monetization_model"] = line.replace("monetization_model:", "").strip()
            
            return idea
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            return self._generate_generic_idea(problem)
    
    def get_available_frameworks(self) -> Dict:
        """Get list of available frameworks"""
        return self.frameworks
    
    async def analyze_competition(self, idea: Dict) -> Dict:
        """Analyze competition for an idea"""
        try:
            # Analyze competition based on idea
            title = idea.get("title", "").lower()
            description = idea.get("description", "").lower()
            
            # Simple competition analysis
            competition_level = "medium"
            if any(word in title for word in ["simple", "easy", "affordable"]):
                competition_level = "low"
            elif any(word in title for word in ["enterprise", "advanced", "complex"]):
                competition_level = "high"
            
            analysis = {
                "idea_id": idea.get("id", "unknown"),
                "competition_level": competition_level,
                "market_saturation": "Medium",
                "key_competitors": [
                    "Established players in the space",
                    "Emerging startups",
                    "Open source alternatives"
                ],
                "competitive_advantages": [
                    "Simpler user experience",
                    "Lower pricing",
                    "Better integration"
                ],
                "market_gaps": [
                    "Complex existing solutions",
                    "High pricing",
                    "Poor user experience"
                ],
                "recommendations": [
                    "Focus on differentiation",
                    "Target underserved segments",
                    "Build strong user experience"
                ]
            }
            
            return analysis
        except Exception as e:
            print(f"Error analyzing competition: {e}")
            return {"error": str(e)}

    async def estimate_market_size(self, idea: Dict) -> Dict:
        """Estimate market size for an idea"""
        try:
            # Estimate market size based on idea
            title = idea.get("title", "").lower()
            description = idea.get("description", "").lower()
            
            # Simple market size estimation
            if any(word in title for word in ["enterprise", "large", "global"]):
                market_size = "Large ($100M+ TAM)"
                obtainable_market = "$10M - $50M"
            elif any(word in title for word in ["small", "niche", "specific"]):
                market_size = "Small ($10M - $50M TAM)"
                obtainable_market = "$1M - $10M"
            else:
                market_size = "Medium ($50M - $100M TAM)"
                obtainable_market = "$5M - $20M"
            
            estimate = {
                "idea_id": idea.get("id", "unknown"),
                "total_addressable_market": market_size,
                "obtainable_market": obtainable_market,
                "target_customer_segments": [
                    "Small businesses",
                    "Startups",
                    "Freelancers"
                ],
                "market_growth_rate": "15-20% annually",
                "market_maturity": "Growing",
                "geographic_focus": "Global",
                "pricing_potential": "$10-50/month per user",
                "customer_lifetime_value": "$500-2000"
            }
            
            return estimate
        except Exception as e:
            print(f"Error estimating market size: {e}")
            return {"error": str(e)} 