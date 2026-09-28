# EMS Task: Phase 1 — Deploy Readiness

| Field          | Value |
|----------------|-------|
| **Task ID**    | EMS-001-P1 |
| **Title**      | Production Deploy Readiness — Error Audit, Build, Security |
| **Status**     | In Progress |
| **Priority**   | Critical |
| **Created**    | 2026-07-17 |
| **Parent**     | EMS-001 |
| **Est. Time**  | 2-3 hours |

---

## Description

Fix all existing errors, ensure a clean production build, audit security, and prepare the project for deployment. This is the foundation — nothing else ships until this phase is green.

---

## Checklist

### 1.1 TypeScript & Lint
- [ ] Run `npx tsc --noEmit` — fix ALL errors
- [ ] Run `npx next lint` — fix ALL errors and warnings
- [ ] Fix any Tailwind CSS build warnings or class conflicts
- [ ] Ensure zero `any` types in critical paths (auth, API, templates)

### 1.2 Runtime Error Audit
- [ ] Home page — check browser console for errors
- [ ] Login page — test login flow, check console
- [ ] Signup page — test signup flow, check console
- [ ] Dashboard page — check console, verify data loads
- [ ] Builder page — test all forms, template switching, save/sync
- [ ] AI Chat page — test chat flow (logged in)
- [ ] Export/Print page — test PDF download flow
- [ ] Profile page — test profile update
- [ ] Choose Template page — test template selection
- [ ] Check all pages for unhandled promise rejections

### 1.3 API Route Audit
- [ ] `POST /api/auth/login` — test with valid/invalid credentials
- [ ] `POST /api/auth/register` — test with valid/duplicate data
- [ ] `GET /api/auth/me` — test with valid/expired/missing token
- [ ] `PUT /api/auth/update-profile` — test update flow
- [ ] `GET /api/cv/profile` — test fetch all profiles
- [ ] `POST /api/cv/profile` — test create/upsert
- [ ] `GET/PUT/DELETE /api/cv/profile/[id]` — test CRUD
- [ ] `GET/POST /api/cv/exports` — test fetch/create exports
- [ ] `GET/DELETE /api/cv/exports/[id]` — test fetch/delete
- [ ] `GET /api/ai-chat/sessions` — test fetch sessions
- [ ] `POST /api/ai-chat/message` — test send message
- [ ] `POST /api/ai-chat/generate` — test CV generation
- [ ] `GET/PATCH/DELETE /api/ai-chat/session/[id]` — test CRUD
- [ ] Verify ALL routes return proper error JSON (no HTML error pages in production)
- [ ] Verify ALL routes handle missing/malformed body gracefully
- [ ] Verify MongoDB connection failure returns 503, not 500

### 1.4 Hardcoded Values
- [ ] Search for `http://localhost` — replace with relative paths or env vars
- [ ] Search for `https://localhost` — same
- [ ] Search for hardcoded port numbers
- [ ] Search for hardcoded API URLs — use environment variables
- [ ] Verify `NEXT_PUBLIC_API_URL` or equivalent is configured

### 1.5 Environment Variables
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Create `.env.example` with all required vars documented
- [ ] Verify `MONGODB_URI` works in production
- [ ] Verify `JWT_SECRET` is strong (not a placeholder)
- [ ] Verify `GEMINI_API_KEY` is valid
- [ ] Check all `process.env.*` references have fallbacks or validation

### 1.6 Build Verification
- [ ] Run `next build` — zero errors
- [ ] Check build output for warnings
- [ ] Verify static pages generate correctly
- [ ] Verify dynamic pages compile correctly
- [ ] Check for any `export const dynamic = "force-dynamic"` that shouldn't be there
- [ ] Verify API routes are not accidentally statically optimized

### 1.7 Performance
- [ ] Check for oversized JS bundles in build output
- [ ] Verify images use `next/image` (search for raw `<img src=` tags)
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Check for unnecessary re-renders in builder (React DevTools)
- [ ] Verify PaginatedSheet cleanup (ResizeObserver, requestAnimationFrame)
- [ ] Check for memory leaks in `useLayoutEffect` cleanup functions

### 1.8 Security
- [ ] Verify `.env.local` not committed to git
- [ ] Verify `JWT_SECRET` is not a weak/common string
- [ ] Verify password field is `select: false` in User model
- [ ] Verify API routes validate input length (prevent DoS via huge payloads)
- [ ] Check for XSS: user input rendered as `dangerouslySetInnerHTML` anywhere?
- [ ] Check for NoSQL injection: unsanitized req.body passed to MongoDB queries?
- [ ] Verify auth middleware rejects expired tokens properly
- [ ] Check for open redirects in auth flows
- [ ] Add rate limiting to login/register routes (basic in-memory or Redis)

### 1.9 Production Config
- [ ] Verify `next.config.ts` — no dev-only settings
- [ ] Add `robots.txt` for SEO
- [ ] Add `sitemap.xml` generation
- [ ] Set proper `<title>` and `<meta description>` on all pages
- [ ] Add OpenGraph tags for social sharing
- [ ] Verify `@page { size: A4; margin: 0; }` print CSS works in production
- [ ] Add error boundary component for production error handling
- [ ] Test with `NODE_ENV=production` locally

### 1.10 Cleanup
- [ ] Remove unused imports across all files
- [ ] Remove commented-out code blocks
- [ ] Remove `console.log` debug statements (mark PaginatedSheet debug logs for later removal)
- [ ] Remove any test/placeholder data left in code
- [ ] Verify no secrets logged to console

---

## Completion Criteria

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npx next lint` passes with zero errors
- [ ] `next build` succeeds with zero errors
- [ ] All pages load without console errors
- [ ] All API routes return proper responses
- [ ] No hardcoded URLs or secrets in source code
- [ ] `.env.example` exists with documented variables
- [ ] Security audit complete — no critical vulnerabilities

---

## Status Log

| Date | Status | Notes |
|------|--------|-------|
| 2026-07-17 | In Progress | Task created |
