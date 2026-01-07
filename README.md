# 🛡️ SafePath — Intelligent Route Safety & Travel Assistance Platform

**SafePath** is a production-ready full-stack web application that helps users plan **safer travel routes** using real-time routing, interactive maps, and contextual risk analysis.

It demonstrates **secure authentication**, **geospatial data handling**, **API integration**, and **modern frontend architecture** using Next.js App Router.

---

## 🔍 Why SafePath?

Travel route planners often optimize only for distance or time.  
SafePath focuses on **route safety**, enabling informed travel decisions through visual risk indicators and intelligent UX.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- Secure authentication using **Clerk**
- Middleware-protected routes
- Server-side auth with `auth()` (no custom JWT)
- User profile management (name & avatar)
- Production-ready session handling

### 🗺️ Route Planning & Mapping
- Interactive maps with **Leaflet / OpenStreetMap**
- Route generation using **OpenRouteService (ORS)**
- Auto-fit map view to route bounds
- Zoom & pan controls for exploration

### 🧠 Route Safety Intelligence
- Safety scoring system: **SAFE / CAUTION / DANGER**
- Color-coded route visualization
- Risk zone aggregation
- Best-departure-time indicator

### 🕘 Route History & UX
- Automatically saved recent routes
- Pin / unpin important routes
- One-click re-analysis
- Empty-state onboarding for new users
- Toast notifications & smooth animations

### 🎨 UI & Experience
- Clean dashboard layout
- Responsive design (mobile & desktop)
- Polished header with user dropdown
- Dark-themed profile dropdown
- Smooth page transitions
- License-compliant map attribution

---

## 🧩 Tech Stack

### Frontend
- **Next.js (App Router)**
- React
- Tailwind CSS
- Framer Motion
- Leaflet / React-Leaflet

### Backend
- Next.js API Routes
- OpenRouteService API
- Clerk Authentication

### Tooling & Platform
- TypeScript
- ESLint
- Git & GitHub
- Vercel (deployment)

---

## 🔒 Authentication Architecture (Design Decision)

- Authentication is handled entirely by **Clerk**
- Session validation via Clerk middleware
- Server components use `auth()`
- Client components use `useUser()`

This avoids redundant token handling and improves security and maintainability.

---

## 🚀 Deployment

- Deployed on **Vercel**
- Environment variables securely managed
- Clerk production domains configured
- Verified production build (`npm run build`)

---

## 📌 Project Status

- ✅ Authentication & protected dashboard
- ✅ Route planning & safety visualization
- ✅ Route history & UX polish
- ✅ Profile management
- 🔄 Weather & disaster intelligence (planned)

---

## 👨‍💻 Purpose

SafePath was built as a **placement-ready full-stack project** to demonstrate:

- Secure authentication design
- Real-world API integration
- Geospatial data visualization
- Modern Next.js App Router architecture
- Production-grade deployment practices

---

## 🔮 Planned Enhancements

- 🌦️ Weather-based route risk scoring
- 🚨 Disaster & alert overlays
- 🤖 AI travel assistant
- 📊 Analytics & admin dashboard
- 🗂️ Route comparison & recommendations

---

## 📜 Attribution

Map data © OpenStreetMap contributors  
Routing powered by OpenRouteService

---

⭐ **If you found this project interesting, feel free to star the repository!**
