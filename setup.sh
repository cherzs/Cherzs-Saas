#!/bin/bash

echo "🚀 Setting up Cherzs - SaaS Idea Discovery Platform"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. You'll need to install it for the database."
    echo "   On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   On macOS: brew install postgresql"
    echo "   On Windows: Download from https://www.postgresql.org/download/windows/"
fi

echo ""
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your actual API keys and database URL"
fi

# Initialize database
echo "Initializing database..."
python init_db.py

cd ..

echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
EOF
    echo "⚠️  Please update the .env.local file with your actual API keys"
fi

cd ..

echo ""
echo "✅ Setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your API keys and database URL"
echo "2. Update frontend/.env.local with your API keys"
echo "3. Start the backend: cd backend && python run.py"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "📧 Demo account: demo@cherzs.com / demo123"
echo ""
echo "🎉 Happy coding with Cherzs!" 