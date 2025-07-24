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
        """Generate unbundling idea"""
        giants = {
            "e-commerce": ["Shopify", "WooCommerce", "Magento"],
            "marketing": ["HubSpot", "Mailchimp", "Constant Contact"],
            "crm": ["Salesforce", "HubSpot CRM", "Pipedrive"],
            "analytics": ["Google Analytics", "Mixpanel", "Amplitude"],
            "productivity": ["Notion", "Asana", "Trello"]
        }
        
        category = problem.get('category', 'general')
        giants_list = giants.get(category, ["Generic Platform"])
        giant = giants_list[0]
        
        return {
            "title": f"Specialized {giant} Alternative",
            "description": f"Create a focused alternative to {giant} that specifically addresses: {problem['title']}",
            "target_audience": f"Users frustrated with {giant}'s complexity or pricing",
            "monetization_model": "Subscription-based with tiered pricing",
            "tech_stack": ["React", "Node.js", "PostgreSQL", "AWS"],
            "market_size": "Medium (niche but growing)",
            "competition_level": "medium",
            "key_features": [
                "Simplified interface",
                "Lower pricing",
                "Better customer support",
                "Industry-specific features"
            ],
            "framework_type": "unbundle"
        }
    
    def _generate_niche_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate niche-specific idea"""
        niches = {
            "real-estate": "Real Estate",
            "healthcare": "Healthcare",
            "education": "Education",
            "finance": "Finance",
            "legal": "Legal Services",
            "restaurant": "Restaurant",
            "fitness": "Fitness"
        }
        
        target_industry = industry or problem.get('category', 'general')
        niche_name = niches.get(target_industry, "Specialized Industry")
        
        return {
            "title": f"{niche_name} Management Platform",
            "description": f"Comprehensive solution for {niche_name.lower()} businesses to solve: {problem['title']}",
            "target_audience": f"Small to medium {niche_name.lower()} businesses",
            "monetization_model": "Monthly subscription with industry-specific pricing",
            "tech_stack": ["React", "Python FastAPI", "PostgreSQL", "Stripe"],
            "market_size": "Small but loyal",
            "competition_level": "low",
            "key_features": [
                "Industry-specific workflows",
                "Compliance features",
                "Integration with industry tools",
                "Specialized reporting"
            ],
            "framework_type": "niche"
        }
    
    def _generate_api_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate API-as-service idea"""
        api_ideas = [
            "Identity Verification API",
            "Address Validation API",
            "Document Processing API",
            "Payment Processing API",
            "Email Validation API",
            "Phone Number Verification API"
        ]
        
        return {
            "title": "Specialized API Service",
            "description": f"API service that solves: {problem['title']}",
            "target_audience": "Developers and businesses needing specific functionality",
            "monetization_model": "Usage-based pricing with API calls",
            "tech_stack": ["Python FastAPI", "Redis", "PostgreSQL", "Docker"],
            "market_size": "Growing developer market",
            "competition_level": "medium",
            "key_features": [
                "RESTful API",
                "Comprehensive documentation",
                "SDKs for multiple languages",
                "Usage analytics dashboard"
            ],
            "framework_type": "api"
        }
    
    def _generate_automation_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate automation idea"""
        return {
            "title": "Workflow Automation Tool",
            "description": f"Automate processes related to: {problem['title']}",
            "target_audience": "Businesses looking to reduce manual work",
            "monetization_model": "Tiered subscription based on automation volume",
            "tech_stack": ["React", "Node.js", "PostgreSQL", "Zapier-like integrations"],
            "market_size": "Large automation market",
            "competition_level": "high",
            "key_features": [
                "Drag-and-drop workflow builder",
                "Pre-built templates",
                "Integration marketplace",
                "Analytics and reporting"
            ],
            "framework_type": "automation"
        }
    
    def _generate_generic_idea(self, problem: Dict, industry: str = None) -> Dict:
        """Generate generic idea"""
        return {
            "title": f"Solution for {problem['title']}",
            "description": f"Comprehensive solution addressing: {problem['description']}",
            "target_audience": "Businesses facing this specific problem",
            "monetization_model": "Subscription-based SaaS",
            "tech_stack": ["React", "Python FastAPI", "PostgreSQL", "AWS"],
            "market_size": "To be determined",
            "competition_level": "unknown",
            "key_features": [
                "Core problem-solving features",
                "User-friendly interface",
                "Analytics and reporting",
                "Integration capabilities"
            ],
            "framework_type": "generic"
        }
    
    def _parse_ai_response(self, content: str, framework_type: str, problem: Dict) -> Dict:
        """Parse AI response (simplified)"""
        try:
            # This is a simplified parser - in production you'd use proper JSON parsing
            return {
                "title": f"AI-Generated {framework_type.title()} Solution",
                "description": content[:200] + "...",
                "target_audience": "AI-determined audience",
                "monetization_model": "Subscription-based",
                "tech_stack": ["React", "Python", "PostgreSQL"],
                "market_size": "AI-estimated",
                "competition_level": "medium",
                "key_features": ["AI-generated features"],
                "framework_type": framework_type
            }
        except:
            return self._generate_manually(framework_type, problem)
    
    def get_available_frameworks(self) -> Dict:
        """Get list of available frameworks"""
        return self.frameworks
    
    async def analyze_competition(self, idea: Dict) -> Dict:
        """Analyze competition for an idea"""
        # TODO: Implement actual competition analysis
        # This would integrate with tools like SimilarWeb, SEMrush, etc.
        return {
            "competitor_count": "0-5 competitors",
            "market_saturation": "Low",
            "entry_barriers": "Low",
            "differentiation_opportunities": "High"
        }
    
    async def estimate_market_size(self, idea: Dict) -> Dict:
        """Estimate market size for an idea"""
        # TODO: Implement actual market size estimation
        # This would use data from sources like Statista, industry reports, etc.
        return {
            "total_addressable_market": "$10M - $50M",
            "serviceable_market": "$1M - $5M",
            "obtainable_market": "$100K - $500K",
            "growth_rate": "10-20% annually"
        } 