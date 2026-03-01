# 🐾 PawLife — Your Pet's Digital Home

A full-stack pet care platform built with **Next.js**, **Supabase**, **Clerk**, and **Google Gemini AI**.

Track pet health, find lost pets, connect with the community, discover nearby services, and chat with an AI pet assistant — all in one beautifully designed app.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)
![Gemini](https://img.shields.io/badge/Gemini_AI-PawBuddy-4285F4?logo=google)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🐕 **Pet Profiles** | Register pets with breed, weight, DOB, microchip ID |
| 🏥 **Health Tracker** | Log vaccines, checkups, medications with reminders |
| 📍 **Lost & Found** | Report and find missing pets in your area |
| 💬 **Community Feed** | Share pet moments, like posts (rate-limited) |
| 🤖 **PawBuddy AI** | Gemini-powered chat assistant for pet health & care |
| 🏪 **Services Directory** | Find vets, groomers, pet shops nearby |
| 🛒 **Marketplace** | Browse pet food, toys, and accessories |
| ⚙️ **Settings** | Profile, subscription, notifications, dark mode |

## 🤖 PawBuddy AI

A floating AI assistant on every dashboard page powered by **Google Gemini 2.5 Flash**:
- Answers any pet health, nutrition, training, or care question
- Knows your pets by name (fetches from Supabase)
- 20+ topic fallback knowledge base when AI is unavailable
- Automatic model fallback (2.5-flash → 2.0-flash → 1.5-flash)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Auth:** Clerk (Google + Email sign-in)
- **Database:** Supabase (PostgreSQL + Row Level Security)
- **AI:** Google Gemini API (2.5 Flash)
- **Styling:** Custom CSS design system (Inter + Outfit fonts)
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase project
- Clerk application
- Google AI API key (free at [aistudio.google.com](https://aistudio.google.com))

### Setup

```bash
# Clone the repo
git clone https://github.com/spacewolf0305/pawlife.git
cd pawlife

# Install dependencies
npm install

# Create .env.local with your keys
cp .env.example .env.local
# Edit .env.local with your actual keys

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google AI (PawBuddy)
GOOGLE_AI_API_KEY=your_gemini_api_key
```

## 📁 Project Structure

```
pawlife/
├── app/
│   ├── page.js              # Landing page
│   ├── layout.js             # Root layout (Clerk + fonts)
│   ├── globals.css           # Design system
│   ├── api/chat/route.js     # PawBuddy AI API
│   └── dashboard/
│       ├── layout.js         # Sidebar + topbar
│       ├── page.js           # Dashboard home
│       ├── PawBuddy.js       # AI chat widget
│       ├── ErrorBoundary.js  # Error handling
│       ├── pets/             # Pet profiles
│       ├── health/           # Health tracker
│       ├── social/           # Community feed
│       ├── lost-found/       # Lost & found
│       ├── services/         # Services directory
│       ├── marketplace/      # Pet marketplace
│       └── settings/         # User settings
├── lib/
│   ├── supabase.js           # Supabase client
│   └── utils.js              # Helper functions
└── middleware.js              # Route protection
```

## 📄 License

MIT © [spacewolf0305](https://github.com/spacewolf0305)
