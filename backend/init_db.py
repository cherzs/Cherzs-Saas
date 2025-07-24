#!/usr/bin/env python3
"""
Database initialization script for Cherzs
Creates tables and adds sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import init_db, get_db
from app.models.database import User, Problem, Idea
from app.core.config import settings
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_sample_data():
    """Create sample data for development"""
    db = next(get_db())
    
    try:
        # Create sample user
        sample_user = User(
            email="demo@cherzs.com",
            username="demo_user",
            full_name="Demo User",
            password_hash=pwd_context.hash("demo123"),
            is_active=True,
            subscription_tier="pro"
        )
        db.add(sample_user)
        db.commit()
        db.refresh(sample_user)
        
        # Create sample problems
        sample_problems = [
            Problem(
                title="Email marketing automation is too complex",
                description="Users find it difficult to set up automated email sequences in existing tools",
                source="reddit",
                source_url="https://reddit.com/r/SaaS/comments/example",
                category="marketing",
                severity_score=8.5,
                mention_count=23,
                keywords=["email", "automation", "complex", "marketing"],
                user_id=sample_user.id
            ),
            Problem(
                title="No simple CRM for small agencies",
                description="Existing CRMs are either too complex or too expensive for small marketing agencies",
                source="hackernews",
                source_url="https://news.ycombinator.com/item?id=example",
                category="productivity",
                severity_score=7.8,
                mention_count=15,
                keywords=["crm", "agency", "small", "marketing"],
                user_id=sample_user.id
            ),
            Problem(
                title="Invoice generation takes too long",
                description="Small businesses spend hours creating and sending invoices manually",
                source="g2",
                source_url="https://www.g2.com/products/example",
                category="finance",
                severity_score=6.9,
                mention_count=8,
                keywords=["invoice", "generation", "manual", "finance"],
                user_id=sample_user.id
            )
        ]
        
        for problem in sample_problems:
            db.add(problem)
        db.commit()
        
        # Create sample ideas
        sample_ideas = [
            Idea(
                title="Simplified Email Automation Tool",
                description="Drag-and-drop email automation for non-technical users",
                problem_id=sample_problems[0].id,
                framework_type="unbundle",
                market_size=5000000.0,
                competition_level="medium",
                monetization_model="subscription",
                tech_stack=["React", "Node.js", "PostgreSQL"],
                user_id=sample_user.id
            ),
            Idea(
                title="Agency CRM",
                description="CRM specifically designed for small marketing agencies",
                problem_id=sample_problems[1].id,
                framework_type="niche",
                market_size=2000000.0,
                competition_level="low",
                monetization_model="subscription",
                tech_stack=["Vue.js", "Python", "MongoDB"],
                user_id=sample_user.id
            )
        ]
        
        for idea in sample_ideas:
            db.add(idea)
        db.commit()
        
        print("✅ Sample data created successfully!")
        print(f"📧 Demo user: demo@cherzs.com / demo123")
        print(f"📊 Created {len(sample_problems)} sample problems")
        print(f"💡 Created {len(sample_ideas)} sample ideas")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main initialization function"""
    print("🚀 Initializing Cherzs database...")
    
    try:
        # Initialize database tables
        init_db()
        print("✅ Database tables created successfully!")
        
        # Create sample data
        create_sample_data()
        
        print("\n🎉 Database initialization completed!")
        print("📝 Next steps:")
        print("1. Set up your environment variables in .env file")
        print("2. Run the backend: python run.py")
        print("3. Run the frontend: cd frontend && npm run dev")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 