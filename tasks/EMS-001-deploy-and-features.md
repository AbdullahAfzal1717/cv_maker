# EMS Task: Production Deploy + Feature Parity

| Field          | Value |
|----------------|-------|
| **Task ID**    | EMS-001 |
| **Title**      | Production Deploy Readiness + PDF Download + Guest AI + Auth Enhancements |
| **Status**     | In Progress |
| **Priority**   | High |
| **Created**    | 2026-07-17 |
| **Assignee**   | Developer |

---

## Description

Make the CV Maker project production-ready for deployment. This includes fixing all existing errors, adding Puppeteer-based server-side PDF download (replacing the current `window.print()` approach), enabling AI Chat for guest users via IndexedDB, and adding auth enhancements (Google login, email verification, forgot/change password).

---

## Phase 1 — Deploy Readiness (MUST DO TODAY)

### 1.1 Error Audit & Fix
- [ ] Run `npx tsc --noEmit` and fix all TypeScript errors
- [ ] Run `npx next lint` and fix all ESLint errors/warnings
- [ ] Fix any Tailwind CSS build warnings
- [ ] Check browser console for runtime errors on every page (home, dashboard, builder, ai-chat, export, login, signup, profile)
- [ ] Verify all API routes return proper error responses (no 500 stack traces in production)
- [ ] Check for hardcoded `localhost` URLs — replace with environment-relative paths
- [ ] Verify `.env.local` variables are all documented and `.env.example` exists for deployment
- [ ] Remove any `console.log` debug statements left in production code (except the PaginatedSheet debug logs we just added — mark them for later removal)
- [ ] Verify MongoDB connection handles failures gracefully (no unhandled promise rejections)
- [ ] Check for memory leaks in `useLayoutEffect` / `ResizeObserver` cleanup in PaginatedSheet

### 1.2 Build & Performance
- [ ] Run `next build` — verify zero errors
- [ ] Check build output for any oversized bundles
- [ ] Verify images use `next/image` optimization (check for raw `<img>` tags)
- [ ] Add proper `loading="lazy"` to below-fold images
- [ ] Verify CSS is purged correctly (no unused Tailwind classes bloating the CSS)
- [ ] Check that `Suspense` boundaries are in place for dynamic pages
- [ ] Verify metadata/SEO on all pages (title, description, OpenGraph tags)

### 1.3 Security Audit
- [ ] Verify `JWT_SECRET` is strong and not committed to git
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Check API routes validate input (no unsanitized user input to MongoDB)
- [ ] Verify CORS is configured properly for production domain
- [ ] Check for XSS vulnerabilities (user-generated content rendering)
- [ ] Verify rate limiting on auth routes (login, register)
- [ ] Ensure `password` field is never returned in API responses (Mongoose `select: false`)
- [ ] Check for SSRF in AI service (Gemini API calls)

### 1.4 Deployment Config
- [ ] Verify `next.config.ts` / `next.config.js` is production-ready
- [ ] Set up proper `robots.txt` and `sitemap.xml`
- [ ] Add error boundaries for production error handling
- [ ] Verify the app works with `NODE_ENV=production`
- [ ] Test full flow on a staging/preview deployment

---

## Phase 2 — Puppeteer PDF Download (MUST DO TODAY)

### 2.1 Server-Side PDF Setup
- [ ] Install Puppeteer: `npm install puppeteer` (or `puppeteer-core` + Chrome)
- [ ] Create API route: `src/app/api/pdf/route.ts`
- [ ] Create PDF generation service: `src/lib/services/pdf.service.ts`
- [ ] Handle Puppeteer launch args for serverless/production (headless, no-sandbox, etc.)
- [ ] Set proper `Content-Type: application/pdf` and `Content-Disposition` headers

### 2.2 PDF Generation Logic
- [ ] Accept resume HTML/data in POST body
- [ ] Render the resume using the correct template in a headless browser
- [ ] Apply print CSS (`@page { size: A4; margin: 0; }`) in Puppeteer
- [ ] Generate PDF with `page.pdf()` — A4 format, proper margins
- [ ] Return PDF as a downloadable buffer/stream
- [ ] Handle multi-page resumes (PaginatedSheet page breaks)

### 2.3 Client-Side Integration
- [ ] Create PDF download service: `src/services/pdfService.ts`
- [ ] Update `BuilderPage.tsx` `handleDownload()` to call Puppeteer API instead of `window.print()`
- [ ] Update `ExportViewPage.tsx` download button to use Puppeteer API
- [ ] Add loading state / progress indicator during PDF generation
- [ ] Handle errors gracefully (show toast on failure)
- [ ] Keep `window.print()` as a fallback option

### 2.4 Guest Mode PDF
- [ ] Allow guest users to generate PDF (no auth required on the PDF API route, or use a temporary session)
- [ ] Pass resume data directly in the request body (guest data is in localStorage)

---

## Phase 3 — IndexedDB for Guest AI Chat (TRY TODAY)

### 3.1 IndexedDB Setup
- [ ] Install `idb` package: `npm install idb`
- [ ] Create IndexedDB wrapper: `src/lib/indexdb.ts`
- [ ] Define database schema: `cvmaker-guest` database
  - [ ] `ai-sessions` store: `{ id, title, messages[], isPinned, createdAt, updatedAt }`
  - [ ] `ai-messages` store: `{ id, sessionId, role, text, timestamp }`
- [ ] Create CRUD operations: `createSession`, `getSessions`, `getSession`, `updateSession`, `deleteSession`, `addMessage`

### 3.2 Remove Auth Gate from AI Chat
- [ ] Remove `<ProtectedRoute>` wrapper from `src/app/ai-chat/page.tsx`
- [ ] Update `AiChatPage.tsx` to detect guest vs logged-in user
- [ ] For guests: use IndexedDB for session storage instead of API calls
- [ ] For logged-in users: keep using server-side MongoDB storage (existing behavior)

### 3.3 Guest AI Chat Service
- [ ] Create `src/services/guestAiService.ts` that mirrors `aiService.ts` but uses IndexedDB
- [ ] Implement `getSessions()`, `getSession(id)`, `sendMessage()`, `deleteSession()`, `renameSession()`, `pinSession()` for guest mode
- [ ] `generateCV()` for guests: call the Gemini API directly from a new unauthenticated API route (or proxy through existing route with guest mode)

### 3.4 Server-Side Guest AI API
- [ ] Create `src/app/api/ai-chat/guest/message/route.ts` — accepts messages without JWT, uses a session ID stored in IndexedDB
- [ ] Create `src/app/api/ai-chat/guest/generate/route.ts` — generates CV from guest chat history
- [ ] Rate limiting on guest AI routes (prevent abuse)
- [ ] Optional: limit guest AI to X messages per session

### 3.5 Migration on Login
- [ ] When a guest signs up or logs in, migrate their IndexedDB sessions to MongoDB
- [ ] Clear IndexedDB after successful migration
- [ ] Handle conflicts (merge if user already has sessions)

### 3.6 UI Updates
- [ ] Update AI Chat sidebar to show guest mode indicator
- [ ] Show "Sign in to save conversations" prompt for guests
- [ ] Update `HomePage.tsx` `handleCreateWithAI` to allow guests through (remove the `if (!user) { router.push("/login") }` check)
- [ ] Update `DashboardPage.tsx` `handleCreateWithAI` similarly

---

## Phase 4 — Google Login (IF TIME PERMITS)

### 4.1 Google OAuth Setup
- [ ] Create Google Cloud project and OAuth 2.0 credentials
- [ ] Install `@react-oauth/google` and `google-auth-library`
- [ ] Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.local`
- [ ] Create Google OAuth callback API route: `src/app/api/auth/google/route.ts`

### 4.2 Backend Integration
- [ ] Verify Google token on server-side using `google-auth-library`
- [ ] Find or create user by Google email
- [ ] If email exists (registered with password): link Google account to existing user
- [ ] If email is new: create new user with Google profile data (no password needed)
- [ ] Return JWT token + user object (same format as email login)

### 4.3 Frontend Integration
- [ ] Wrap app in `<GoogleOAuthProvider>` in `layout.tsx`
- [ ] Add Google login button to `SignInPage.tsx`
- [ ] Add Google signup button to `SignUpPage.tsx`
- [ ] Handle the OAuth flow: redirect → callback → store token → redirect to dashboard
- [ ] Add Google profile picture as default `profilePicture` for new users

---

## Phase 5 — Email Verification (IF TIME PERMITS)

### 5.1 Backend
- [ ] Add `isEmailVerified` (boolean) and `emailVerificationToken` (string) fields to User model
- [ ] Create `src/app/api/auth/verify-email/route.ts` — verify token from email link
- [ ] Create `src/app/api/auth/resend-verification/route.ts` — resend verification email
- [ ] Install email service: `nodemailer` + SMTP config or use Resend/SendGrid/Mailgun
- [ ] Add `RESEND_API_KEY` / SMTP config to `.env.local`
- [ ] Generate secure verification token (crypto.randomBytes)
- [ ] Send verification email with link: `/auth/verify-email?token=xxx`

### 5.2 Frontend
- [ ] Create verification pending page: `src/app/auth/verify-email/page.tsx`
- [ ] Create email verified success page: `src/app/auth/email-verified/page.tsx`
- [ ] Show "Please verify your email" banner in dashboard for unverified users
- [ ] Add "Resend verification email" button

### 5.3 Enforcement
- [ ] Allow unverified users to use the app (soft enforcement)
- [ ] Show periodic reminder to verify email
- [ ] Optional: restrict AI features to verified users only

---

## Phase 6 — Forgot Password (IF TIME PERMITS)

### 6.1 Backend
- [ ] Add `passwordResetToken` and `passwordResetExpires` fields to User model
- [ ] Create `src/app/api/auth/forgot-password/route.ts` — generate reset token, send email
- [ ] Create `src/app/api/auth/reset-password/route.ts` — validate token, update password
- [ ] Token expiry: 1 hour
- [ ] Use same email service as verification (Phase 5)

### 6.2 Frontend
- [ ] Create forgot password page: `src/app/auth/forgot-password/page.tsx`
- [ ] Create reset password page: `src/app/auth/reset-password/page.tsx`
- [ ] Add "Forgot password?" link to `SignInPage.tsx`
- [ ] Form validation: email format, new password strength, confirm password match

---

## Phase 7 — Change Password (IF TIME PERMITS)

### 7.1 Backend
- [ ] Create `src/app/api/auth/change-password/route.ts`
- [ ] Require current password verification before allowing change
- [ ] Update password hash and save

### 7.2 Frontend
- [ ] Add "Change Password" section to `ProfileManagementPage.tsx`
- [ ] Form: current password, new password, confirm new password
- [ ] Show success toast on change
- [ ] Re-authenticate user after password change (refresh token)

---

## Feasibility Assessment (What can we do TODAY)

| Phase | Est. Time | Can Do Today? |
|-------|-----------|---------------|
| Phase 1 — Deploy Readiness | 2-3 hours | **YES** — this is the priority |
| Phase 2 — Puppeteer PDF | 3-4 hours | **YES** — high priority, straightforward |
| Phase 3 — Guest AI (IndexedDB) | 4-6 hours | **MAYBE** — depends on Phase 1 & 2 progress |
| Phase 4 — Google Login | 2-3 hours | **UNLIKELY** — needs Google Cloud setup |
| Phase 5 — Email Verification | 2-3 hours | **UNLIKELY** — needs email service setup |
| Phase 6 — Forgot Password | 1-2 hours | **UNLIKELY** — depends on Phase 5 |
| Phase 7 — Change Password | 1 hour | **UNLIKELY** — depends on Phase 5 |

### Recommended Order for Today
1. **Phase 1** — Fix all errors, make build clean
2. **Phase 2** — Puppeteer PDF (biggest user-facing improvement)
3. **Phase 3** — Start IndexedDB + Guest AI if time permits
4. **Phases 4-7** — Move to next session/sprint

---

## Notes

- Current PDF uses `window.print()` which requires user interaction and has inconsistent rendering across browsers. Puppeteer gives pixel-perfect, server-rendered PDFs.
- The AI module currently requires JWT auth on ALL routes. Guest mode needs a new set of unauthenticated API routes with rate limiting.
- Google login requires creating a Google Cloud project (can't be automated in code alone — needs manual console setup).
- Email verification and forgot password both need an email sending service (Resend is the easiest to set up — free tier, 100 emails/day).
- IndexedDB is the right choice for guest AI because it persists across sessions (unlike localStorage which has a 5-10MB limit) and supports structured data with indexes.
