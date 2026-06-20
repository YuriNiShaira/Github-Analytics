# GitInsight

A full-featured GitHub Analytics Dashboard that visualizes developer activity, contribution patterns, and repository insights.

## ✨ Features

- **Activity Timeline** – View daily contribution patterns
- **Commit Heatmap** – Weekly activity breakdown
- **Language Distribution** – Interactive pie charts
- **Repository Browser** – Search, filter, and sort repos
- **User Comparison** – Side-by-side developer benchmarking
- **Export to PDF** – Generate analytics reports
- **Dark/Light Mode** – Toggle themes
- **Accurate Contributions** – GraphQL-powered commit tracking

## 🔒 Privacy First – No Data Collection

Your data stays yours. GitInsight only fetches public GitHub data and stores nothing beyond your session. No tracking, no analytics, no ads – just insights.

## 🚀 Live Demo

[View Live Demo](https://github-analytics-7dkv.vercel.app/)

## 🛠️ Tech Stack

- **Backend**: Django REST Framework, GraphQL (Graphene), PostgreSQL (Supabase), Redis (Upstash), GitHub API
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Apollo Client

## 📦 Quick Start

```bash
# Clone the repository
git clone https://github.com/YuriNiShaira/Github-Analytics.git
cd Github-Analytics

# Backend setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python manage.py migrate
python manage.py runserver

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
