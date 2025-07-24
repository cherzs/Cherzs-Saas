import requests
import json
from typing import List, Dict, Optional
from datetime import datetime
from app.core.config import settings
import boto3
from botocore.exceptions import ClientError

class ValidationToolkitService:
    def __init__(self):
        # Initialize AWS S3 for serverless storage (optional)
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            self.s3_bucket = settings.S3_BUCKET_NAME
        else:
            self.s3_client = None
            
        # Initialize CloudFront for CDN (optional)
        if settings.AWS_ACCESS_KEY_ID:
            self.cloudfront_client = boto3.client(
                'cloudfront',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
        else:
            self.cloudfront_client = None

    async def create_survey(self, survey_type: str, idea: Dict, custom_questions: List[Dict] = None) -> Dict:
        """Create a validation survey"""
        try:
            # Get survey template
            templates = await self.get_survey_templates()
            template = templates.get(survey_type)
            
            if not template:
                raise ValueError(f"Unknown survey type: {survey_type}")
            
            # Create survey with idea context
            survey = {
                "survey_type": survey_type,
                "idea_id": idea.get("id", "unknown"),
                "idea_title": idea.get("title", ""),
                "questions": template["questions"].copy(),
                "custom_questions": custom_questions or [],
                "created_at": datetime.now().isoformat(),
                "status": "active"
            }
            
            # Add custom questions if provided
            if custom_questions:
                survey["questions"].extend(custom_questions)
            
            return survey
        except Exception as e:
            print(f"Error creating survey: {e}")
            return {"error": str(e)}

    async def create_landing_page(self, template_type: str, idea: Dict, custom_content: Dict = None) -> Dict:
        """Create a landing page for validation"""
        try:
            # Get landing page template
            templates = await self.get_landing_page_templates()
            template = templates.get(template_type)
            
            if not template:
                raise ValueError(f"Unknown template type: {template_type}")
            
            # Create landing page with idea content
            landing_page = {
                "template_type": template_type,
                "idea_id": idea.get("id", "unknown"),
                "idea_title": idea.get("title", ""),
                "idea_description": idea.get("description", ""),
                "target_audience": idea.get("target_audience", ""),
                "key_features": idea.get("key_features", []),
                "monetization_model": idea.get("monetization_model", ""),
                "custom_content": custom_content or {},
                "created_at": datetime.now().isoformat(),
                "status": "active"
            }
            
            return landing_page
        except Exception as e:
            print(f"Error creating landing page: {e}")
            return {"error": str(e)}

    async def deploy_landing_page(self, landing_page_data: Dict, idea: Dict) -> Dict:
        """Deploy landing page to serverless storage"""
        try:
            # Generate HTML content
            html_content = self._generate_landing_page_html(landing_page_data, idea)
            
            # Generate unique filename
            filename = f"landing-pages/{idea['id']}/{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            
            if self.s3_client:
                # Upload to S3
                self.s3_client.put_object(
                    Bucket=self.s3_bucket,
                    Key=filename,
                    Body=html_content,
                    ContentType='text/html',
                    ACL='public-read'
                )
                
                # Generate public URL
                public_url = f"https://{self.s3_bucket}.s3.amazonaws.com/{filename}"
                
                # Invalidate CloudFront cache if available
                if self.cloudfront_client and settings.CLOUDFRONT_DISTRIBUTION_ID:
                    self._invalidate_cloudfront_cache(filename)
                
                return {
                    "success": True,
                    "url": public_url,
                    "filename": filename,
                    "deployed_at": datetime.now().isoformat()
                }
            else:
                # Fallback to local storage
                return {
                    "success": True,
                    "url": f"/landing-pages/{filename}",
                    "filename": filename,
                    "deployed_at": datetime.now().isoformat(),
                    "note": "Deployed to local storage (S3 not configured)"
                }
                
        except Exception as e:
            print(f"Error deploying landing page: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _generate_landing_page_html(self, landing_page_data: Dict, idea: Dict) -> str:
        """Generate HTML content for landing page"""
        template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{idea['title']} - Landing Page</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }}
                .container {{
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    text-align: center;
                    color: white;
                }}
                h1 {{
                    font-size: 3rem;
                    margin-bottom: 20px;
                    font-weight: 700;
                }}
                .subtitle {{
                    font-size: 1.5rem;
                    margin-bottom: 40px;
                    opacity: 0.9;
                }}
                .cta-button {{
                    background: #fff;
                    color: #667eea;
                    padding: 15px 40px;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                }}
                .cta-button:hover {{
                    transform: translateY(-2px);
                }}
                .features {{
                    margin-top: 60px;
                    text-align: left;
                }}
                .feature {{
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>{idea['title']}</h1>
                <p class="subtitle">{idea['description']}</p>
                
                <button class="cta-button" onclick="trackConversion()">
                    Get Early Access
                </button>
                
                <div class="features">
                    <h2>Key Features</h2>
                    <div class="feature">
                        <h3>🎯 Problem Focused</h3>
                        <p>Built specifically to solve: {idea.get('problem_description', 'Your problem')}</p>
                    </div>
                    <div class="feature">
                        <h3>💡 Smart Solution</h3>
                        <p>Innovative approach using {idea.get('framework_type', 'proven')} framework</p>
                    </div>
                    <div class="feature">
                        <h3>📈 Market Ready</h3>
                        <p>Target market: {idea.get('market_size', 'Growing market')}</p>
                    </div>
                </div>
            </div>
            
            <script>
                function trackConversion() {{
                    // Track conversion event
                    fetch('/api/v1/validation/track-conversion', {{
                        method: 'POST',
                        headers: {{
                            'Content-Type': 'application/json',
                        }},
                        body: JSON.stringify({{
                            landing_page_id: '{idea["id"]}',
                            event_type: 'cta_click',
                            data: {{
                                timestamp: new Date().toISOString(),
                                user_agent: navigator.userAgent
                            }}
                        }})
                    }});
                    
                    // Show success message
                    alert('Thank you for your interest! We\'ll be in touch soon.');
                }}
            </script>
        </body>
        </html>
        """
        return template
    
    def _invalidate_cloudfront_cache(self, filename: str) -> None:
        """Invalidate CloudFront cache for new content"""
        try:
            self.cloudfront_client.create_invalidation(
                DistributionId=settings.CLOUDFRONT_DISTRIBUTION_ID,
                InvalidationBatch={
                    'Paths': {
                        'Quantity': 1,
                        'Items': [f'/{filename}']
                    },
                    'CallerReference': f'invalidation-{datetime.now().strftime("%Y%m%d-%H%M%S")}'
                }
            )
        except Exception as e:
            print(f"Error invalidating CloudFront cache: {e}")
    
    async def track_conversion(self, landing_page_id: str, event_type: str, data: Dict = None) -> Dict:
        """Track conversion events"""
        try:
            # Store conversion event
            event = {
                "landing_page_id": landing_page_id,
                "event_type": event_type,
                "data": data or {},
                "timestamp": datetime.now().isoformat(),
                "user_agent": data.get("user_agent", ""),
                "ip_address": data.get("ip_address", "")
            }
            
            # TODO: Store in database
            # await self.db.save_conversion_event(event)
            
            return {
                "success": True,
                "event_id": f"event_{landing_page_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "tracked_at": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error tracking conversion: {e}")
            return {"error": str(e)}

    async def get_landing_page_metrics(self, landing_page_id: str) -> Dict:
        """Get metrics for a landing page"""
        try:
            # TODO: Get real metrics from database
            # metrics = await self.db.get_landing_page_metrics(landing_page_id)
            
            # Mock metrics for now
            metrics = {
                "landing_page_id": landing_page_id,
                "total_visitors": 0,
                "unique_visitors": 0,
                "email_signups": 0,
                "conversion_rate": 0.0,
                "bounce_rate": 0.0,
                "avg_time_on_page": 0,
                "traffic_sources": {
                    "direct": 0,
                    "social": 0,
                    "search": 0,
                    "referral": 0
                },
                "events": []
            }
            
            return metrics
        except Exception as e:
            print(f"Error getting landing page metrics: {e}")
            return {"error": str(e)}

    async def get_survey_results(self, survey_id: str) -> Dict:
        """Get results for a survey"""
        try:
            # TODO: Get real results from database
            # results = await self.db.get_survey_results(survey_id)
            
            # Mock results for now
            results = {
                "survey_id": survey_id,
                "total_responses": 0,
                "completion_rate": 0.0,
                "avg_completion_time": 0,
                "responses": [],
                "insights": []
            }
            
            return results
        except Exception as e:
            print(f"Error getting survey results: {e}")
            return {"error": str(e)}

    async def get_market_signals(self, idea: Dict) -> Dict:
        """Get market signals for an idea"""
        try:
            # Analyze market signals based on idea
            signals = {
                "idea_id": idea.get("id", "unknown"),
                "market_trends": [
                    "Growing demand for automation",
                    "Increasing focus on user experience",
                    "Rising adoption of SaaS solutions"
                ],
                "competitor_activity": "Medium",
                "market_maturity": "Growing",
                "customer_sentiment": "Positive",
                "trending_keywords": [
                    idea.get("title", "").lower().split()[0],
                    "automation",
                    "saas",
                    "productivity"
                ]
            }
            
            return signals
        except Exception as e:
            print(f"Error getting market signals: {e}")
            return {"error": str(e)}

    async def analyze_keywords(self, idea: Dict) -> Dict:
        """Analyze keywords for SEO and marketing"""
        try:
            # Analyze keywords based on idea
            title = idea.get("title", "")
            description = idea.get("description", "")
            
            # Extract keywords
            text = f"{title} {description}".lower()
            words = text.split()
            
            # Simple keyword analysis
            keywords = [word for word in words if len(word) > 3]
            keyword_frequency = {}
            
            for keyword in keywords:
                keyword_frequency[keyword] = keyword_frequency.get(keyword, 0) + 1
            
            analysis = {
                "idea_id": idea.get("id", "unknown"),
                "primary_keywords": list(keyword_frequency.keys())[:5],
                "keyword_density": keyword_frequency,
                "seo_score": 75,  # Mock score
                "suggested_keywords": [
                    "automation",
                    "productivity",
                    "saas",
                    "business",
                    "solution"
                ]
            }
            
            return analysis
        except Exception as e:
            print(f"Error analyzing keywords: {e}")
            return {"error": str(e)}

    async def generate_validation_plan(self, idea: Dict) -> Dict:
        """Generate a validation plan for an idea"""
        try:
            plan = {
                "idea_id": idea.get("id", "unknown"),
                "validation_phases": [
                    {
                        "phase": 1,
                        "name": "Problem Validation",
                        "methods": ["Survey", "Interviews", "Market Research"],
                        "duration": "1-2 weeks",
                        "goals": ["Confirm problem exists", "Understand pain points", "Assess market size"]
                    },
                    {
                        "phase": 2,
                        "name": "Solution Validation",
                        "methods": ["Landing Page", "Prototype", "User Testing"],
                        "duration": "2-3 weeks",
                        "goals": ["Validate solution approach", "Test user interest", "Gather feedback"]
                    },
                    {
                        "phase": 3,
                        "name": "Market Validation",
                        "methods": ["Beta Launch", "Pricing Tests", "Partnership Talks"],
                        "duration": "3-4 weeks",
                        "goals": ["Test market demand", "Validate pricing", "Build partnerships"]
                    }
                ],
                "recommended_tools": [
                    "Survey tools (Typeform, Google Forms)",
                    "Landing page builders (Unbounce, Leadpages)",
                    "Analytics (Google Analytics, Mixpanel)",
                    "User research (UserTesting, Hotjar)"
                ],
                "success_metrics": [
                    "Survey completion rate > 70%",
                    "Landing page conversion > 5%",
                    "User interviews > 10",
                    "Market size > $10M"
                ]
            }
            
            return plan
        except Exception as e:
            print(f"Error generating validation plan: {e}")
            return {"error": str(e)}

    async def generate_validation_report(self, idea: Dict, survey_results: List[Dict] = None, landing_page_metrics: Dict = None) -> Dict:
        """Generate a comprehensive validation report"""
        try:
            report = {
                "idea_id": idea.get("id", "unknown"),
                "idea_title": idea.get("title", ""),
                "generated_at": datetime.now().isoformat(),
                "summary": {
                    "overall_score": 0,
                    "recommendation": "Continue validation",
                    "confidence_level": "Medium"
                },
                "validation_results": {
                    "problem_validation": {
                        "score": 0,
                        "status": "Pending",
                        "data": survey_results or []
                    },
                    "solution_validation": {
                        "score": 0,
                        "status": "Pending",
                        "data": landing_page_metrics or {}
                    },
                    "market_validation": {
                        "score": 0,
                        "status": "Pending",
                        "data": {}
                    }
                },
                "recommendations": [
                    "Continue with problem validation",
                    "Build landing page for solution validation",
                    "Conduct market research"
                ],
                "next_steps": [
                    "Create and distribute survey",
                    "Build landing page",
                    "Conduct user interviews",
                    "Analyze competition"
                ]
            }
            
            return report
        except Exception as e:
            print(f"Error generating validation report: {e}")
            return {"error": str(e)}
    
    def _calculate_validation_score(self, survey_results: List[Dict] = None, 
                                  landing_page_metrics: Dict = None) -> float:
        """Calculate overall validation score (0-100)"""
        score = 50  # Base score
        
        if survey_results:
            # Analyze survey responses
            positive_responses = sum(1 for result in survey_results 
                                  if result.get("willingness_to_pay", 0) >= 3)
            score += (positive_responses / len(survey_results)) * 25 if survey_results else 0
        
        if landing_page_metrics:
            # Analyze landing page performance
            conversion_rate = landing_page_metrics.get("conversion_rate", 0)
            score += min(conversion_rate * 100, 25)
        
        return min(100, max(0, score))
    
    def _generate_recommendations(self, survey_results: List[Dict] = None, 
                                landing_page_metrics: Dict = None) -> List[str]:
        """Generate recommendations based on validation results"""
        recommendations = []
        
        if survey_results:
            avg_willingness = sum(r.get("willingness_to_pay", 0) for r in survey_results) / len(survey_results)
            if avg_willingness < 3:
                recommendations.append("Consider adjusting pricing or value proposition")
            if avg_willingness >= 4:
                recommendations.append("Strong market demand - proceed with development")
        
        if landing_page_metrics:
            conversion_rate = landing_page_metrics.get("conversion_rate", 0)
            if conversion_rate < 0.05:
                recommendations.append("Improve landing page copy and design")
            if conversion_rate > 0.15:
                recommendations.append("Excellent conversion rate - scale marketing efforts")
        
        return recommendations
    
    def _suggest_next_steps(self, survey_results: List[Dict] = None, 
                           landing_page_metrics: Dict = None) -> List[str]:
        """Suggest next steps based on validation results"""
        next_steps = []
        
        validation_score = self._calculate_validation_score(survey_results, landing_page_metrics)
        
        if validation_score >= 80:
            next_steps.extend([
                "Build MVP",
                "Set up development team",
                "Create detailed business plan"
            ])
        elif validation_score >= 60:
            next_steps.extend([
                "Iterate on idea based on feedback",
                "Conduct more user interviews",
                "Refine value proposition"
            ])
        else:
            next_steps.extend([
                "Pivot or refine the idea",
                "Conduct more market research",
                "Consider different target audience"
            ])
        
        return next_steps 

    async def process_survey_response(self, survey_id: str, responses: Dict, respondent_info: Dict = None) -> Dict:
        """Process survey response and store in database"""
        try:
            # Store response in database
            response_data = {
                "survey_id": survey_id,
                "responses": responses,
                "respondent_info": respondent_info or {},
                "submitted_at": datetime.now().isoformat(),
                "completion_time": responses.get("completion_time", 0),
                "quality_score": self._calculate_response_quality(responses)
            }
            
            # TODO: Store in PostgreSQL database
            # await self.db.save_survey_response(response_data)
            
            return {
                "success": True,
                "response_id": f"resp_{survey_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "processed_at": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error processing survey response: {e}")
            return {"success": False, "error": str(e)}
    
    async def calculate_survey_metrics(self, survey_id: str) -> Dict:
        """Calculate real-time survey metrics"""
        try:
            # TODO: Get all responses from database
            # responses = await self.db.get_survey_responses(survey_id)
            
            # Mock data for development
            mock_responses = [
                {"problem_frequency": 4, "problem_impact": 4, "willingness_to_pay": 3},
                {"problem_frequency": 5, "problem_impact": 5, "willingness_to_pay": 4},
                {"problem_frequency": 3, "problem_impact": 3, "willingness_to_pay": 2},
                {"problem_frequency": 4, "problem_impact": 4, "willingness_to_pay": 3},
                {"problem_frequency": 5, "problem_impact": 5, "willingness_to_pay": 4}
            ]
            
            metrics = {
                "total_responses": len(mock_responses),
                "completion_rate": 0.85,  # Mock completion rate
                "avg_problem_frequency": sum(r["problem_frequency"] for r in mock_responses) / len(mock_responses),
                "avg_problem_impact": sum(r["problem_impact"] for r in mock_responses) / len(mock_responses),
                "avg_willingness_to_pay": sum(r["willingness_to_pay"] for r in mock_responses) / len(mock_responses),
                "problem_validation_score": self._calculate_problem_validation_score(mock_responses),
                "market_opportunity_score": self._calculate_market_opportunity_score(mock_responses),
                "response_quality": self._calculate_overall_response_quality(mock_responses),
                "last_updated": datetime.now().isoformat()
            }
            
            return metrics
        except Exception as e:
            print(f"Error calculating survey metrics: {e}")
            return {"error": str(e)}
    
    async def update_validation_results(self, survey_id: str, metrics: Dict) -> bool:
        """Update validation results in database"""
        try:
            # TODO: Update validation record in database
            # await self.db.update_validation_results(survey_id, metrics)
            
            # For now, just log the update
            print(f"Updated validation results for survey {survey_id}: {metrics}")
            return True
        except Exception as e:
            print(f"Error updating validation results: {e}")
            return False
    
    async def get_survey_metrics(self, survey_id: str) -> Dict:
        """Get current survey metrics"""
        return await self.calculate_survey_metrics(survey_id)
    
    async def export_survey_data(self, survey_id: str, format: str = "csv") -> Dict:
        """Export survey data in specified format"""
        try:
            # TODO: Get survey data from database
            # survey_data = await self.db.get_survey_data(survey_id)
            
            # Mock export data
            export_data = {
                "survey_id": survey_id,
                "format": format,
                "exported_at": datetime.now().isoformat(),
                "data": {
                    "responses": [],  # Would contain actual response data
                    "metrics": await self.calculate_survey_metrics(survey_id),
                    "survey_info": {
                        "title": "Problem Validation Survey",
                        "created_at": "2024-01-15T10:30:00Z",
                        "status": "active"
                    }
                }
            }
            
            return export_data
        except Exception as e:
            print(f"Error exporting survey data: {e}")
            return {"error": str(e)}
    
    def _calculate_response_quality(self, responses: Dict) -> float:
        """Calculate quality score for a single response"""
        quality_score = 0.0
        
        # Check for complete responses
        required_fields = ["problem_frequency", "problem_impact", "willingness_to_pay"]
        completed_fields = sum(1 for field in required_fields if field in responses)
        quality_score += (completed_fields / len(required_fields)) * 50
        
        # Check for thoughtful responses (not all same value)
        if "problem_frequency" in responses and "problem_impact" in responses:
            if responses["problem_frequency"] != responses["problem_impact"]:
                quality_score += 25
        
        # Check for realistic willingness to pay
        if "willingness_to_pay" in responses:
            if 2 <= responses["willingness_to_pay"] <= 4:
                quality_score += 25
        
        return min(100.0, quality_score)
    
    def _calculate_problem_validation_score(self, responses: List[Dict]) -> float:
        """Calculate problem validation score (0-100)"""
        if not responses:
            return 0.0
        
        avg_frequency = sum(r["problem_frequency"] for r in responses) / len(responses)
        avg_impact = sum(r["problem_impact"] for r in responses) / len(responses)
        
        # Score based on frequency and impact (both 1-5 scale)
        frequency_score = (avg_frequency / 5.0) * 50
        impact_score = (avg_impact / 5.0) * 50
        
        return frequency_score + impact_score
    
    def _calculate_market_opportunity_score(self, responses: List[Dict]) -> float:
        """Calculate market opportunity score (0-100)"""
        if not responses:
            return 0.0
        
        avg_willingness = sum(r["willingness_to_pay"] for r in responses) / len(responses)
        
        # Score based on willingness to pay (1-5 scale)
        # 1-2: Low opportunity, 3: Medium, 4-5: High opportunity
        if avg_willingness <= 2:
            return 25.0
        elif avg_willingness <= 3:
            return 50.0
        elif avg_willingness <= 4:
            return 75.0
        else:
            return 100.0
    
    def _calculate_overall_response_quality(self, responses: List[Dict]) -> float:
        """Calculate overall response quality score"""
        if not responses:
            return 0.0
        
        quality_scores = [self._calculate_response_quality(r) for r in responses]
        return sum(quality_scores) / len(quality_scores) 

    async def get_survey_templates(self) -> Dict:
        """Get available survey templates"""
        templates = {
            "problem_validation": {
                "name": "Problem Validation Survey",
                "description": "Validate if the problem you're solving is real and painful",
                "questions_count": 4,
                "estimated_time": "2-3 minutes",
                "questions": [
                    {
                        "id": "problem_frequency",
                        "type": "scale",
                        "question": "How often do you face this problem?",
                        "options": ["Never", "Rarely", "Sometimes", "Often", "Daily"]
                    },
                    {
                        "id": "problem_impact",
                        "type": "scale",
                        "question": "How much does this problem impact your work?",
                        "options": ["No impact", "Minor", "Moderate", "Significant", "Critical"]
                    },
                    {
                        "id": "current_solution",
                        "type": "text",
                        "question": "How do you currently solve this problem?"
                    },
                    {
                        "id": "willingness_to_pay",
                        "type": "scale",
                        "question": "Would you pay for a solution to this problem?",
                        "options": ["No", "Maybe", "Yes", "Definitely", "Already paying"]
                    }
                ]
            },
            "solution_validation": {
                "name": "Solution Validation Survey",
                "description": "Validate if your solution addresses the problem effectively",
                "questions_count": 4,
                "estimated_time": "3-4 minutes",
                "questions": [
                    {
                        "id": "solution_interest",
                        "type": "scale",
                        "question": "How interested are you in this solution?",
                        "options": ["Not interested", "Somewhat", "Interested", "Very interested", "Must have"]
                    },
                    {
                        "id": "feature_priority",
                        "type": "multi_select",
                        "question": "Which features are most important to you?",
                        "options": ["Easy to use", "Affordable", "Fast", "Integrations", "Support"]
                    },
                    {
                        "id": "pricing_expectation",
                        "type": "text",
                        "question": "What would you expect to pay for this solution?"
                    },
                    {
                        "id": "timeline",
                        "type": "scale",
                        "question": "When would you need this solution?",
                        "options": ["No rush", "Within 6 months", "Within 3 months", "Within 1 month", "Immediately"]
                    }
                ]
            }
        }
        return templates

    async def get_landing_page_templates(self) -> Dict:
        """Get available landing page templates"""
        templates = {
            "coming_soon": {
                "name": "Coming Soon",
                "description": "Simple coming soon page to collect email signups",
                "best_for": "Early validation and building waitlist",
                "features": [
                    "Email signup form",
                    "Problem statement",
                    "Solution preview",
                    "Social proof"
                ]
            },
            "problem_solution": {
                "name": "Problem-Solution",
                "description": "Focus on the problem and how you solve it",
                "best_for": "Validating problem-solution fit",
                "features": [
                    "Clear problem statement",
                    "Solution overview",
                    "Benefits and outcomes",
                    "Call-to-action"
                ]
            },
            "feature_focused": {
                "name": "Feature-Focused",
                "description": "Highlight key features and benefits",
                "best_for": "Validating feature demand",
                "features": [
                    "Feature highlights",
                    "Use cases",
                    "Integration possibilities",
                    "Pricing preview"
                ]
            }
        }
        return templates 