# Gleaner Next.js Setup

## ✅ Completed

### Project Structure
```
frontend-nextjs/
├── app/
│   ├── layout.tsx          (Root layout with design system)
│   ├── page.tsx            (Landing page)
│   ├── globals.css         (Tailwind + design tokens)
│   └── (routes)/
│       ├── architecture/
│       │   └── page.tsx    (Architecture page)
│       └── app/
│           └── page.tsx    (Live demo app)
├── components/
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── ProblemSection.tsx
│   ├── SolutionSection.tsx
│   ├── FeaturesSection.tsx
│   ├── CTASection.tsx
│   └── Footer.tsx
└── package.json
```

### Design System Integration
- ✅ Cera Pro typography imported from Google Fonts
- ✅ Mapbox color palette implemented as Tailwind classes
- ✅ CSS custom properties defined in globals.css
- ✅ Dark theme optimized for all components

### Components Created
- ✅ Header - Navigation with links to all pages
- ✅ HeroSection - Tagline, CTA buttons, hero image
- ✅ ProblemSection - 3-column problem cards
- ✅ SolutionSection - 6-step solution flow
- ✅ FeaturesSection - Feature grid + metrics
- ✅ CTASection - Call-to-action box
- ✅ Footer - Copyright and description

### Tailwind Configuration
- Custom colors: void-black, deep-charcoal, signal-blue, map-green, etc.
- Custom font-family: font-cera-pro
- Utility classes: btn-primary, btn-secondary, card, eyebrow

## 🚀 Next Steps

### 1. Start Development Server
```bash
cd /Users/roopakeerthiraj/Documents/Gleaner_AI_SupplyChain/backstop/frontend-nextjs
npm run dev
```

Visit: http://localhost:3000

### 2. Create App Pages

#### Architecture Page (`app/architecture/page.tsx`)
```typescript
export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-void-black">
      <Header />
      <section className="max-w-6xl mx-auto px-6 py-32">
        {/* 8-step timeline */}
        {/* 4-layer architecture diagram */}
        {/* Animated data flow SVG */}
      </section>
      <Footer />
    </main>
  );
}
```

#### App Page (`app/app/page.tsx`)
```typescript
export default function AppPage() {
  return (
    <main className="min-h-screen bg-void-black">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Sidebar: Live Issues + Metrics */}
        {/* Center: Google Map */}
        {/* Right: Agent Trace + Impact Card */}
      </div>
    </main>
  );
}
```

### 3. Integrate with FastAPI Backend

Create `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'ws://127.0.0.1:8000/ws/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### 4. Connect to Backend
- API calls: `fetch('/api/state')` instead of `http://127.0.0.1:8000/api/state`
- WebSocket: `ws://localhost:3000/ws/live-issues` (proxied)
- Environment: Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`

### 5. Migrate HTML Content

The 3 HTML pages need to be converted to Next.js pages:

| HTML File | Next.js Route | Status |
|-----------|---------------|--------|
| landing.html | `/` (page.tsx) | ✅ Created with components |
| architecture.html | `/architecture` | ⏳ Needs SVG flow integration |
| index.html (app) | `/app` | ⏳ Needs WebSocket + Maps |

### 6. Add Missing Features

- [ ] Animated SVG flow diagrams (HeroSection, ArchitecturePage)
- [ ] Google Maps integration
- [ ] WebSocket client for live issues
- [ ] API integration with FastAPI backend
- [ ] Form submission handlers
- [ ] Error boundaries and loading states

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Running Both Frontend & Backend

### Terminal 1: Backend (Python FastAPI)
```bash
cd backstop
source .venv/bin/activate
cd backend
uvicorn main:app --reload --port 8000
```

### Terminal 2: Frontend (Next.js)
```bash
cd backstop/frontend-nextjs
npm run dev
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs (FastAPI Swagger docs)

## Advantages of Next.js

✅ **Component-based** - Reusable UI components
✅ **File-based routing** - No manual router setup
✅ **Built-in optimization** - Image, font, and code optimization
✅ **Server & client components** - Flexible rendering
✅ **API routes** - Backend logic in `/app/api`
✅ **TypeScript support** - Type-safe development
✅ **Hot reload** - Instant feedback during development
✅ **Production-ready** - Deploy to Vercel or any Node.js host

## File Structure Complete

The Next.js project is now set up with:
- ✅ Design system (Tailwind + CSS variables)
- ✅ Landing page with all sections
- ✅ Component library (Header, sections, Footer)
- ✅ Ready for route creation
- ✅ Ready for API integration

Next, complete the Architecture and App pages with the interactive features!
