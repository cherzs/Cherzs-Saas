#!/usr/bin/env python3
"""
Database initialization script for Cherzs
Creates tables and initializes empty database
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

def create_initial_user():
    """Create initial user for development"""
    db = next(get_db())
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == "demo@cherzs.com").first()
        
        if not existing_user:
            # Create demo user
            demo_user = User(
                email="demo@cherzs.com",
                username="demo_user",
                full_name="Demo User",
                password_hash=pwd_context.hash("demo123"),
                is_active=True,
                subscription_tier="free"
            )
            
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
            print("✅ Demo user created successfully!")
            print(f"📧 Demo user: demo@cherzs.com / demo123")
        else:
            print("✅ Demo user already exists")
            print(f"📧 Demo user: demo@cherzs.com / demo123")
        
    except Exception as e:
        print(f"❌ Error creating demo user: {e}")
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
        
        # Create initial user
        create_initial_user()
        
        print("\n🎉 Database initialization completed!")
        print("📝 Next steps:")
        print("1. Set up your environment variables in .env file")
        print("2. Run the backend: python run.py")
        print("3. Run the frontend: cd frontend && npm run dev")
        print("4. Start discovering problems and generating ideas!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 