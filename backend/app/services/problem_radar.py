import requests
from bs4 import BeautifulSoup
import json
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import re
from app.core.config import settings

class ProblemRadarService:
    def __init__(self):
        self.reddit_base_url = "https://www.reddit.com"
        self.hn_base_url = "https://hacker-news.firebaseio.com/v0"
        self.g2_base_url = "https://www.g2.com"
        
    async def scrape_reddit_problems(self, subreddits: List[str] = None) -> List[Dict]:
        """Scrape problems from Reddit communities"""
        if not subreddits:
            subreddits = ["SaaS", "Entrepreneur", "startups", "webdev", "programming"]
        
        problems = []
        
        for subreddit in subreddits:
            try:
                # Using Reddit's JSON API
                url = f"{self.reddit_base_url}/r/{subreddit}/hot.json?limit=25"
                headers = {
                    'User-Agent': 'Cherzs-Problem-Radar/1.0'
                }
                
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    
                    for post in data['data']['children']:
                        post_data = post['data']
                        title = post_data.get('title', '')
                        content = post_data.get('selftext', '')
                        
                        # Look for problem indicators
                        problem_indicators = [
                            "I wish there was",
                            "I need a tool for",
                            "How do you solve",
                            "My biggest challenge",
                            "Pain point",
                            "Frustrated with",
                            "Looking for a solution"
                        ]
                        
                        if any(indicator.lower() in title.lower() or indicator.lower() in content.lower() 
                               for indicator in problem_indicators):
                            
                            problem = {
                                'title': title,
                                'description': content[:500] + "..." if len(content) > 500 else content,
                                'source': 'reddit',
                                'source_url': f"https://reddit.com{post_data.get('permalink', '')}",
                                'category': self._categorize_problem(title + " " + content),
                                'severity_score': self._calculate_severity(title, content),
                                'mention_count': post_data.get('score', 1),
                                'keywords': self._extract_keywords(title + " " + content),
                                'created_at': datetime.fromtimestamp(post_data.get('created_utc', 0))
                            }
                            problems.append(problem)
                            
            except Exception as e:
                print(f"Error scraping Reddit r/{subreddit}: {e}")
                continue
                
        return problems
    
    async def scrape_hackernews_problems(self) -> List[Dict]:
        """Scrape problems from Hacker News"""
        problems = []
        
        try:
            # Get top stories
            response = requests.get(f"{self.hn_base_url}/topstories.json")
            if response.status_code == 200:
                story_ids = response.json()[:30]  # Top 30 stories
                
                for story_id in story_ids:
                    story_response = requests.get(f"{self.hn_base_url}/item/{story_id}.json")
                    if story_response.status_code == 200:
                        story = story_response.json()
                        
                        if story.get('type') == 'story' and story.get('title'):
                            title = story.get('title', '')
                            url = story.get('url', '')
                            
                            # Look for problem indicators
                            problem_indicators = [
                                "Show HN",
                                "Ask HN",
                                "How do you",
                                "What tools do you use",
                                "Looking for"
                            ]
                            
                            if any(indicator.lower() in title.lower() for indicator in problem_indicators):
                                problem = {
                                    'title': title,
                                    'description': f"From Hacker News: {title}",
                                    'source': 'hackernews',
                                    'source_url': url or f"https://news.ycombinator.com/item?id={story_id}",
                                    'category': self._categorize_problem(title),
                                    'severity_score': self._calculate_severity(title, ""),
                                    'mention_count': story.get('score', 1),
                                    'keywords': self._extract_keywords(title),
                                    'created_at': datetime.fromtimestamp(story.get('time', 0))
                                }
                                problems.append(problem)
                                
        except Exception as e:
            print(f"Error scraping Hacker News: {e}")
            
        return problems
    
    async def scrape_g2_reviews(self, categories: List[str] = None) -> List[Dict]:
        """Scrape negative reviews from G2 to identify problems"""
        if not categories:
            categories = ["project-management", "crm", "marketing-automation", "analytics"]
        
        problems = []
        
        for category in categories:
            try:
                # This is a simplified version - in production you'd need proper scraping
                # or use G2's API if available
                url = f"{self.g2_base_url}/categories/{category}"
                headers = {
                    'User-Agent': 'Cherzs-Problem-Radar/1.0'
                }
                
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Look for negative reviews (this is a simplified approach)
                    review_elements = soup.find_all('div', class_='review')
                    
                    for review in review_elements[:10]:  # Limit to 10 reviews
                        rating = review.find('span', class_='rating')
                        if rating and int(rating.text) <= 3:  # Negative reviews
                            title_elem = review.find('h3')
                            content_elem = review.find('p')
                            
                            if title_elem and content_elem:
                                title = title_elem.text.strip()
                                content = content_elem.text.strip()
                                
                                problem = {
                                    'title': f"G2 Review Problem: {title}",
                                    'description': content,
                                    'source': 'g2',
                                    'source_url': url,
                                    'category': category,
                                    'severity_score': 7.0,  # High severity for negative reviews
                                    'mention_count': 1,
                                    'keywords': self._extract_keywords(title + " " + content),
                                    'created_at': datetime.now()
                                }
                                problems.append(problem)
                                
            except Exception as e:
                print(f"Error scraping G2 category {category}: {e}")
                continue
                
        return problems
    
    def _categorize_problem(self, text: str) -> str:
        """Categorize problem based on keywords"""
        text_lower = text.lower()
        
        categories = {
            'e-commerce': ['shopify', 'woocommerce', 'amazon', 'ebay', 'payment', 'checkout'],
            'real-estate': ['property', 'real estate', 'housing', 'rental', 'mortgage'],
            'healthcare': ['medical', 'health', 'patient', 'doctor', 'hospital'],
            'education': ['learning', 'course', 'student', 'education', 'school'],
            'marketing': ['seo', 'social media', 'advertising', 'campaign', 'email'],
            'finance': ['accounting', 'bookkeeping', 'tax', 'financial', 'budget'],
            'productivity': ['project management', 'task', 'collaboration', 'workflow'],
            'developer-tools': ['api', 'code', 'development', 'programming', 'git']
        }
        
        for category, keywords in categories.items():
            if any(keyword in text_lower for keyword in keywords):
                return category
                
        return 'general'
    
    def _calculate_severity(self, title: str, content: str) -> float:
        """Calculate problem severity score (0-10)"""
        text = (title + " " + content).lower()
        
        # Severity indicators
        urgent_words = ['urgent', 'critical', 'broken', 'failing', 'emergency']
        moderate_words = ['frustrated', 'difficult', 'challenging', 'problem', 'issue']
        mild_words = ['wish', 'hope', 'would like', 'looking for']
        
        score = 5.0  # Base score
        
        for word in urgent_words:
            if word in text:
                score += 2.0
                
        for word in moderate_words:
            if word in text:
                score += 1.0
                
        for word in mild_words:
            if word in text:
                score += 0.5
                
        return min(10.0, max(0.0, score))
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from text"""
        # Simple keyword extraction - in production you'd use NLP
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        
        words = re.findall(r'\b\w+\b', text.lower())
        keywords = [word for word in words if word not in stop_words and len(word) > 3]
        
        # Return top 10 keywords
        return list(set(keywords))[:10]
    
    async def aggregate_problems(self, filters: Dict = None) -> List[Dict]:
        """Aggregate problems from all sources"""
        all_problems = []
        
        # TODO: Implement actual scraping
        # reddit_problems = await self.scrape_reddit_problems()
        # hn_problems = await self.scrape_hackernews_problems()
        # g2_problems = await self.scrape_g2_reviews()
        
        # all_problems.extend(reddit_problems)
        # all_problems.extend(hn_problems)
        # all_problems.extend(g2_problems)
        
        # Apply filters if provided
        if filters:
            if filters.get('category'):
                all_problems = [p for p in all_problems if p['category'] == filters['category']]
            
            if filters.get('min_severity'):
                all_problems = [p for p in all_problems if p['severity_score'] >= filters['min_severity']]
            
            if filters.get('keywords'):
                keyword_filter = filters['keywords'].lower()
                all_problems = [p for p in all_problems 
                              if any(kw.lower() in keyword_filter for kw in p['keywords'])]
        
        # Sort by severity and recency
        all_problems.sort(key=lambda x: (x['severity_score'], x['created_at']), reverse=True)
        
        return all_problems 