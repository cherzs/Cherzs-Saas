# Cherzs - SaaS Idea Discovery & Validation Platform

Cherzs adalah platform yang membantu developer menemukan dan memvalidasi ide SaaS dengan menggunakan data real dan framework yang terbukti efektif.

## 🚀 Fitur Utama

### 1. Problem Radar
- **Agregasi Masalah**: Mengumpulkan masalah dari Reddit, Hacker News, dan platform review
- **Scoring System**: Sistem penilaian keparahan masalah (0-10)
- **Kategorisasi**: Filter berdasarkan industri dan kategori
- **Trending Problems**: Masalah yang sedang trending dan banyak dibicarakan

### 2. Idea Framework Engine
- **Unbundle a Giant**: Ambil satu fitur dari produk besar dan buat lebih baik
- **Pick a Niche**: Terapkan model bisnis ke industri spesifik
- **API as a Service**: Sederhanakan proses kompleks melalui API
- **Automation Tool**: Otomatisasi tugas berulang

### 3. Validation Toolkit
- **Survey Builder**: Template survey untuk validasi masalah dan solusi
- **Landing Page Builder**: Template landing page untuk validasi ide
- **Market Signals**: Analisis sinyal pasar dan kompetisi
- **Conversion Tracking**: Pelacakan metrik konversi

## 🛠 Tech Stack

### Frontend
- **Framework**: React dengan Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Custom components dengan Lucide React icons
- **Hosting**: Vercel

### Backend
- **Framework**: Python FastAPI
- **Database**: PostgreSQL (Supabase/Neon)
- **AI/Vector**: Pinecone
- **Hosting**: AWS Lambda / Google Cloud Functions

### Layanan Eksternal
- **Authentication**: Clerk / Auth0
- **Payment**: Stripe
- **Email**: Resend
- **Web Scraping**: Bright Data / Apify

## 📁 Struktur Proyek

```
cherzs/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   └── lib/            # Utilities
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── main.py             # FastAPI app
│   └── requirements.txt
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL database

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables
Buat file `.env` di root backend:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/cherzs

# Security
SECRET_KEY=your-secret-key-here

# External APIs
OPENAI_API_KEY=your-openai-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-pinecone-env
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Auth
CLERK_SECRET_KEY=your-clerk-key
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# Email
RESEND_API_KEY=your-resend-key

# Web Scraping
BRIGHT_DATA_USERNAME=your-bright-data-username
BRIGHT_DATA_PASSWORD=your-bright-data-password
```

## 📊 Model Monetisasi

### Freemium Model
- **Free**: Akses terbatas ke Problem Radar (10 masalah/hari)
- **Starter ($19/bulan)**: Akses penuh Problem Radar, 5 ide/bulan
- **Pro ($49/bulan)**: Semua fitur + Validation Toolkit
- **Team ($99/bulan)**: Kolaborasi tim, ekspor data, laporan kustom

## 🔧 API Endpoints

### Problems
- `GET /api/v1/problems` - Get problems with filters
- `GET /api/v1/problems/categories` - Get problem categories
- `GET /api/v1/problems/trending` - Get trending problems
- `POST /api/v1/problems/search` - Search problems

### Ideas
- `GET /api/v1/ideas/frameworks` - Get available frameworks
- `POST /api/v1/ideas/generate` - Generate idea with framework
- `POST /api/v1/ideas/validate-idea` - Validate idea
- `GET /api/v1/ideas/industries` - Get available industries

### Validation
- `POST /api/v1/validation/surveys/create` - Create validation survey
- `POST /api/v1/validation/landing-pages/create` - Create landing page
- `POST /api/v1/validation/market-signals` - Get market signals
- `POST /api/v1/validation/generate-report` - Generate validation report

## 🎯 Roadmap

### Phase 1 (MVP) - Completed ✅
- [x] Problem Radar dengan scraping Reddit/HN
- [x] Idea Framework Engine
- [x] Basic Validation Toolkit
- [x] Landing page dan dashboard

### Phase 2 (Q2 2024)
- [ ] Integrasi AI untuk ide generation
- [ ] Advanced market analysis
- [ ] User authentication
- [ ] Payment integration

### Phase 3 (Q3 2024)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] API marketplace
- [ ] Mobile app

### Phase 4 (Q4 2024)
- [ ] AI-powered problem detection
- [ ] Predictive market analysis
- [ ] Integration marketplace
- [ ] Enterprise features

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: [cherzs.com](https://cherzs.com)
- **Email**: hello@cherzs.com
- **Twitter**: [@cherzs](https://twitter.com/cherzs)

---

**Cherzs** - Find your next SaaS idea with confidence! 🚀 