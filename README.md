# Prepify

Prepify is a next-generation platform dedicated to democratizing elite exam preparation. By bridging the gap between cutting-edge AI analytics and human expertise, Prepify empowers aspirants targeting JEE, NEET, GATE, and UPSC with NTA-grade Computer Based Testing (CBT) and world-class mentorship.

## 🚀 Features
- **Role-Based Dashboards**: Tailored interfaces for Students, Mentors, Institutes, and Admins.
- **AI-Driven Analytics**: Deep insights into CBT performance.
- **Secure Architecture**: Edge-runtime middleware with custom JWT claims for high-performance, secure Role-Based Access Control (RBAC).
- **Antigravity Design System**: A proprietary high-fidelity, monochromatic UI/UX featuring glassmorphism, precise motion, and frictionless interactions to ensure zero distraction.
- **Enterprise-Grade Validation**: End-to-end type safety and strict payload validation via Zod and strongly-typed Server Actions.

## 🛠️ Technology Stack
- **Framework**: [Next.js 16.3](https://nextjs.org/) (App Router, Server Components, Turbopack)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Edge Auth, RPCs)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Components**: Radix UI / shadcn-inspired bespoke elements

## 📂 Project Structure
- `app/`: Next.js App Router containing pages, layouts, and API routes.
  - `app/dashboard/*`: Segmented, role-specific portals.
  - `app/legal/*`: Dynamic, SEO-optimized static routes (SSG).
- `components/ui/`: Reusable UI elements (e.g., `<GlassSkeleton/>`, `<SidebarNav/>`).
- `lib/repositories/`: Database abstraction layer (Repository Pattern).
- `lib/validations/`: Shared Zod schemas ensuring secure I/O across the app.
- `supabase/migrations/`: Tracked SQL migrations containing DB schema, RPC functions, and secure JWT hooks.

## ⚙️ Getting Started

### 1. Environment Setup
Create a `.env.local` file at the root of the project and provide your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Initialization
Ensure your local or remote Supabase instance is updated with the latest schemas, RPCs, and custom JWT claim hooks:
```bash
npm run db:push
```

### 3. Run the Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛡️ Security & Architecture
Prepify enforces strict security standards:
- **JWT Claims**: RBAC is handled at the edge using `proxy.ts`, which reads read-only `app_metadata` claims injected securely by Supabase via the `custom_access_token_hook`.
- **Atomic Transactions**: Complex state changes (like user onboarding) are wrapped in atomic SQL transactions via Supabase RPCs.
- **Rate Limiting**: Server Actions are protected by in-memory sliding-window rate limiters to deter brute-force attacks.
- **Zero CLS Loading**: Suspense boundaries (`loading.tsx`) implement mathematically precise `<GlassSkeleton/>` dimensions to completely eliminate Cumulative Layout Shift.
